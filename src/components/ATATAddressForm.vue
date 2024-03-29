<template>
  <div>

    <ATATRadioGroup
      id="AddressType"
      ref="AddressTypeRef"
      legend="Type of mailing address"
      :value="_selectedAddressType"
      @update:value="_selectedAddressType = $event"
      :items="addressTypeOptions"
      name="AddressType"
      class="mt-3 mb-8"
      @radioButtonSelected="addressTypeChange"
      :rules="[$validators.required('Please select your Organization\'s address type.')]"
    />

    <v-form
      ref="AddressFormRef"
      lazy-validation
      v-if="_selectedAddressType !== ''">
      <v-row>
      <v-col class="col-12 col-lg-8">
        <ATATTextField
          id="StreetAddress"
          ref="StreetAddressRef"
          label="Street address"
          :class="inputClass"
          :value="_streetAddress1"
          @update:value="_streetAddress1 = $event"
          :rules="getRules('StreetAddress')"
        />
      </v-col>
      <v-col class="col-12 col-lg-3">
        <ATATTextField
          id="UnitSuite"
          label="Unit, suite, etc."
          :optional="true"
          :class="inputClass"
          :value="_streetAddress2"
          @update:value="_streetAddress2 = $event"
          width="160"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        class="col-12"
        :class="[
          _selectedAddressType !== addressTypes?.FOR ?? ''
            ? 'col-lg-5'
            : 'col-lg-4',
        ]"
      >
        <ATATTextField
          v-if="_selectedAddressType !== addressTypes?.MIL ?? ''"
          id="City"
          ref="CityRef"
          label="City"
          :class="inputClass"
          :value="_city"
          @update:value="_city = $event"
          :rules="getRules('City')"
        />
        <ATATSelect
          v-if="_selectedAddressType === addressTypes?.MIL ?? ''"
          id="APO_FPO_DPO"
          ref="APO_FPO_DPORef"
          label="APO/FPO/DPO"
          :class="inputClass"
          :items="militaryPostOfficeOptions"
          :selectedValue="_selectedMilitaryPO"
          @update:selectedValue="_selectedMilitaryPO = $event"
          :returnObject="true"
          :rules="getRules('APO_FPO_DPO')"

        />
      </v-col>
      <v-col
        class="col-12"
        :class="[
          _selectedAddressType !== addressTypes?.FOR ?? ''
            ? 'col-lg-3'
            : 'col-lg-4',
        ]"
      >
        <ATATAutoComplete
          id="State"
          ref="StateRef"
          label="State"
          v-if="_selectedAddressType === addressTypes?.USA ?? ''"
          :class="inputClass"
          :searchFields="['text', 'value']"
          :items="stateListData"
          :selectedItem="_selectedState"
          @update:selectedItem="_selectedState = $event"
          placeholder=""
          icon="arrow_drop_down"
          :rules="getRules('State')"
        />

        <ATATSelect
          v-if="_selectedAddressType === addressTypes?.MIL ?? ''"
          id="StateCode"
          ref="StateCodeRef"
          label="AA/AE/AP"
          :class="inputClass"
          :items="stateCodeListData"
          :selectedValue="_selectedStateCode"
          @update:selectedValue="_selectedStateCode = $event"
          :returnObject="true"
          :rules="getRules('StateCode')"

        />

        <ATATTextField
          v-if="_selectedAddressType === addressTypes?.FOR ?? ''"
          id="StateProvince"
          ref="StateProvinceRef"
          label="State or Province"
          :value="_stateOrProvince"
          @update:value="_stateOrProvince = $event"
          :class="inputClass"
          :rules="getRules('StateProvince')"

        />
      </v-col>
      <v-col class="col-12 col-lg-3">
        <ATATTextField
          :id="IDLabel"
          ref="ZipCodeRef"
          :label="zipLabel"
          :class="inputClass"
          :value="_zipCode"
          @update:value="_zipCode = $event"
          :rules="getRules(IDLabel)"
          :validateOnBlur="true"
          width="160"
        />
      </v-col>
    </v-row>
    <v-row v-if="_selectedAddressType === addressTypes?.FOR ?? ''">
      <v-col class="col-12 col-lg-4">
        <ATATAutoComplete
          ref="CountryRef"
          id="Country"
          label="Country"
          :class="inputClass"
          titleKey="text"
          :searchFields="['text', 'value']"
          :items="countryListData"
          :selectedItem="_selectedCountry"
          @update:selectedItem="_selectedCountry = $event"
          :returnObject="true"
          placeholder=""
          icon="arrow_drop_down"
          :rules="getRules('Country')"
        />
      </v-col>
    </v-row> 
    </v-form>
  </div>
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
import { ComponentPublicInstance } from "vue";

import ATATAutoComplete from "./ATATAutoComplete.vue";
import ATATDialog from "./ATATDialog.vue";
import ATATRadioGroup from "./ATATRadioGroup.vue";
import ATATSelect from "./ATATSelect.vue";
import ATATTextField from "./ATATTextField.vue";
import Inputmask from "inputmask/";


import {
  AutoCompleteItem,
  isValidObj,
  mask,
  RadioButton,
  SelectData,
  stringObj,  
  ValidationRule
} from "types/Global";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";

@Component({
  components: {
    ATATAutoComplete,
    ATATDialog,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
  },
})

class ATATAddressForm extends Vue {

  $refs!: {
    [key: string]:ComponentPublicInstance & {
      setErrorMessage: ()=> void,
      validate: () => Promise<SubmitEventPromise>,
      resetValidation: ()=> void,
      reset: ()=> void
    }
  };

  @PropSync("selectedAddressType") public _selectedAddressType?: string;
  @PropSync("streetAddress1") public _streetAddress1?: string;
  @PropSync("streetAddress2") public _streetAddress2?: string;
  @PropSync("city") public _city?: string;
  @PropSync("selectedMilitaryPO") public _selectedMilitaryPO?: SelectData;
  @PropSync("selectedState") public _selectedState?: SelectData;
  @PropSync("selectedStateCode") public _selectedStateCode?: string;
  @PropSync("stateOrProvince") public _stateOrProvince?: string;
  @PropSync("zipCode") public _zipCode?: string;
  @PropSync("selectedCountry") public _selectedCountry?: AutoCompleteItem;

  @Prop({required: true}) public addressTypeOptions?: RadioButton[];
  @Prop({required: true}) public addressTypes?: stringObj;
  @Prop() public militaryPostOfficeOptions?: SelectData[];
  @Prop({default: []}) public stateListData!: SelectData[];
  @Prop() public stateCodeListData?: SelectData[];
  @Prop({default: []}) public countryListData!: SelectData[];
  @Prop() public requiredFields?: stringObj[];
  @Prop() public isValidRules?: isValidObj[];

  public maskObj: mask = {};


  // methods

  private addressTypeChange(addressType: string): void {
    this._selectedCountry =
        addressType === this.addressTypes?.FOR
          ? { text: "", value: "" }
          : { text: "United States of America", value: "US" };

    this.resetData();
  }

  private getRules(inputID: string): ValidationRule[] {
    if (this.requiredFields) {
      const result = this.requiredFields.filter(obj => {
        return obj.field === inputID
      })
      if(result.length) {
        return [this.$validators.required(result[0].message)]
      }
    }

    if (this.isValidRules) {
      const isValidResult = this.isValidRules.filter(obj => {
        return obj.field === inputID
      })
      if(isValidResult.length) {
        const rule = isValidResult[0];
        this.setMask(inputID, rule);
        return[this.$validators.isMaskValid(
          rule.mask,rule.message,rule.isMaskRegex
        )]
      }
    }
    return [];
  }
  private setMask(inputID:string, rule: isValidObj): void {
    this.$nextTick(()=>{
      const inputField = document.getElementById(
        inputID + "_text_field"
      ) as HTMLInputElement;
      if(inputField !== null) {
        this.maskObj ={
          placeholder: "",
          jitMasking: true
        }
        if (rule.isMaskRegex && rule.isMaskRegex===true){
          this.maskObj.regex =  rule.mask[0] || "";
        } else {
          this.maskObj.mask = rule.mask || [];
        }
        Inputmask(this.maskObj).mask(inputField);
      }
    })
  }

  public resetData(): void {
    
    for (const ref in this.$refs){
      if (ref === "AddressFormRef"){
        this.$refs.AddressFormRef?.resetValidation();
        this.$refs.AddressFormRef?.reset();
      }
      if (this.$refs[ref]){
        if (Object.hasOwnProperty.call(this.$refs[ref], "resetValidation")){
          this.$refs[ref].resetValidation();
        }
      } 
    }
  }

  // computed

  get inputClass(): string {
    return this.$vuetify.display.mdAndDown
      ? "_input-max-width my-2"
      : "my-2";
  }

  get zipLabel(): string {
    return this._selectedAddressType !== this.addressTypes?.FOR
      ? "ZIP code"
      : "Postal code";
  }
  get IDLabel(): string {
    return this._selectedAddressType !== this.addressTypes?.FOR
      ? "ZIPCode"
      : "PostalCode";
  }
}
export default toNative(ATATAddressForm)
</script>
