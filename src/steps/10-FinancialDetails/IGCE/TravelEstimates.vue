<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          How do you want to estimate your travel needs?
        </h1>
        <p class="page-intro">
          Consider the travel requirements that you previously outlined (e.g.,
          location, duration, quantity, attendance, etc.). You may choose to set
          a ceiling price and apply it to all periods. Or, if you know that your
          travel requirements will change over time, then you may opt to set a
          different price for each period.
        </p>
        <div class="copy-max-width">
          <ATATRadioGroup
            class="copy-max-width max-width-740"
            id="TravelEstimates"
            :card="true"
            :items="travelEstimateOptions"
            :value.sync="ceilingPrice"
            :rules="[$validators.required('Please select an option')]"
          />
        </div>
        <hr class="mt-8" v-if="ceilingPrice !== ''" />

        <div v-if="ceilingPrice !== ''">
          <ATATSingleAndMultiplePeriods
            :periods.sync="periods"
            :isMultiple="ceilingPrice === 'MULTIPLE'"
            :values.sync="estimatedTravelCosts"
          ></ATATSingleAndMultiplePeriods>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import {RadioButton, SingleMultiple} from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { Component, Mixins, Watch } from "vue-property-decorator";
import Periods from "@/store/periods";
import {EstimateOptionValueDTO, PeriodDTO} from "@/api/models";
import IGCEStore from "@/store/IGCE";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import AnticipatedDataNeeds from "@/components/DOW/AnticipatedDataNeeds.vue";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods,
    AnticipatedDataNeeds
  },
})
export default class TravelEstimates extends Mixins(SaveOnLeave) {
  private periods: PeriodDTO[] | null = [];
  private ceilingPrice: SingleMultiple = "";
  private estimatedTravelCosts = [""];
  private percentages = [""];
  public savedData: EstimateOptionValueDTO = {
    option: "",
    estimated_values: [],
  };

  private travelEstimateOptions: RadioButton[] = [
    {
      id: "SinglePrice",
      label:
        "I want to apply the same price estimate to all performance periods.",
      value: "SINGLE",
    },
    {
      id: "MultiplePrices",
      label:
        "I want to estimate a different price for the base and each option period.",
      value: "MULTIPLE",
    },
  ];

  get currentData(): EstimateOptionValueDTO {
    return{
      option: this.ceilingPrice,
      estimated_values: this.estimatedTravelCosts,
    }
  };

  @Watch("ceilingPrice")
  protected changeSelection(newVal: string): void{
    if (newVal !== this.savedData.option){
      this.estimatedTravelCosts = [];
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  private async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.periods = Periods.periods;
  }

  private async loadOnEnter(): Promise<void> {
    const store = await IGCEStore.getRequirementsCostEstimate();
    this.savedData = store.travel;
    this.ceilingPrice = store.travel.option
    this.estimatedTravelCosts = store.travel.estimated_values;
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      const store = await IGCEStore.getRequirementsCostEstimate();
      store.travel = this.currentData;
      await IGCEStore.setRequirementsCostEstimate(store);
      await IGCEStore.saveRequirementsCostEstimate();
    }
    return true;
  }
}
</script>

