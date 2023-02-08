<!-- eslint-disable camelcase -->
<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width mb-7">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Does your contracting office charge a fee for processing task orders?
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-7">
              Based on what you previously told us in the Acquisition Package Details section, you
              will not be utilizing the Defense Information Technology Contracting Organization
              (DITCO). Therefore, if your Contracting Office charges an additional fee, it will
              be included in your total estimate. Additionally, your acquisition is subject to a 1%
              external ordering agency fee that will be automatically included in your estimate.
            </p>
          </div>
          <ATATRadioGroup 
            id="isFeeChargedOptions" 
            width="180" 
            :value.sync="isCharged" 
            :items="items"
            name="is-fee-charged" 
            card="true" 
            :rules="[$validators.required('Please select an option')]">
          </ATATRadioGroup>
          <hr class="mt-7" v-if="isCharged === 'YES'" />
          <ATATTextField v-if="isCharged === 'YES'" ref="PercentageTextbox"
            label="What percentage of the total price does your contracting office charge?" 
            id="ContractPricePercentage"
            placeHolder="1-20" suffix="%" width="150" :value.sync="percentage" :rules="[
              $validators.required('Please enter your contracting office’s fee.'),
              $validators.isBetween(1, 20, 'The percentage must be less than or equal to 20%.'),
            ]" />
        </v-col>
      </v-row>
  </v-container>
</v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Mixins, Watch } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue"
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import IGCEStore from "@/store/IGCE";
import { RequirementsCostEstimateDTO } from "@/api/models";
import { YesNo } from "../../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField
  },
})
export default class FeeCharged extends Mixins(SaveOnLeave) {
  $refs!: {
    PercentageTextbox: Vue & {
      errorMessages: () => [];
    };
  };


  private isCharged: YesNo = "";
  private percentage: number | null = null;
  private items = [
    {
      id: "YES",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "NO",
      label: "No.",
      value: "NO",
    },
  ];

  private get currentData(): RequirementsCostEstimateDTO["fee_specs"] {
    return {
      is_charged: this.isCharged,
      percentage: this.percentage
    };
  }

  private savedData: RequirementsCostEstimateDTO["fee_specs"] = {
    is_charged: "",
    percentage: null
  };

  @Watch("isCharged")
  protected evalIsCharged(newVal: string): void {
    if (newVal === "NO") {
      this.percentage = null;
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public hasErrorMessages(): boolean {
    if (this.$refs.PercentageTextbox) {
      return this.$refs.PercentageTextbox.errorMessages.length > 0;
    }
    return false;
  }

  public async loadOnEnter(): Promise<void> {
    const store = await IGCEStore.getRequirementsCostEstimate();
    this.savedData = store.fee_specs;
    this.isCharged = store.fee_specs.is_charged || "";
    this.percentage = store.fee_specs.percentage;
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      if (this.hasErrorMessages()) {
        this.percentage = null;
      }
      const store = await IGCEStore.getRequirementsCostEstimate();
      store.fee_specs = this.currentData;
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

