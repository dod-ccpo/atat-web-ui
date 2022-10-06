<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          Tell us more about your potential surge capacity
        </h1>

        <ATATAlert
          type="callout"
          :showIcon="false"
          class="copy-max-width pa-6"
          calloutBackground="primary-lighter" 
        >
          <template v-slot:content>
            <h2 class="mb-2">Surge Capabilities</h2>
            <p class="ma-0">
             Surge capabilities over the life of the task order can be between 
             1-50% of the contractor’s total proposed price for the base and 
             all option periods, excluding any six-month extension of services 
             pursuant to 
                <a id="FARlink"
                role="button"
                target="_blank"
                tabindex="0"
                href="https://www.acquisition.gov/far/52.217-8">
              <span class="">Federal Acquisition Regulation (FAR) 52.217-8</span>
              </a> 
            </p>
          </template>
        </ATATAlert>
        <p class="mt-8 mb-2">
          <strong>
            What percentage of surge would you like to estimate for your requirement?
          </strong>
        </p>
        <ATATTextField
          label=""
          id="ContractPricePercentage"
          placeHolder="1-50"
          suffix="%"
          width="150"
          :value.sync="surgeCapabilities"
          :rules="[
            $validators.isBetween(1, 50, 'Please enter a number between 1-50'),
            $validators.required('Please enter a number between 1-50'),
          ]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { RequirementsCostEstimateDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATAlert from "../../../components/ATATAlert.vue";
import ATATTextField from "../../../components/ATATTextField.vue";

@Component({
  components: {
    ATATAlert,
    ATATTextField,
  },
})
export default class SurgeCapabilities extends Mixins(SaveOnLeave) {
  private surgeCapabilities = "";

  private get currentData(): RequirementsCostEstimateDTO {
    return {
      surge_capabilities: this.surgeCapabilities,
    };
  }

  private savedData: RequirementsCostEstimateDTO = {
    surge_capabilities: "",
  };

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    //const storeData = await AcquisitionPackage.
    //loadData<RequirementsCostEstimateDTO>({storeProperty: 
    //StoreProperties.RequirementsCostEstimate});
    const storeData = 
    await AcquisitionPackage.getRequirementsCostEstimate();
    if (storeData) {
      this.savedData.surge_capabilities = storeData.surge_capabilities;
      this.surgeCapabilities = storeData.surge_capabilities || "";
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      //await AcquisitionPackage
      //     .saveData<RequirementsCostEstimateDTO>({data: this.currentData, 
      //     storeProperty: StoreProperties.RequirementsCostEstimate});
      await AcquisitionPackage.setRequirementsCostEstimate(
        this.currentData
      );
        
    }
    return true;
  }
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
