/* eslint-disable camelcase */
import { AttachmentDTO, PackageDocumentsSignedDTO } from "@/api/models";
import {AttachmentServiceCallbacks, RecordManager} from "..";
import {AttachmentServiceBase} from "../base";
import AcquisitionPackage from "@/store/acquisitionPackage/index";
import { PackageDocumentsSignedAPI } from "@/api/packageDocumentsSigned";

const recordManager : RecordManager<PackageDocumentsSignedDTO>= {
  retrieveOrCreate: async function (): Promise<PackageDocumentsSignedDTO>{
    return await AcquisitionPackage.getPackageDocumentsSigned() as PackageDocumentsSignedDTO;
  },
  save: async function (record: string): Promise<void> {
    const data = JSON.parse(record) as PackageDocumentsSignedDTO;
    AcquisitionPackage.setPackageDocumentsSigned(data);
  },
  updateRecord: function (record: string, attachmentSysId: string, fileName: string):
      PackageDocumentsSignedDTO {
    return JSON.parse(record) as PackageDocumentsSignedDTO;
  }
}

export class PackageDocumentsSignedAttachmentService extends
  AttachmentServiceBase<PackageDocumentsSignedAPI, PackageDocumentsSignedDTO> {

  constructor(serviceKey: string, tableName: string, tableApi: PackageDocumentsSignedAPI) {
    super(serviceKey, tableName, tableApi);
  }

  protected recordManager: RecordManager<PackageDocumentsSignedDTO> = recordManager;

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
