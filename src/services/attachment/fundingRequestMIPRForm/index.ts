/* eslint-disable camelcase */
import {FundingRequestMIPRFormApi} from "@/api/fundingRequestMIPRForm";
import {AttachmentDTO, FundingRequestMIPRFormDTO} from "@/api/models";
import FinancialDetails from "@/store/financialDetails";
import {AttachmentServiceCallbacks, RecordManager} from "..";
import {AttachmentServiceBase} from "../base";

// record manager to coordinate record creation saving with attachment service
const recordManager: RecordManager<FundingRequestMIPRFormDTO> = {
  retrieveOrCreate: async function (): Promise<FundingRequestMIPRFormDTO> {
    return await FinancialDetails.loadFundingRequestMIPRForm();
  },
  save: async function (record: string): Promise<void> {
    const data = JSON.parse(record) as FundingRequestMIPRFormDTO;
    FinancialDetails.setFundingRequestMIPRForm(data);
  },
  updateRecord: function (
    record: string,
    attachmentSysId: string,
    fileName: string
  ): FundingRequestMIPRFormDTO {
    const data = JSON.parse(record) as FundingRequestMIPRFormDTO;
    data.mipr_attachment = attachmentSysId;
    data.mipr_filename = fileName;

    return data;
  },
};

export class FundingRequestMIPRAttachmentService extends AttachmentServiceBase<
  FundingRequestMIPRFormApi,
  FundingRequestMIPRFormDTO
> {
  constructor(
    serviceKey: string,
    tableName: string,
    tableApi: FundingRequestMIPRFormApi
  ) {
    super(serviceKey, tableName, tableApi);
  }

  protected recordManager: RecordManager<FundingRequestMIPRFormDTO> | null =
    recordManager;

  async remove(attachment: AttachmentDTO): Promise<void> {
    if (!attachment) {
      throw new Error("invalid request, attachment required");
    }

    //first delete the attachment
    await this.attachmentApi.remove(attachment.sys_id || "");

    //find the record
    const record = await this.tableApi.retrieve(attachment.table_sys_id);

    if (record == undefined) {
      throw new Error(
        `unable to locate record associated with attachment ${attachment}`
      );
    }

    //does the attachment exist in the record?
    if (record.mipr_attachment !== attachment.sys_id) {
      throw new Error(`can't locate attachment record in fs data`);
    }

    record.mipr_attachment = "";
    record.mipr_filename = "";

    await this.tableApi.update(attachment.table_sys_id, record);
    AttachmentServiceCallbacks.invokeRemoveCallbacks(
      this.serviceKey,
      attachment
    );
  }
}
