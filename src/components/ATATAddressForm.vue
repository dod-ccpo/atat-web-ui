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
          :rules="getRules('streetAddress1')"
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
          selectedAddressType !== addressTypes.FOR
            ? 'col-lg-5'
            : 'col-lg-4',
        ]"
      >
        <ATATTextField
          v-show="selectedAddressType !== addressTypes.MIL"
          id="City"
          label="City"
          :class="inputClass"
          :value.sync="_city"
        />
        <ATATSelect
          v-show="selectedAddressType === addressTypes.MIL"
          id="APO_FPO_DPO"
          label="APO/FPO/DPO"
          :class="inputClass"
          :items="militaryPostOfficeOptions"
          :selectedValue.sync="_selectedMilitaryPO"
          :returnObject="true"
        />
      </v-col>
      <v-col
        class="col-12"
        :class="[
          selectedAddressType !== addressTypes.FOR
            ? 'col-lg-3'
            : 'col-lg-4',
        ]"
      >
        <ATATAutoComplete
          id="State"
          label="State"
          v-show="selectedAddressType === addressTypes.USA"
          :class="inputClass"
          titleKey="text"
          :searchFields="['text', 'value']"
          :items="stateListData"
          :selectedItem.sync="_selectedState"
          placeholder=""
          icon="arrow_drop_down"
        />

        <ATATSelect
          v-show="selectedAddressType === addressTypes.MIL"
          id="StateCode"
          label="AA/AE/AP"
          :class="inputClass"
          :items="stateCodeListData"
          :selectedValue.sync="_selectedStateCode"
          :returnObject="true"
        />

        <ATATTextField
          v-show="selectedAddressType === addressTypes.FOR"
          id="StateProvince"
          label="State or Province"
          :value.sync="_stateOrProvince"
          :class="inputClass"
        />
      </v-col>
      <v-col class="col-12 col-lg-3">
        <ATATTextField
          id="ZIP"
          :label="zipLabel"
          :class="inputClass"
          :value.sync="_zipCode"
          width="160"
        />
      </v-col>
    </v-row>
    <v-row v-show="selectedAddressType === addressTypes.FOR">
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

import { RadioButton, SelectData, stringObj } from "types/Global";

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
  @Prop() public minLength?: stringObj[];


  // methods

  private addressTypeChange(addressType: string): void {
    this._selectedCountry =
      addressType === this.addressTypes?.FOR
        ? {text: "", value: ""}
        : {text: "United States of America", value: "US"};
  }

  private getRules(inputName: string): string[] {
    let rulesArr = []
    if (this.requiredFields) {
      var result = this.requiredFields.filter(obj => {
        return obj.field === inputName
      })
      if(result.length) {
        rulesArr.push(this.$validators.required(result[0].message))
      }
    }
    if (this.minLength) {
      var result = this.minLength.filter(obj => {
        return obj.field === inputName
      })
      if(result.length) {
        rulesArr.push(this.$validators.required(result[0].message))
      }
    }

    return rulesArr
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

}

</script>
