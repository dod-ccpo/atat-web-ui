
<template>
  <v-form ref="form" lazy-validation>
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
        v-if="evalPlan.source_selection === 'SET_LUMP_SUM'"
        id="SetLumpSumCheckboxes"
        groupLabel="In addition to the required criteria listed above, what other 
          assessment areas would you like to evaluate?"
        groupLabelId="OtherAssessmentAreasLabel"
        :items="lumpSumCheckboxOptions"
        :value.sync="selectedSetLumpSumOptions"
      />

      <CustomSpecifications 
        id="CustomSpecEntry"
        v-if="showCustomSpecifications"
        :sourceSelection="evalPlan.source_selection"
        :isDifferentiator="false"
        :isOptional="true"
        :customSpecifications.sync="customSpecifications"
      />

    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import Callout from "./components/Callout.vue";
import CustomSpecifications from "./components/CustomSpecifications.vue"

import { EvaluationPlanDTO } from "@/api/models";
import { Checkbox, RadioButton } from "types/Global";
import { convertEvalPlanAssessmentAreaToCheckbox, hasChanges, scrollToId } from "@/helpers";
import _ from "lodash";
import SaveOnLeave from "@/mixins/saveOnLeave";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";

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
    return this.evalPlan.source_selection.indexOf("TECH_PROPOSAL") > -1;
  }

  public setLumpSumCustomSysId = "";

  public get header(): string {
    switch(this.evalPlan.source_selection) {
    case "NO_TECH_PROPOSAL":
      return "Now let’s review compliance standards when no technical proposal is required";
    case "TECH_PROPOSAL":
      return "Now let’s review compliance standards when technical proposals are required";
    case "SET_LUMP_SUM":
      return "Now let’s review assessment criteria required for white papers";
    case "EQUAL_SET_LUMP_SUM":
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
    standard_specifications: "",
    custom_specifications: "",
    standard_differentiators: "",
    custom_differentiators: "",
    sys_id: ""
    /* eslint-enable camelcase */
  }

  public get showCustomSpecifications(): boolean {
    return this.selectedStandardsRadioItem === 'YES'
      || this.selectedSetLumpSumOptions.includes(this.setLumpSumCustomSysId);
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
    standard_specifications: "",
    custom_specifications: "",
    standard_differentiators: "",
    custom_differentiators: "",
    sys_id: ""
  }

  public customSpecifications: string[] = [];

  public initCustomSpecs(): void {  
    this.customSpecifications = this.evalPlan.custom_specifications?.split(",") || [];
    if (!this.isLoading) {
      this.$nextTick(() => {
        scrollToId("CustomSpecEntry");
      });
    }
    this.evalPlan.has_custom_specifications = "YES";
  }

  public clearCustomSpecs(): void {
    this.evalPlan.custom_specifications = "";
    this.customSpecifications = [];
    this.evalPlan.has_custom_specifications = "NO";
  }


  @Watch("selectedStandardsRadioItem")
  public selectedStandardsRadioItemChange(newVal: string): void {
    newVal === "YES" ? this.initCustomSpecs() : this.clearCustomSpecs();
  }

  @Watch("customSpecifications")
  public customSpecificationsChange(newVal: string[]): void {
    this.evalPlan.custom_specifications = newVal.join(",")
  }

  @Watch("selectedSetLumpSumOptions")
  public selectedSetLumpSumOptionsChange(newVal: string[], oldVal: string[]): void {
    // eslint-disable-next-line camelcase
    this.evalPlan.standard_specifications = newVal.join(",");
    if (newVal.includes(this.setLumpSumCustomSysId) 
      && !oldVal.includes(this.setLumpSumCustomSysId)) 
    {
      this.initCustomSpecs();
    } else if (!newVal.includes(this.setLumpSumCustomSysId)) {
      this.clearCustomSpecs();
    }
  }

  public selectedSetLumpSumOptions: string[] = [];

  public lumpSumCheckboxOptions: Checkbox[] = [];

  public setLumpSumCheckboxOptions(): Checkbox[] {
    let options: Checkbox[] 
      = convertEvalPlanAssessmentAreaToCheckbox(EvaluationPlan.assessmentAreaData);
    const customOption = options.find(obj => obj.label.indexOf("custom") > -1);
    if (customOption) {
      this.setLumpSumCustomSysId = customOption.value;
    }
    if(this.evalPlan.method !== "BEST_USE"){
      options = options.filter(item => {return item.id !== "RiskToGovt"});
    }
    return options;
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await EvaluationPlan.getEvaluationPlan();
    if (storeData) {
      this.evalPlan = _.cloneDeep(storeData);
      this.savedData = _.cloneDeep(storeData);
      if (this.evalPlan.source_selection === "SET_LUMP_SUM") {
        this.selectedSetLumpSumOptions = this.evalPlan.standard_specifications?.split(",") || [];
      }
      this.selectedStandardsRadioItem = this.evalPlan.has_custom_specifications || "";

      this.lumpSumCheckboxOptions = this.setLumpSumCheckboxOptions();

    }
  }

  public async mounted(): Promise<void> {
    this.isLoading = true;
    await this.loadOnEnter();
    this.isLoading = false;
  }

  private get hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged) {
        await EvaluationPlan.setEvaluationPlan(this.currentData);
        await EvaluationPlan.saveEvaluationPlan();
      }
    } catch (error) {
      console.log(error);
    }

    return true;

  }


}
</script>
