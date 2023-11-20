
<template>
  <section :id="idPrefix + 'contactForm'" class="mt-10">
    <ATATRadioGroup
      :id="idPrefix + 'ContactAffiliation'"
      :ref="idPrefix + 'ContactAffiliationRef'"
      :legend="roleLegend"
      :legend-font-normal-weight="roleLegendFontNormalWeight"
      :items="contactRoles"
      :value="_selectedRole"
      @update:value="_selectedRole = $event"
      :rules="[
        $validators.required('Enter ' + validationMsgCustom + ' role.'),
      ]"
      class="mb-10"
    />

   
      <ATATSelect
        :id="idPrefix + 'Branch'"
        :ref="idPrefix + 'BranchRef'"
        v-if="_selectedRole === 'MILITARY'"
        v-model="_selectedBranch"
        :selectedValue="_selectedBranch"
        @update:selectedValue="_selectedBranch = $event"
        class="_input-max-width mb-10"
        label="Service Branch"
        placeholder=""
        :items="branchData"
        :showAccessRadioButtons="_showAccessRadioButtons"
        @update:showAccessRadioButtons="_showAccessRadioButtons = $event"
        :returnObject="true"
        :rules="[
          $validators.required(
            'Select ' + validationMsgCustom + ' service branch.'
          ),
        ]"
      />

      <ATATAutoComplete
        :id="idPrefix + 'Rank'"
        :ref="idPrefix +  'RankRef'"
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
            'Select ' + validationMsgCustom + ' rank.', undefined, true
          ),
        ]"
        class="_input-max-width mb-7"
        icon="arrow_drop_down"
      />

      <ATATSelect
        :id="idPrefix + 'Salutation'"
        :ref="idPrefix + 'SalutationRef'"
        v-if="_selectedRole === 'CIVILIAN'"
        class="_input-max-width mb-7"
        label="Salutation"
        :optional="true"
        placeholder=""
        :items="salutationData"
        :selectedValue="_selectedSalutation"
        @update:selectedValue="_selectedSalutation = $event"
      />
      <div v-if="_selectedRole">
        <v-row class="form-section mb-7">
          <v-col class="col-12 col-lg-3">
            <ATATTextField
              label="First name"
              :id="idPrefix + 'FirstName'"
              :ref="idPrefix + 'FirstNameRef'"
              class="_input-max-width"
              :value="_firstName"
              @update:value="_firstName = $event"
              :rules="[
                $validators.required(
                  'Enter ' + validationMsgCustom + ' first name.'
                ),
              ]"
            />
          </v-col>
          <v-col class="col-12 col-lg-3">
            <ATATTextField
              label="Middle name"
              :id="idPrefix + 'MiddleName'"
              :ref="idPrefix + 'MiddleNameRef'"
              :optional="true"
              class="_input-max-width"
              :value="_middleName"
              @update:value="_middleName = $event"
            />
          </v-col>
          <v-col class="col-12 col-lg-3">
            <ATATTextField
              label="Last name"
              :id="idPrefix + 'LastName'"
              :ref="idPrefix + 'LastNameRef'"
              class="_input-max-width"
              :value="_lastName"
              @update:value="_lastName = $event"
              :rules="[
                $validators.required(
                  'Enter ' + validationMsgCustom + ' last name.'
                ),
              ]"
            />
          </v-col>
          <v-col class="col-12 col-lg-3">
            <ATATTextField
              label="Suffix"
              :id="idPrefix + 'Suffix'"
              :ref="idPrefix + 'SuffixRef'"
              :optional="true"
              width="80"
              :value="_suffix"
              @update:value="_suffix = $event"
            />
          </v-col>
        </v-row>

        <ATATTextField
            v-if="showJobTitle"
            :id="idPrefix + 'JobTitle'"
            :ref="idPrefix + 'JobTitleRef'"
            label="Job Title"
            class="_input-max-width mb-10"
            :value="_title"
            @update:value="_title = $event"
            :rules="[
            $validators.required(
              'Enter ' + validationMsgCustom + ' job title.'
            )
          ]"
        />

        <ATATPhoneInput
          :id="idPrefix + 'PhoneNumber'"
          :ref="idPrefix + 'PhoneNumberRef'"
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
              'Enter ' + validationMsgCustom + ' phone number.'
            ),
            $validators.isPhoneNumberValid(_selectedPhoneCountry),
          ]"
        />

        <ATATTextField
          v-if="showEmail"
          :id="idPrefix + 'EmailAddress'"
          :ref="idPrefix + 'EmailAddressRef'"
          label="Email address"
          class="_input-max-width mb-10"
          helpText="Enter a .mil or .gov email address."
          :value="_email"
          @update:value="_email = $event"
          :rules="[
            $validators.required(
              'Enter ' + validationMsgCustom + ' email address.'
            ),
            $validators.isEmail(),
          ]"
        />
      </div>
  </section>
</template>

<script lang="ts">
import { ComponentPublicInstance } from "vue";
import { Vue, Component, Prop, Watch, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATPhoneInput from "@/components/ATATPhoneInput.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ContactData from "@/store/contactData";
import {
  CountryObj,
  RadioButton,
  RankData,
  SelectData
} from "../../types/Global";

@Component({
  emits: ["resetContactForm"],
  components: {
    ATATAutoComplete,
    ATATPhoneInput,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
  },
})
class ATATContactForm extends Vue {
  $refs!: {
    atatGlobalContact: ComponentPublicInstance & {
      resetValidation: () => void;
      reset: () => void;
    };
  };

  //props
  @Prop() private loaded!: boolean
  @Prop({default: "What role best describes your affiliation with the DoD?"})
  private roleLegend?: string;
  @Prop() private branchData!: SelectData[];
  @Prop() private selectedBranchRanksData!: SelectData[];
  @Prop({default: false}) public roleLegendFontNormalWeight?: boolean;
  @PropSync("showAccessRadioButtons") private _showAccessRadioButtons!: boolean;
  @PropSync("selectedPhoneCountry") private _selectedPhoneCountry!: CountryObj;
  @PropSync("selectedRole") private _selectedRole?: string;
  @PropSync("selectedRank") private _selectedRank?: RankData;
  @PropSync("selectedBranch") private _selectedBranch?: SelectData;
  @PropSync("selectedSalutation") private _selectedSalutation?: SelectData;
  @PropSync("firstName") private _firstName?: string;
  @PropSync("middleName") private _middleName?: string;
  @PropSync("lastName") private _lastName?: string;
  @PropSync("suffix") private _suffix?: string;
  @PropSync("title") private _title?: string;
  @Prop({default: false}) private showJobTitle?: boolean;
  @PropSync("email") private _email?: string;
  @Prop({default: true}) private showEmail?: boolean;
  @PropSync("phone") private _phone?: string;
  @PropSync("phoneExt") private _phoneExt?: string;
  @Prop({default: "contactForm"}) public idPrefix?: string;
  @Prop({default: "a"}) public validationMsgCustom?: string;

  // watchers

  @Watch("_selectedBranch")
  public clearRank(newVal: SelectData, oldVal: SelectData): void{
    const isOldValValid = Object.values(oldVal).every(v=>v!=="")
    if (isOldValValid){
      this._selectedRank =  { grade: "", name: "", sysId: ""}
    }
  }

  // data
  private salutationData: SelectData[] = [];
  private contactRoles: RadioButton[] = [ // Order reversed based on feedback provided on AT-8846
    {
      id: "Civilian",
      label: "Civilian",
      value: "CIVILIAN",
    },
    {
      id: "Military",
      label: "Military",
      value: "MILITARY",
    }
  ];
  
 


}
export default toNative(ATATContactForm)
</script>
