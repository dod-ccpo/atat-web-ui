
<template>
  <section class="mt-10">
    <ATATRadioGroup
      id="ContactAffiliation"
      :legend="legendText"
      :items="contactRoles"
      :value.sync="_selectedRole"
      :rules="[
        $validators.required('Please enter your role.'),
      ]"
      class="mb-10"
      @radioButtonSelected="contactTypeChange"
    />

    <v-form ref="atatGlobalContact">
      <ATATSelect
        id="Branch"
        v-show="_selectedRole === 'MILITARY'"
        v-model="_selectedBranch"
        class="_input-max-width mb-10"
        label="Service Branch"
        placeholder=""
        :items="branchData"
        :selectedValue.sync="_selectedBranch"
        :showAccessRadioButtons.sync="_showAccessRadioButtons"
        :returnObject="true"
        :rules="[
          $validators.required(
            'Please select your service branch.'
          ),
        ]"
      />

      <div v-show="(_selectedBranch && _selectedBranch.value) || _selectedRole === 'CIVILIAN'">
        <ATATAutoComplete
          id="Rank"
          v-show="_selectedRole === 'MILITARY'"
          label="Rank"
          titleKey="name"
          :items="selectedBranchRanksData"
          :searchFields="['name', 'grade']"
          :selectedItem.sync="_selectedRank"
          :rules="[
            $validators.required(
              'Please select your rank.'
            ),
          ]"
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
              :rules="[
                $validators.required(
                  'Please enter your first name.'
                ),
              ]"
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
              :rules="[
                $validators.required(
                  'Please enter your last name.'
                ),
              ]"
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

        <ATATPhoneInput
          id="PhoneNumber"
          label="Phone number"
          class="width-100 mb-10"
          :value.sync="_phone"
          :country.sync="_selectedPhoneCountry"
          :extensionValue.sync="_phoneExt"
          :rules="[
            $validators.required(
              'Please enter your phone number'
            ),
            $validators.isPhoneNumberValid(this._selectedPhoneCountry),
          ]"
        />

        <ATATTextField
          id="EmailAddress"
          label="Email address"
          class="_input-max-width mb-10"
          helpText="Enter a .mil or .gov email address."
          :value.sync="_email"
          :rules="[
            $validators.required(
              'Please enter your email address.'
            ),
            $validators.isEmail(),
          ]"
        />
      </div>
    </v-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATPhoneInput from "@/components/ATATPhoneInput.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";
;
import ContactData from "@/store/contactData";
import {
  AutoCompleteItem,
  AutoCompleteItemGroups,
  RadioButton,
  RankData,
  SelectData
} from "../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { convertSystemChoiceToSelect } from "@/helpers";

@Component({
  components: {
    ATATAutoComplete,
    ATATPhoneInput,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
  },
})
export default class ATATContactForm extends Vue {
  $refs!: {
    atatGlobalContact: Vue & {
      resetValidation: () => void;
      reset: () => void;
    };
  };

  //props
  @Prop() private loaded!: boolean
  @PropSync("showAccessRadioButtons") private _showAccessRadioButtons!: boolean;
  @PropSync("selectedPhoneCountry") private _selectedPhoneCountry?: string;
  @PropSync("type") private _type?: string;
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

  // watchers

  @Watch("_selectedBranch")
  protected branchChange(newVal: string): void {
    if (newVal !== null){
      this.setRankData();
    }
  }

  // data
  private legendText = "";
  private branchData: SelectData[] = [];
  private branchRanksData: AutoCompleteItemGroups = {};
  private selectedBranchRanksData: AutoCompleteItem[] = [];
  private salutationData: SelectData[] = [];
  private contactRoles: RadioButton[] = [
    {
      id: "Military",
      label: "Military",
      value: "MILITARY",
    },
    {
      id: "Civilian",
      label: "Civilian",
      value: "CIVILIAN",
    },
  ];
  private setRankData(): void {
    if (this._selectedBranch && this._selectedBranch.value) {
      this.selectedBranchRanksData =
        this.branchRanksData[this._selectedBranch.value];
    }
  }

  private contactTypeChange(): void {
    if(this.loaded){
      this.resetData();
    }

  }
  public resetData(): void {
    Vue.nextTick(() => {
      //iterate over the forms children ref manually set their 'errorMessages' array to empty
      const formChildren = this.$refs.atatGlobalContact.$children;

      formChildren.forEach((ref)=> {
        ((ref as unknown) as {errorMessages:[], _value: string}).errorMessages = [];
      });
      Vue.nextTick(() => {
        this.$refs.atatGlobalContact.reset();
        this.$refs.atatGlobalContact.resetValidation();
      });
    });
  }

  public async loadOnEnter(): Promise<void> {
    const branches = await ContactData.LoadMilitaryBranches();
    this.branchData = branches.map((choice) => {
      const text = `U.S. ${choice.label}`;
      const { value } = choice;
      return {
        text,
        value,
      };
    });
    this.branchRanksData = ContactData.militaryAutoCompleteGroups;
    this.salutationData = convertSystemChoiceToSelect(ContactData.salutationChoices);
    this.legendText = this._type === "financialPOCForm"?
      'What role best describes your Financial POC\'s affiliation?':
      'What role best describes your affiliation with the DoD?'
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
