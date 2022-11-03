<template>
  <v-container class="container-max-width" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Has a migration assessment, analysis, or process occurred to identify the cloud services
          and tools needed?
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            If available, you can upload this supporting documentation, and we will attach it to
            your Description of Work to be shared with the CSPs for proposal purposes. Please do
            not upload any classified documents.
          </p>
          <ATATRadioGroup
            id="ExistingEnvOptions"
            :card="true"
            :items="uploadOptions"
            :rules="[$validators.required('Please select an option')]"
            :value.sync="selectedUpload"
            class="copy-max-width mb-10 max-width-740"
            width="180"
          />
          <div v-show="selectedUpload === 'YES'">
            <hr />
            <ATATFileUpload
              id="FundingPlan"
              tabindex="-1"
              :invalidFiles.sync="invalidFiles"
              :maxFileSizeInBytes="maxFileSizeInBytes"
              :validFileFormats="validFileFormats"
              :validFiles.sync="uploadedFiles"
              :multiplesAllowed="true"
              :attachmentServiceName="attachmentServiceName"
              :removeAll.sync="removeAll"
              @delete="deleteFile"
            />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">

import { Component, Mixins, Watch } from "vue-property-decorator";
import { invalidFile, RadioButton, uploadingFile } from "../../../../types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { CurrentEnvironmentDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATFileUpload from "@/components/ATATFileUpload.vue";
import { TABLENAME as FUNDING_REQUEST_MIPRFORM_TABLE } from "@/api/fundingRequestMIPRForm";

@Component({
  components: {
    ATATFileUpload,
    ATATRadioGroup,
  },
})
export default class UploadProcessDocuments extends Mixins(SaveOnLeave) {
  private attachmentServiceName = FUNDING_REQUEST_MIPRFORM_TABLE;
  private uploadOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "No",
      label: "No.",
      value: "NO",
    },
  ];
  private invalidFiles: invalidFile[] = [];
  private maxFileSizeInBytes = 1073741824;
  private validFileFormats = ["csv","xlsx","pdf","jpg","png","docx"];
  private uploadedFiles: uploadingFile[] = [];

  public selectedUpload
    = AcquisitionPackage.currentEnv?.assessmentAnalysisDocumentation || ""
  private get currentData(): CurrentEnvironmentDTO {
    return {
      assessmentAnalysisDocumentation: this.selectedUpload || "",
    };
  }

  private savedData: CurrentEnvironmentDTO = {
    assessmentAnalysisDocumentation: "",
  }

  public removeAll = false

  @Watch('selectedUpload')
  private onValueChange(): void{
    if(this.selectedUpload === "NO"){
      this.uploadedFiles = []
      this.removeAll = true
    }
  }

  public async deleteFile(file: uploadingFile): Promise<void> {
    // todo future ticket - delete attachment
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }
  public async loadOnEnter(): Promise<void> {
    const storeData = AcquisitionPackage.currentEnv
    if (storeData) {
      this.savedData = {
        assessmentAnalysisDocumentation: storeData.assessmentAnalysisDocumentation,
      }
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        AcquisitionPackage.setCurrentEnv(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>

