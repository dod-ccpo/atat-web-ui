<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Tell us more about your system of records
            </h1>
            <div class="mt-10">
              <ATATTextField
                id="SystemName"
                label="System name"
                class="_input-max-width"
                :value.sync="systemName"
                :rules="[$validators.required('Please enter the name of your system of records.')]"
              />
            </div>
            <div class="d-flex align-start flex-column mt-10 textarea-max-width">
              <ATATTextArea
                id="OperationToBePerformed"
                label="What is the operation of work to be performed?"
                class="width-100"
                :rows="7"
                :value.sync="operationToBePerformed"
                :rules="[
                  $validators.required(
                    'Please enter a description for the operation of work to be performed.'
                  ),
                  $validators.maxLength(
                    400,
                    'Please limit your description to 400 characters or less'
                  ),
                  ]"
                maxChars="400"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {Component, Mixins} from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import {SensitiveInformationDTO} from "@/api/models";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import {hasChanges} from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATTextArea,
    ATATTextField,
  },
})

export default class PIIRecord extends Mixins(SaveOnLeave) {
  private systemName = "";
  private operationToBePerformed = "";

  private get currentData(): SensitiveInformationDTO {
    return {
      system_of_record_name: this.systemName,
      work_to_be_performed: this.operationToBePerformed,
      acquisition_package: AcquisitionPackage.packageId

    };
  }

  private get savedData(): SensitiveInformationDTO {
    return {
      system_of_record_name: AcquisitionPackage.sensitiveInformation?.system_of_record_name || "",
      work_to_be_performed: AcquisitionPackage.sensitiveInformation?.work_to_be_performed || "",
    };
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage
      .loadData<SensitiveInformationDTO>({storeProperty: StoreProperties.SensitiveInformation});
    if (storeData) {
      this.systemName = storeData.system_of_record_name || '';
      this.operationToBePerformed = storeData.work_to_be_performed || '';
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage
          .saveData<SensitiveInformationDTO>( {data: this.currentData, 
            storeProperty: StoreProperties.SensitiveInformation});
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
