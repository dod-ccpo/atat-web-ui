<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          Tell us more about the scope of your project
        </h1>

        <ATATAlert
          type="callout"
          :showIcon="false"
          class="copy-max-width mt-10"
        >
          <template v-slot:content>
            <h2>Surge Capabilities</h2>
            <p class="mt-2">
              The Government may require surge capabilities during the base or
              any option period, and surge modifications will be within the
              scope of the contract for the defined task areas in the
              description of work.
            </p>
            <p class="mb-0">
              Surge capabilities over the life of the task order cannot exceed
              between 1-50% of the contractor’s total proposed price for the
              base and all option periods, excluding any six-month extension of
              services pursuant to Federal Acquisition Regulation (FAR)
              52.217-8.
            </p>
          </template>
        </ATATAlert>
        <p class="mt-8 mb-2">
          If surge capabilities are required, what percentage of the
          contractor’s total proposed price will not be exceeded?
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
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { RequirementsCostEstimateDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATAlert from "../../components/ATATAlert.vue";
import ATATTextField from "../../components/ATATTextField.vue";

@Component({
  components: {
    ATATAlert,
    ATATTextField,
  },
})
export default class RequirementsCostEstimate extends Mixins(SaveOnLeave) {
  private surgeCapabilities = "";

  get contractPricePercentageRules(): unknown[] {
    const validationRules = [];
    validationRules.push(
      (v: number) => (v > 0 && v <= 50) || "Enter a number between 1-50"
    );
    validationRules.push(
      (v: string) => /[0-9]/.test(v) || "Enter a number between 1-50"
    );

    return validationRules;
  }

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
    const storeData = await AcquisitionPackage.
      loadData<RequirementsCostEstimateDTO>({storeProperty: 
      StoreProperties.RequirementsCostEstimate});
    if (storeData) {
      this.savedData.surge_capabilities = storeData.surge_capabilities;
      this.surgeCapabilities = storeData.surge_capabilities || "";
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage
          .saveData<RequirementsCostEstimateDTO>({data: this.currentData, 
            storeProperty: StoreProperties.RequirementsCostEstimate});
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
