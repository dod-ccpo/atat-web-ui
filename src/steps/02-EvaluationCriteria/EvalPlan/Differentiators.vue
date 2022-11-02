
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
        :boldLabel="false"
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
import Vue from "vue";

import { Component, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import CustomSpecifications from "./components/CustomSpecifications.vue"
import { Checkbox } from "types/Global";

@Component({
  components: {
    ATATCheckboxGroup,
    CustomSpecifications
  }
})

export default class Differentiators extends Vue {
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
}
</script>

