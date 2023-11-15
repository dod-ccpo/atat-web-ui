
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
        v-if="isWizard"
        id="ContactAffiliation"
        ref="ContactAffiliationRef"
        :legend="
          'What role best describes your ' +
          corOrAcor +
          '’s affiliation with the DoD?'
        "
        :items="contactRoles"
        :value="_selectedRole"
        @update:value="_selectedRole = $event"
        :rules="[
          $validators.required('Please enter your ' + corOrAcor + '’s role.'),
        ]"
        class="mb-10"
        @radioButtonSelected="contactTypeChange"
      />

      <div>
        <ATATSelect
          :id="corOrAcor + '_Branch'"
          :ref="corOrAcor + '_BranchRef'"
          v-show="_selectedRole === 'MILITARY'"
          v-model="_selectedBranch"
          class="_input-max-width mb-10"
          label="Service Branch"
          placeholder=""
          :items="branchData"
          :selectedValue="_selectedBranch"
          @update:selectedValue="_selectedBranch = $event"
          :returnObject="true"
          :rules="[
            $validators.required(
              'Please select your ' + corOrAcor + '’s service branch.'
            ),
          ]"
        />

        <div v-if="(_selectedBranch && _selectedBranch.value) || _selectedRole === 'CIVILIAN'">
          <ATATAutoComplete
            :id="corOrAcor + '_Rank'"
            :ref="corOrAcor + '_RankRef'"
            v-if="_selectedRole === 'MILITARY'"
            label="Rank"
            titleKey="name"
            valueKey="sysId"
            :items="selectedBranchRanksData"
            :searchFields="['name', 'grade']"
            :selectedItem="_selectedRank"
            @update:selectedItem="_selectedRank = $event"
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
            :ref="corOrAcor + '_SalutationRef'"
            v-show="_selectedRole === 'CIVILIAN'"
            class="_input-max-width mb-7"
            label="Salutation"
            :optional="true"
            placeholder=""
            :items="salutationData"
            :selectedValue="_selectedSalutation"
            @update:selectedValue="_selectedSalutation = $event"
          />

          <v-row class="form-section mb-7">
            <v-col class="col-12 col-lg-3">
              <ATATTextField
                label="First name"
                :id="corOrAcor + '_FirstName'"
                :ref="corOrAcor + '_FirstNameRef'"
                class="_input-max-width"
                :value="_firstName"
                @update:value="_firstName = $event"
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
                :ref="corOrAcor + '_MiddleNameRef'"
                :optional="true"
                class="_input-max-width"
                :value="_middleName"
                @update:value="_middleName = $event"
              />
            </v-col>
            <v-col class="col-12 col-lg-3">
              <ATATTextField
                label="Last name"
                :id="corOrAcor + '_LastName'"
                :ref="corOrAcor + '_LastNameRef'"
                class="_input-max-width"
                :value="_lastName"
                @update:value="_lastName = $event"
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
                :ref="corOrAcor + '_SuffixRef'"
                :optional="true"
                width="80"
                :value="_suffix"
                @update:value="_suffix = $event"
              />
            </v-col>
          </v-row>

          <ATATPhoneInput
            :id="corOrAcor + '_PhoneNumber'"
            :ref="corOrAcor + '_PhoneNumberRef'"
            label="Phone number"
            class="width-100 mb-10"
            :value="_phone"
            @update:value="_phone = $event"
            :country="_selectedPhoneCountry"
            @update:country="_selectedPhoneCountry = $event"
            :extensionValue="_phoneExt"
            @update:extensionValue="_phoneExt = $event"
            :rules="[
              $validators.required(
                'Please enter your ' + corOrAcor + '’s phone number'
              ),
              $validators.isPhoneNumberValid(_selectedPhoneCountry),
            ]"
          />

          <ATATTextField
            :id="corOrAcor + '_EmailAddress'"
            :ref="corOrAcor + '_EmailAddressRef'"
            label="Email address"
            class="_input-max-width"
            :class="{ 'mb-10': isWizard }"
            helpText="Enter a .mil or .gov email address."
            :value="_email"
            @update:value="_email = $event"
            :rules="[
              $validators.required(
                'Please enter your ' + corOrAcor + '’s email address.'
              ),
              $validators.isEmail(),
            ]"
          />

          <DoDAAC 
            v-if="isWizard"
            ref="DoDAACref"
            :isForm="true"
            :isWizard="isWizard"
            :dodaac="_dodaac"
            @update:dodaac="_dodaac = $event"
            :corOrAcor="corOrAcor"
            :rules="[ 
              $validators.required('Please enter your ' + corOrAcor + '’s 6-character DoDAAC.'),
            ]"
          />
        </div>
      </div>
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
import { ComponentPublicInstance } from "vue";
import { Component, Prop , Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATPhoneInput from "@/components/ATATPhoneInput.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import DoDAAC from "../components/DoDAAC.vue";

import { RadioButton, SelectData, RankData, CountryObj } from "../../../../types/Global";

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
class CorAcorContactInfoForm extends Vue {

  //props
  @Prop() private corOrAcor!: string;
  @Prop() private branchData!: SelectData[];
  @Prop() private selectedBranchRanksData!: SelectData[];
  @Prop() private contactRoles!: RadioButton[];
  @Prop() private isWizard!: boolean;
  @Prop() private isForm!: boolean;
  @Prop() private sectionHeader!: string;

  @PropSync("selectedPhoneCountry") private _selectedPhoneCountry!: CountryObj;

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
    this.loaded = true;
  }

}
export default toNative(CorAcorContactInfoForm)
</script>
