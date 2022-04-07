<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Tell us about your FOIA Coordinator
          </h1>

          <ATATTextField
            id="FullName"
            class="_input-max-width mb-10"
            label="Full name"
            helpText="Include rank, if applicable"
          />

          <ATATTextField
            id="Email"
            class="_input-max-width mb-10"
            label="Email address"
            helpText="Enter a .mil or .gov email address."
          />

          <hr />
          
          <ATATAddressForm 
            :selectedAddressType.sync="selectedAddressType"
            :streetAddress1.sync="streetAddress1"
            :streetAddress2.sync="streetAddress2"
            :city.sync="city"
            :selectedMilitaryPO.sync="selectedMilitaryPO"
            :selectedState.sync="selectedState"
            :selectedStateCode.sync="selectedStateCode"
            :stateOrProvince.sync="stateOrProvince"
            :zipCode.sync="zipCode"
            :selectedCountry.sync="selectedCountry"
            :selectedCountryData.sync="selectedCountryData"

            :addressTypeOptions="addressTypeOptions"
            :addressTypes="addressTypes"
            :militaryPostOfficeOptions="militaryPostOfficeOptions"
            :stateListData="stateListData"
            :stateCodeListData="stateCodeListData"
            :countryListData="countryListData"
          />

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATAddressForm from "@/components/ATATAddressForm.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";

import { RadioButton, SelectData } from "../../../types/Global";

@Component({
  components: {
    ATATAddressForm,
    ATATRadioGroup,
    ATATTextField,
  },
})

export default class FOIACoordinator extends Vue {
  private addressTypes = {
    USA: "US",
    MIL: "MILITARY",
    FOR: "FOREIGN",
  };
  
  private selectedAddressType = this.addressTypes.USA;
  public streetAddress1 = "";
  public streetAddress2 = "";
  public city = "";
  public stateOrProvince = "";
  public zipCode = "";

  private addressTypeOptions: RadioButton[] = [
    {
      id: "USAddress",
      label: "U.S. address",
      value: this.addressTypes.USA,
    },
    {
      id: "MilitaryAddress",
      label: "Military/Diplomatic (APO, FPO, or DPO)",
      value: this.addressTypes.MIL,
    },
    {
      id: "ForeignAddress",
      label: "Foreign address",
      value: this.addressTypes.FOR,
    },
  ];

  private selectedMilitaryPO: SelectData = { text: "", value: "" };
  private militaryPostOfficeOptions: SelectData[] = [
    { text: "Army Post Office (APO)", value: "APO" },
    { text: "Fleet Post Office (FPO)", value: "FPO" },
    { text: "Diplomatic Post Office (DPO)", value: "DPO" },
  ];

  private selectedStateCode: SelectData = { text: "", value: "" };
  private stateCodeListData: SelectData[] = [
    { text: "AA - Armed Forces Americas", value: "AA" },
    { text: "AE - Armed Forces Europe", value: "AE" },
    { text: "AP - Armed Forces Pacific", value: "AP" },
  ];

  private selectedState: SelectData = { text: "", value: "" };
  private stateListData: SelectData[] = AcquisitionPackage.stateListData;

  private selectedCountry = this.addressTypes.USA;
  private selectedCountryData: SelectData = { text: "", value: "" };

  public countryListData: SelectData[] = [{ text: "", value: "" }];
  public async mounted(): Promise<void> {
    this.countryListData = await AcquisitionPackage.getCountryListData(["US"]);
  }


}
</script>
