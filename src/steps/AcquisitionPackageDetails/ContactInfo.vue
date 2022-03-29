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
          v-model="selectedBranch"
          v-show="selectedRole === 'MIL'"
          class="input-max-width mb-10"
          label="Service branch"
          placeholder=""
          :items="branchData"
          :selectedValue.sync="selectedBranch"
          :return-object="true"
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
          :searchFields="['rank', 'value', 'grade']"
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
        <ATATPhoneInput
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
import ATATPhoneInput from "@/components/ATATPhoneInput.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";

import { 
  AutoCompleteItem, 
  AutoCompleteItemGroups, 
  RadioButton, 
  SelectData 
} from "../../../types/Global";


@Component({
  components: {
    ATATAutoComplete,
    ATATPhoneInput,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
  },
})

export default class ContactInfo extends Vue {

  // computed

  get showContactInfoFields(): boolean {
    return this.selectedRole !== "MIL" 
      || (this.selectedRole === "MIL" && this.selectedBranch.value !== "")
  }

  // methods

  private setRankData(): void {
    if (this.selectedBranch.value) {
      this.selectedBranchRanks = this.branchRanksData[this.selectedBranch.value];
    }
  }

  // watchers

  @Watch("selectedBranch")
  protected branchChange(): void {
    this.setRankData();
    AcquisitionPackage.setSelectedContactBranch(this.selectedBranch);
  }  

  @Watch("selectedRole") 
  protected roleChange(newRole: string): void {
    if (newRole === "MIL") {
      const branch = this.branchData.filter((branchObj) => {
        return branchObj.value === this.selectedServiceOrAgency.value;
      });
      if (branch.length) {
        this.selectedBranch = branch[0];
      }
    }
  }

  // data
  
  public selectedServiceOrAgency: SelectData = AcquisitionPackage.selectedServiceOrAgency;

  private selectedBranch: SelectData = { text: "", value: "" };
  private branchData: SelectData[] = AcquisitionPackage.branchData;

  private selectedRank = "";
  private selectedBranchRanks: AutoCompleteItem[] = [];
  private branchRanksData: AutoCompleteItemGroups = AcquisitionPackage.branchRanksData;

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

}
</script>
