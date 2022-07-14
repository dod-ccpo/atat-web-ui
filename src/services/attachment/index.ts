/* eslint-disable camelcase */
import { TableApiBase } from "@/api/tableApiBase";
import { AttachmentApi } from "@/api/attachments";
import { AttachableDTO, AttachmentDTO, BaseTableDTO, 
  FundingPlanDTO } from "@/api/models";
import api from "@/api";
import {
  FundingPlanApi,
  TABLENAME as FundingPlanTableName,
} from "@/api/fundingPlan";
import { TABLENAME as FundingRequestFSFormTableName } from "@/api/fundingRequestFSForm";
import { FundingRequestFSAttachmentService } from "./fundingRequestFSForm";
import { AttachmentService, AttachmentServiceBase } from "./base";

export const AttachmentServiceCallbacks =  (()=>{

  const uploadCallbacks: Record<string, ((attachment: AttachmentDTO)=> void)[]> = {};
  const removeCallbacks:  Record<string, ((attachment: AttachmentDTO)=> void)[]> = {};

  const registerUploadCallBack= (serviceKey: string , 
    callback: (attachment: AttachmentDTO)=> void)=> {
    
    if(!uploadCallbacks[serviceKey]?.length){
      uploadCallbacks[serviceKey]= []; 
    } 
    uploadCallbacks[serviceKey].push(callback);
  } 

  const registerRemoveCallBack= (serviceKey: string , 
    callback: (attachment: AttachmentDTO)=> void)=> {
    
    if(!removeCallbacks[serviceKey]?.length){
      removeCallbacks[serviceKey]= []; 
    } 
    removeCallbacks[serviceKey].push(callback);
  }

  const invokeUploadCallbacks = (serviceKey: string, attachment: AttachmentDTO) => {
    if(uploadCallbacks[serviceKey])
    {
      uploadCallbacks[serviceKey].forEach(callback=> callback(attachment));
    }
  }

  const invokeRemoveCallbacks = (serviceKey: string, attachment: AttachmentDTO) => {
    if(removeCallbacks[serviceKey]){
      removeCallbacks[serviceKey].forEach(callback=> callback(attachment));
    }
  }

  return {

    registerUploadCallBack,
    registerRemoveCallBack,
    invokeUploadCallbacks,
    invokeRemoveCallbacks,
    
  }
   

})() 

interface TableAttachment<TModel extends AttachableDTO> {
  data: TModel;
  attachment: AttachmentDTO;
}

//https://stackoverflow.com/questions/17798047/streams-with-percentage-complete
//https://masteringjs.io/tutorials/axios/axios-multi-form-data
//https://stackoverflow.com/questions/17798047/streams-with-percentage-complete

class FileAttachmentServiceBase<
  TTableApi extends TableApiBase<TModel>,
  TModel extends AttachableDTO
> {
  attachmentApi = new AttachmentApi();
  serviceKey: string;
  tableName: string;
  tableApi: TTableApi;
  constructor(serviceKey: string, tableName: string, tableApi: TTableApi) {
    this.serviceKey = serviceKey;
    this.tableName = tableName;
    this.tableApi = tableApi;
  }

  private getExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf(".") + 1);
  }

  async upload(
    file: File,
    onProgress?: (total: number, current: number) => void
  ): Promise<TableAttachment<TModel>> {
   
    //creates initial record
    const record = await this.tableApi.create();

    if (!record) {
      throw new Error("failed to create record to associate attachment with");
    }

    const fileName = file.name;
    const fileExtension = this.getExtension(fileName);

    //build attachment object
    const attachment: AttachmentDTO = {
      file_name: fileName,
      table_name: this.tableName,
      content_type: "*/*",
      table_sys_id: record.sys_id || "",
    };

    //upload the Attachment and get the meta data
    const updatedAttachment = await this.attachmentApi.upload(
      attachment,
      file,
      onProgress
    );

    AttachmentServiceCallbacks
      .invokeUploadCallbacks(this.serviceKey, {...attachment, ...updatedAttachment});

    const attachmentSysId = updatedAttachment?.sys_id || "";

    // update record with attachment sys id, file name, and extension
    // (this will point the attachment column in the record to the attachment)
    record.attachment = attachmentSysId;
    record.file_name = fileName;
    record.extension = fileExtension;
    const updatedRecord = await this.tableApi.update(
      record.sys_id || "",
      record
    );

    //return the attachment and table data
    return {
      data: updatedRecord,
      attachment: updatedAttachment,
    };
    
  }


  async remove(attachment:AttachmentDTO): Promise<void>{

    if(!attachment){
      throw new Error('invalid request, attachment required');
    }
    //first delete the attachment
    await this.attachmentApi.remove(attachment.sys_id || "");
    //then delete the record
    await this.tableApi.remove(attachment.table_sys_id);

    AttachmentServiceCallbacks.invokeRemoveCallbacks(this.serviceKey, attachment);
  }
}

export class FileAttachmentService extends FileAttachmentServiceBase<
  TableApiBase<AttachableDTO>,
  AttachableDTO
> {}


export interface RecordManager<TModel extends BaseTableDTO> {
   retrieveOrCreate: () => Promise<TModel>;
   save:(record: string) => Promise<void>;
}


export const AttachmentServiceTypes = {
  FundingPlans: "FundingPlans",
  FundingRequestFSForm: "FundingRequestFSForm"
};

export const FileAttachmentServiceFactory = (
  attachmentServiceType: string
): FileAttachmentService => {
  switch (attachmentServiceType) {
  case AttachmentServiceTypes.FundingPlans:
    return new FileAttachmentServiceBase<FundingPlanApi, FundingPlanDTO>(
      attachmentServiceType,
      FundingPlanTableName,
      api.fundingPlanTable
    ) as FileAttachmentService;
  default:
    throw new Error(
      `unable to create service instance for api ${attachmentServiceType}`
    );
  }
};

export const AttachmentServiceFactory = (attachmentServiceType: string): 
AttachmentServiceBase<TableApiBase<BaseTableDTO>,BaseTableDTO> => {

  debugger;

  switch(attachmentServiceType){

  case AttachmentServiceTypes.FundingRequestFSForm:
    return new FundingRequestFSAttachmentService(
      attachmentServiceType,
      FundingRequestFSFormTableName,
      api.fundingRequestFSFormTable);

  default:
    throw new Error(
      `unable to create service instance for api ${attachmentServiceType}`
    );
    
  }
}