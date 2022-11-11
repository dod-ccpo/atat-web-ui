<template>
  <div>
    <h2 class="mb-5" v-if="isHybrid">
      {{hybridText}}
    </h2>
    <p id="ClassificationLevelP" class="mb-2 font-weight-500">
      What classification levels are your instances currently deployed in?
    </p>
    <p id="SelectMessage" class="mb-4">
      Select all that apply to your current environment.
    </p>
    <ATATCheckboxGroup
      id="ClassificationTypesCheckboxes"
      :card="false"
      :hasOtherValue="true"
      :items="classificationsLevels"
      :rules="[
              $validators.required('Please select at least one classification level.')
       ]"
      :value.sync="_selectedClassifications"
      class="copy-max-width mb-10"
      name="classificationTypesCheckboxes"
    />
    <div v-if="impactLevels.length > 1">
      <p id="DeployedP" class="mb-3 font-weight-500">
        For your Unclassified
        <span v-if="isCloud">
            instance(s), what impact levels are you currently deployed in?
          </span>
        <span v-if="onPrem">
            instances, what type of information are you hosting?
          </span>
      </p>
      <p id="SelectMessage2" class="mb-4">
        Select all that apply to your current environment.
      </p>
      <ATATCheckboxGroup
        v-if="isCloud"
        id="ImpactLevelCheckboxes"
        :card="false"
        :hasOtherValue="true"
        :items="impactLevels"
        :rules="[
            $validators.required('Please select at least one impact level.')
           ]"
        :value.sync="_selectedImpactLevels"
        class="copy-max-width mb-10"
        name="impactLevelCheckboxes"
      />
      <ATATCheckboxGroup
        v-if="onPrem"
        id="InstanceCheckbox"
        :card="false"
        :hasOtherValue="true"
        :items="instanceClass"
        :rules="[
            $validators.
            required('Please select at least one type of information that you are hosting.')
           ]"
        :value.sync="_selectedInstances"
        class="copy-max-width mb-10"
        name="instanceCheckbox"
      />
    </div>
    <div v-if="IL2Selected">
      <p id="CloudTypeP" class="mb-4 font-weight-500">
        For your IL2 instance(s), what type of cloud are currently deployed in?
      </p>
      <ATATCheckboxGroup
        id="CloudTypeCheckboxes"
        :card="false"
        :hasOtherValue="true"
        :items="cloudTypes"
        :rules="[
                    $validators.required('Please select at least one type of cloud.')
           ]"
        :value.sync="_selectedCloudTypes"
        class="copy-max-width"
        name="cloudTypeCheckboxes"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import classificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";
import { Checkbox } from "../../../../types/Global";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { buildClassificationCheckboxList } from "@/helpers";
@Component({
  components: {
    ATATCheckboxGroup,
  }
})
export default class ClassificationLevelForm extends Vue {
  @Prop() public isCloud?:boolean;
  @Prop() public onPrem?:boolean;
  @Prop({required: true}) public isHybrid?:boolean;
  @Prop({required: true}) public hybridText?:string;
  @PropSync("selectedImpactLevels") private _selectedImpactLevels?: string[];
  @PropSync("selectedClassifications") private _selectedClassifications?: string[];
  @PropSync("selectedCloudTypes") private _selectedCloudTypes?: string[];
  @PropSync("selectedInstances") private _selectedInstances?: string[];

  public classifications: ClassificationLevelDTO[] = []
  private impactLevels: Checkbox[] = [];
  public IL2Selected = false;
  public unclassifiedSelected = false;
  private classificationsLevels: Checkbox[] = [
    {
      id: "Unclassified",
      label: "Unclassified",
      value: "U",
    },
    {
      id: "Secret",
      label: "Secret",
      value: "S",
    },
    {
      id: "TopSecret",
      label: "Top Secret",
      value: "TS",
    },
  ]
  private instanceClass: Checkbox[] = [
    {
      id: "PublicRelease",
      label: "Information approved for public release (Low Confidentiality and Moderate Integrity)",
      value: "IL2",
      description: "Equivalent to a Impact Level 2 (IL2) deployment"
    },
    {
      id: "CUI",
      label: "Controlled Unclassified Information (CUI)",
      value: "IL4",
      description: "Equivalent to a Impact Level 4 (IL4) deployment"
    },
    {
      id: "NationalSecuritySystems",
      label: "CUI and National Security Systems",
      value: "IL5",
      description: "Equivalent to a Impact Level 5 (IL5) deploytment"
    },
  ];
  private cloudTypes: Checkbox[] = [
    {
      id: "CommercialCloud",
      label: "Commercial cloud",
      value: "commercialCloud",
    },
    {
      id: "GovernmentCloud",
      label: "Federal community cloud (government cloud)",
      value: "GovernmentCloud",
    },

  ]

  @Watch("_selectedClassifications")
  public selectedTypeChange(newVal: string[]): void {
    let filteredList :ClassificationLevelDTO[] = []
    if(newVal.includes("U")) {
      this.unclassifiedSelected = true
      let filtered = this.classifications
        .filter(classification => classification.classification === "U" )
      filteredList.push(...filtered)
      if (this.impactLevels.length === 0) {
        this.impactLevels = this.createCheckboxItems(filteredList)
      }
    }
    if (!newVal.includes("U")) {
      this.unclassifiedSelected = false
      this.impactLevels = [];
      this._selectedInstances = []
      this._selectedImpactLevels = []
    }
  }
  // will be added in future sprint
  // @Watch("_selectedImpactLevels")
  // public selectedOptionChange(newVal: string[]): void {
  //   let filtered = this.classifications
  //     .filter(classification => classification.impact_level === "IL2")
  //   if(filtered[0].sys_id){
  //     this.IL2Selected = newVal.includes(filtered[0].sys_id);
  //   }
  //   if(!this.IL2Selected){
  //     this._selectedCloudTypes = [];
  //   }
  // }

  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return buildClassificationCheckboxList(data, "", true, true);
  }



  public async loadOnEnter(): Promise<void> {
    this.classifications = await classificationRequirements.getAllClassificationLevels();
    await classificationRequirements.loadEnvironmentInstances()
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
