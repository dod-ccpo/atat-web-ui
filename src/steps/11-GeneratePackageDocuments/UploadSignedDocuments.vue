<template>
  <div>
    <h1>
      Upload your signed documents
    </h1>
    <div class="copy-max-width">
      <p class="mt-2">
        To submit your package, all documents that require certification must be signed by your 
        approving officials. Upload your individually signed documents below.    
      </p>
      <div>
        <ATATAlert
          id="warning"
          style="width:968px"
          class="my-10"
          type="warning"
        >
        
          <template v-slot:content>
            <p class="mt-1 mb-0">
              Prior to proceeding, we recommend 
              <router-link 
                class="my-2"
                id="revisitFundingSection"
                :to="{ name: routeNames.FundingPlanType }"
                >
                revisiting the Funding section
                </router-link>
              to ensure you uploaded either your Fiscal Service Forms (7600A and 7600B) or your 
              Military Interdepartmental Purchase Request (MIPR). If you already provided your 
              completed funding document(s), please ignore this message.
            </p>
          </template>
        </ATATAlert>
      <div class="d-flex">
        <div
          style="width: 588px;"
        >
          <ATATFileUpload
            :validFileFormats="validFileFormats"
            :attachmentServiceName="attachmentServiceName"
            :maxFileSizeInBytes="maxFileSizeInBytes"
            :restrictedNames="generatedDocumentNames"
            id="SignedDocs"
            @delete="onRemoveAttachment"
            fileListTitle="Your files"
            :invalidFiles.sync="invalidFiles"
            :maxNumberOfFiles="getMaxNumberOfFiles"
            :validFiles.sync="uploadedFiles"
            :rules="getRulesArray()"
            :filesRequired="true"
            :showSupportedFileTypes="false"
          />
        </div>
        <div>
          <div
            style="width: 380px;"
            class="pl-5">
            <ATATAlert
              v-if="!isCompleted && uploadedFiles.length>0"
              id="warning"
              class="mb-4"
              type="warning"
            >
              <template v-slot:content>
                <p class="mt-1 mb-0">
                  <strong>
                    Missing {{ numberOfMissingFiles }} file{{ numberOfMissingFiles > 1 ? 's' : ''}}.
                  </strong>Please upload all of the signed documents listed below.
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
                <div class="d-flex flex-column">
                  <h3>
                    {{needsSignatureLength}} signed documents
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
        </div>
      </div>
    </div>
  </div>
  <ATATLoadingPackageModal :isLoading="isLoading" />
  </div>
</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import { Component, Watch } from "vue-facing-decorator;

import ATATAlert from "@/components/ATATAlert.vue";
import ATATFileUpload from "@/components/ATATFileUpload.vue";
import ATATLoadingPackageModal from "@/components/ATATLoadingPackageModal.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import { TABLENAME as PACKAGE_DOCUMENTS_SIGNED } from "@/api/packageDocumentsSigned";
import { invalidFile, signedDocument, uploadingFile } from "../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Attachments from "@/store/attachments";
import FinancialDetails from "@/store/financialDetails";
import { PackageDocumentsSignedDTO } from "@/api/models";
import { routeNames } from "../../router/stepper"
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components:{
    ATATAlert,
    ATATFileUpload,
    ATATLoadingPackageModal,
    ATATSVGIcon,
  }
})
export default class UploadSignedDocuments extends SaveOnLeave {
  public packageNotInitialized = false;
  public routeNames = routeNames;

  private attachmentServiceName = PACKAGE_DOCUMENTS_SIGNED;
  private maxFileSizeInBytes = 1073741824;
  private validFileFormats = ["pdf","jpg","png","docx","doc"];
  private invalidFiles: invalidFile[] = [];
  private uploadedFiles: uploadingFile[] = [];
  private needsSignatureLength = 0;
  private allSignaturesLength = 0;
  private isInitialLoad = true;
  private haveFilesChanged = false;
  private saved:PackageDocumentsSignedDTO | null = {
    /* eslint-disable camelcase */
    sys_id: "",
    sys_updated_by: "",
    sys_created_on: "",
    sys_mod_count: "",
    sys_updated_on: "",
    sys_tags: "",
    sys_created_by: ""
  };
  private filesNeeded:string[] = [];
  public generatedDocumentNames: string[] = [];
  get fairOpportunity():string {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity || "";
  }
  get incrementallyFunded():string {
    return FinancialDetails.fundingRequirement?.incrementally_funded || "";
  }

  get getMaxNumberOfFiles():number{
    return this.filesNeeded.length;
  }
  
  private packages: signedDocument[] = [];

  get numberOfMissingFiles(): number {
    return this.getMaxNumberOfFiles - this.uploadedFiles.length;
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
    await this.setDisableContinue();
    if(!this.isInitialLoad && AcquisitionPackage.currentUserIsContributor){
      this.haveFilesChanged = true;
    }
    this.isInitialLoad = false;
  }

  private async setDisableContinue(): Promise<void>{
    await AcquisitionPackage.setDisableContinue(
      !this.isCompleted
    )
  }

  /**
   * returns if all expected files have been uploaded
   **/
  get isCompleted(): boolean {
    return this.uploadedFiles.length === this.getMaxNumberOfFiles
  }

  private getRulesArray(): ((v: string) => string | true | undefined)[] {
    //eslint-disable-next-line prefer-const
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
          this.generatedDocumentNames
        )
      );
    });

    return rulesArr;
  }

  public get isLoading(): boolean {
    return this.packageNotInitialized || this.isPackageLoading;
  }
  public get isPackageLoading(): boolean {
    return AcquisitionPackage.getIsLoading;
  }

  public async loadOnEnter(): Promise<void> {
    if(!AcquisitionPackage.initialized){
      await AcquisitionPackage.loadPackageFromId(AcquisitionPackage.packageId);
      this.packageNotInitialized = false;
    }
    this.packages = (await AcquisitionPackage.getSignedDocumentsList()).filter(
      signedDoc => signedDoc.show && signedDoc.requiresSignature
    );
    this.needsSignatureLength = this.packages.length;
    this.filesNeeded = this.packages.map(signedDoc => signedDoc.itemName)
    this.generatedDocumentNames = AcquisitionPackage.generatedDocumentNames;
    this.uploadedFiles = await AcquisitionPackage.getDocuments(true);
  }
  async mounted(): Promise<void>{
    await this.loadOnEnter()
    await this.setDisableContinue();
  }

  async saveOnLeave(): Promise<boolean>{
    if (this.haveFilesChanged)
    {
      await AcquisitionPackage.setOwnerNeedsNotification();
    }
    return true;
  }

}
</script>

