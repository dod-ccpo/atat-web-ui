<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Let’s upload your supporting documentation
        </h1>
        <div class="copy-max-width">
          <p id="IntroP" class="mb-7">
            Upload any reference materials that support how your estimates were 
            calculated, such as an export of your cost estimate report, a screenshot 
            from the CSP pricing calculator website, or vendor invoices from a 
            similar requirement.
          </p>

        <ATATFileUpload
          :validFileFormats="validFileFormats"
          :attachmentServiceName="attachmentServiceName"
          id="SupportingDocFileUpload"
          @delete="onRemoveAttachment"
          fileListTitle="Your files"
          :invalidFiles.sync="invalidFiles"
          :maxNumberOfFiles="100"
          :maxFileSizeInBytes="maxFileSizeInBytes"
          :validFiles.sync="uploadedFiles"
          :requiredMessage="requiredFileUploadMessage"
          :rules="getRulesArray()"
          @mouseleave="onFileUploadChanged"
          @blur="onFileUploadChanged"
          :startCompact="false"
        />

        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import ATATFileUpload from "../../../components/ATATFileUpload.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { TABLENAME as REQUIREMENTS_COST_ESTIMATE_TABLE } from "@/api/requirementsCostEstimate";
import { AttachmentServiceCallbacks } from "@/services/attachment";
import {AttachmentDTO, RequirementsCostEstimateDTO} from "@/api/models";
import { invalidFile, uploadingFile } from "types/Global";
import Attachments from "@/store/attachments";
import IGCE from "@/store/IGCE";

@Component({
  components: {
    ATATFileUpload,
    ATATTextField,
  }
})

export default class SupportingDocumentation extends Vue {
  public validFileFormats = ["csv","xls","xlsx","pdf","jpg","png","doc","docx"];
  private attachmentServiceName = REQUIREMENTS_COST_ESTIMATE_TABLE;
  private rceCostEstimate: RequirementsCostEstimateDTO | null = null;
  private saved: {gtcNumber: string, orderNumber: string} = {
    gtcNumber: "",
    orderNumber: ""
  };
  private showWarning = false;
  private uploadedFiles: uploadingFile[] = [];
  private invalidFiles: invalidFile[] = [];
  public requiredFileUploadMessage = ""
  private maxFileSizeInBytes = 1073741824;

  async onRemoveAttachment(file: uploadingFile): Promise<void> {
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

        //get updated data
        await this.loadRequirementsCostEstimateData();
      }
    } catch (error) {
      console.error(`error removing attachment with id ${file?.attachmentId}`);
    }
  }

  @Watch("uploadedFiles")
  private onUploadedFilesChanged(): void {
    // this.showWarning =
    //   this.uploadedFiles.length > 0 && this.uploadedFiles.length < 2;
  }

  async loadRequirementsCostEstimateData(): Promise<void>{
    this.rceCostEstimate = await IGCE.getRequirementsCostEstimate();
  }

  private onFileUploadChanged(): void {
    if (this.uploadedFiles.length == 0) {
      // todo do something
    }
  }

  // rules array dynamically created based on the invalid
  // files returned from the child component
  // `ATATFileUpload.vue`
  private getRulesArray(): ((v: string) => string | true | undefined)[] {
    //eslint-disable-next-line prefer-const
    let rulesArr: ((v: string) => string | true | undefined)[] = [];

    rulesArr.push(this.$validators.required(this.requiredFileUploadMessage));

    this.invalidFiles.forEach((iFile) => {
      rulesArr.push(
        this.$validators.isFileValid(
          iFile.file,
          this.validFileFormats,
          this.maxFileSizeInBytes,
          iFile.doesFileExist,
          iFile.SNOWError,
          iFile.statusCode
        )
      );
    });

    return rulesArr;
  }

  /**
   * Loads the attachments across all the records of requirement cost
   * estimate table.
   */
  async loadAttachments(): Promise<void>{
    const attachments = await Attachments.getAttachmentsByTableSysIds({
      serviceKey: this.attachmentServiceName,
      tableSysId: this.rceCostEstimate?.sys_id as string
    });
    const uploadedFiles = attachments.map((attachment: AttachmentDTO) => {
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

  /**
   *
   */
  async loadOnEnter(): Promise<void> {
    try {
      this.rceCostEstimate = await IGCE.getRequirementsCostEstimate();
    } catch (error) {
      throw new Error("an error occurred loading supporting documentation");
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    await this.loadAttachments()
    //listen for attachment service upload callbacks
    //and update attachments
    AttachmentServiceCallbacks.registerUploadCallBack(
      REQUIREMENTS_COST_ESTIMATE_TABLE,
      async () => {
        await this.loadRequirementsCostEstimateData();
      }
    );
  }
  
}
</script>

