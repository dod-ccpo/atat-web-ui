/* eslint-disable camelcase */
import {AcquisitionPackageDTO, AttachmentDTO, FairOpportunityDTO} from "@/api/models";
import {AttachmentServiceCallbacks, RecordManager} from "..";
import {AttachmentServiceBase} from "../base";
import AcquisitionPackage from "@/store/acquisitionPackage/index";
import {AcquisitionPackagesApi} from "@/api/acquisitionPackages";
import { FairOpportunityApi } from "@/api/fairOpportunity";

const recordManager : RecordManager<FairOpportunityDTO>= {
  retrieveOrCreate: async function (): Promise<AcquisitionPackageDTO>{
    return await AcquisitionPackage.getFairOpportunity() as FairOpportunityDTO;
  },
  save: async function (record: string): Promise<void> {
    const data = JSON.parse(record) as FairOpportunityDTO;
    AcquisitionPackage.setFairOpportunity(data);
  },
  updateRecord: function (record: string, attachmentSysId: string, fileName: string):
    FairOpportunityDTO {
    return JSON.parse(record) as FairOpportunityDTO;
  }
}

export class AcquisitionPackageDocumentService extends
  AttachmentServiceBase<AcquisitionPackagesApi, AcquisitionPackageDTO> {

  constructor(serviceKey: string, tableName: string, tableApi: AcquisitionPackagesApi) {
    super(serviceKey, tableName, tableApi);
  }

  protected recordManager: RecordManager<AcquisitionPackageDTO> = recordManager;

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