/* eslint-disable camelcase */
import {AttachmentDTO, CurrentEnvironmentDTO} from "@/api/models";
import {AttachmentServiceCallbacks, RecordManager} from "..";
import {AttachmentServiceBase} from "../base";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import {CurrentEnvironmentApi} from "@/api/currentEnvironment";

// record manager to coordinate record creation saving with attachment service
const recordManager : RecordManager<CurrentEnvironmentDTO> = {
  retrieveOrCreate: async function (): Promise<CurrentEnvironmentDTO> {
    return await CurrentEnvironment.getCurrentEnvironment() as CurrentEnvironmentDTO;
  },
  save: async function (record: string): Promise<void> {
    // const data = JSON.parse(record) as CurrentEnvironmentDTO;
    // await CurrentEnvironment.setCurrentEnvironment(data);
  },
  updateRecord: function (record: string, attachmentSysId: string, fileName: string):
    CurrentEnvironmentDTO {
    return JSON.parse(record) as CurrentEnvironmentDTO;
    // nothing else to do here because the attachment is added to the record and no slot column
  }
}

export class CurrentEnvironmentDocumentService extends
  AttachmentServiceBase<CurrentEnvironmentApi, CurrentEnvironmentDTO>{

  constructor(serviceKey: string, tableName: string, tableApi: CurrentEnvironmentApi) {
    super(serviceKey, tableName, tableApi);
  }

  protected recordManager: RecordManager<CurrentEnvironmentDTO> = recordManager;

  /**
   * The function in the super class (base attachment) deletes both the attachment and the
   * base record. This works for some use cases where the primary base record is about
   * the attachment. But for current environment system and migration docs, the base record
   * should remain intact irrespective or the attachments because
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
