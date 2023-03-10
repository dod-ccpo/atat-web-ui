/* eslint-disable camelcase */
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";

import { TABLENAME as FUNDING_REQUEST_FSFORM_TABLE } from "@/api/fundingRequestFSForm";
import { TABLENAME as FUNDING_REQUEST_MIPRFORM_TABLE } from "@/api/fundingRequestMIPRForm";
import { TABLENAME as REQUIREMENTS_COST_ESTIMATE_TABLE } from "@/api/requirementsCostEstimate";
import { TABLENAME as CURRENT_ENVIRONMENT_TABLE } from "@/api/currentEnvironment";
import { TABLENAME as FAIR_OPPORTUNITY_TABLE } from "@/api/fairOpportunity";
import { TABLENAME as ACQUISITION_PACKAGE_TABLE } from "@/api/acquisitionPackages";
import { TABLENAME as PACKAGE_DOCUMENTS_SIGNED_TABLE } from "@/api/packageDocumentsSigned";
import { TABLENAME as PACKAGE_DOCUMENTS_UNSIGNED_TABLE } from "@/api/packageDocumentsUnsigned";
import { AttachmentDTO } from "@/api/models";
import {
  AttachmentServiceCallbacks,
  AttachmentServiceTypes,
  AttachmentServiceFactory,
} from "@/services/attachment";

import Vue from "vue";

const ATAT_ATTACHMENTS_KEY = "ATAT_ATTACHMENTS_KEY";

import {
  storeDataToSession,
  retrieveSession,
} from "../helpers";
import {api} from "@/api";
import {AxiosRequestConfig} from "axios";
@Module({
  name: "AttachmentsStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class AttachmentStore extends VuexModule {
  private initialized = false;
  // store session properties
  protected sessionProperties: string[] = [FUNDING_REQUEST_FSFORM_TABLE,
    FUNDING_REQUEST_MIPRFORM_TABLE, REQUIREMENTS_COST_ESTIMATE_TABLE,
    CURRENT_ENVIRONMENT_TABLE, FAIR_OPPORTUNITY_TABLE, ACQUISITION_PACKAGE_TABLE,
    PACKAGE_DOCUMENTS_SIGNED_TABLE];

  public [FUNDING_REQUEST_FSFORM_TABLE]: AttachmentDTO[] = [];
  public [FUNDING_REQUEST_MIPRFORM_TABLE]: AttachmentDTO[] = [];
  public [REQUIREMENTS_COST_ESTIMATE_TABLE]: AttachmentDTO[] = [];
  public [CURRENT_ENVIRONMENT_TABLE]: AttachmentDTO[] = [];
  public [FAIR_OPPORTUNITY_TABLE]: AttachmentDTO[] = [];
  public [ACQUISITION_PACKAGE_TABLE]: AttachmentDTO[] = [];
  public [PACKAGE_DOCUMENTS_SIGNED_TABLE]: AttachmentDTO[] = [];
  public [PACKAGE_DOCUMENTS_UNSIGNED_TABLE]: AttachmentDTO[] = [];

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
      // locate attachment service
      const attachmentService = AttachmentServiceFactory(key);

      // remove attachment
      await attachmentService.remove({
        sys_id: attachmentId,
        table_sys_id: recordId,
      } as AttachmentDTO);

      //remove attachment record from
      const attachments = storeData[key] as AttachmentDTO[];
      const attachmentsAfterRemoval = attachments?.filter(
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
      FUNDING_REQUEST_FSFORM_TABLE,
      (attachment) => {
        this.addAttachment({
          key: FUNDING_REQUEST_FSFORM_TABLE,
          attachment,
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      FUNDING_REQUEST_MIPRFORM_TABLE,
      (attachment) => {
        this.addAttachment({
          key: FUNDING_REQUEST_MIPRFORM_TABLE,
          attachment,
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      REQUIREMENTS_COST_ESTIMATE_TABLE,
      (attachment) => {
        this.addAttachment({
          key: REQUIREMENTS_COST_ESTIMATE_TABLE,
          attachment,
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      CURRENT_ENVIRONMENT_TABLE,
      (attachment) => {
        this.addAttachment({
          key: CURRENT_ENVIRONMENT_TABLE,
          attachment,
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      FAIR_OPPORTUNITY_TABLE,
      (attachment) => {
        this.addAttachment({
          key: FAIR_OPPORTUNITY_TABLE,
          attachment
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      ACQUISITION_PACKAGE_TABLE,
      (attachment) => {
        this.addAttachment({
          key: ACQUISITION_PACKAGE_TABLE,
          attachment
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      PACKAGE_DOCUMENTS_SIGNED_TABLE,
      (attachment) => {
        this.addAttachment({
          key: PACKAGE_DOCUMENTS_SIGNED_TABLE,
          attachment
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      PACKAGE_DOCUMENTS_UNSIGNED_TABLE,
      (attachment) => {
        this.addAttachment({
          key: PACKAGE_DOCUMENTS_UNSIGNED_TABLE,
          attachment
        })
      }
    );

    const sessionRestored = retrieveSession(ATAT_ATTACHMENTS_KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
    }

    this.setInitialized(true);
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

  /**
   * Check if the attachments are available in the store, if they are, then
   * returns it from the store. Otherwise, makes an API call and sets
   * the attachments to the store and returns the attachments.
   */
  @Action({rawError: true})
  public async getAttachmentsBySysIds({
    serviceKey,
    sysIds,
  }: {
    serviceKey: string;
    sysIds: string[];
  }): Promise<AttachmentDTO[]> {
    let attachmentList: AttachmentDTO[] = [];
    const storeData = this as unknown as Record<string, unknown>;
    const attachmentListFromStore = storeData[serviceKey] as AttachmentDTO[];
    if (attachmentListFromStore && attachmentListFromStore.length > 0) {
      attachmentList = attachmentListFromStore
        .filter(attachment => sysIds.indexOf(attachment.sys_id as string) !== -1)
    }
    if (attachmentList.length === sysIds.length) {
      return attachmentList;
    } else {
      const query =
        "^sys_idIN" + sysIds;
      const attachmentsBySysIdsRequestConfig: AxiosRequestConfig = {
        params: {
          sysparm_query: query
        }
      };
      attachmentList = await api.attachments.getQuery(attachmentsBySysIdsRequestConfig);
      // below call sets the attachments to the store
      this.updateAttachments({
        key: serviceKey,
        attachments: attachmentList});
      return attachmentList;
    }
  }

  /**
   * Gets the attachments by table sys id, sets them to the store and returns the attachments.
   */
  @Action({rawError: true})
  public async getAttachmentsByTableSysIds(
    {serviceKey, tableSysId,}: {
    serviceKey: string;
    tableSysId: string;
  }): Promise<AttachmentDTO[]> {
    let attachmentList: AttachmentDTO[] = [];
    const attachmentsBySysIdsRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query:  "^table_sys_id=" + tableSysId
      }
    };
    attachmentList = await api.attachments.getQuery(attachmentsBySysIdsRequestConfig);
    // below call sets the attachments to the store
    this.updateAttachments({
      key: serviceKey,
      attachments: attachmentList});
    return attachmentList;
  }

  /**
   * Gets the attachments by primary key sys id, sets it to the store and returns the attachment.
   */
  @Action({rawError: true})
  public async getAttachmentById(
    {serviceKey, sysID,}: {
      serviceKey: string;
      sysID: string;
    }): Promise<AttachmentDTO> {
    const attachment = await api.attachments.retrieve(sysID);
    // below call sets the attachments to the store
    this.updateAttachments({
      key: serviceKey,
      attachments: [attachment]});
    return attachment;
  }

  @Action({rawError: true})
  public async reset(): Promise<void> {
    sessionStorage.removeItem(ATAT_ATTACHMENTS_KEY);
    this.doReset();
  }

  @Mutation
  private doReset(): void {
    this.initialized = false;
    this[FUNDING_REQUEST_FSFORM_TABLE] = [];
    this[FUNDING_REQUEST_MIPRFORM_TABLE] = [];
    this[REQUIREMENTS_COST_ESTIMATE_TABLE] = [];
    this[CURRENT_ENVIRONMENT_TABLE] = [];
    this[FAIR_OPPORTUNITY_TABLE] = [];
    this[ACQUISITION_PACKAGE_TABLE] = [];
    this[PACKAGE_DOCUMENTS_SIGNED_TABLE] = [];
    this[PACKAGE_DOCUMENTS_UNSIGNED_TABLE] = [];
  }
}

const Attachments = getModule(AttachmentStore);
export default Attachments;
