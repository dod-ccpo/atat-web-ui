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
      :ref="'ClassificationLevelCheckboxesRef' + id"
      :id="'ClassificationLevelCheckboxes' + id"
      :card="false"
      :hasOtherValue="true"
      :items="topLevelClassifications"
      :rules="[
              $validators.required('Please select at least one classification level.')
       ]"
      :value="selectedTopLevelClassifications"
      @update:value="selectedTopLevelClassifications = $event"
      class="copy-max-width mb-10"
      :name="'classificationTypesCheckboxes' + id"
    />
    <div v-if="showImpactLevels">
      <p id="DeployedP" class="mb-3 font-weight-500">
        For your Unclassified instance(s), what
        <span v-if="isCloud">
            impact levels are you currently deployed in?
          </span>
        <span v-if="isOnPrem">
            type of information are you hosting?
          </span>
      </p>
      <p id="SelectMessage2" class="mb-4">
        Select all that apply to your current environment.
      </p>

      <ATATCheckboxGroup
        :ref="'ImpactLevelId' + id"
        :id="impactLevelId + id"
        :card="false"
        :hasOtherValue="true"
        :items="impactLevelOptions"
        :rules="[$validators.required(impactLevelErrorMessage)]"
        :value="selectedImpactLevels"
        @update:value="selectedImpactLevels = $event"
        class="copy-max-width mb-10"
        :name="impactLevelId + id"
      />

    </div>

  </div>
</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import { Component, Prop, Watch, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from '@/decorators/custom';
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
class ClassificationLevelForm extends Vue {
  @Prop() public isCloud?:boolean;
  @Prop() public isOnPrem?:boolean;
  @Prop() public id?: string;
  @Prop({required: true}) public isHybrid?:boolean;
  @Prop({required: true}) public hybridText?:string;
  @PropSync("selectedClassifications") private _selectedClassifications!: string[];

  public allClassificationLevels: ClassificationLevelDTO[] = []

  public get impactLevelId(): string {
    return this.isCloud 
      ? "CloudClassificationCheckboxes" 
      : "OnPremClassificationCheckboxes";
  }

  public get impactLevelErrorMessage(): string {
    return this.isCloud
      ? "Please select at least one impact level."
      : "Please select at least one type of information that you are hosting."
  }

  public get showImpactLevels(): boolean {
    return this.selectedTopLevelClassifications 
      ? this.selectedTopLevelClassifications.includes("U") 
      : false;
  }

  public get impactLevelOptions(): Checkbox[] {
    return this.isCloud 
      ? this.cloudImpactLevelOptions 
      : this.onPremImpactLevelOptions;
  }
  public get getCheckboxIdSuffix(): string {
    return this.isCloud ? "Cloud" : "Prem";
  }

  public selectedTopLevelClassifications: string[] = []
  private topLevelClassifications: Checkbox[] = [
    {
      id: "Unclassified" + this.getCheckboxIdSuffix,
      label: "Unclassified",
      value: "U",
    },
    {
      id: "Secret" + this.getCheckboxIdSuffix,
      label: "Secret",
      value: "S",
    },
    {
      id: "TopSecret" + this.getCheckboxIdSuffix,
      label: "Top Secret",
      value: "TS",
    },
  ];

  public selectedImpactLevels: string[] = [];
  public cloudImpactLevelOptions: Checkbox[] = [];
  public onPremImpactLevelOptions: Checkbox[] = [
    {
      id: "PublicRelease",
      label: `Information approved for public release (Low Confidentiality 
        and Moderate Integrity)`,
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

  @Watch("selectedTopLevelClassifications")
  public selectedTopLevelClassificationChange(newVal: string[], oldVal: string[]): void {
    if (!newVal.includes("U")) {
      this.selectedImpactLevels = [];
    }
    if (newVal.length > oldVal.length) {
      const noUnclassified = newVal.filter(c => c !== "U");
      this._selectedClassifications = this._selectedClassifications?.concat(noUnclassified);
      this._selectedClassifications = [...new Set(
        [...this._selectedClassifications, ...noUnclassified]
      )];
    } else {
      const uncheckedClassification = oldVal.filter(v => newVal.indexOf(v) === -1)[0];
      const i = this._selectedClassifications?.indexOf(uncheckedClassification);
      if (i > -1) {
        this._selectedClassifications?.splice(i, 1);
      }
    }
  }

  @Watch("selectedImpactLevels")
  public selectedImpactLevelsChange(newVal: string[], oldVal: string[]): void {
    if (newVal.length > oldVal.length) {
      this._selectedClassifications = this._selectedClassifications?.concat(newVal);
      this._selectedClassifications = [...new Set([...this._selectedClassifications, ...newVal])]
    } else {
      const uncheckedILs = oldVal.filter(v => newVal.indexOf(v) === -1);
      uncheckedILs.forEach((uncheckedIL) => {
        const i = this._selectedClassifications?.indexOf(uncheckedIL);
        if (i > -1) {
          this._selectedClassifications?.splice(i, 1);
        }
      });
    }
  }

  public async setSecretSysIds(): Promise<void> {
    const secretClassificationAbbrs = ["S", "TS"];
    secretClassificationAbbrs.forEach((abbr) => {
      const classificationObj = this.allClassificationLevels.find(
        obj => obj.classification === abbr
      );
      const index = this.topLevelClassifications.findIndex(obj => obj.value === abbr);
      this.topLevelClassifications[index].value = classificationObj?.sys_id || "";
    });
  }

  public async setOnPremImpactLevelSysId(): Promise<void> {
    const unclassifiedILs = ["IL2", "IL4", "IL5"];
    unclassifiedILs.forEach((IL) => {
      const classificationObj = this.allClassificationLevels.find(
        obj => obj.impact_level === IL
      );
      const sysId = classificationObj?.sys_id;
      const onPremILIndex = this.onPremImpactLevelOptions.findIndex(
        obj => obj.value === IL
      );
      this.onPremImpactLevelOptions[onPremILIndex].value = sysId || "";
    });
  }

  public async loadOnEnter(): Promise<void> {
    this.allClassificationLevels = await classificationRequirements.getAllClassificationLevels();
    // await classificationRequirements.loadEnvironmentInstances()

    await this.setSecretSysIds();
    await this.setOnPremImpactLevelSysId();
    const onlyUnclassifiedILs = this.allClassificationLevels
      .filter(classification => classification.classification === "U" );
    this.cloudImpactLevelOptions = buildClassificationCheckboxList(
      onlyUnclassifiedILs, "", true, true
    );

    // parse sys_ids for selectedClassifications into their appropriate arrays
    // of either selected top-level or impact-level
    if (this._selectedClassifications) {
      this._selectedClassifications.forEach((sysId) => {
        const selectedTopLevelClassification: Checkbox | undefined
          = this.topLevelClassifications.find(obj => obj.value === sysId);
        if (selectedTopLevelClassification) {
          this.selectedTopLevelClassifications.push(selectedTopLevelClassification.value);
        } else {
          const selctedImpactLevel: Checkbox | undefined
            = this.impactLevelOptions.find(obj => obj.value === sysId);
          if (selctedImpactLevel) {
            this.selectedImpactLevels.push(selctedImpactLevel.value);
            if (this.selectedTopLevelClassifications.indexOf("U") === -1) {
              this.selectedTopLevelClassifications.push("U");
            }
          }
        }
      });
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  /* 
  // START -- PRESERVE CODE FOR POST-MVP
  // CLOUD TYPES WILL BE POST MVP - it was a late addition

  public IL2Selected = false;

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
  ];

  @Watch("_selectedImpactLevels")
  public selectedOptionChange(newVal: string[]): void {
    let filtered = this.allClassificationLevels
      .filter(classification => classification.impact_level === "IL2")
    if(filtered[0].sys_id){
      this.IL2Selected = newVal.includes(filtered[0].sys_id);
    }
    if(!this.IL2Selected){
      this._selectedCloudTypes = [];
    }
  }

  // END -- PRESERVE CODE FOR POST-MVP
  */
}

export default toNative(ClassificationLevelForm)
</script>
