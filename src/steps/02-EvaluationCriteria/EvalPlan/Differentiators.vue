
<template>
  <div class="container-max-width">
    <h1 class="page-header">
      What differentiator(s) should be used to distinguish between technical proposals?
    </h1>
    <div class="copy-max-width">
      <p class="page-intro">
        Select at least one area that a CSP may offer the Government at a higher 
        price for additional benefit, beyond the solution itself, that will 
        distinguish it from other competitor’s solutions. During the source 
        selection process, the evaluation team will evaluate these differentiators 
        and document how the perceived benefits of the higher priced proposal 
        merit additional cost.
      </p>

      <ATATCheckboxGroup
        id="DifferentiatorOptions"
        :card="true"
        :noDescriptions="true"
        :items="differentiators"
        :value.sync="selectedDifferentiators"
        :rules="[
          $validators.required('Please select at least one differentiator.'),
        ]"

      />

      <CustomSpecifications 
        id="CustomDifferentiatorEntry"
        v-show="showCustomDifferentiators"
        sourceSelection="TechProposal"
        :isDifferentiator="true"
        :isOptional="customDiffsOptional"
        :customSpecifications.sync="customDifferentiators"
      />     

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import CustomSpecifications from "./components/CustomSpecifications.vue"
import { Checkbox } from "types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { EvaluationPlanDTO } from "@/api/models";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { hasChanges } from "@/helpers";

import _ from "lodash";

@Component({
  components: {
    ATATCheckboxGroup,
    CustomSpecifications
  }
})

export default class Differentiators extends Mixins(SaveOnLeave) {

  /* eslint-disable camelcase */
  public evalPlan: EvaluationPlanDTO = {
    source_selection: "",
  }
  public savedData: EvaluationPlanDTO = {
    source_selection: "",
  }
  /* eslint-enable camelcase */

  public get currentData(): EvaluationPlanDTO {
    return this.evalPlan;
  }

  public customDifferentiators: string[] = [];
  public selectedDifferentiators: string[] = [];
  public differentiators: Checkbox[] = [
    {
      id: "LevelOfComplexity",
      label: "Level of complexity reduced due to proposed solution",
      value: "LevelOfComplexity",
    },
    {
      id: "CapabilityGained",
      label: `Any capability gained by implementing the solution (beyond the 
        Government’s requirement)`,
      value: "CapabilityGained",
    },
    {
      id: "ScheduleSavings",
      label: "Any schedule savings achieved due to proposed solution",
      value: "ScheduleSavings",
    },
    {
      id: "CostSavings",
      label: "Any lifecycle cost savings achieved due to proposed solution",
      value: "CostSavings",
    },
    {
      id: "Longevity",
      label: "Any enduring persistence (longevity) due to proposed solution",
      value: "Longevity",
    },
    {
      id: "AutomationCapability",
      label: "Any automation capability proposed to improve reliability and reduce human-error",
      value: "AutomationCapability",
    },
    {
      id: "CustomDifferentiators",
      label: "Other - I want to write my own custom differentiator(s).",
      value: "CustomDifferentiators",
    },
  ];

  public showCustomDifferentiators = false;
  public customDiffsOptional = true;

  @Watch("selectedDifferentiators")
  public selectedDifferentiatorsChange(newVal: string[], oldVal: string[]): void {
    this.showCustomDifferentiators = newVal.includes("CustomDifferentiators");
    if (!this.showCustomDifferentiators && oldVal.includes("CustomDifferentiators")) {
      this.customDifferentiators = [];
    }
    this.customDiffsOptional = newVal.length > 1;
    if (newVal.length === 1 && this.customDifferentiators.length === 0) {
      this.customDifferentiators.push("");
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = AcquisitionPackage.getEvaluationPlan;
    if (storeData) {
      this.evalPlan = _.cloneDeep(storeData);
      this.savedData = _.cloneDeep(storeData);
      this.selectedDifferentiators = this.evalPlan.standard_differentiators || [];
      this.customDifferentiators = this.evalPlan.custom_differentiators || [];
    }
  }

  private get hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async saveOnLeave(): Promise<boolean> {
    try {
      /* eslint-disable camelcase */
      this.evalPlan.standard_differentiators = this.selectedDifferentiators;
      this.evalPlan.custom_differentiators = this.customDifferentiators;
      /* eslint-enable camelcase */

      if (this.hasChanged) {
        // KEEP FOR FUTURE TICKET when API hooked up for saving to SNOW
        // await AcquisitionPackage.saveData({
        //   data: this.currentData,
        //   storeProperty: StoreProperties.EvaluationPlan,
        // });
        // REMOVE line below after above hooked up
        await AcquisitionPackage.setEvaluationPlan(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }

    return true;

  }  

}

</script>
