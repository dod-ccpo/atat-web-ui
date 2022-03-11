
<template>
  <section class="mt-10">
    <hr />
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
      id="Branch"
      v-show="selectedContactAffiliation === 'MIL'"
      class="input-max-width mb-10"
      label="Service Branch"
      placeholder=""
      :items="branchData"
      :selectedValue.sync="selectedBranch"
      :showAccessRadioButtons.sync="showAccessRadioButtons"
    />

    <div v-show="selectedBranch || selectedContactAffiliation === 'CIV'">
      <ATATAutoComplete
        id="Rank"
        v-show="selectedContactAffiliation === 'MIL'"
        label="Rank"
        titleKey="rank"
        :items="selectedBranchRanks"
        :searchFields="['rank', 'value']"
        :selectedItem.sync="selectedRank"
        class="input-max-width mb-7"
        icon="arrow_drop_down"
      />

      <ATATSelect
        v-show="selectedContactAffiliation === 'CIV'"
        id="Salutation"
        class="input-max-width mb-7"
        label="Salutation"
        :optional="true"
        placeholder=""
        :items="salutationData"
        :selectedValue.sync="selectedSalutation"
      />

      <v-row class="form-section mb-7">
        <v-col class="col-12 col-lg-3">
          <ATATTextField label="First name" id="FirstName" class="input-max-width" />
        </v-col>
        <v-col class="col-12 col-lg-3">
          <ATATTextField label="Middle name" id="MiddleName" :optional="true" class="input-max-width" />
        </v-col>
        <v-col class="col-12 col-lg-3">
          <ATATTextField label="Last name" id="LastName" class="input-max-width" />
        </v-col>
        <v-col class="col-12 col-lg-3">
          <ATATTextField
            label="Suffix"
            id="Suffix"
            :optional="true"
            width="80px"
          />
        </v-col>
      </v-row>

      <ATATTextField 
        label="Email address" 
        id="EmailAddress" 
        class="input-max-width mb-10" 
        helpText="Enter a .mil or .gov email address."
      />

      <div class="d-flex mb-10">
        <ATATTextField 
          label="Phone number" 
          id="PhoneNumber" 
          class="input-max-width width-100" 
        />
        <ATATTextField 
          label="Extension" 
          id="PhoneExtension" 
          width="140px"
          :optional="true"
          class="ml-6"
        />
      </div>

      <ATATTextField 
        label="DoD Activity Address Code (DoDAAC)" 
        id="DoDAAC" 
        class="input-max-width"
        tooltipText="A DoDAAC is a 6-character code that uniquely identifies a 
          unit, activity, or organization that has the authority to requisition, 
          contract for, or fund/pay bills for materials and services." 
      />

    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATAutoComplete from "@/components/ATATAutoComplete.vue"
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { 
  RadioButton, 
  SelectData, 
  AutoCompleteItem, 
  AutoCompleteItemGroups 
} from "../../../../types/Global";

@Component({
  components: {
    ATATAutoComplete,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
  }
})

export default class ContactInfoForm extends Vue {

  //props

  @Prop({default: true}) private isACOR!: boolean;
  @PropSync("showAccessRadioButtons") private _showAccessRadioButtons!: boolean;

  // data

  private selectedSalutation = "";
  private salutationData: SelectData[] = [
    { text: "Mr.", value: "Mr.", },
    { text: "Mrs.", value: "Mrs.", },
    { text: "Miss", value: "Miss", },
    { text: "Ms.", value: "Ms.", },
    { text: "Dr.", value: "Dr.", },
  ];

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

  private selectedRank = "";
  private selectedBranchRanks: AutoCompleteItem[] = [];
  private branchRanksData: AutoCompleteItemGroups = {
    "USAF": [
      { rank: "AF Rank 1", value: "AF-R1", },
      { rank: "AF Rank 2", value: "AF-R2", },
      { rank: "AF Rank 3", value: "AF-R3", },
    ],
    "ARMY": [
      { rank: "ARMY Rank 1", value: "ARMY-R1", },
      { rank: "ARMY Rank 2", value: "ARMY-R2", },
      { rank: "ARMY Rank 3", value: "ARMY-R3", },
    ],
    "USCG": [
      { rank: "USCG Rank 1", value: "USCG-R1", },
      { rank: "USCG Rank 2", value: "USCG-R2", },
      { rank: "USCG Rank 3", value: "USCG-R3", },
    ],
    "USMC": [
      { rank: "USMC Rank 1", value: "USMC-R1", },
      { rank: "USMC Rank 2", value: "USMC-R2", },
      { rank: "USMC Rank 3", value: "USMC-R3", },
    ],    
    "NAVY": [
      { rank: "NAVY Rank 1", value: "NAVY-R1", },
      { rank: "NAVY Rank 2", value: "NAVY-R2", },
      { rank: "NAVY Rank 3", value: "NAVY-R3", },
    ],
      "USSF": [
      { rank: "USSF Rank 1", value: "USSF-R1", },
      { rank: "USSF Rank 2", value: "USSF-R2", },
      { rank: "USSF Rank 3", value: "USSF-R3", },
    ],
  };

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
    this.selectedBranchRanks = this.branchRanksData[this.selectedBranch];
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
