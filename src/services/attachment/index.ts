/* eslint-disable camelcase */
import { TableApiBase } from "@/api/tableApiBase";
import { AttachmentApi } from "@/api/attachments";
import { AttachableDTO, AttachmentDTO, BaseTableDTO, FundingPlanDTO } from "@/api/models";
import api from "@/api";
import {
  FundingPlanApi,
  TABLENAME as FundingPlanTableName,
} from "@/api/fundingPlan";

const getExtension= (filename: string): string => {
  return filename.substring(filename.lastIndexOf(".") + 1);
}


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

interface SnowTableAttachment<TModel extends BaseTableDTO> {
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


export class AttachmentServiceBase<
  TTableApi extends TableApiBase<TModel>,
  TModel extends BaseTableDTO> {
  attachmentApi = new AttachmentApi();
  serviceKey: string;
  tableName: string;
  tableApi: TTableApi;
  constructor(serviceKey: string, tableName: string, tableApi: TTableApi) {
    this.serviceKey = serviceKey;
    this.tableName = tableName;
    this.tableApi = tableApi;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected updateRecord(record: TModel, attachmentSysId: string, fileName: string): TModel {
    throw new Error('not implemented exception');
  }

  async upload(
    file: File,
    onProgress?: (total: number, current: number) => void
  ): Promise<SnowTableAttachment<TModel>> {
   
    //creates initial record
    let record = await this.tableApi.create();

    if (!record) {
      throw new Error("failed to create record to associate attachment with");
    }

    const fileName = file.name;
    const fileExtension = getExtension(fileName);

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

    record = this.updateRecord(record, attachmentSysId,fileName);
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


export const AttachmentServiceTypes = {
  FundingPlans: "FundingPlans",
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
