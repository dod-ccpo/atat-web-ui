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
              :value.sync="opRepOption"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
          <hr class="mt-8" v-if="opRepOption !== ''" />

          <div v-if="opRepOption !== ''">
            <ATATSingleAndMultiplePeriods
              :periods.sync="periods"
              :isMultiple="opRepOption === 'MULTIPLE'"
              :values.sync="opRepEstValues"
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
import {RadioButton, SingleMultiple} from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import { hasChanges } from "@/helpers";
import Periods from "@/store/periods";
import { EstimateOptionValueDTO, PeriodDTO } from "@/api/models";
import IGCEStore from "@/store/IGCE";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import _ from "lodash";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods
  },
})
export default class OptimizeOrReplicate extends Mixins(SaveOnLeave) {
  private opRepOption: SingleMultiple = "";
  private opRepEstValues: string[] = [""];
  private periods: PeriodDTO[] | null = [];
  private singlePeriodTooltipText = "This estimate will be applied to all performance periods.";
  private multiplePeriodTooltipText = `Customize a price estimate for 
    each performance period, based on your needs.`;

  public savedData: EstimateOptionValueDTO = {
    option:"",
    estimated_values:[]
  };

  private optimizeOrReplicateEstimateOptions: RadioButton[] = [
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
      option: this.opRepOption,
      estimated_values: this.opRepEstValues,
    }
  }

  @Watch("opRepOption", {deep: true})
  protected changeSelection(newVal: string): void{
    if (newVal !== this.savedData.option){
      this.opRepEstValues = [];
    }
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
    this.savedData = _.cloneDeep(store.optimize_replicate);
    this.opRepOption = store.optimize_replicate.option;
    this.opRepEstValues = store.optimize_replicate.estimated_values;
    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.periods = Periods.periods;
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      const store = await IGCEStore.getRequirementsCostEstimate();
      store.optimize_replicate = this.currentData
      await IGCEStore.setRequirementsCostEstimate(store);
      await IGCEStore.saveRequirementsCostEstimate();
    }
    return true;
  }

}
</script>
