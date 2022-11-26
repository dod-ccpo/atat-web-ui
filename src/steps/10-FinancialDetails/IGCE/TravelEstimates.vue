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
            :isMultiple="ceilingPrice === 'multiple'"
            :values.sync="estimatedTravelCosts"
          ></ATATSingleAndMultiplePeriods>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { RadioButton } from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { Component, Mixins, Watch } from "vue-property-decorator";
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import IGCEStore, { TravelEstimateNeeds } from "@/store/IGCE";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods
  },
})
export default class TravelEstimates extends Mixins(SaveOnLeave) {
  private periods: PeriodDTO[] | null = [];
  private ceilingPrice = "";
  private estimatedTravelCosts = [""];
  public savedData: TravelEstimateNeeds = {
    ceilingPrice: "",
    estimatedTravelCosts: [],
  };

  private travelEstimateOptions: RadioButton[] = [
    {
      id: "SinglePrice",
      label:
        "I want to set a ceiling price and apply the same estimate to all base and option periods.",
      value: "single",
    },
    {
      id: "MultiplePrices",
      label:
        "I want to customize my travel estimates for the base and each option period.",
      value: "multiple",
    },
  ];

  get currentData(): TravelEstimateNeeds {
    return{
      ceilingPrice: this.ceilingPrice,
      estimatedTravelCosts: this.estimatedTravelCosts,
    }
  };

  @Watch("ceilingPrice")
  protected changeSelection(newVal: string): void{
    if (newVal !== this.savedData.ceilingPrice){
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
    const store = await IGCEStore.getTravelEstimateNeeds();
    this.savedData = store;
    this.ceilingPrice = store.ceilingPrice;
    this.estimatedTravelCosts = store.estimatedTravelCosts;
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      IGCEStore.setTravelEstimateNeeds(this.currentData);
    }
    return true;
  }
}
</script>

