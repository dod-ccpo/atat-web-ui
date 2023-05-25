<template>
  <div>
    <ATATRadioGroup
      v-if="isForm"
      id="CompetitiveStatusOptions"
      :legend="legend" 
      :value.sync="_competitiveStatus"
      :items="competitiveStatusOptions"
      name="competitive-status-radio-group"
      :class="classes"
      :rules="rules"
      :isForm="true"
    />
    <ATATRadioGroup
      v-if="!isForm"
      id="CompetitiveStatusOptions"
      :legend="legend" 
      :value="selectedCompetitiveStatusReadOnly"
      :items="competitiveStatusOptionsReadOnly"
      name="competitive-status-radio-group"
      :class="classes"
      :isForm="false"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})

export default class LevelOfCompetition extends Vue {
  @Prop({default: true}) private isForm!: boolean;
  @Prop({default: ""}) private legend!: string;
  @Prop({default: ""}) private classes!: string;
  @PropSync("competitiveStatus", { default: "" }) public _competitiveStatus!: string | null;
  @Prop() private rules?: [];
  
  private selectedCompetitiveStatusReadOnly = "";

  private competitiveStatusOptions: RadioButton[] = [
    {
      id: "FULL_OPEN",
      label: `Full and open competition`,
      value: "FULL_OPEN",
      readonly: !this.isForm,
    },
    {
      id: "SB_SET_ASIDE",
      label: `Small business (SB) set-aside`,
      value: "SB_SET_ASIDE",
      readonly: !this.isForm,
    },
    {
      id: "OTHER_THAN_FULL",
      label: `Other than full and open competition`,
      value: "OTHER_THAN_FULL",
      readonly: !this.isForm,
    },
  ];

  public competitiveStatusOptionsReadOnly: RadioButton[] =  [
    {
      id: "Yes_FOException",
      label: "Yes, a Justification & Approval is required.",
      value: "YES",
      readonly: true,
    },
    {
      id: "No_FOException",
      label: "No.",
      value: "NO",
      readonly: true,
    }
  ];

  public async setReadOnly(): Promise<void> {
    if (!this.isForm) {
      this.selectedCompetitiveStatusReadOnly = this._competitiveStatus !== "NO_NONE" 
        ? "YES"
        : "NO";
    }
  }

  public async mounted(): Promise<void> {
    await this.setReadOnly();
  }
}
</script>
