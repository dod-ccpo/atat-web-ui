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
                target="_blank"
                href="https://www.acquisition.gov/far/52.217-8">
              <span class="_external-link">Federal Acquisition Regulation (FAR) 52.217-8</span>
              </a> 
            </p>
          </template>
        </ATATAlert>
        <p class="mt-8 mb-2 font-weight-500">
            What percentage of surge would you like to estimate for your requirement?
        </p>
        <ATATTextField
          label=""
          ref="PercentageTextbox"
          id="ContractPricePercentage"
          placeHolder="1-50"
          suffix="%"
          width="150"
          :value.sync="capacity"
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
import Vue from "vue";
import { Component, Mixins } from "vue-property-decorator";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATAlert from "../../../components/ATATAlert.vue";
import ATATTextField from "../../../components/ATATTextField.vue";
import IGCEStore, {SurgeRequirements } from "@/store/IGCE";
import {YesNo} from "../../../../types/Global";

@Component({
  components: {
    ATATAlert,
    ATATTextField,
  },
})
export default class SurgeCapabilities extends Mixins(SaveOnLeave) {
  $refs!: {
    PercentageTextbox: Vue & {
      errorMessages: [];
    };
  };

  public capacity: number | null = null;
  public capabilities: YesNo = "";
  private get currentData(): SurgeRequirements {
    return {
      capabilities: this.capabilities,
      capacity: this.capacity
    };
  }

  private savedData : SurgeRequirements = {
    capabilities: this.capabilities,
    capacity: this.capacity
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public hasErrorMessages(): boolean {
    return this.$refs.PercentageTextbox.errorMessages.length>0;
  }

  public async loadOnEnter(): Promise<void> {
    const store = await IGCEStore.getRequirementsCostEstimate();
    this.savedData = store.surge_requirements;
    this.capabilities = store.surge_requirements.capabilities;
    this.capacity = store.surge_requirements.capacity as number;
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      if (this.hasErrorMessages()){
        this.capacity = null;
      }
      const store = await IGCEStore.getRequirementsCostEstimate();
      store.surge_requirements = this.currentData;
      await IGCEStore.setRequirementsCostEstimate(store);
      await IGCEStore.saveRequirementsCostEstimate();
    }
    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
