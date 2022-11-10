<template>
  <v-container class="container-max-width" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Do you have system diagrams, data architecture diagrams, charts, or other relevant
          information for your current environment?
        </h1>
        <div class="copy-max-width">
          <p class="mb-0">
            If available, you can upload this supporting documentation, and we will attach it to
            your Description of Work to be shared with the CSPs for proposal purposes. Please do not
            upload any classified documents.
          </p>
          <ATATRadioGroup
            id="ExistingEnvOptions"
            :card="true"
            :items="uploadOptions"
            :rules="[$validators.required('Please select an option')]"
            :value.sync="hasSystemDocumentation"
            class="copy-max-width mb-10 max-width-740"
            width="180"
          />
          <div v-show="hasSystemDocumentation === 'YES'">
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
                @delete="removeFile"
             />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">

import { Component, Mixins, Watch } from "vue-property-decorator";
import { invalidFile, RadioButton, uploadingFile, YesNo } from "../../../../types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { CurrentEnvironmentDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATFileUpload from "@/components/ATATFileUpload.vue";
import { TABLENAME as FUNDING_REQUEST_MIPRFORM_TABLE } from "@/api/fundingRequestMIPRForm";
import CurrentEnvironment,
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";

@Component({
  components: {
    ATATFileUpload,
    ATATRadioGroup,
  },
})
export default class UploadSystemDocuments extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;
  
  private attachmentServiceName = FUNDING_REQUEST_MIPRFORM_TABLE;
  private uploadOptions: RadioButton[] = [
    {
      id: "Yes_SystemDocs",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "No_SystemDocs",
      label: "No.",
      value: "NO",
    },
  ];
  private invalidFiles: invalidFile[] = [];
  private maxFileSizeInBytes = 1073741824;
  private validFileFormats = ["csv","xlsx","pdf","jpg","png","docx"];
  private uploadedFiles: uploadingFile[] = [];

  public hasSystemDocumentation: YesNo = "";
  private get currentData(): Record<string, string> {
    return {
      // eslint-disable-next-line camelcase
      has_system_documentation: this.hasSystemDocumentation,
    };
  }

  private savedData: Record<string, string> = {
    // eslint-disable-next-line camelcase
    has_system_documentation: "",
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    // TODO - get from ACQPKG store or CURRENV store??
    const storeData = await AcquisitionPackage.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = storeData;
      this.hasSystemDocumentation = storeData.has_system_documentation;
      this.savedData = {
        // eslint-disable-next-line camelcase
        has_system_documentation: storeData.has_system_documentation,
      }
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        Object.assign(this.currEnvDTO, this.currentData);
        debugger;
        // TODO - which store to save to?
        CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
        AcquisitionPackage.setCurrentEnvironment(this.currEnvDTO);

        // will be used when SNOW store has been wired
        // await AcquisitionPackage.saveData<CurrentEnvironmentDTO>({
        //   data: this.currentData,
        //   storeProperty: StoreProperties.CurrentEnvironment
        // });
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
  public removeAll = false

  @Watch('selectedUpload')
  private selectedUploadChange(): void{
    if(this.hasSystemDocumentation === "NO"){
      this.uploadedFiles = []
      this.removeAll = true
    }
  }

  public async removeFile(file: uploadingFile): Promise<void> {
    // todo future ticket - delete attachment
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>

