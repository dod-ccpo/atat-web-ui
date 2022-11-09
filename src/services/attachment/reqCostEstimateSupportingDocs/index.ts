/* eslint-disable camelcase */
import {AttachmentDTO, RequirementsCostEstimateDTO} from "@/api/models";
import {AttachmentServiceCallbacks, RecordManager} from "..";
import { AttachmentServiceBase } from "../base";
import FinancialDetails from "@/store/financialDetails";
import {RequirementsCostEstimateApi} from "@/api/requirementsCostEstimate";

// record manager to coordinate record creation saving with attachment service
const recordManager : RecordManager<RequirementsCostEstimateDTO> = {
  retrieveOrCreate: async function (): Promise<RequirementsCostEstimateDTO> {
    const record = await FinancialDetails.loadRequirementsCostEstimate();
    return record;
  },
  save: async function (record: string): Promise<void> {
    const data = JSON.parse(record) as RequirementsCostEstimateDTO;
    FinancialDetails.setRequirementsCostEstimate(data);
  },
  updateRecord: function (record: string, attachmentSysId: string,
    fileName: string): RequirementsCostEstimateDTO {
    return JSON.parse(record) as RequirementsCostEstimateDTO;
    // nothing else to do here because the attachment is added to the record and no slot column
  }
}

export class RequirementsCostEstimateAttachmentService extends
  AttachmentServiceBase<RequirementsCostEstimateApi, RequirementsCostEstimateDTO>{

  constructor(serviceKey: string, tableName: string, tableApi: RequirementsCostEstimateApi) {
    super(serviceKey, tableName, tableApi);
  }

  protected recordManager: RecordManager<RequirementsCostEstimateDTO> = recordManager;

  /**
   * The function in the super class (base attachment) deletes both the attachment and the
   * base record. This works for some use cases where the primary base record is about
   * the attachment. But for requirements cost estimate, the base record should remain
   * intact irrespective or the attachments because
   * 1. The base record could have one or more attachments
   * 2. The base record will have other pieces of information not specific to attachments.
   *
   * For the above reasons, we need to override the "remove" function.
   * @param attachment: Attachment that needs to be removed.
   */
  async remove(attachment: AttachmentDTO | undefined): Promise<void> {
    if (!attachment) {
      throw new Error("invalid request, attachment required");
    }
    //only delete the attachment
    await this.attachmentApi.remove(attachment.sys_id || "");
    AttachmentServiceCallbacks.invokeRemoveCallbacks(
      this.serviceKey,
      attachment
    );
  }
}
