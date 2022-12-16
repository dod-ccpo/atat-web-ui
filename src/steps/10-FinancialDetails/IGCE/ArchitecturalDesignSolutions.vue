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
                :value.sync="currentEnvEstimateNeeds.ceilingPrice"
                :rules="[$validators.required('Please select an option')]"
              />
            </div>

            <div v-if="currentEnvEstimateNeeds.ceilingPrice !== ''" class="mt-8">
              <ATATSingleAndMultiplePeriods
                :periods.sync="periods"
                :isMultiple="currentEnvEstimateNeeds.ceilingPrice === 'multiple'"
                :values.sync="currentEnvEstimateNeeds.estimatedCosts"
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
                :value.sync="perfReqEstimateNeeds.ceilingPrice"
                :rules="[$validators.required('Please select an option')]"
              />
            </div>

            <div v-if="perfReqEstimateNeeds.ceilingPrice !== ''">
              <ATATSingleAndMultiplePeriods
                :periods.sync="periods"
                :isMultiple="perfReqEstimateNeeds.ceilingPrice === 'multiple'"
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

  private currentEnvEstimateNeeds: ArchDesignEstimateNeeds = {
    type: "CURRENT_ENV",
    ceilingPrice: "",
    estimatedCosts: []
  };

  private perfReqEstimateNeeds: ArchDesignEstimateNeeds = {
    type: "DOW",
    ceilingPrice: "",
    estimatedCosts: []
  };

  private estimateOptions: RadioButton[] = [
    {
      id: "SinglePrice",
      label: "I want to apply the same price estimate to all performance periods.",
      value: "single",
    },
    {
      id: "MultiplePrices",
      label: "I want to estimate a different price for the base and each option period.",
      value: "multiple",
    },
  ];

  @Watch("currentEnvEstimateNeeds", {deep: true})
  private currentEnvEstimateNeedsChangeSelection(newVal: ArchDesignEstimateNeeds): void {
    if(newVal.ceilingPrice === "single"){
      this.currentEnvEstimateNeeds.estimatedCosts.length = 1;
    }
  }

  @Watch("currentEnvEstimateNeeds", {deep: true})
  private perfReqEstimateNeedsChangeSelection(newVal: ArchDesignEstimateNeeds): void {
    if(newVal.ceilingPrice === "single"){
      this.perfReqEstimateNeeds.estimatedCosts.length = 1;
    }
  }

  public savedData: ArchDesignEstimateNeeds[] = [];
  get currentData(): ArchDesignEstimateNeeds[] {
    return [this.currentEnvEstimateNeeds, this.perfReqEstimateNeeds];
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async loadOnEnter(): Promise<void> {
    this.DOWHasArchDesignNeeds = DescriptionOfWork.DOWHasArchitecturalDesignNeeds;
    this.currentEnvHasArchDesignNeeds
      = CurrentEnvironment.currentEnvironment?.needs_architectural_design_services === "YES";
    this.bothNeed = (this.DOWHasArchDesignNeeds === true && this.currentEnvHasArchDesignNeeds);
    
    const store = await IGCEStore.getArchDesignEstimateNeeds();
    this.savedData = _.cloneDeep(store);
    const currEnvData = store.find(obj => obj.type === "CURRENT_ENV");
    if (currEnvData) {
      this.currentEnvEstimateNeeds = currEnvData;
    }
    const dowData = store.find(obj => obj.type === "DOW");
    if (dowData) {
      this.perfReqEstimateNeeds = dowData;
    }
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