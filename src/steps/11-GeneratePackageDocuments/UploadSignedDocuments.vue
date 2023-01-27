<template>
  <div>
    <h1>
      Upload your signed documents
    </h1>
    <div class="copy-max-width">
      <p class="mt-2 mb-4">
        To submit your package to DITCO, all documents that require certification must be signed by
        your approving officials. Upload your individually signed documents below.
      </p>
      <hr class="base-lighter" />
      <v-row class="d-flex">
        <v-col cols="8">
          <ATATFileUpload
            :validFileFormats="validFileFormats"
            :attachmentServiceName="attachmentServiceName"
            :maxFileSizeInBytes="maxFileSizeInBytes"
            id="SignedDocs"
            @delete="onRemoveAttachment"
            fileListTitle="Your files"
            :invalidFiles.sync="invalidFiles"
            :maxNumberOfFiles="filesNeeded.length"
            :validFiles.sync="uploadedFiles"
            :rules="getRulesArray()"
            :filesRequired="true"
          />
        </v-col>
        <v-col cols="2">
          <div
            style="width: 330px;"
            class="pl-5">
            <ATATAlert
              v-if="needsSignatureLength > uploadedFiles.length"
              id="warning"
              class="mb-4"
              type="warning"
            >
              <template v-slot:content>
                <p class="mt-1 mb-0">
                  <strong>
                    Missing {{needsSignatureLength - uploadedFiles.length}} {{missingDocsText}}
                  </strong>
                </p>
                <p class="mb-0">
                  Please upload any missing document
                </p>
              </template>
            </ATATAlert>
            <div
              class="
              border1
              border-rounded-more
              border-base-lighter
              bg-primary-lighter
              pa-6"
            >
              <div class="d-flex align-center mb-4">
                <ATATSVGIcon
                  class="mr-2"
                  name="fileSignature"
                  width="39"
                  height="35"
                  color="primary"
                />
                <h3 class="mb-2">
                 {{needsSignatureLength}} signatures required</h3>
              </div>
              <div
                v-for="(item,idx) in filesNeeded"
                :key="idx"
                class="d-flex"
              >
                <ATATSVGIcon
                  class="mr-2 pt-1"
                  name="filePresent"
                  width="13"
                  height="16"
                  color="primary"
                />
                <span class="text-primary text-decoration-underline">
                  {{item}}
                </span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Watch } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ATATFileUpload from "@/components/ATATFileUpload.vue";
import { TABLENAME as ACQUISITION_PACKAGE_TABLE } from "@/api/acquisitionPackages";
import { invalidFile, uploadingFile } from "../../../types/Global";
import Attachments from "@/store/attachments";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import FinancialDetails from "@/store/financialDetails";
import ATATAlert from "@/components/ATATAlert.vue";
import acquisitionPackage from "@/store/acquisitionPackage";
@Component({
  components:{
    ATATFileUpload,
    ATATSVGIcon,
    ATATAlert,
  }
})
export default class UploadSignedDocuments extends Vue {
  private attachmentServiceName = ACQUISITION_PACKAGE_TABLE;
  private maxFileSizeInBytes = 1073741824;
  private validFileFormats = ["pdf","jpg","png","docx"];
  private invalidFiles: invalidFile[] = [];
  private uploadedFiles: uploadingFile[] = [];
  private needsSignatureLength = 0;
  private filesNeeded:string[] = [];
  get fairOpportunity():string {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity || "";
  }
  get incrementallyFunded():string {
    return FinancialDetails.fundingRequirement?.incrementally_funded || "";
  }
  private packages = [
    {
      itemName:"Requirements Checklist",
      requiresSignature:true,
      alertText:"Requires signatures",
      show:true
    },
    {
      itemName:"Independent Government Cost Estimate",
      requiresSignature:true,
      alertText:"Requires signatures",
      show:true
    },
    {
      itemName:"Incremental Funding Plan",
      requiresSignature:false,
      alertText:"Requires signatures",
      show:this.incrementallyFunded === "YES"
    },
    {
      itemName:"Justification and Approval (Template)",
      requiresSignature:true,
      alertText:"Complete and sign",
      show:this.fairOpportunity !== "NO_NONE"
    },
    {
      itemName:"Sole Source Market Research Report (Template)",
      requiresSignature:true,
      alertText:"Complete and sign",
      show:this.fairOpportunity !== "NO_NONE"
    },
    {
      itemName:"Description of Work",
      requiresSignature:false,
      show:true
    },
    {
      itemName:"Evaluation Plan",
      requiresSignature:false,
      show:this.fairOpportunity !== "NO_NONE"
    },
  ];
  get missingDocsText(): string{
    return this.filesNeeded.length - this.uploadedFiles.length === 1?
      "signed document":"signed documents"
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
  @Watch("uploadedFiles")
  private async filesUploaded(): Promise<void>{
    if(this.uploadedFiles.length === this.needsSignatureLength){
      await acquisitionPackage.setDisableContinue(false)
    }else{
      await acquisitionPackage.setDisableContinue(true)
    }
  }
  private getRulesArray(): ((v: string) => string | true | undefined)[] {
    let rulesArr: ((v: string) => string | true | undefined)[] = [];

    this.invalidFiles.forEach((iFile) => {
      rulesArr.push(
        this.$validators.isFileValid(
          iFile.file,
          this.validFileFormats,
          this.maxFileSizeInBytes,
          iFile.doesFileExist,
          iFile.SNOWError,
          iFile.statusCode,
          [],
        )
      );
    });

    return rulesArr;
  }
  public async loadOnEnter(): Promise<void> {
    this.packages.forEach(item =>{
      if(item.show && item.requiresSignature){
        this.needsSignatureLength++
        this.filesNeeded.push(item.itemName)
      }
    })
    await acquisitionPackage.setDisableContinue(true)
  }
  async mounted(): Promise<void>{
    await this.loadOnEnter()
  }
}
</script>

