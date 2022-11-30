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
          <div v-if="hasSingleArchitecturalDesignProblem">
            <div class="copy-max-width">
              <ATATRadioGroup
                class="copy-max-width max-width-740"
                id="SingleArchEstimates"
                legend="How do you want to estimate a price for this requirement?"
                :items="estimateOptions"
                :value.sync="singleCeilingPrice"
                :rules="[$validators.required('Please select an option')]"
              />
            </div>
            <hr class="mt-8" v-if="singleCeilingPrice !== ''" />

            <div v-if="singleCeilingPrice !== ''">
              <ATATSingleAndMultiplePeriods
                :periods.sync="periods"
                :isMultiple="singleCeilingPrice === 'multiple'"
                :values.sync="singleEstimateNeeds.estimatedCosts"
                :singlePeriodTooltipText="singlePeriodTooltipText"
                :multiplePeriodTooltipText = "multiplePeriodTooltipText"
                :showMultiplePeriodTooltip="true"
              ></ATATSingleAndMultiplePeriods>
            </div>
          </div>
          <div v-if="!hasSingleArchitecturalDesignProblem">
            <h2>1. Estimate your known problem related to your current environment</h2>
            <br />
            <div class="copy-max-width">
              <ATATRadioGroup
                class="copy-max-width max-width-740"
                id="currentEnvArchEstimates"
                legend="How do you want to estimate a price for this requirement?"
                :items="estimateOptions"
                :value.sync="currentEnvCeilingPrice"
                :rules="[$validators.required('Please select an option')]"
              />
            </div>
            <hr class="mt-8" v-if="currentEnvCeilingPrice !== ''" />

            <div v-if="currentEnvCeilingPrice !== ''">
              <ATATSingleAndMultiplePeriods
                :periods.sync="periods"
                :isMultiple="currentEnvCeilingPrice === 'multiple'"
                :values.sync="currentEnvEstimateNeeds.estimatedCosts"
                :singlePeriodTooltipText="singlePeriodTooltipText"
                :multiplePeriodTooltipText = "multiplePeriodTooltipText"
                :showMultiplePeriodTooltip="true"
              ></ATATSingleAndMultiplePeriods>
            </div>
            <hr/>
            <h2>2. Estimate your known problem outlined in your Performance Requirements</h2>
            <br />
            <div class="copy-max-width">
              <ATATRadioGroup
                class="copy-max-width max-width-740"
                id="perfReqArchEstimates"
                legend="How do you want to estimate a price for this requirement?"
                :items="estimateOptions"
                :value.sync="perfReqCeilingPrice"
                :rules="[$validators.required('Please select an option')]"
              />
            </div>
            <hr class="mt-8" v-if="perfReqCeilingPrice !== ''" />

            <div v-if="perfReqCeilingPrice !== ''">
              <ATATSingleAndMultiplePeriods
                :periods.sync="periods"
                :isMultiple="perfReqCeilingPrice === 'multiple'"
                :values.sync="perfReqEstimateNeeds.estimatedCosts"
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
import { RadioButton } from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import { hasChanges } from "@/helpers";
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import IGCEStore, { ArchDesignEstimateNeeds } from "@/store/IGCE";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods
  }
})
export default class ArchitecturalDesignSolutions extends Mixins(SaveOnLeave) {

  private hasSingleArchitecturalDesignProblem = true;

  private pageIntroText = "";
  private periods: PeriodDTO[] | null = [];
  private singlePeriodTooltipText = "This estimate will be applied to all performance periods.";
  private multiplePeriodTooltipText = `Customize a price estimate for 
    each performance period, based on your needs.`;

  private singleCeilingPrice = "";
  private currentEnvCeilingPrice = "";
  private perfReqCeilingPrice = "";

  private singleEstimateNeeds: ArchDesignEstimateNeeds = {
    ceilingPrice: "",
    estimatedCosts: []
  };

  private currentEnvEstimateNeeds: ArchDesignEstimateNeeds = {
    ceilingPrice: "",
    estimatedCosts: []
  };

  private perfReqEstimateNeeds: ArchDesignEstimateNeeds = {
    ceilingPrice: "",
    estimatedCosts: []
  };

  public savedData: ArchDesignEstimateNeeds[] = [];

  private estimateOptions: RadioButton[] = [
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

  get currentData(): ArchDesignEstimateNeeds[] {
    const estimateNeeds: ArchDesignEstimateNeeds[] = [];

    if(this.hasSingleArchitecturalDesignProblem){
      estimateNeeds.push(this.singleEstimateNeeds);
    } else {
      estimateNeeds.push(this.currentEnvEstimateNeeds);
      estimateNeeds.push(this.perfReqEstimateNeeds);
    }

    return estimateNeeds;
  }

  @Watch("singleCeilingPrice")
  private singleEstimateNeedsChangeSelection(newVal: string): void {
    if(newVal !== this.singleEstimateNeeds.ceilingPrice){
      this.singleEstimateNeeds.ceilingPrice = newVal;
      this.singleEstimateNeeds.estimatedCosts = [];
    }
      
  }

  @Watch("currentEnvCeilingPrice")
  private currentEnvEstimateNeedsChangeSelection(newVal: string): void {
    if(newVal !== this.currentEnvEstimateNeeds.ceilingPrice){
      this.currentEnvEstimateNeeds.ceilingPrice = newVal;
      this.currentEnvEstimateNeeds.estimatedCosts = [];
    }
  }

  @Watch("perfReqCeilingPrice")
  private perfReqEstimateNeedsChangeSelection(newVal: string): void {
    if(newVal !== this.perfReqEstimateNeeds.ceilingPrice){
      this.perfReqEstimateNeeds.ceilingPrice = newVal;
      this.perfReqEstimateNeeds.estimatedCosts = [];
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public get issuesText(): string {
    return this.hasSingleArchitecturalDesignProblem
      ? "problem or use-case"
      : "problems or use-cases"
  }

  protected async loadOnEnter(): Promise<boolean> {

    const store = await IGCEStore.getArchDesignEstimateNeeds();
    this.savedData = store;

    if(store.length > 1){
      this.currentEnvEstimateNeeds = store[0];
      this.currentEnvCeilingPrice = this.currentEnvEstimateNeeds.ceilingPrice;
      this.perfReqEstimateNeeds = store[1];
      this.perfReqCeilingPrice = this.perfReqEstimateNeeds.ceilingPrice;
    } else if(store.length == 1) {
      this.singleEstimateNeeds = store[0];
      this.singleCeilingPrice = this.singleEstimateNeeds.ceilingPrice;
    }

    const currentEnvironmentNeeds = // true;
      AcquisitionPackage.currentEnvironment?.needs_architectural_design_services === "YES";

    /* todo: ONLY HAS LOGIC FOR CURRENT ENVIRONMENT AT THE MOMENT; NEEDS DOW ITEMS THAT HAVEN'T
       BEEN IMPLEMENTED YET */
    const perfReqNeeds = true;

    this.hasSingleArchitecturalDesignProblem = !(currentEnvironmentNeeds && perfReqNeeds);

    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.periods = Periods.periods;
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);

    if (this.hasChanged()) {
      IGCEStore.setArchDesignEstimateNeeds(this.currentData);
    }

    return true;
  }

}
</script>