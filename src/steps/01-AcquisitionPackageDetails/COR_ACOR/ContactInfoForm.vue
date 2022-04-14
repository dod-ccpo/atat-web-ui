
<template>
  <section class="mt-10">
    <hr />
    <h2 id="ContactInfoHeader" class="form-section-heading">
      Your {{ corOrAcor }}’s Contact Information
    </h2>

    <ATATRadioGroup
      id="ContactAffiliation"
      :legend="'What role best describes your ' + corOrAcor + '’s affiliation with the DoD?'"
      :items="contactRoles"
      :value.sync="_selectedRole"
      class="mb-10"
    />

    <ATATSelect
      id="Branch"
      v-show="_selectedRole === 'MILITARY'"
      v-model="selectedBranch"
      class="_input-max-width mb-10"
      label="Service Branch"
      placeholder=""
      :items="branchData"
      :selectedValue.sync="_selectedBranch"
      :showAccessRadioButtons.sync="showAccessRadioButtons"
      :returnObject="true"
    />

    <div v-show="selectedBranch.value || _selectedRole === 'CIVILIAN'">
      <ATATAutoComplete
        id="Rank"
        v-show="_selectedRole === 'MILITARY'"
        label="Rank"
        titleKey="name"
        :items="selectedBranchRanksData"
        :searchFields="['name', 'grade']"
        :selectedItem.sync="_selectedRank"
        class="_input-max-width mb-7"
        icon="arrow_drop_down"
      />

      <ATATSelect
        id="Salutation"
        v-show="_selectedRole === 'CIVILIAN'"
        class="_input-max-width mb-7"
        label="Salutation"
        :optional="true"
        placeholder=""
        :items="salutationData"
        :selectedValue.sync="_selectedSalutation"
      />

      <v-row class="form-section mb-7">
        <v-col class="col-12 col-lg-3">
          <ATATTextField 
            label="First name" 
            id="FirstName" 
            class="_input-max-width" 
            :value.sync="_firstName"
          />
        </v-col>
        <v-col class="col-12 col-lg-3">
          <ATATTextField 
            label="Middle name" 
            id="MiddleName" 
            :optional="true" 
            class="_input-max-width" 
            :value.sync="_middleName"
          />
        </v-col>
        <v-col class="col-12 col-lg-3">
          <ATATTextField 
            label="Last name" 
            id="LastName" 
            class="_input-max-width" 
            :value.sync="_lastName"
          />
        </v-col>
        <v-col class="col-12 col-lg-3">
          <ATATTextField
            label="Suffix"
            id="Suffix"
            :optional="true"
            width="80"
            :value.sync="_suffix"
          />
        </v-col>
      </v-row>

      <ATATTextField 
        id="EmailAddress" 
        label="Email address" 
        class="_input-max-width mb-10" 
        helpText="Enter a .mil or .gov email address."
        :value.sync="_email"
      />

      <div class="d-flex mb-10">
        <ATATPhoneInput
          id="PhoneNumber" 
          label="Phone number" 
          class="_input-max-width width-100" 
          :value.sync="_phone"
          :country.sync="_selectedPhoneCountry"
        />
        <ATATTextField 
          id="PhoneExtension" 
          label="Extension" 
          width="140"
          :optional="true"
          class="ml-6"
          :value.sync="_phoneExt"
        />
      </div>

      <ATATTextField 
        id="DoDAAC" 
        label="DoD Activity Address Code (DoDAAC)" 
        class="_input-max-width"
        tooltipText="A DoDAAC is a 6-character code that uniquely identifies a 
          unit, activity, or organization that has the authority to requisition, 
          contract for, or fund/pay bills for materials and services." 
        :value.sync="_dodaac"
      />

    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATAutoComplete from "@/components/ATATAutoComplete.vue"
import ATATPhoneInput from "@/components/ATATPhoneInput.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

// import AcquisitionPackage from "@/store/acquisitionPackage";
// import ContactData from "@/store/contactData";
// import { ContactDTO } from "@/api/models";

import { 
  RadioButton, 
  SelectData, 
  RankData
  // AutoCompleteItem, 
  // AutoCompleteItemGroups 
} from "../../../../types/Global";


@Component({
  components: {
    ATATAutoComplete,
    ATATPhoneInput,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
  }
})

export default class ContactInfoForm extends Vue {

  //props

  @Prop() private corOrAcor!: string;
  @Prop() private branchData!: SelectData[];
  @Prop() private selectedBranchRanksData!: SelectData[];
  @Prop() private contactRoles!: RadioButton[];

  @PropSync("showAccessRadioButtons") private _showAccessRadioButtons!: boolean;
  @PropSync("selectedPhoneCountry") private _selectedPhoneCountry?: string;

  @PropSync("selectedRole") private _selectedRole?: string;
  @PropSync("selectedRank") private _selectedRank?: RankData;
  @PropSync("selectedBranch") private _selectedBranch?: SelectData;
  @PropSync("selectedSalutation") private _selectedSalutation?: SelectData;
  @PropSync("firstName") private _firstName?: string;
  @PropSync("middleName") private _middleName?: string;
  @PropSync("lastName") private _lastName?: string;
  @PropSync("suffix") private _suffix?: string;
  @PropSync("email") private _email?: string;
  @PropSync("phone") private _phone?: string;
  @PropSync("phoneExt") private _phoneExt?: string;
  @PropSync("dodaac") private _dodaac?: string;

  // data

  private salutationData: SelectData[] = [
    { text: "Mr.", value: "MR" },
    { text: "Mrs.", value: "MRS" },
    { text: "Miss", value: "MISS" },
    { text: "Ms.", value: "MS" },
    { text: "Dr.", value: "DR" },
  ];

}
</script>
