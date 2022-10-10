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
import { TABLENAME as FUNDING_REQUEST_FSFORM_TABLE } from "@/api/fundingRequestFSForm";
import { AttachmentServiceCallbacks } from "@/services/attachment";
import { FundingRequestFSFormDTO } from "@/api/models";
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
  private attachmentServiceName = FUNDING_REQUEST_FSFORM_TABLE;
  private loaded: FundingRequestFSFormDTO | null = null;
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

  async onRemoveAttachment(file: uploadingFile): Promise<void> {
    try {
      if (file) {
        const key = this.attachmentServiceName;
        const attachmentId = file.attachmentId;
        const recordId = file.recordId;
        await Attachments.removeAttachment({
          key,
          attachmentId,
          recordId,
        });

        //get updated data
        await this.loadFundingRequestData();
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

  async loadFundingRequestData(): Promise<void>{
    this.loaded = await FinancialDetails.loadFundingRequestFSForm();
    this.saved = await FinancialDetails.load7600();
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


  public async mounted(): Promise<void> {
    //listen for attachment service upload callbacks
    //and update attachments
    AttachmentServiceCallbacks.registerUploadCallBack(
      FUNDING_REQUEST_FSFORM_TABLE,
      async () => {
        await this.loadFundingRequestData();
      }
    );
  }
  
}
</script>

