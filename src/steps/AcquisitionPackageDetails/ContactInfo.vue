<template>
  <v-container fluid class="container-max-width">
    <v-row class="form-section">
      <v-col>
        <h1 class="page-header">Let’s confirm your contact information</h1>
        <ATATRadioGroup
          legend="What role best describes your affiliation with the DoD?"
          id="ContactRole"
          :items="contactRoles"
          :value.sync="selectedRole"
          class="mb-6"
        />

        <ATATSelect
          id="Branch"
          v-show="selectedRole === 'MIL'"
          class="input-max-width mb-10"
          label="Service Branch"
          placeholder=""
          :items="branchData"
          :selectedValue.sync="selectedBranch"
        />

        <ATATSelect
          v-show="selectedRole !== 'MIL'"
          id="Salutation"
          class="input-max-width"
          label="Salutation"
          :optional="true"
          placeholder=""
          :items="salutationData"
          :selectedValue.sync="selectedSalutation"
        />
        
        <ATATAutoComplete
          id="Rank"
          v-show="selectedRole === 'MIL' && showContactInfoFields"
          label="Rank"
          titleKey="rank"
          :items="selectedBranchRanks"
          :searchFields="['rank', 'value']"
          :selectedItem.sync="selectedRank"
          class="input-max-width mb-7"
          icon="arrow_drop_down"
        />


      </v-col>
    </v-row>
    <v-row class="form-section" v-show="showContactInfoFields">
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
    <v-row class="form-section mb-0" v-show="showContactInfoFields">
      <v-col>
        <ATATTextField
          label="Your title"
          id="ContactTitle"
          class="input-max-width mb-10"
        />
        <ATATTextField
          label="Your email"
          id="ContactEmail"
          class="input-max-width mb-10"
          helpText="Enter a .mil or .gov email address."
        />
        <ATATTextField
          label="Your phone number"
          id="ContactPhone"
          class="input-max-width"
          :class="{'mb-10' : selectedRole === 'CIV'}"
        />
        <ATATAutoComplete
          v-show="selectedRole === 'CIV'"
          id="ContactGrade"
          :optional="true"
          class="input-max-width"
          label="Grade"
          :label-sr-only="false"
          titleKey="grade"
          :searchFields="['grade']"
          :items="gradeData"
          :selectedItem.sync="selectedGrade"
          placeholder=""
          icon="arrow_drop_down"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { 
  AutoCompleteItem, 
  AutoCompleteItemGroups, 
  RadioButton, 
  SelectData 
} from "../../../types/Global";

@Component({
  components: {
    ATATAutoComplete,
    ATATTextField,
    ATATSelect,
    ATATRadioGroup,
  },
})

export default class ContactInfo extends Vue {

  // computed

  get showContactInfoFields(): boolean {
    return this.selectedRole !== "MIL" 
      || (this.selectedRole === "MIL" && this.selectedBranch !== "")
  }

  // methods

  private setRankData(): void {
    this.selectedBranchRanks = this.branchRanksData[this.selectedBranch];
  }

  // watchers

  @Watch("selectedBranch")
  protected branchChange(): void {
    this.setRankData();
  }  

  // move branches to store, repeated in ContactInfoForm.vue
  private selectedBranch = "";
  private branchData: SelectData[] = [
    { text: "U.S. Air Force", value: "USAF", },
    { text: "U.S. Army", value: "ARMY", },
    { text: "U.S. Coast Guard", value: "USCG", },
    { text: "U.S. Marine Corps", value: "USMC", },
    { text: "U.S. Navy", value: "NAVY", },
    { text: "U.S. Space Force", value: "USSF", },
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

  private selectedRole = "";
  private contactRoles: RadioButton[] = [
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
    {
      id: "Contractor",
      label: "Contractor",
      value: "CTR",
    },
  ];

  private selectedGrade = "";
  private gradeData = [
    { grade: "GS-01" },
    { grade: "GS-02" },
    { grade: "GS-03" },
    { grade: "GS-04" },
    { grade: "GS-05" },
    { grade: "GS-06" },
    { grade: "GS-07" },
    { grade: "GS-08" },
    { grade: "GS-09" },
    { grade: "GS-10" },
    { grade: "GS-11" },
    { grade: "GS-12" },
    { grade: "GS-13" },
    { grade: "GS-14" },
    { grade: "GS-15" },
    { grade: "SES" },
  ];

  private selectedSalutation = "";
  private salutationData: SelectData[] = [
    { text: "Mr.", value: "Mr.", },
    { text: "Mrs.", value: "Mrs.", },
    { text: "Miss", value: "Miss", },
    { text: "Ms.", value: "Ms.", },
    { text: "Dr.", value: "Dr.", },
  ];
  
  private selectedRank = "";
  private rankData: SelectData[] = [
    {
      text: "Private E-1 (PVT)",
      value: "PVT",
    },
    {
      text: "Private E-2 (PV2)",
      value: "PV2",
    },
    {
      text: "Private First Class (PFC)",
      value: "PFC",
    },
    {
      text: "Corporal (CPL)",
      value: "CPL",
    },
    {
      text: "Specialist (SPC)",
      value: "SPC",
    },
    {
      text: "Sergeant (SGT)",
      value: "SGT",
    },
    {
      text: "Staff Sergeant (SSG)",
      value: "SSG",
    },
  ];
}
</script>
