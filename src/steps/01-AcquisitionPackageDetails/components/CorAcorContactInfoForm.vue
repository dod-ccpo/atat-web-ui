
<template>
  <div>
    <section v-if="isForm" :class="{'mt-10' : isWizard}">
      <hr v-if="isWizard" />
      <h2 v-if="isWizard" :id="corOrAcor +'_ContactInfoHeader'" class="form-section-heading">
        {{ sectionHeader }}
      </h2>

      <h3 
        v-else 
        :id="corOrAcor +'_ContactInfoHeader'" 
        class="mb-5 form-section-heading"
      >
        {{ sectionHeader }}
      </h3>

      <ATATRadioGroup
        v-show="isWizard"
        id="ContactAffiliation"
        :legend="
          'What role best describes your ' +
          corOrAcor +
          '’s affiliation with the DoD?'
        "
        :items="contactRoles"
        :value.sync="_selectedRole"
        :rules="[
          $validators.required('Please enter your ' + corOrAcor + '’s role.'),
        ]"
        class="mb-10"
        @radioButtonSelected="contactTypeChange"
      />

      <v-form ref="CORACORContactForm">
        <ATATSelect
          :id="corOrAcor + '_Branch'"
          v-show="_selectedRole === 'MILITARY'"
          v-model="_selectedBranch"
          class="_input-max-width mb-10"
          label="Service Branch"
          placeholder=""
          :items="branchData"
          :selectedValue.sync="_selectedBranch"
          :returnObject="true"
          :rules="[
            $validators.required(
              'Please select your ' + corOrAcor + '’s service branch.'
            ),
          ]"
        />

        <div v-show="(_selectedBranch && _selectedBranch.value) || _selectedRole === 'CIVILIAN'">
          <ATATAutoComplete
            :id="corOrAcor + '_Rank'"
            v-show="_selectedRole === 'MILITARY'"
            label="Rank"
            titleKey="name"
            :items="selectedBranchRanksData"
            :searchFields="['name', 'grade']"
            :selectedItem.sync="_selectedRank"
            :rules="[
              $validators.required(
                'Please select your ' + corOrAcor + '’s rank.'
              ),
            ]"
            class="_input-max-width mb-7"
            icon="arrow_drop_down"
          />

          <ATATSelect
            :id="corOrAcor + '_Salutation'"
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
                :id="corOrAcor + '_FirstName'"
                class="_input-max-width"
                :value.sync="_firstName"
                :rules="[
                  $validators.required(
                    'Please enter your ' + corOrAcor + '’s first name.'
                  ),
                ]"
              />
            </v-col>
            <v-col class="col-12 col-lg-3">
              <ATATTextField
                label="Middle name"
                :id="corOrAcor + '_MiddleName'"
                :optional="true"
                class="_input-max-width"
                :value.sync="_middleName"
              />
            </v-col>
            <v-col class="col-12 col-lg-3">
              <ATATTextField
                label="Last name"
                :id="corOrAcor + '_LastName'"
                class="_input-max-width"
                :value.sync="_lastName"
                :rules="[
                  $validators.required(
                    'Please enter your ' + corOrAcor + '’s last name.'
                  ),
                ]"
              />
            </v-col>
            <v-col class="col-12 col-lg-3">
              <ATATTextField
                label="Suffix"
                :id="corOrAcor + '_Suffix'"
                :optional="true"
                width="80"
                :value.sync="_suffix"
              />
            </v-col>
          </v-row>

          <ATATPhoneInput
            :id="corOrAcor + '_PhoneNumber'"
            label="Phone number"
            class="width-100 mb-10"
            :value.sync="_phone"
            :country.sync="_selectedPhoneCountry"
            :extensionValue.sync="_phoneExt"
            :rules="[
              $validators.required(
                'Please enter your ' + corOrAcor + '’s phone number'
              ),
              $validators.isPhoneNumberValid(this._selectedPhoneCountry),
            ]"
          />

          <ATATTextField
            :id="corOrAcor + '_EmailAddress'"
            label="Email address"
            class="_input-max-width"
            :class="{ 'mb-10': isWizard }"
            helpText="Enter a .mil or .gov email address."
            :value.sync="_email"
            :rules="[
              $validators.required(
                'Please enter your ' + corOrAcor + '’s email address.'
              ),
              $validators.isEmail(),
            ]"
          />

          <DoDAAC 
            v-if="isWizard"
            :isForm="true"
            :isWizard="isWizard"
            :dodaac.sync="_dodaac"
            :corOrAcor="corOrAcor"
            :rules="[ 
              $validators.required('Please enter your ' + corOrAcor + '’s 6-character DoDAAC.'),
            ]"
          />
        </div>
      </v-form>
    </section>
    
    <div v-else>
      <div class="mb-2">
        <strong class="mr-2">Name:</strong> {{ formalName }}
      </div>
      <div class="mb-2">
        <strong class="mr-2">Email:</strong>  {{ _email }}
      </div>
      <div class="mb-2">
        <strong class="mr-2">Phone Number:</strong> {{ _phone }} 
        <span v-if="_phoneExt">ext. {{ _phoneExt }}</span>
      </div>
      <div class="mb-2">
        <strong class="mr-2">
          Department of Defense Activity Address Code &#40;DoDAAC&#41;:
        </strong> 
        {{ _dodaac }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATPhoneInput from "@/components/ATATPhoneInput.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import DoDAAC from "../components/DoDAAC.vue";

import { RadioButton, SelectData, RankData } from "../../../../types/Global";

@Component({
  components: {
    ATATAutoComplete,
    ATATPhoneInput,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
    DoDAAC,
  },
})
export default class CorAcorContactInfoForm extends Vue {
  $refs!: {
    CORACORContactForm: Vue & {
      resetValidation: () => void;
      reset: () => void;
    };
  };

  //props

  @Prop() private corOrAcor!: string;
  @Prop() private branchData!: SelectData[];
  @Prop() private selectedBranchRanksData!: SelectData[];
  @Prop() private contactRoles!: RadioButton[];
  @Prop() private isWizard!: boolean;
  @Prop() private isForm!: boolean;
  @Prop() private sectionHeader!: string;

  @PropSync("selectedPhoneCountry") private _selectedPhoneCountry?: string;

  @PropSync("selectedRole") private _selectedRole?: string;
  @PropSync("selectedRank") private _selectedRank?: RankData;
  @PropSync("selectedBranch") private _selectedBranch?: SelectData;
  @PropSync("selectedSalutation") private _selectedSalutation?: SelectData;
  @PropSync("firstName") private _firstName?: string;
  @PropSync("middleName") private _middleName?: string;
  @PropSync("lastName") private _lastName?: string;
  @PropSync("suffix") private _suffix?: string;
  @Prop() private formalName?: string;
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

  private loaded = false;
  private contactTypeChange(): void {
    if (this.loaded) {
      this.resetData();
    }
    this.loaded = true;
  }

  public resetData(): void {
    Vue.nextTick(() => {
      //iterate over the forms children ref manually set their 'errorMessages' array to empty
      const formChildren = this.$refs.CORACORContactForm.$children;

      formChildren.forEach((ref)=> {
        ((ref as unknown) as {errorMessages:[], _value: string}).errorMessages = [];
      });
      Vue.nextTick(() => {
        this.$refs.CORACORContactForm.reset();
        this.$refs.CORACORContactForm.resetValidation();
      });
    });
  }
}
</script>
