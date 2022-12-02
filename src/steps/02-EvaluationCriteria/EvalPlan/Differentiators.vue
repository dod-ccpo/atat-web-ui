
<template>
  <v-form ref="form" lazy-validation>
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
          v-if="showCustomDifferentiators"
          sourceSelection="TechProposal"
          :isDifferentiator="true"
          :isOptional="customDiffsOptional"
          :customSpecifications.sync="customDifferentiators"
        />     

      </div>
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import CustomSpecifications from "./components/CustomSpecifications.vue"
import { Checkbox } from "types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { EvaluationPlanDTO } from "@/api/models";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { convertEvalPlanDifferentiatorToCheckbox, hasChanges } from "@/helpers";

import _ from "lodash";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";

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
    method: "",
    has_custom_specifications: "",
    standard_specifications: "",
    custom_specifications: "",
    standard_differentiators: "",
    custom_differentiators: "",
    sys_id: ""
  }
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
  /* eslint-enable camelcase */

  public get currentData(): EvaluationPlanDTO {
    return this.evalPlan;
  }

  public customDifferentiators: string[] = [];
  public selectedDifferentiators: string[] = [];
  public differentiators: Checkbox[] = [];

  public showCustomDifferentiators = false;
  public customDiffsOptional = true;

  public otherSysId = "";

  @Watch("selectedDifferentiators")
  public selectedDifferentiatorsChange(newVal: string[], oldVal: string[]): void {
    this.showCustomDifferentiators = newVal.includes(this.otherSysId);
    if (!this.showCustomDifferentiators && oldVal.includes(this.otherSysId)) {
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
    const storeData = await EvaluationPlan.getEvaluationPlan();
    this.differentiators = convertEvalPlanDifferentiatorToCheckbox(
      EvaluationPlan.differentiatorData
    );

    const otherItem = this.differentiators.find(item => item.id === "CustomDifferentiators");

    this.otherSysId = otherItem?.value || "";

    if (storeData) {
      this.evalPlan = _.cloneDeep(storeData);
      this.savedData = _.cloneDeep(storeData);
      this.selectedDifferentiators = this.evalPlan.standard_differentiators?.split(",") || [];
      this.customDifferentiators = this.evalPlan.custom_differentiators?.split(",") || [];
    }
  }

  private get hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async saveOnLeave(): Promise<boolean> {
    // need to flip `setValidateNow` to true in page component's `saveOnLeave` method
    // for pages with checkbox groups that have validation rules
    await AcquisitionPackage.setValidateNow(true);
    
    try {
      /* eslint-disable camelcase */
      this.evalPlan.standard_differentiators = this.selectedDifferentiators.join(",");
      this.evalPlan.custom_differentiators = this.customDifferentiators.join(",");
      /* eslint-enable camelcase */

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
