
<template>
  <section class="mt-10">
    <h2 class="form-section-heading">
      Your COR’s Contact Information
    </h2>

    <ATATRadioGroup
      legend="What role best describes your COR’s affiliation with the DoD?"
      id="ContactAffiliation"
      :items="contactAffiliations"
      :value.sync="selectedContactAffiliation"
      class="mb-10"
    />

    <ATATSelect
      v-show="selectedContactAffiliation === 'MIL'"
      id="Branch"
      class="input-max-width"
      label="Service Branch"
      placeholder=""
      :items="branchData"
      :selectedValue.sync="selectedBranch"
      :showAccessRadioButtons.sync="showAccessRadioButtons"
    />

  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";

import { RadioButton, SelectData, AutoCompleteItem } from "../../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATSelect,
  }
})

export default class ContactInfoForm extends Vue {

  //props

  @Prop({default: true}) private isACOR!: boolean;
  @PropSync("showAccessRadioButtons") private _showAccessRadioButtons!: boolean;

  // data

  private selectedBranch = "";
  private branchData: SelectData[] = [
    { text: "U.S. Air Force", value: "USAF", },
    { text: "U.S. Army", value: "ARMY", },
    { text: "U.S. Coast Guard", value: "USCG", },
    { text: "U.S. Marine Corps", value: "USMC", },
    { text: "U.S. Navy", value: "NAVY", },
    { text: "U.S. Space Force", value: "USSF", },
  ];

  private selectedContactAffiliation = "";
  private contactAffiliations: RadioButton[] = [
    {
      id: "Military",
      label: "Military",
      value: "MIL",
    },
    {
      id: "Civilian",
      label: "Civilian",
      value: "CIV",
    },
  ];

  private branchRanksData: unknown = [
    {
      "USAF": [
        { rank: "AF Rank 1", value: "AF-R1", },
        { rank: "AF Rank 2", value: "AF-R1", },
        { rank: "AF Rank 3", value: "AF-R1", },
      ],
    }

  ];

  // computed
  
  get corOrAcor(): string {
    return this.isACOR ? "ACOR" : "COR";
  }

  // methods

  private setShowAccessRadioButtons(): void {
    this._showAccessRadioButtons = this.selectedContactAffiliation === "CIV" 
      || this.selectedBranch !== "";
  }

  private setRankData(): void {

  }

  // watchers

  @Watch("selectedBranch")
  protected branchChange(): void {
    this.setShowAccessRadioButtons();
    this.setRankData();
  }

  @Watch("selectedContactAffiliation")
  protected contactAffiliationChange(): void {
    this.setShowAccessRadioButtons();
  }

}
</script>
