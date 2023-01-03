<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Let’s gather price estimates for your architectural design solutions
          </h1>
          <p class="page-intro">
            Consider the details you previously outlined for architectural design 
            solutions to address your known {{ issuesText }}. 
            Estimate a price per period for this requirement below. If you know the 
            requirement will change over time, then you can customize the price 
            for each performance period.
          </p>
          
          <div v-if="currentEnvHasArchDesignNeeds">
            <h2 v-if="bothNeed" class="mb-5">
              1. Estimate your known problem related to your current environment
            </h2>

            <div class="copy-max-width">
              <ATATRadioGroup
                class="copy-max-width max-width-740"
                id="currentEnvArchEstimates"
                legend="How do you want to estimate a price for this requirement?"
                :items="estimateOptions"
                :value.sync="currEnvOption"
                :rules="[$validators.required('Please select an option')]"
              />
            </div>

            <div v-if="currEnvOption !== ''" class="mt-8">
              <ATATSingleAndMultiplePeriods
                :periods.sync="periods"
                :isMultiple="currEnvOption === 'MULTIPLE'"
                :values.sync="currEnvEstValues"
                :singlePeriodTooltipText="singlePeriodTooltipText"
                :multiplePeriodTooltipText = "multiplePeriodTooltipText"
                :showMultiplePeriodTooltip="true"
              ></ATATSingleAndMultiplePeriods>
            </div>
          </div>

          <hr v-if="bothNeed" />

          <div v-if="DOWHasArchDesignNeeds">
            <h2 v-if="bothNeed" class="mb-5">
              2. Estimate your known problem outlined in your Performance Requirements
            </h2>
            <div class="copy-max-width">
              <ATATRadioGroup
                class="copy-max-width max-width-740"
                id="perfReqArchEstimates"
                legend="How do you want to estimate a price for this requirement?"
                :items="estimateOptions"
                :value.sync="perfReqOption"
                :rules="[$validators.required('Please select an option')]"
              />
            </div>

            <div v-if="perfReqOption !== ''" class="mt-8">
              <ATATSingleAndMultiplePeriods
                :periods.sync="periods"
                :isMultiple="perfReqOption === 'MULTIPLE'"
                :values.sync="perfReqEstValues"
                :singlePeriodTooltipText="singlePeriodTooltipText"
                :multiplePeriodTooltipText = "multiplePeriodTooltipText"
                :showMultiplePeriodTooltip="true"
              ></ATATSingleAndMultiplePeriods>
            </div>
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
import {RadioButton, SingleMultiple} from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import { hasChanges } from "@/helpers";
import Periods from "@/store/periods";
import { EstimateOptionValueDTO, PeriodDTO } from "@/api/models";
import IGCEStore from "@/store/IGCE";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import DescriptionOfWork from "@/store/descriptionOfWork";
import _ from "lodash";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods
  }
})
export default class ArchitecturalDesignSolutions extends Mixins(SaveOnLeave) {
  private bothNeed = false;
  private DOWHasArchDesignNeeds: boolean | null = false;
  private currentEnvHasArchDesignNeeds: boolean | null = false;
  private periods: PeriodDTO[] | null = [];
  private singlePeriodTooltipText = "This estimate will be applied to all performance periods.";
  private multiplePeriodTooltipText = `Customize a price estimate for 
    each performance period, based on your needs.`;

  public get issuesText(): string {
    return this.bothNeed
      ? "problems or use-cases"
      : "problem or use-case"
  }

  private currEnvOption: SingleMultiple = "";
  private currEnvEstValues: string[] = [""];

  private perfReqOption: SingleMultiple = "";
  private perfReqEstValues: string[] = [""];

  private estimateOptions: RadioButton[] = [
    {
      id: "SinglePrice",
      label: "I want to apply the same price estimate to all performance periods.",
      value: "SINGLE",
    },
    {
      id: "MultiplePrices",
      label: "I want to estimate a different price for the base and each option period.",
      value: "MULTIPLE",
    },
  ];

  @Watch("currEnvOption", {deep: true})
  private currentEnvCostEstimateChangeSelection(newVal: string): void {
    if(newVal !== this.savedCurrEnvData.option){
      this.currEnvEstValues = [];
    }
  }

  @Watch("perfReqOption", {deep: true})
  private perfReqCostEstimateChangeSelection(newVal: string): void {
    if(newVal !== this.savedPerfReqData.option){
      this.perfReqEstValues = [];
    }
  }

  public savedCurrEnvData: EstimateOptionValueDTO = {
    option:"",
    estimated_values:[]
  };

  public savedPerfReqData: EstimateOptionValueDTO = {
    option:"",
    estimated_values:[]
  };

  get currentDataCurrEnv(): EstimateOptionValueDTO {
    return{
      option: this.currEnvOption,
      estimated_values: this.currEnvEstValues,
    }
  }

  get currentDataPerfReq(): EstimateOptionValueDTO {
    return{
      option: this.perfReqOption,
      estimated_values: this.perfReqEstValues,
    }
  }

  private hasChanged(): boolean {
    return (hasChanges(this.currentDataCurrEnv, this.savedCurrEnvData) ||
        hasChanges(this.currentDataPerfReq, this.savedPerfReqData));
  }

  protected async loadOnEnter(): Promise<void> {
    this.DOWHasArchDesignNeeds = DescriptionOfWork.DOWHasArchitecturalDesignNeeds;
    this.currentEnvHasArchDesignNeeds
      = CurrentEnvironment.currentEnvironment?.needs_architectural_design_services === "YES";
    this.bothNeed = (this.DOWHasArchDesignNeeds === true && this.currentEnvHasArchDesignNeeds);
    
    const store = await IGCEStore.getRequirementsCostEstimate();
    this.savedCurrEnvData = _.cloneDeep(store.architectural_design_current_environment);
    this.currEnvOption = store.architectural_design_current_environment.option;
    this.currEnvEstValues = store.architectural_design_current_environment.estimated_values;

    this.savedPerfReqData = _.cloneDeep(store.architectural_design_performance_requirements);
    this.perfReqOption = store.architectural_design_performance_requirements.option;
    this.perfReqEstValues = store.architectural_design_performance_requirements.estimated_values;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.periods = Periods.periods;
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    if (this.hasChanged()) {
      const store = await IGCEStore.getRequirementsCostEstimate();
      store.architectural_design_current_environment = this.currentDataCurrEnv;
      store.architectural_design_performance_requirements = this.currentDataPerfReq;
      await IGCEStore.setRequirementsCostEstimate(store);
      await IGCEStore.saveRequirementsCostEstimate();
    }
    return true;
  }

}
</script>
