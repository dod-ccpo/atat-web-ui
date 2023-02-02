<template>
  <div>
    <h1>
      Upload your signed documents
    </h1>
    <div class="copy-max-width">
      <p class="mt-2 mb-4">
        To submit your package, all documents that require certification must
        be signed by your approving officials and uploaded below.
        <span v-if="fairOpportunity !=='NO_NONE'">
        For the <span class="font-weight-500">Justification & Approval (J&A)</span>
        and <span class="font-weight-500">Market Research Report</span>, you must also
        upload the completed template in an editable format to help your
        Contracting Office track changes during the review process.</span>
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
            :maxNumberOfFiles="fairOpportunity !== 'NO_NONE'?
            filesNeeded.length + 2:filesNeeded.length"
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
              v-if="fairOpportunity !== 'NO_NONE'"
              class="
              border1
              border-rounded-more
              border-base-lighter
              bg-primary-lighter
              pa-6
              mb-4"
            >
              <div class="d-flex align-center mb-4">
                <ATATSVGIcon
                  class="mr-2"
                  name="checkedBag"
                  width="39"
                  height="35"
                  color="primary"
                />
                <div class="d-flex flex-column">
                  <h3>
                    2 completed templates
                  </h3>
                  <span class="font-size-14 help-text">Upload .doc or .docx files</span>
                </div>
              </div>
              <ol>
                <li>
                  Justification and Approval
                </li>
                <li>
                  Sole Source Market Research Report
                </li>
              </ol>
            </div>
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
                <div class="d-flex flex-column">
                  <h3>
                    {{needsSignatureLength}} signatures required
                  </h3>
                  <span class="font-size-14 help-text">Upload .pdf, .png, or .jpg files</span>
                </div>
              </div>
              <ol>
                <li
                  v-for="(item,idx) in filesNeeded"
                  :key="idx"
                  class="pb-1"
                >
                  {{item}}
                </li>
              </ol>
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
import { TABLENAME as PACKAGE_DOCUMENTS_SIGNED } from "@/api/packageDocumentsSigned";
import { invalidFile, uploadingFile } from "../../../types/Global";
import Attachments from "@/store/attachments";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import FinancialDetails from "@/store/financialDetails";
import ATATAlert from "@/components/ATATAlert.vue";
import acquisitionPackage from "@/store/acquisitionPackage";
import { PackageDocumentsSignedDTO, ReferenceColumn } from "@/api/models";
import { TABLENAME as ACQUISITION_PACKAGE_TABLE } from "@/api/acquisitionPackages";
@Component({
  components:{
    ATATFileUpload,
    ATATSVGIcon,
    ATATAlert,
  }
})
export default class UploadSignedDocuments extends Vue {
  private attachmentServiceName = PACKAGE_DOCUMENTS_SIGNED;
  private maxFileSizeInBytes = 1073741824;
  private validFileFormats = ["pdf","jpg","png","docx"];
  private invalidFiles: invalidFile[] = [];
  private uploadedFiles: uploadingFile[] = [];
  private needsSignatureLength = 0;
  private saved:PackageDocumentsSignedDTO | null = {
    /* eslint-disable camelcase */
    sys_id: "",
    sys_updated_by: "",
    sys_created_on: "",
    sys_mod_count: "",
    acquisition_package: {},
    sys_updated_on: "",
    sys_tags: "",
    sys_created_by: ""
  };
  private filesNeeded:string[] = [];
  get fairOpportunity():string {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity || "";
  }
  get incrementallyFunded():string {
    return FinancialDetails.fundingRequirement?.incrementally_funded || "";
  }
  private packages = [
    {
      itemName:"Justification and Approval",
      requiresSignature:true,
      alertText:"Complete and sign",
      show:true
    },{
      itemName:"Sole Source Market Research Report",
      requiresSignature:true,
      alertText:"Complete and sign",
      show:true
    },
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
      requiresSignature:true,
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
          recordId,
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
    await acquisitionPackage.setDisableContinue(true)
    this.packages.forEach(item =>{
      if(item.show && item.requiresSignature){
        this.needsSignatureLength++
        this.filesNeeded.push(item.itemName)
      }
    })
    this.saved = await acquisitionPackage.getPackageDocumentsSigned()
    if(this.saved){
      try {
        const attachment = await Attachments.getAttachmentById({
          serviceKey: PACKAGE_DOCUMENTS_SIGNED, sysID: this.saved?.sys_id||""});
        if (attachment) {
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
          this.uploadedFiles = [upload];
        }
      } catch (error) {
        throw new Error("an error occurred loading Package Signed Documents data");
      }
    }
  }
  async mounted(): Promise<void>{
    await this.loadOnEnter()

  }
}
</script>

