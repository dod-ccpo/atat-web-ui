/* eslint-disable camelcase */
import { FundingRequestFSFormApi } from "@/api/fundingRequestFSForm";
import { AttachmentDTO, FundingRequestFSFormDTO } from "@/api/models";
import { AttachmentServiceCallbacks, RecordManager } from "..";
import { AttachmentServiceBase } from "../base";
import FinancialDetails from "@/store/financialDetails";
import api from "@/api";


// record manager to coordinate record creation saving with attachment service
const recordManager : RecordManager<FundingRequestFSFormDTO> = {
  retrieveOrCreate: async function (): Promise<FundingRequestFSFormDTO> {
    debugger;
    const record = await  FinancialDetails.loadFundingRequestFSForm();
    return record;
  },
  save: async function (record: string): Promise<void> {
    const data = JSON.parse(record) as FundingRequestFSFormDTO;
    FinancialDetails.setFundingRequestFSForm(data);
  }
}

export class FundingRequestFSAttachmentService extends 
  AttachmentServiceBase<FundingRequestFSFormApi, FundingRequestFSFormDTO>{

  constructor(serviceKey: string, tableName: string, tableApi: FundingRequestFSFormApi) {
    super(serviceKey, tableName, tableApi);
  }

  protected recordManager: RecordManager<FundingRequestFSFormDTO> = recordManager;
  

  protected updateRecord(record: FundingRequestFSFormDTO, attachmentSysId: string, 
    fileName: string): FundingRequestFSFormDTO {

    if(record.fs_form_7600a_filename.length > 0)
    {
      // eslint-disable-next-line camelcase
      record.fs_form_7600b_filename = fileName;
      // eslint-disable-next-line camelcase
      record.fs_form_7600b_attachment = attachmentSysId;
    }
    else{
      // eslint-disable-next-line camelcase
      record.fs_form_7600a_filename = fileName;
      // eslint-disable-next-line camelcase
      record.fs_form_7600a_attachment = attachmentSysId;
    };

    return record;
     
  }

  async remove(attachment:AttachmentDTO): Promise<void>{

    if(!attachment){
      throw new Error('invalid request, attachment required');
    }

    //first delete the attachment
    await this.attachmentApi.remove(attachment.sys_id || "");

    //find the record 
    const record = await this.tableApi.retrieve(attachment.table_sys_id);

    if(record == undefined)
    {
      throw new Error(`unable to locate record associated with attachment ${attachment}`)
    }

    //which attachment is it?
    if(record.fs_form_7600a_attachment !== attachment.sys_id && 
      record.fs_form_7600b_attachment !== attachment.sys_id){
      throw new Error(`can't locate attachment record in fs data`);
    }

    if(record.fs_form_7600a_attachment === attachment.sys_id){
      //remove this attachment
      record.fs_form_7600a_attachment = "";
      record.fs_form_7600a_filename = "";
    }
    else{
      record.fs_form_7600b_attachment = "";
      record.fs_form_7600b_filename = "";
    }

    await this.tableApi.update(attachment.table_sys_id, record);
    AttachmentServiceCallbacks.invokeRemoveCallbacks(this.serviceKey, attachment);
  }
  

}