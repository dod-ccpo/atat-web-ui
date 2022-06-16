/* eslint-disable camelcase */
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";

import { FundingPlansTable } from "@/api";
import { AttachmentDTO } from "@/api/models";
import {
  AttachmentServiceCallbacks,
  AttachmentServiceTypes,
  FileAttachmentServiceFactory,
} from "@/services/attachment";

import Vue from "vue";

const ATAT_ATTACHMENTS_KEY = "ATAT_ATTACHMENTS_KEY";

import {
  storeDataToSession,
  retrieveSession,
} from "../helpers";

@Module({
  name: "AttachmentsStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class AttachmentStore extends VuexModule {
  private initialized = false;

  // store session properties
  protected sessionProperties: string[] = [FundingPlansTable];

  public [FundingPlansTable]: AttachmentDTO[] = [];

  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for contact data store");
    }
  }

  @Mutation
  public updateAttachments({
    key,
    attachments,
  }: {
    key: string;
    attachments: AttachmentDTO[];
  }): void {
    try {
      Vue.set(this, key, attachments);
    } catch (error) {
      throw new Error("error updating attachment data");
    }
  }

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Action({ rawError: true })
  public async removeAttachment({
    key,
    attachmentId,
    recordId,
  }: {
    key: string;
    attachmentId: string;
    recordId: string;
  }): Promise<void> {
    const storeData = this as unknown as Record<string, unknown>;

    try {
      // convert first letter of key to uppercase because the file attachment
      // service factory expects keys in CamelCased upper case starting letters
      const convertedKey = key[0].toUpperCase() + key.substring(1);
      // locate attachment service
      const attachmentService = FileAttachmentServiceFactory(convertedKey);

      // remove attachment
      await attachmentService.remove({
        sys_id: attachmentId,
        table_sys_id: recordId,
      } as AttachmentDTO);

      //remove attachment record from
      const attachments = storeData[key] as AttachmentDTO[];
      const attachmentsAfterRemoval = attachments.filter(
        (attachment) => attachment.sys_id !== attachmentId
      );
      this.updateAttachments({ key, attachments: attachmentsAfterRemoval });
      storeDataToSession(this, this.sessionProperties, ATAT_ATTACHMENTS_KEY);
    } catch (error) {
      console.error(
        `error ocurred removing attachment data for ${key} error: ${error}`
      );
    }
  }

  @Action({ rawError: true })
  public async addAttachment({
    key,
    attachment,
  }: {
    key: string;
    attachment: AttachmentDTO;
  }): Promise<void> {
    const storeData = this as unknown as Record<string, unknown>;
    const existingAttachments = storeData[key] as AttachmentDTO[];
    const attachments = [...existingAttachments, attachment];
    this.updateAttachments({ key, attachments });
    storeDataToSession(this, this.sessionProperties, ATAT_ATTACHMENTS_KEY);
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {

    if (this.initialized) {
      return;
    }

    //listen for attachment service upload callbacks
    //and update attachments
    AttachmentServiceCallbacks.registerUploadCallBack(
      AttachmentServiceTypes.FundingPlans,
      (attachment) => {
        this.addAttachment({
          key: FundingPlansTable,
          attachment,
        })
      }
    );

    const sessionRestored = retrieveSession(ATAT_ATTACHMENTS_KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
      this.setInitialized(true);
    }
  }

  @Action({ rawError: true })
  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  @Action({rawError: true})
  public async getAttachments(serviceKey: string): Promise<AttachmentDTO[]> {
    await this.ensureInitialized();
    const storeData = this as unknown as Record<string, unknown>;
    return storeData[serviceKey] as AttachmentDTO[];
  }
}

const Attachments = getModule(AttachmentStore);
export default Attachments;
