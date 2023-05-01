
<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Tell us more about your Contracting Office
          </h1>
          <div class="copy-max-width">
            <p class="mb-6">
              We’ll use your responses below to pre-fill your Contracting
              Office’s information on documents, where applicable.
            </p>
          </div>
          <div>
            <section id="Section2">
              <ATATTextField
                id="ContractingOffice"
                label="Contracting Office name"
                class="_input-max-width mb-10"
                :value.sync="name"
                :rules="[$validators.required('Please enter the contracting office name.')]"
              />

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
                :requiredFields='[
                {field:"StreetAddress", message: "Please enter an address."},
                {field:"City", message:  "Enter a city."},
              {field:"State" , message: "Select a state code."},
              {field:"ZIPCode" , message: "Please enter a ZIP code."},
              {
                field:"APO_FPO_DPO",
                message: "Select a military or diplomatic post office (APO, FPO, or DPO)."
                },
              {field:"StateCode", message:  "Select a state code."},
              {field:"StateProvince", message: "Enter a state/province."},
              {field:"Country", message: "Select a country."},
              {field:"PostalCode" , message: "Please enter a postal code."},
              ]'
                :isValidRules='[
                {
                  field:"ZIPCode",
                  message: "Your ZIP code must be 5 or 9 digits.",
                  mask:["99999", "99999-9999"],
                  },
                {
                  field:"PostalCode",
                  message: "Your postal code must be 10 characters or " +
                  "less and may include spaces and hyphens.",
                  mask:["^[0-9A-Za-z\\s\\-]{1,10}$"],
                  isMaskRegex: true
                }
              ]'
                :addressTypeOptions="addressTypeOptions"
                :addressTypes="addressTypes"
                :militaryPostOfficeOptions="militaryPostOfficeOptions"
                :stateListData="stateListData"
                :stateCodeListData="stateCodeListData"
                :countryListData="countryListData"
              />
            </section>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Watch, Mixins } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import {convertSystemChoiceToSelect, convertAgencyRecordToSelect } from "@/helpers";

import ATATAddressForm from "@/components/ATATAddressForm.vue";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATTextField from "../../components/ATATTextField.vue";

import { RadioButton, SelectData } from "types/Global";

import AcquisitionPackage, {StoreProperties} from "@/store/acquisitionPackage";
import { AddressDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import OrganizationData from "@/store/organizationData";
import ContactData from "@/store/contactData";


@Component({
  components: {
    ATATAddressForm,
    ATATAutoComplete,
    ATATDialog,
    ATATTextField,
  },
})

export default class ContractingOfficeInfo extends Mixins(SaveOnLeave) {

  get inputClass(): string {
    return this.$vuetify.breakpoint.mdAndDown
      ? "_input-max-width my-2"
      : "my-2";
  }

  // data
  private emptySelectData: SelectData = { text: "", value: "" };
  private addressTypes = {
    USA: "US",
    MIL: "MILITARY",
    FOR: "FOREIGN",
  };

  private name = "";
  private dodAddressCode = "";
  private selectedAddressType = "";
  private streetAddress1 = "";
  private streetAddress2 = "";
  private city = "";
  private zipCode = "";
  private stateOrProvince = "";
  private country = "";

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

  private selectedMilitaryPO: SelectData = { text: "", value: ""};
  private militaryPostOfficeOptions: SelectData[] = [
    { text: "Army Post Office (APO)", value: "APO" },
    { text: "Fleet Post Office (FPO)", value: "FPO" },
    { text: "Diplomatic Post Office (DPO)", value: "DPO" },
  ];

  private selectedStateCode: SelectData = { text: "", value: ""};
  private stateCodeListData: SelectData[] = [
    { text: "AA - Armed Forces Americas", value: "AA" },
    { text: "AE - Armed Forces Europe", value: "AE" },
    { text: "AP - Armed Forces Pacific", value: "AP" },
  ];

  private selectedState: SelectData = { text: "", value: ""};
  private stateListData: SelectData[] = [];
  private setSelectedData(): void {
    // Foreign addresses set country obj
    if (this.selectedAddressType === this.addressTypes.FOR) {
      this.selectedCountry =
        this.countryListData.find((c) => c.value === this.savedData.country.value)
        || this.emptySelectData;
      this.stateOrProvince = this.savedData.state_province_state_code
    } else {
      // US or Military addreses - set country obj to USA

      const US = this.countryListData.
        find((c) => c.text === "United States of America")|| {};
      this.selectedCountry = {text:US.text, value:US.value}

      // Military addresses - set selectedStateCode and selectedMilitaryPO
      if (this.selectedAddressType === this.addressTypes.MIL && this.stateCodeListData) {
        this.selectedStateCode =
          this.stateCodeListData.find((s) => s.value === this.savedData.state_province_state_code)
          || this.emptySelectData;

        this.selectedMilitaryPO =
          this.militaryPostOfficeOptions.find((p) => p.value === this.city)
          || this.emptySelectData;

        // US addresses - set selectedState
      } else if (this.selectedAddressType === this.addressTypes.USA && this.stateListData) {
        if(this.savedData.state_province_state_code === ""){
          return
        }
        this.selectedState =
          this.stateListData.find(
            (stateObj) => stateObj.value === this.savedData.state_province_state_code)
          || this.emptySelectData;
      }
    }
  }

  private selectedCountry: SelectData = {text: "", value: ""};

  public countryListData: SelectData[] = [{text: "", value: ""}];
  public async mounted(): Promise<void> {
    this.countryListData = ContactData.countryChoices;
    await this.loadOnEnter();
    this.setSelectedData();
  }

  private get currentData(): AddressDTO {
    let state = "";
    let city = this.city;
    if (this.selectedAddressType == this.addressTypes.USA) {
      state = this.selectedState.value as string;
    } else if (this.selectedAddressType == this.addressTypes.FOR) {
      state = this.stateOrProvince;
    } else if (this.selectedAddressType == this.addressTypes.MIL) {
      state = this.selectedStateCode.value as string;
      city = this.selectedMilitaryPO.value as string;
    }

    return {
      apo_fpo_cpo: this.selectedMilitaryPO.value,
      country: this.selectedCountry.value,
      address_type: this.selectedAddressType,
      category: "CONTRACTING_OFFICE",
      city: city,
      zip_postal_code: this.zipCode,
      acquisition_package: AcquisitionPackage.packageId,
      street_address_1: this.streetAddress1,
      unit: this.streetAddress2,
      state_province_state_code: state,
      name: this.name,
      aa_ae_ap: this.selectedStateCode.value
    };
  }

  private savedData = {
    apo_fpo_cpo: "",
    country: "",
    address_type: "",
    category: "",
    city: "",
    zip_postal_code: "",
    acquisition_package: "",
    street_address_1: "",
    unit: "",
    state_province_state_code: "",
    name: "",
    aa_ae_ap:""
  } as Record<string, any>

  // methods

  public async loadOnEnter(): Promise<void> {
    this.stateListData = ContactData.stateChoices;
    this.selectedAddressType = this.addressTypes.USA
    const storeData = await AcquisitionPackage
      .loadData<AddressDTO>({storeProperty:
        StoreProperties.ContractingShopNonDitcoAddress}) as Record<string, any>;
    if (storeData) {
      this.name = storeData.name;

      const selectedAddressTypeIndx = this.addressTypeOptions.findIndex(
        (options) => options.value === storeData.address_type
      );

      this.selectedAddressType =
        selectedAddressTypeIndx > -1
          ? this.addressTypeOptions[selectedAddressTypeIndx].value
          : "";

      this.streetAddress1 = storeData.street_address_1;
      this.streetAddress2 = storeData.unit;
      this.city = storeData.city;
      this.zipCode = storeData.zip_postal_code;
      this.savedData = storeData
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveData( {data: this.currentData,
          storeProperty: StoreProperties.ContractingShopNonDitcoAddress});
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}
</script>
