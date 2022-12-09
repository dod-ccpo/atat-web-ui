<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Last step! Your completed package requires additional documentation.
            </h1>
            <div class="copy-max-width">
              <p class="mt-2 mb-0">
                Based on what you told us about your exception to fair opportunity in Step 2, 
                you need to complete a 
                <strong>
                    Justification &amp; Approval (J&amp;A) 
                    and Sole Source Market Research Report (MRR).
                </strong>
              </p>
              <br/><br/>
              <div class="bg-primary-lighter border-rounded-more pa-8">
                <h2>
                  <strong>What do I need to do?</strong>
                </h2>
                <br/>
                <v-list class="_atat-stepper">
                  <v-list-item-group >
                    <v-list-item>
                      <span class="_step-circle">1</span>
                      <v-list-item-content>
                        <span class="">
                          Download Word document templates for the J&amp;A and MRR below.<br/><br/>
                          <v-row>
                            <v-col cols="5">
                              <v-btn
                                type="button"
                                class="v-btn primary no-text-decoration"
                                width="250"
                                target="_blank"
                                :href="jaTemplateUrl"
                              >
                                Download J&amp;A Template &nbsp;
                                <v-icon class="v-btn--icon">download</v-icon>
                              </v-btn>
                            </v-col>
                            <v-col cols="7">
                              <v-btn
                                type="button"
                                width="250"
                                target="_blank"
                                class="v-btn primary no-text-decoration"
                                :href="mrrTemplateUrl"
                              >
                                Download MRR Template &nbsp;
                                <v-icon class="v-btn--icon">download</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </span>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <span class="_step-circle">2</span>
                      <v-list-item-content>
                        Follow the instructions provided within each template to complete the 
                        documents outside of DAPPS. Be sure to obtain any necessary signatures.
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <span class="_step-circle">3</span>
                      <v-list-item-content>
                        Upload your signed J&amp;A and MRR below, and we will include them within 
                        your completed requirements package that will be generated next.
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </div>
            <hr />
            <div class="copy-max-width">
              <h2>Upload your signed J&amp;A and MRR</h2>
              <br/>
              <ATATFileUpload
                id="JAMRRFiles"
                tabindex="-1"
                :maxNumberOfFiles="2"
                :maxFileSizeInBytes="maxFileSizeInBytes"
                :validFileFormats="validFileFormats"
                :multiplesAllowed="true"
                :attachmentServiceName="attachmentServiceName"
                :invalidFiles.sync="invalidFiles"
                :validFiles.sync="uploadedFiles"
                :removeAll.sync="removeAll"
                @delete="onRemoveAttachment"
                @uploaded="onUpload"
                :rules="[$validators.required('Please upload a file')]"
              />
            </div>
            <ATATAlert
                id="UploadJAMRRDocsAlert"
                v-show="uploadedFiles.length > 0 && uploadedFiles.length < 2"
                type="warning"
                class="mt-10"
            >
              <template v-slot:content>
                <p class="mb-0">
                  You may be missing a required document. Please ensure that both
                  signed documents are uploaded before submitting your completed
                  package. If your J&amp;A and MRR were combined into a single file before
                  uploading, ignore this message.
                </p>
              </template>
            </ATATAlert>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";
import { invalidFile, uploadingFile } from "../../../types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";
import {AttachmentDTO, FairOpportunityDTO} from "@/api/models";
import { hasChanges } from "@/helpers";
import ATATFileUpload from "@/components/ATATFileUpload.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import AcquisitionPackage, {StoreProperties} from "@/store/acquisitionPackage";
import { TABLENAME as FAIR_OPPORTUNITY_TABLE } from "@/api/fairOpportunity";
import Attachments from "@/store/attachments";
import {AttachmentServiceCallbacks} from "@/services/attachment";

@Component({
  components: {
    ATATFileUpload,
    ATATAlert
  },
})
export default class UploadJAMRRDocuments extends Mixins(SaveOnLeave) {
  private fairOppDTO = AcquisitionPackage.getInitialFairOpportunity();

  private attachmentServiceName = FAIR_OPPORTUNITY_TABLE;
  private maxFileSizeInBytes = 1073741824;
  private invalidFiles: invalidFile[] = [];
  private validFileFormats = ["pdf","jpg","png"];
  private uploadedFiles: uploadingFile[] = [];
  public removeAll = false;

  private jaTemplateUrl = "";
  private mrrTemplateUrl = "";

  public exception_to_fair_opportunity = "";

  private savedData: Record<string, string> = {
    exception_to_fair_opportunity: ""
  };

  private get currentData(): Record<string, string> {
    return {
      exception_to_fair_opportunity: this.exception_to_fair_opportunity
    };
  }

  @Watch('selectedUpload')
  private selectedUploadChange(): void{
    this.uploadedFiles = []
    this.removeAll = true
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async onUpload(file: uploadingFile): Promise<void> {
    try {
      if(file){
        const attachmentSysId = file.attachmentId;
        console.log(attachmentSysId);
      }
    } catch (error) {
      console.error(`error completing file upload with id ${file?.attachmentId}`);
    }
  }

  public async onRemoveAttachment(file: uploadingFile): Promise<void> {
    try {
      if (file) {
        const key = this.attachmentServiceName;
        const attachmentId = file.attachmentId;
        const recordId = file.recordId;
        await Attachments.removeAttachment({
          key,
          attachmentId,
          recordId, // recordId is the "table_sys_id" in the context of ATTACHMENT API
        });
      }
    } catch (error) {
      console.error(`error removing attachment with id ${file?.attachmentId}`);
    }
  }

  async loadAttachments(): Promise<void>{
    const attachments = await Attachments.getAttachments(this.attachmentServiceName);

    console.log(attachments);

    const uploadedFiles = attachments
      .filter((attachment: AttachmentDTO) => {
        return (
          AcquisitionPackage.fairOpportunity?.sys_id === attachment.table_sys_id
        )
      })
      .map((attachment: AttachmentDTO) => {
        const file = new File([], attachment.file_name, {
          lastModified: Date.parse(attachment.sys_created_on || "")
        });
        const upload: uploadingFile = {
          attachmentId: attachment.sys_id || "",
          fileName: attachment.file_name,
          file: file,
          created: file.lastModified,
          progressStatus: 100,
          link: attachment.download_link || "",
          recordId: attachment.table_sys_id,
          isErrored: false,
          isUploaded: true
        }
        return upload;
      });
    this.uploadedFiles = [...uploadedFiles];
  }

  protected async saveOnLeave(): Promise<boolean> {

    AcquisitionPackage.setValidateNow(true);

    return true;
  }

  /**
   * Since this is the first page in the generate package documents step, need to ensure that
   * the fair opportunity table record and sys_id exists for the document upload. To do this
   * a save is performed immediately after load.
   */
  public async loadOnEnter(): Promise<void> {
    let storeData = await AcquisitionPackage.getFairOpportunity();
    await AcquisitionPackage.saveData({
      data: storeData as FairOpportunityDTO,
      storeProperty: StoreProperties.FairOpportunity,
    }, )
    storeData = await AcquisitionPackage.getFairOpportunity();
    if (storeData) {
      this.fairOppDTO = storeData;
      this.exception_to_fair_opportunity = storeData.exception_to_fair_opportunity;
      this.savedData = {
        exception_to_fair_opportunity: storeData.exception_to_fair_opportunity
      }
    }
    this.jaTemplateUrl = await AcquisitionPackage.getJamrrTemplateUrl('ja');
    this.mrrTemplateUrl = await AcquisitionPackage.getJamrrTemplateUrl('mrr');
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    await this.loadAttachments();

    AttachmentServiceCallbacks.registerUploadCallBack(
      FAIR_OPPORTUNITY_TABLE,
      async () => {
        await AcquisitionPackage.getFairOpportunity();
      }
    );
  }
}
</script>
