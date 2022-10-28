/* eslint-disable camelcase */
import {RequirementsCostEstimateDTO} from "@/api/models";
import { RecordManager } from "..";
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

  // "remove" function does not need to be overriden in the context of removing an attachment
  // from a requirements cost estimate record.
}
