/* eslint-disable camelcase */
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";

import { AttachmentDTO } from "@/api/models";
import {
  AttachmentServiceCallbacks,
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
import { AttachmentApi } from "@/api/attachments";

@Module({
  name: "AttachmentsStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class AttachmentStore extends VuexModule {
  private initialized = false;
  private prefix = "x_g_dis_atat_";
  private FUNDING_REQUEST_FSFORM_TABLE = "x_g_dis_atat_funding_request_fs_form";
  private FUNDING_REQUEST_MIPRFORM_TABLE = "x_g_dis_atat_funding_request_mipr";
  private REQUIREMENTS_COST_ESTIMATE_TABLE = "x_g_dis_atat_requirements_cost_estimate";
  private CURRENT_ENVIRONMENT_TABLE = "x_g_dis_atat_current_environment";
  private FAIR_OPPORTUNITY_TABLE = "x_g_dis_atat_fair_opportunity";
  private ACQUISITION_PACKAGE_TABLE = "x_g_dis_atat_acquisition_package";
  private PACKAGE_DOCUMENTS_SIGNED_TABLE = "x_g_dis_atat_package_documents_signed";
  private PACKAGE_DOCUMENTS_UNSIGNED_TABLE = "x_g_dis_atat_package_documents_unsigned";

  // store session properties
  protected sessionProperties: string[] = [
    this.FUNDING_REQUEST_FSFORM_TABLE,
    this.FUNDING_REQUEST_MIPRFORM_TABLE, 
    this.REQUIREMENTS_COST_ESTIMATE_TABLE,
    this.CURRENT_ENVIRONMENT_TABLE, 
    this.FAIR_OPPORTUNITY_TABLE, 
    this.ACQUISITION_PACKAGE_TABLE,
    this.PACKAGE_DOCUMENTS_SIGNED_TABLE,
    this.PACKAGE_DOCUMENTS_UNSIGNED_TABLE
  ];

  public ["x_g_dis_atat_funding_request_fs_form"]: AttachmentDTO[] = [];
  public ["x_g_dis_atat_funding_request_mipr"]: AttachmentDTO[] = [];
  public ["x_g_dis_atat_requirements_cost_estimate"]: AttachmentDTO[] = [];
  public ["x_g_dis_atat_current_environment"]: AttachmentDTO[] = [];
  public ["x_g_dis_atat_fair_opportunity"]: AttachmentDTO[] = [];
  public ["x_g_dis_atat_acquisition_package"]: AttachmentDTO[] = [];
  public ["x_g_dis_atat_package_documents_signed"]: AttachmentDTO[] = [];
  public ["x_g_dis_atat_package_documents_unsigned"]: AttachmentDTO[] = [];

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
      this.FUNDING_REQUEST_FSFORM_TABLE,
      (attachment) => {
        this.addAttachment({
          key: this.FUNDING_REQUEST_FSFORM_TABLE,
          attachment,
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      this.FUNDING_REQUEST_MIPRFORM_TABLE,
      (attachment) => {
        this.addAttachment({
          key: this.FUNDING_REQUEST_MIPRFORM_TABLE,
          attachment,
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      this.REQUIREMENTS_COST_ESTIMATE_TABLE,
      (attachment) => {
        this.addAttachment({
          key: this.REQUIREMENTS_COST_ESTIMATE_TABLE,
          attachment,
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      this.CURRENT_ENVIRONMENT_TABLE,
      (attachment) => {
        this.addAttachment({
          key: this.CURRENT_ENVIRONMENT_TABLE,
          attachment,
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      this.FAIR_OPPORTUNITY_TABLE,
      (attachment) => {
        this.addAttachment({
          key: this.FAIR_OPPORTUNITY_TABLE,
          attachment
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      this.ACQUISITION_PACKAGE_TABLE,
      (attachment) => {
        this.addAttachment({
          key: this.ACQUISITION_PACKAGE_TABLE,
          attachment
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      this.PACKAGE_DOCUMENTS_SIGNED_TABLE,
      (attachment) => {
        this.addAttachment({
          key: this.PACKAGE_DOCUMENTS_SIGNED_TABLE,
          attachment
        })
      }
    );
    AttachmentServiceCallbacks.registerUploadCallBack(
      this.PACKAGE_DOCUMENTS_UNSIGNED_TABLE,
      (attachment) => {
        this.addAttachment({
          key: this.PACKAGE_DOCUMENTS_UNSIGNED_TABLE,
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
      // set download_link in each attachment
      api.attachments.assignDownloadLink(attachmentList)
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
    // set download_link in each attachment
    api.attachments.assignDownloadLink(attachmentList)
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
    // set download_link in each attachment
    api.attachments.assignDownloadLink([attachment])
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
    this["x_g_dis_atat_funding_request_fs_form"] = [];
    this["x_g_dis_atat_funding_request_mipr"] = [];
    this["x_g_dis_atat_requirements_cost_estimate"] = [];
    this["x_g_dis_atat_current_environment"] = [];
    this["x_g_dis_atat_fair_opportunity"] = [];
    this["x_g_dis_atat_acquisition_package"] = [];
    this["x_g_dis_atat_package_documents_signed"] = [];
    this["x_g_dis_atat_package_documents_unsigned"] = [];
  }
}

const Attachments = getModule(AttachmentStore);
export default Attachments;
