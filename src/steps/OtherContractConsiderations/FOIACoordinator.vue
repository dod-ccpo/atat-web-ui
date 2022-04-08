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
            :value.sync="fullName"
          />

          <ATATTextField
            id="Email"
            class="_input-max-width mb-10"
            label="Email address"
            helpText="Enter a .mil or .gov email address."
            :value.sync="emailAddress"
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
import { Component, Mixins } from "vue-property-decorator";

import ATATAddressForm from "@/components/ATATAddressForm.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { SensitiveInformationDTO } from "@/models/OtherContractConsiderationsDTOs"
import { hasChanges } from "@/helpers";

import { RadioButton, SelectData } from "../../../types/Global";

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

  private fullName 
    = AcquisitionPackage.sensitiveInformation?.foia_full_name || "";

  private emailAddress 
    = AcquisitionPackage.sensitiveInformation?.foia_email || "";

  private selectedAddressType 
    = AcquisitionPackage.sensitiveInformation?.foia_address_type || this.addressTypes.USA;
  
  public streetAddress1 
    = AcquisitionPackage.sensitiveInformation?.foia_street_address_1 || "";

  public streetAddress2
    = AcquisitionPackage.sensitiveInformation?.foia_street_address_2 || "";

  public city 
    = AcquisitionPackage.sensitiveInformation?.foia_city_apo_fpo || "";

  public stateOrProvince
    = AcquisitionPackage.sensitiveInformation?.foia_state_province_state_code || "";

  public zipCode
    = AcquisitionPackage.sensitiveInformation?.foia_zip_postal_code || "";

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

  private selectedCountry = this.emptySelectData;

  private stateListData: SelectData[] = AcquisitionPackage.stateListData;

  private setSelectedData(): void {
    let foundSelectObj;

    // Foreign addresses set country obj
    if (this.selectedAddressType === this.addressTypes.FOR) {
      foundSelectObj = this.countryListData.find((countryObj) => {
        return countryObj.text === this.savedData?.foia_country;
      });
      this.selectedCountry = foundSelectObj || this.emptySelectData;
    } else {
      // US or Military addreses - set country obj to USA
      this.selectedCountry = { text: "United States of America", value: "US" };

      // Military addresses - set selectedStateCode and selectedMilitaryPO
      if (this.selectedAddressType === this.addressTypes.MIL && this.stateCodeListData) {
        foundSelectObj = this.stateCodeListData.find((stateCodeObj) => {
          return stateCodeObj.value === this.stateOrProvince;
        });
        this.selectedStateCode = foundSelectObj || this.emptySelectData
        
        if (this.militaryPostOfficeOptions) {
          foundSelectObj = this.militaryPostOfficeOptions.find((POObj) => {
            return POObj.value === this.city;
          });
          this.selectedMilitaryPO = foundSelectObj || this.emptySelectData;
        }

      // US addresses - set selectedState
      } else if (this.selectedAddressType === this.addressTypes.USA && this.stateListData) {
        foundSelectObj = this.stateListData.find((stateObj) => {
          return stateObj.text === this.stateOrProvince;
        });
        this.selectedState = foundSelectObj || this.emptySelectData      
      }
    }
  }

  private findSelectedStateObj(): SelectData {
    let foundStateObj;
    const stateData = this.selectedAddressType === this.addressTypes.MIL
      ? this.stateCodeListData
      : this.stateListData;
    foundStateObj = stateData.find((stateObj) => {
      return stateObj.text === this.stateOrProvince;
    });
    return foundStateObj || this.emptySelectData;
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
  } as Record<string, string>


  public countryListData: SelectData[] = [this.emptySelectData];
  
  public async mounted(): Promise<void> {
    this.countryListData = await AcquisitionPackage.getCountryListData(["US"]);
    await this.loadOnEnter();
    this.setSelectedData();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData 
      = await AcquisitionPackage.loadSensitiveInformation() as Record<string, string>;

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
      AcquisitionPackage.setSensitiveInformation(this.currentData);
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveSensitiveInformation(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }


}
</script>
