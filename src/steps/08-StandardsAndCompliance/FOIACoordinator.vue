<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">Tell us about your FOIA Coordinator</h1>

            <ATATTextField
              id="FullName"
              class="_input-max-width mb-10"
              label="Full name"
              helpText="Include rank, if applicable"
              :value.sync="fullName"
              :rules="[
                $validators.required(
                  'Please enter your FOIA coordinator’s full name.'
                ),
              ]"
            />

            <ATATTextField
              id="Email"
              class="_input-max-width mb-10"
              label="Email address"
              helpText="Enter a .mil or .gov email address."
              :value.sync="emailAddress"
              :rules="[
                $validators.required('Please enter your email address.'),
                $validators.isEmail(),
              ]"
            />

            <hr />

            <ATATAddressForm
              :addressTypeOptions="addressTypeOptions"
              :addressTypes="addressTypes"
              :city.sync="city"
              :countryListData="countryListData"
              :militaryPostOfficeOptions="militaryPostOfficeOptions"
              :minLength="[]"
              :requiredFields="[
                { field: 'StreetAddress', message: 'Please enter an address.' },
                { field: 'City', message: 'Please enter a city.' },
                { field: 'State', message: 'Please select a state.' },
                { field: 'ZIPCode', message: 'Please enter a ZIP code.' },
                {
                  field: 'APO_FPO_DPO',
                  message: 'Please select a military post office (APO or FPO).',
                },
                { field: 'StateCode', message: 'Please select a state code.' },
                {
                  field: 'StateProvince',
                  message: 'Please enter a state/province.',
                },
                { field: 'Country', message: 'Please select a country.' },
                { field: 'PostalCode', message: 'Please enter a postal code.' },
              ]"
              :isValidRules="[
                {
                  field: 'ZIPCode',
                  message: 'Your ZIP code must be 5 or 9 digits.',
                  mask: ['99999', '99999-9999'],
                },
                {
                  field: 'PostalCode',
                  message:
                    'Your postal code must be 10 characters or ' +
                    'less and may include spaces and hyphens.',
                  mask: ['^[A-Za-z0-9- ]{0,10}$'],
                  isMaskRegex: true,
                },
              ]"
              :selectedAddressType.sync="selectedAddressType"
              :selectedCountry.sync="selectedCountry"
              :selectedMilitaryPO.sync="selectedMilitaryPO"
              :selectedState.sync="selectedState"
              :selectedStateCode.sync="selectedStateCode"
              :stateCodeListData="stateCodeListData"
              :stateListData="stateListData"
              :stateOrProvince.sync="stateOrProvince"
              :streetAddress1.sync="streetAddress1"
              :streetAddress2.sync="streetAddress2"
              :zipCode.sync="zipCode"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";

import ATATAddressForm from "@/components/ATATAddressForm.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { SensitiveInformationDTO } from "@/api/models";
import { hasChanges } from "@/helpers";

import { RadioButton, SelectData } from "../../../types/Global";
import ContactData from "@/store/contactData";

@Component({
  components: {
    ATATAddressForm,
    ATATRadioGroup,
    ATATTextField,
  },
})
export default class FOIACoordinator extends Mixins(SaveOnLeave) {
  private addressTypes = {
    USA: "US",
    MIL: "MILITARY",
    FOR: "FOREIGN",
  };

  private emptySelectData: SelectData = { text: "", value: "" };

  private fullName =
    AcquisitionPackage.sensitiveInformation?.foia_full_name || "";

  private emailAddress =
    AcquisitionPackage.sensitiveInformation?.foia_email || "";

  private selectedAddressType =
    AcquisitionPackage.sensitiveInformation?.foia_address_type ||
    this.addressTypes.USA;

  public streetAddress1 =
    AcquisitionPackage.sensitiveInformation?.foia_street_address_1 || "";

  public streetAddress2 =
    AcquisitionPackage.sensitiveInformation?.foia_street_address_2 || "";

  public city =
    AcquisitionPackage.sensitiveInformation?.foia_city_apo_fpo || "";

  public stateOrProvince =
    AcquisitionPackage.sensitiveInformation?.foia_state_province_state_code ||
    "";

  public zipCode =
    AcquisitionPackage.sensitiveInformation?.foia_zip_postal_code || "";

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

  private selectedMilitaryPO: SelectData = this.emptySelectData;
  private militaryPostOfficeOptions: SelectData[] = [
    { text: "Army Post Office (APO)", value: "APO" },
    { text: "Fleet Post Office (FPO)", value: "FPO" },
    { text: "Diplomatic Post Office (DPO)", value: "DPO" },
  ];

  private selectedStateCode: SelectData = this.emptySelectData;
  private stateCodeListData: SelectData[] = [
    { text: "AA - Armed Forces Americas", value: "AA" },
    { text: "AE - Armed Forces Europe", value: "AE" },
    { text: "AP - Armed Forces Pacific", value: "AP" },
  ];

  private selectedCountry: SelectData = this.emptySelectData;

  private stateListData: SelectData[] = [];

  private setSelectedData(): void {
    // Foreign addresses set country obj
    if (this.selectedAddressType === this.addressTypes.FOR) {
      this.selectedCountry =
        this.countryListData.find(
          (c) => c.text === this.savedData?.foia_country
        ) || this.emptySelectData;
    } else {
      // US or Military addreses - set country obj to USA
      this.selectedCountry = { text: "United States of America", value: "US" };

      // Military addresses - set selectedStateCode and selectedMilitaryPO
      if (
        this.selectedAddressType === this.addressTypes.MIL &&
        this.stateCodeListData
      ) {
        this.selectedStateCode =
          this.stateCodeListData.find(
            (s) => s.value === this.stateOrProvince
          ) || this.emptySelectData;

        this.selectedMilitaryPO =
          this.militaryPostOfficeOptions.find((p) => p.value === this.city) ||
          this.emptySelectData;

        // US addresses - set selectedState
      } else if (
        this.selectedAddressType === this.addressTypes.USA &&
        this.stateListData
      ) {
        this.selectedState =
          this.stateListData.find(
            (stateObj) => stateObj.value === this.stateOrProvince
          ) || this.emptySelectData;
      }
    }
  }

  private selectedState: SelectData = this.emptySelectData;

  private get currentData(): SensitiveInformationDTO {
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
      foia_full_name: this.fullName,
      foia_email: this.emailAddress,
      foia_address_type: this.selectedAddressType,
      foia_city_apo_fpo: city,
      foia_street_address_1: this.streetAddress1,
      foia_street_address_2: this.streetAddress2,
      foia_state_province_state_code: state,
      foia_zip_postal_code: this.zipCode,
      foia_country: this.selectedCountry.text,
      acquisition_package: AcquisitionPackage.packageId
    };
  }

  private savedData = {
    foia_full_name: "",
    foia_email: "",
    foia_address_type: "",
    foia_city_apo_fpo: "",
    foia_street_address_1: "",
    foia_street_address_2: "",
    foia_state_province_state_code: "",
    foia_zip_postal_code: "",
    foia_country: "",
  } as Record<string, string>;

  public countryListData: SelectData[] = [this.emptySelectData];

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.setSelectedData();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData =
      (await AcquisitionPackage.loadSensitiveInformation()) as Record<
        string,
        string
      >;
    this.stateListData = ContactData.stateChoices;
    this.countryListData = ContactData.countryListData(["US"]);

    if (storeData) {
      const keys: string[] = [
        "foia_full_name",
        "foia_email",
        "foia_address_type",
        "foia_city_apo_fpo",
        "foia_street_address_1",
        "foia_street_address_2",
        "foia_state_province_state_code",
        "foia_zip_postal_code",
        "foia_country",
      ];
      keys.forEach((key: string) => {
        if (Object.prototype.hasOwnProperty.call(storeData, key)) {
          this.savedData[key] = storeData[key];
        }
      });
    } else {
      AcquisitionPackage.saveData<SensitiveInformationDTO>({data: this.currentData, 
        storeProperty: StoreProperties.SensitiveInformation });
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage
          .saveData<SensitiveInformationDTO>( {data: this.currentData, 
            storeProperty: StoreProperties.SensitiveInformation});
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}
</script>
