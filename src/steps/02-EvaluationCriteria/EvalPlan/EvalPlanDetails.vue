
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

    <ATATCheckboxGroup 
      v-if="evalPlan.source_selection === 'SetLumpSum'"
      id="SetLumpSumCheckboxes"
      groupLabel="In addition to the required criteria listed above, what other 
        assessment areas would you like to evaluate?"
      groupLabelId="OtherAssessmentAreasLabel"
      :items="setLumpSumCheckboxOptions"
      :value.sync="selectedSetLumpSumOptions"
    />

    <CustomSpecifications 
      id="CustomSpecEntry"
      v-show="showCustomSpecifications"
      :sourceSelection="evalPlan.source_selection"
      :isDifferentiator="false"
      :isOptional="true"
      :customSpecifications.sync="evalPlan.custom_specifications"
    />

  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import Callout from "./components/Callout.vue";
import CustomSpecifications from "./components/CustomSpecifications.vue"

import AcquisitionPackage from "@/store/acquisitionPackage";
import { EvaluationPlanDTO } from "@/api/models";
import { Checkbox, RadioButton } from "types/Global";
import { hasChanges, scrollToId } from "@/helpers";
import _ from "lodash";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
    Callout,
    CustomSpecifications,
  }
})

export default class EvalPlanDetails extends Mixins(SaveOnLeave) {
  public isLoading = false;
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
    has_custom_specifications: "",
    standard_specifications: [],
    custom_specifications: [],
    /* eslint-enable camelcase */
  }

  public get showCustomSpecifications(): boolean {
    return this.selectedStandardsRadioItem === 'YES'
      || this.selectedSetLumpSumOptions.includes("CustomAssessment");
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

  public get currentData(): EvaluationPlanDTO {
    return this.evalPlan;
  }

  /* eslint-disable camelcase */
  public savedData: EvaluationPlanDTO = {
    source_selection: "",
    method: "",
    has_custom_specifications: "",
    standard_specifications: [],
    custom_specifications: [],
  }

  public initCustomSpecs(): void {  
    this.evalPlan.custom_specifications = this.evalPlan.custom_specifications || [];
    this.evalPlan.custom_specifications.push("");
    this.$nextTick(() => {
      scrollToId("CustomSpecEntry");
    });
    this.evalPlan.has_custom_specifications = "YES";
  }

  public clearCustomSpecs(): void {
    this.evalPlan.custom_specifications = [];
    this.evalPlan.has_custom_specifications = "NO";
  }
  /* eslint-enable camelcase */

  @Watch("selectedStandardsRadioItem")
  public selectedStandardsRadioItemChange(newVal: string): void {
    if (!this.isLoading) {
      newVal === "YES" ? this.initCustomSpecs() : this.clearCustomSpecs();
    }
  }
  @Watch("selectedSetLumpSumOptions")
  public selectedSetLumpSumOptionsChange(newVal: string[], oldVal: string[]): void {
    if (!this.isLoading) {
      // eslint-disable-next-line camelcase
      this.evalPlan.standard_specifications = newVal;
      if (newVal.includes("CustomAssessment") && !oldVal.includes("CustomAssessment")) {
        this.initCustomSpecs();
      } else if (!newVal.includes("CustomAssessment")) {
        this.clearCustomSpecs();
      }      
    }
  }

  public selectedSetLumpSumOptions: string[] = [];
  public get setLumpSumCheckboxOptions(): Checkbox[] {
    const options: Checkbox[] = [
      {
        id: "AutomationCapability",
        label: "Any automation capability proposed to improve reliability and reduce human-error",
        value: "AutomationCapability",
      },
      {
        id: "CustomAssessmentOption",
        label: "I want to write my own custom assessment area(s)",
        value: "CustomAssessment",
      },
    ];
    if (this.evalPlan.method === "BestUse") {
      options.unshift( {
        id: "RiskToGovt",
        label: "Risk to the Government",
        value: "RiskToGovt"
      });
    }
    return options;
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = AcquisitionPackage.getEvaluationPlan;
    if (storeData) {
      this.evalPlan = _.cloneDeep(storeData);
      this.savedData = _.cloneDeep(storeData);
      if (this.evalPlan.source_selection === "SetLumpSum") {
        this.selectedSetLumpSumOptions = this.evalPlan.standard_specifications || [];
      }
      this.selectedStandardsRadioItem = this.evalPlan.has_custom_specifications || "";

    }
  }

  public async mounted(): Promise<void> {
    this.isLoading = true;
    await this.loadOnEnter();
    this.isLoading = false;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async saveOnLeave(): Promise<boolean> {
    try {
      debugger;
      if (this.hasChanged()) {
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
