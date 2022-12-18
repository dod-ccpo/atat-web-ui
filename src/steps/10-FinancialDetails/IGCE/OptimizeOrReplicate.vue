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
              :value.sync="oAndRCostEstimates.option"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
          <hr class="mt-8" v-if="oAndRCostEstimates.option !== ''" />

          <div v-if="oAndRCostEstimates.option !== ''">
            <ATATSingleAndMultiplePeriods
              :periods.sync="periods"
              :isMultiple="oAndRCostEstimates.option === 'multiple'"
              :values.sync="oAndRCostEstimates.estimated_values"
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
import { RadioButton } from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import { hasChanges } from "@/helpers";
import Periods from "@/store/periods";
import { EstimateOptionValueDTO, PeriodDTO } from "@/api/models";
import IGCEStore, { defaultRequirementsCostEstimate } from "@/store/IGCE";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import _ from "lodash";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods
  },
})
export default class OptimizeOrReplicate extends Mixins(SaveOnLeave) {

  private oAndRCostEstimates: EstimateOptionValueDTO = {
    option: "",
    estimated_values: []
  };
  private costEstimate = defaultRequirementsCostEstimate();

  private periods: PeriodDTO[] | null = [];
  private singlePeriodTooltipText = "This estimate will be applied to all performance periods.";
  private multiplePeriodTooltipText = `Customize a price estimate for 
    each performance period, based on your needs.`;

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

  public savedData: EstimateOptionValueDTO = {
    option:"",
    estimated_values:[]
  };


  @Watch("oAndRCostEstimates", {deep: true})
  protected changeSelection(newVal: EstimateOptionValueDTO): void{
    if (newVal.option === "SINGLE"){
      this.oAndRCostEstimates.estimated_values.length = 1;
    }
  }
  get currentData(): EstimateOptionValueDTO {
    return this.oAndRCostEstimates;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public get headingVerb(): string {
    const replicatedOrOptimized = 
      CurrentEnvironment.currentEnvironment?.current_environment_replicated_optimized;
    return replicatedOrOptimized === "YES_OPTIMIZE" ? "optimizing" : "replicating";
  }

  protected async loadOnEnter(): Promise<boolean> {
    const store = await IGCEStore.getRequirementsCostEstimate();
    this.savedData = store.optimize_replicate;
    this.oAndRCostEstimates = store.optimize_replicate
    this.costEstimate = _.cloneDeep(store);
    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.periods = Periods.periods;
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      this.costEstimate.optimize_replicate = this.currentData
      await IGCEStore.setRequirementsCostEstimate(this.costEstimate);
    }
    return true;
  }

}
</script>
