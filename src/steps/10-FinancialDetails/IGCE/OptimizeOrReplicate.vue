<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Let’s start with a price estimate for {{ headingVerb }} your current functions
          </h1>
          <p class="page-intro">
            Based on what you previously told us in the Background section, you need the CSP 
            to perform a “lift and shift” to recreate your environment and configurations using 
            JWCC offerings. Below, estimate a price per period for this requirement. 
            If you know the requirement will change over time, then you can customize 
            the price for each performance period.
          </p>
          <div class="copy-max-width">
            <ATATRadioGroup
              class="copy-max-width max-width-740"
              id="OptimizeOrReplicateEstimates"
              :card="false"
              legend="How do you want to estimate a price for this requirement?"
              :items="optimizeOrReplicateEstimateOptions"
              :value.sync="ceilingPrice"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
          <hr class="mt-8" v-if="ceilingPrice !== ''" />

          <div v-if="ceilingPrice !== ''">
            <ATATSingleAndMultiplePeriods
              :periods.sync="periods"
              :isMultiple="ceilingPrice === 'multiple'"
              :values.sync="estimatedCosts"
              :singlePeriodTooltipText="singlePeriodTooltipText"
              :multiplePeriodTooltipText = "multiplePeriodTooltipText"
              :showMultiplePeriodTooltip="true"
            ></ATATSingleAndMultiplePeriods>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Watch, Mixins } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { RadioButton } from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import { hasChanges } from "@/helpers";
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import IGCEStore, { OptimizeOrReplicateEstimateNeeds } from "@/store/IGCE";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods
  },
})
export default class OptimizeOrReplicate extends Mixins(SaveOnLeave) {

  private ceilingPrice = "";
  private estimatedCosts = [""];
  private periods: PeriodDTO[] | null = [];
  private singlePeriodTooltipText = "This estimate will be applied to all performance periods.";
  private multiplePeriodTooltipText = `Customize a price estimate for 
    each performance period, based on your needs.`;

  public savedData: OptimizeOrReplicateEstimateNeeds = {
    ceilingPrice: "",
    estimatedCosts: [],
  };

  private optimizeOrReplicateEstimateOptions: RadioButton[] = [
    {
      id: "SinglePrice",
      label:
        "I want to apply the same price estimate to all performance periods.",
      value: "single",
    },
    {
      id: "MultiplePrices",
      label:
        "I want to estimate a different price for the base and each option period.",
      value: "multiple",
    },
  ];

  get currentData(): OptimizeOrReplicateEstimateNeeds {
    return{
      ceilingPrice: this.ceilingPrice,
      estimatedCosts: this.estimatedCosts,
    }
  };

  @Watch("ceilingPrice")
  protected changeSelection(newVal: string): void{
    if (newVal !== this.savedData.ceilingPrice){
      this.estimatedCosts = [];
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public get headingVerb(): string {
    const replicatedOrOptimized = 
      AcquisitionPackage.currentEnvironment?.current_environment_replicated_optimized;
    return replicatedOrOptimized === "YES_OPTIMIZE" ? "optimizing" : "replicating";
  }

  protected async loadOnEnter(): Promise<boolean> {
    const store = await IGCEStore.getOptimizeOrReplicateEstimateNeeds();
    this.savedData = store;
    this.ceilingPrice = store.ceilingPrice;
    this.estimatedCosts = store.estimatedCosts;

    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.periods = Periods.periods;
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) { 
      IGCEStore.setOptimizeOrReplicateEstimateNeeds(this.currentData);
    }
    return true;
  }

}
</script>