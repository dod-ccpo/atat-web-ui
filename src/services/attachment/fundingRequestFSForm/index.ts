/* eslint-disable camelcase */
import {FundingRequestFSFormApi} from "@/api/fundingRequestFSForm";
import {AttachmentDTO, FundingRequestFSFormDTO} from "@/api/models";
import {RecordManager} from "..";
import {AttachmentServiceBase} from "../base";
import FinancialDetails from "@/store/financialDetails";

// record manager to coordinate record creation saving with attachment service
const recordManager : RecordManager<FundingRequestFSFormDTO> = {
  retrieveOrCreate: async function (): Promise<FundingRequestFSFormDTO> {
    return await FinancialDetails.loadFundingRequestFSForm();
  },
  save: async function (record: string): Promise<void> {
    const data = JSON.parse(record) as FundingRequestFSFormDTO;
    FinancialDetails.setFundingRequestFSForm(data);
  },
  updateRecord: function (record: string, attachmentSysId: string, 
    fileName: string): FundingRequestFSFormDTO {
    const fundingFSForm = FinancialDetails.fundingRequestFSForm as FundingRequestFSFormDTO;
    // the assumption being made here is if the 7600 a file attachment
    // has a value, then it's already been uploaded to
    if(fundingFSForm.fs_form_7600a_attachment.length > 0)
    {
      fundingFSForm.fs_form_7600b_filename = fileName;
      fundingFSForm.fs_form_7600b_attachment = attachmentSysId;
    }
    else{
      fundingFSForm.fs_form_7600a_filename = fileName;
      fundingFSForm.fs_form_7600a_attachment = attachmentSysId;
    }
    return fundingFSForm;
  }
}

export class FundingRequestFSAttachmentService extends 
  AttachmentServiceBase<FundingRequestFSFormApi, FundingRequestFSFormDTO>{

  constructor(serviceKey: string, tableName: string, tableApi: FundingRequestFSFormApi) {
    super(serviceKey, tableName, tableApi);
  }

  protected recordManager: RecordManager<FundingRequestFSFormDTO> = recordManager;
  
  async remove(attachment:AttachmentDTO): Promise<void>{
    if(!attachment){
      throw new Error('invalid request, attachment required');
    }
    //first delete the attachment
    await this.attachmentApi.remove(attachment.sys_id || "");
    //find the record 
    const fundingFSForm = await FinancialDetails.fundingRequestFSForm as FundingRequestFSFormDTO;
    //which attachment is it?
    if(fundingFSForm.fs_form_7600a_attachment !== attachment.sys_id &&
      fundingFSForm.fs_form_7600b_attachment !== attachment.sys_id){
      throw new Error(`can't locate attachment record in fs data`);
    }
    if(fundingFSForm.fs_form_7600a_attachment === attachment.sys_id){
      //remove this attachment
      fundingFSForm.fs_form_7600a_attachment = "";
      fundingFSForm.fs_form_7600a_filename = "";
    }
    else{
      fundingFSForm.fs_form_7600b_attachment = "";
      fundingFSForm.fs_form_7600b_filename = "";
    }
    await FinancialDetails.saveFundingRequestFSForm(fundingFSForm);
  }
}
