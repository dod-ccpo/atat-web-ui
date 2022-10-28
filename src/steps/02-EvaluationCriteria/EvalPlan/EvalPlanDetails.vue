
<template>
  <div class="container-max-width">
    <h1 class="page-header">
      {{ header }}
    </h1>
    <Callout 
      :sourceSelection="evalPlan.source_selection"
      :method="evalPlan.method"
    />
    
    <ATATRadioGroup
      v-if="isStandards"
      id="CustomStandards"
      class="copy-max-width"
      :items="standardsRadioGroupItems"
      :legend="radioGroupLegend"
      :value.sync="selectedStandardsRadioItem"
      :rules="[
        $validators.required('Please select an option.'),
      ]"
    />

    <CustomSpecifications 
      id="CustomSpecEntry"
      v-show="selectedStandardsRadioItem === 'YES'"
      :sourceSelection="evalPlan.source_selection"
      :isDifferentiator="false"
      :isOptional="true"
      :customSpecifications.sync="evalPlan.custom_specifications"
    />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import Callout from "./components/Callout.vue";
import CustomSpecifications from "./components/CustomSpecifications.vue"

import AcquisitionPackage from "@/store/acquisitionPackage";
import { EvaluationPlanDTO } from "@/api/models";
import { RadioButton } from "types/Global";
import { scrollToId } from "@/helpers";

@Component({
  components: {
    ATATRadioGroup,
    Callout,
    CustomSpecifications,
  }
})

export default class EvalPlanDetails extends Vue {

  public get isStandards(): boolean {
    return this.evalPlan.source_selection.indexOf("TechProposal") > -1;
  }

  public get header(): string {
    switch(this.evalPlan.source_selection) {
    case "NoTechProposal":
      return "Now let’s review compliance standards when no technical proposal is required";
    case "TechProposal":
      return "Now let’s review compliance standards when technical proposals are required";
    case "SetLumpSum":
      return "Now let’s review assessment criteria required for white papers";
    case "EqualSetLumpSum":
      return `Based on your evaluation method, there are no required compliance 
        standards, differentiators, or assessment areas.`
    default:
      return ""
    }
  }

  public evalPlan: EvaluationPlanDTO = {
    /* eslint-disable camelcase */
    source_selection: "",
    method: "",
    has_custom_specifications: false,
    standard_specifications: [],
    custom_specifications: [],
    /* eslint-enable camelcase */
  }

  public selectedStandardsRadioItem = "";
  public standardsRadioGroupItems: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes, I want to write my own custom compliance standard(s).",
      value: "YES",
    },    
    {
      id: "No",
      label: "No.",
      value: "NO",
    },    
  ];
  public radioGroupLegend = `In addition to the required standards listed above, 
    do you want to include any custom compliance standards that CSPs must meet to 
    be determined technically acceptable?`;

  public savedData: EvaluationPlanDTO = {
    // eslint-disable-next-line camelcase
    source_selection: "",
  }

  @Watch("selectedStandardsRadioItem")
  public selectedStandardsRadioItemChange(newVal: string): void {
    if (newVal === "YES") {
      const customSpecs = this.evalPlan.custom_specifications;
      if (customSpecs && customSpecs.length === 0) {
        customSpecs.push("");
      }
      this.$nextTick(() => {
        scrollToId("CustomSpecEntry");
      })
    } else {
      // eslint-disable-next-line camelcase
      this.evalPlan.custom_specifications = [];
    }

  }

  public async loadOnEnter(): Promise<void> {
    const storeData = AcquisitionPackage.getEvaluationPlan;
    if (storeData) {
      this.evalPlan = storeData;
      this.savedData = storeData;
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
