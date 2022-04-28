<template>
  <div>

    <ATATRadioGroup
      id="AddressType"
      legend="Type of mailing address"
      :value.sync="_selectedAddressType"
      :items="addressTypeOptions"
      name="AddressType"
      class="mt-3 mb-8"
      @radioButtonSelected="addressTypeChange"
    />

    <v-row>
      <v-col class="col-12 col-lg-8">
        <ATATTextField
          id="StreetAddress"
          label="Street address"
          :class="inputClass"
          :value.sync="_streetAddress1"
          :rules="getRules('StreetAddress')"
        />
      </v-col>
      <v-col class="col-12 col-lg-3">
        <ATATTextField
          id="UnitSuite"
          label="Unit, suite, etc."
          :optional="true"
          :class="inputClass"
          :value.sync="_streetAddress2"
          width="160"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        class="col-12"
        :class="[
          _selectedAddressType !== addressTypes.FOR
            ? 'col-lg-5'
            : 'col-lg-4',
        ]"
      >
        <ATATTextField
          v-show="_selectedAddressType !== addressTypes.MIL"
          id="City"
          label="City"
          :class="inputClass"
          :value.sync="_city"
          :rules="getRules('City')"
        />
        <ATATSelect
          v-show="_selectedAddressType === addressTypes.MIL"
          id="APO_FPO_DPO"
          label="APO/FPO/DPO"
          :class="inputClass"
          :items="militaryPostOfficeOptions"
          :selectedValue.sync="_selectedMilitaryPO"
          :returnObject="true"
          :rules="getRules('APO_FPO_DPO')"

        />
      </v-col>
      <v-col
        class="col-12"
        :class="[
          _selectedAddressType !== addressTypes.FOR
            ? 'col-lg-3'
            : 'col-lg-4',
        ]"
      >
        <ATATAutoComplete
          id="State"
          label="State"
          v-show="_selectedAddressType === addressTypes.USA"
          :class="inputClass"
          titleKey="text"
          :searchFields="['text', 'value']"
          :items="stateListData"
          :selectedItem.sync="_selectedState"
          placeholder=""
          icon="arrow_drop_down"
          :rules="getRules('State')"
        />

        <ATATSelect
          v-show="_selectedAddressType === addressTypes.MIL"
          id="StateCode"
          label="AA/AE/AP"
          :class="inputClass"
          :items="stateCodeListData"
          :selectedValue.sync="_selectedStateCode"
          :returnObject="true"
          :rules="getRules('StateCode')"

        />

        <ATATTextField
          v-show="_selectedAddressType === addressTypes.FOR"
          id="StateProvince"
          label="State or Province"
          :value.sync="_stateOrProvince"
          :class="inputClass"
          :rules="getRules('StateProvince')"

        />
      </v-col>
      <v-col class="col-12 col-lg-3">
        <ATATTextField
          :id="IDLabel"
          :label="zipLabel"
          :class="inputClass"
          :value.sync="_zipCode"
          :rules="getRules(IDLabel)"
          width="160"
        />
      </v-col>
    </v-row>
    <v-row v-show="_selectedAddressType === addressTypes.FOR">
      <v-col class="col-12 col-lg-4">
        <ATATAutoComplete
          id="Country"
          label="Country"
          :class="inputClass"
          titleKey="text"
          :searchFields="['text', 'value']"
          :items="countryListData"
          :selectedItem.sync="_selectedCountry"
          :returnObject="true"
          placeholder=""
          icon="arrow_drop_down"
          :rules="getRules('Country')"
        />
      </v-col>
    </v-row> 
  
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATAutoComplete from "./ATATAutoComplete.vue";
import ATATDialog from "./ATATDialog.vue";
import ATATRadioGroup from "./ATATRadioGroup.vue";
import ATATSelect from "./ATATSelect.vue";
import ATATTextField from "./ATATTextField.vue";
import Inputmask from "inputmask/";


import { isValidObj, RadioButton, SelectData, stringObj } from "types/Global";

@Component({
  components: {
    ATATAutoComplete,
    ATATDialog,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
  },
})

export default class ATATAddressForm extends Vue {
  @PropSync("selectedAddressType") public _selectedAddressType?: string;
  @PropSync("streetAddress1") public _streetAddress1?: string;
  @PropSync("streetAddress2") public _streetAddress2?: string;
  @PropSync("city") public _city?: string;
  @PropSync("selectedMilitaryPO") public _selectedMilitaryPO?: SelectData;
  @PropSync("selectedState") public _selectedState?: SelectData;
  @PropSync("selectedStateCode") public _selectedStateCode?: string;
  @PropSync("stateOrProvince") public _stateOrProvince?: string;
  @PropSync("zipCode") public _zipCode?: string;
  @PropSync("selectedCountry") public _selectedCountry?: SelectData;

  @Prop({required: true}) public addressTypeOptions?: RadioButton[];
  @Prop({required: true}) public addressTypes?: stringObj;
  @Prop() public militaryPostOfficeOptions?: SelectData[];
  @Prop() public stateListData?: SelectData[];
  @Prop() public stateCodeListData?: SelectData[];
  @Prop() public countryListData?: SelectData[];
  @Prop() public requiredFields?: stringObj[];
  @Prop() public isValidRules?: isValidObj[];


  // methods

  private addressTypeChange(addressType: string): void {
    this._selectedCountry =
        addressType === this.addressTypes?.FOR
          ? { text: "", value: "" }
          : { text: "United States of America", value: "US" };
  }

  private getRules(inputID: string): ((v:string)=> string | true | undefined)[] {
    let rulesArr: ((v:string)=>string | true | undefined)[]  = [];
    if (this.requiredFields) {

      const result = this.requiredFields.filter(obj => {
        return obj.field === inputID
      })
      if(result.length) {
        rulesArr.push(this.$validators.required(result[0].message))
      }
    }

    if (this.isValidRules) {
      const isValidResult = this.isValidRules.filter(obj => {
        return obj.field === inputID
      })
      if(isValidResult.length) {
        this.setMask(inputID,isValidResult[0].mask);
        rulesArr.push(this.$validators.isMaskValid(
          isValidResult[0].mask,isValidResult[0].message,isValidResult[0].isMaskRegex
        ))
      }
    }

    return rulesArr
  }
  private setMask(inputID:string, mask:string[]): void {
    Vue.nextTick(()=>{
      const inputField = document.getElementById(
        inputID + "_text_field"
      ) as HTMLInputElement;

      if(inputField !== null) {
        Inputmask({
          mask: mask || [],
          placeholder: "",
          jitMasking: true
        }).mask(inputField);
      }

    })
  }
  // computed

  get inputClass(): string {
    return this.$vuetify.breakpoint.mdAndDown
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

</script>
