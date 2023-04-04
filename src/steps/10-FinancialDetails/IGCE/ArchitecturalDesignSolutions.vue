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
            solutions to address your known problems or use-cases. 
            Estimate costs for each of these requirements below. If you know the 
            requirement will change over time, then you can customize the price 
            for each performance period.
          </p>
          
          <div>
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
import DescriptionOfWork from "@/store/descriptionOfWork";
import _ from "lodash";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods
  }
})
export default class ArchitecturalDesignSolutions extends Mixins(SaveOnLeave) {
  private periods: PeriodDTO[] | null = [];
  private singlePeriodTooltipText = "This estimate will be applied to all performance periods.";
  private multiplePeriodTooltipText = `Customize a price estimate for 
    each performance period, based on your needs.`;

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


  @Watch("perfReqOption", {deep: true})
  private perfReqCostEstimateChangeSelection(newVal: string): void {
    if(newVal !== this.savedPerfReqData.option){
      this.perfReqEstValues = [];
    }
  }

  public savedPerfReqData: EstimateOptionValueDTO = {
    option:"",
    estimated_values:[]
  };

  get currentDataPerfReq(): EstimateOptionValueDTO {
    return{
      option: this.perfReqOption,
      estimated_values: this.perfReqEstValues,
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentDataPerfReq, this.savedPerfReqData);
  }

  protected async loadOnEnter(): Promise<void> {    
    const store = await IGCEStore.getRequirementsCostEstimate();
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
      store.architectural_design_performance_requirements = this.currentDataPerfReq;
      await IGCEStore.setRequirementsCostEstimate(store);
      await IGCEStore.saveRequirementsCostEstimate();
    }
    return true;
  }

}
</script>
