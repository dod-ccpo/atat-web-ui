/* eslint-disable camelcase */
import {AttachmentDTO, FairOpportunityDTO} from "@/api/models";
import {AttachmentServiceCallbacks, RecordManager} from "..";
import {AttachmentServiceBase} from "../base";
import AcquisitionPackage from "@/store/acquisitionPackage/index";
import {FairOpportunityApi} from "@/api/fairOpportunity";

// EJY IS THIS FILE NEEDED NOW?

// const recordManager : RecordManager<FairOpportunityDTO>= {
//   retrieveOrCreate: async function (): Promise<FairOpportunityDTO>{
//     return await AcquisitionPackage.getFairOpportunity() as FairOpportunityDTO;
//   },
//   save: async function (record: string): Promise<void> {
//     const data = JSON.parse(record) as FairOpportunityDTO;
//     AcquisitionPackage.setFairOpportunity(data);
//   },
//   updateRecord: function (record: string, attachmentSysId: string, fileName: string):
//     FairOpportunityDTO {
//     return JSON.parse(record) as FairOpportunityDTO;
//   }
// }

export class FairOpportunityDocumentService extends
  AttachmentServiceBase<FairOpportunityApi, FairOpportunityDTO> {

  constructor(serviceKey: string, tableName: string, tableApi: FairOpportunityApi) {
    super(serviceKey, tableName, tableApi);
  }

  // protected recordManager: RecordManager<FairOpportunityDTO> = recordManager;

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