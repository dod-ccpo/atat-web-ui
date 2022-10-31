<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Let’s see if you have any supporting documentation
        </h1>
        <div class="copy-max-width">
          <p id="IntroP" class="mb-7">
            If you have any reference materials to support how your estimates were 
            calculated, you can provide links or upload attachments below. Your 
            contracting officer will rely on these resources as evidence of the 
            realism of your IGCE.
          </p>
          <h2 id="Section1Header" class="mb-5">
            1. Share a link to your custom cost estimate report
          </h2>
          <ATATTextField 
            label="CSP pricing calculator link"
            id="CSPPriceCalcLink"
            :optional="true"
            :tooltipText="cspLinkTooltip"
            :value.sync="cspCalculatorLink"
            placeHolder="https://example.com"
            @blur="checkProtocol"
            :validateOnBlur="true"
            :rules="[
              $validators.isURL('Please enter a valid URL.')            
            ]"
          />

          <ATATDivider badgeText="AND/OR" />

          <h2 id="Section2Header" class="mb-0">
            2. Upload supporting documentation
          </h2>
          <p class="font-size-14 text-base">
            Attach any files to support your estimated prices (e.g., an export of 
            your cost estimate report, a screenshot from the CSP pricing calculator 
            website, vendor invoices from a similar requirement, etc.)
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
          :startCompact="true"
          :helpText="fileUploadHelpText"
        />

        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATDivider from "@/components/ATATDivider.vue";
import ATATFileUpload from "../../../components/ATATFileUpload.vue";
import ATATTextField from "@/components/ATATTextField.vue";

// EJY file upload from Upload7600.vue
import { TABLENAME as REQUIREMENTS_COST_ESTIMATE_TABLE } from "@/api/requirementsCostEstimate";
import { AttachmentServiceCallbacks } from "@/services/attachment";
import {AttachmentDTO, RequirementsCostEstimateDTO} from "@/api/models";
import FinancialDetails from "@/store/financialDetails";
import { invalidFile, uploadingFile } from "types/Global";
import Attachments from "@/store/attachments";


@Component({
  components: {
    ATATDivider,
    ATATFileUpload,
    ATATTextField,
  }
})

export default class SupportingDocumentation extends Vue {
  public validFileFormats = ["csv","xls","xlsx","pdf","jpg","png","doc","docx"];
  private attachmentServiceName = REQUIREMENTS_COST_ESTIMATE_TABLE;
  private loaded: RequirementsCostEstimateDTO | null = null;
  private saved: {gtcNumber: string, orderNumber: string} = {
    gtcNumber: "",
    orderNumber: ""
  };
  private showWarning = false;
  private uploadedFiles: uploadingFile[] = [];
  private invalidFiles: invalidFile[] = [];
  public requiredFileUploadMessage = ""
  private maxFileSizeInBytes = 1073741824;
  private fileUploadHelpText = `Supported file types: .csv, .xls(x), .pdf, .jpg, .png, .doc(x) 
    • Max file size: 1GB`
  public cspCalculatorLink = "";
  public cspLinkTooltip = `If available, enter your share link from the CSP 
    calculator website, so a contracting officer can access your custom cost 
    estimate report.`;

  public checkProtocol(): void {
    this.cspCalculatorLink = this.cspCalculatorLink.trim();
    if (this.cspCalculatorLink.length && this.cspCalculatorLink.indexOf("http") !== 0) {
      this.cspCalculatorLink = "https://" + this.cspCalculatorLink;
    }    
  }

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

  /**
   * Since this function may not have an existing "Requirements Cost Estimate" record because
   * this may be the first component that uses the data from Requirements Cost... As a result,
   * a save operation may need t obe done immediately after the component gets mounted, so that
   * the user can start adding attachments. The call to this function may also be moved to the
   * code that uploads the attachment.
   */
  async saveRequirementCostEstimateData(): Promise<void> {
    const requirementsCostEstimate = await FinancialDetails.loadRequirementsCostEstimate();
    this.loaded = await FinancialDetails.saveRequirementsCostEstimate(requirementsCostEstimate);
  }

  async loadRequirementsCostEstimateData(): Promise<void>{
    this.loaded = await FinancialDetails.loadRequirementsCostEstimate();
  }

  /**
   * TODO: this function may not be needed, since it is loading all attachments for all
   * the records of requirements cost estimate table.
   */
  async loadAttachments(): Promise<void>{
    const attachments = await Attachments.getAttachments(this.attachmentServiceName);
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

  private onFileUploadChanged(): void {
    if (this.uploadedFiles.length == 0) {
      // todo do something
    }
  }

  // rules array dynamically created based on the invalid
  // files returned from the child component
  // `ATATFileUpload.vue`
  private getRulesArray(): ((v: string) => string | true | undefined)[] {
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
   *
   */
  async loadOnEnter(): Promise<void> {
    try {
      await this.saveRequirementCostEstimateData(); //TODO:loadRequirementsCostEstimateData instead?
      // await this.loadAttachments(); // this will be needed when the requirements cost estimate
      // record is tied with acquisition
    } catch (error) {
      throw new Error("an error occurred loading supporting documentation");
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
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

