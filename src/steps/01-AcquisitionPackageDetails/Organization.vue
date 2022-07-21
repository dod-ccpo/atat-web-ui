
<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header">
          Next, we’ll gather information about your organization
        </h1>

        <ATATAutoComplete
          id="ServiceOrAgency"
          class="_input-max-width mb-2"
          label="What service or agency do you work for?"
          :label-sr-only="false"
          titleKey="text"
          :searchFields="['text']"
          :items="serviceOrAgencyData"
          :selectedItem.sync="selectedServiceOrAgency"
          :rules="[$validators.required('Please select your service or agency.')]"
          placeholder="Find your service/agency"
          icon="arrow_drop_down"
        />

        <a
          role="button"
          id="RequestAgencyAdded"
          class="_text-link"
          :class="{ 'mb-10 d-inline-block': !selectedServiceOrAgency }"
          @click="showDialog = true"
        >
          Request to have your agency added
        </a>

        <div v-show="selectedServiceOrAgency" class="mt-10">
          <hr />
          <section id="Section1">
            <h2 class="form-section-heading">
              1. Tell us more about your organization
            </h2>
            <ATATAutoComplete
              id="DisaOrg"
              v-show="
                selectedServiceOrAgency &&
                selectedServiceOrAgency.value === this.DisaOrgName
              "
              class="_input-max-width mb-10"
              label="DISA Organization"
              :label-sr-only="false"
              titleKey="text"
              :searchFields="['text']"
              :items="disaOrgData"
              :selectedItem.sync="selectedDisaOrg"
              :rules="[$validators.required('Please select your DISA Organization.')]"
              placeholder="Find your DISA organization"
              icon="arrow_drop_down"
            />

            <ATATTextField
              id="OrgName"
              v-show="
                selectedServiceOrAgency &&
                selectedServiceOrAgency.value !== this.DisaOrgName
              "
              label="Organization name"
              class="_input-max-width mb-10"
              :value.sync="organizationName"
              :rules="[$validators.required('Please enter your organization name.'),
              $validators.maxLength(80, 'Organization name cannot exceed 80 characters.')]"
            />

            <ATATTextField
              id="DoDAAC"
              label="DoD Activity Address Code (DoDAAC)"
              class="_input-max-width"
              tooltipText="A DoDAAC is a 6-character code that uniquely identifies a unit, 
              activity, or organization that has the authority to requisition, contract 
              for, or fund/pay bills for materials and services."
              :value.sync="dodAddressCode"
              :rules="[$validators.required('Please enter your 6-character DoDAAC.'), 
              $validators.minLength(6, 'Your DoDAAC must be 6 characters.'),
              $validators.maxLength(6, 'Your DoDAAC must be 6 characters.')]"
            />

            <hr />
          </section>

          <section id="Section2">
            <h2 class="form-section-heading">
              2. What is your organization’s address?
            </h2>

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
              {field:"City", message:  "Please enter a city."},
             {field:"State" , message: "Please select a state."},
             {field:"ZIPCode" , message: "Please enter a ZIP code."},
             {
               field:"APO_FPO_DPO",
               message: "Please select a military post office (APO or FPO)."
               },
             {field:"StateCode", message:  "Please select a state code."},
             {field:"StateProvince", message: "Please enter a state/province."},
             {field:"Country", message: "Please select a country."},
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

    <ATATDialog
      :showDialog.sync="showDialog"
      title="Request to add your agency"
      persistent
      no-click-animation
      okText="Send Request"
      width="632"
      :OKDisabled="true"
    >
      <template #content>
        <p class="body">
          The agency list is intended to represent activities at the highest
          level. If you would like to add your service or agency, please send us
          the following information for consideration.
        </p>
        <ATATTextField
          id="AgencyOrgName"
          label="Agency/Organization Name"
          :class="[inputClass, 'pb-16 mb-9']"
        />
      </template>
    </ATATDialog>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Watch, Mixins } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import {convertSystemChoiceToSelect} from "@/helpers";

import ATATAddressForm from "@/components/ATATAddressForm.vue";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATTextField from "../../components/ATATTextField.vue";

import { RadioButton, SelectData } from "types/Global";

import AcquisitionPackage, {StoreProperties} from "@/store/acquisitionPackage";
import { OrganizationDTO } from "@/api/models";
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

export default class OrganizationInfo extends Mixins(SaveOnLeave) {
  // // computed

  get inputClass(): string {
    return this.$vuetify.breakpoint.mdAndDown
      ? "_input-max-width my-2"
      : "my-2";
  }

  // data
  private emptySelectData: SelectData = { text: "", value: "" };

  private DisaOrgName = "DEFENSE_INFORMATION_SYSTEMS_AGENCY";

  private addressTypes = {
    USA: "US",
    MIL: "MILITARY",
    FOR: "FOREIGN",
  };

  private organizationName = "";
  private dodAddressCode = "";
  private selectedAddressType = "";
  private streetAddress1 = "";
  private streetAddress2 = "";
  private city = "";
  private zipCode = "";
  private stateOrProvince = "";
  private country = "";
  private showDialog = false;

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

  private selectedDisaOrg: SelectData = this.emptySelectData;
  private disaOrgData: SelectData[] = [];
  private selectedServiceOrAgency: SelectData = this.emptySelectData;
  private serviceOrAgencyData: SelectData[] = [];

  private selectedStateCode: SelectData = this.emptySelectData;
  private stateCodeListData: SelectData[] = [
    { text: "AA - Armed Forces Americas", value: "AA" },
    { text: "AE - Armed Forces Europe", value: "AE" },
    { text: "AP - Armed Forces Pacific", value: "AP" },
  ];

  private selectedState: SelectData = this.emptySelectData;
  private stateListData: SelectData[] = [];
  private setSelectedData(): void {
    // Foreign addresses set country obj
    if (this.selectedAddressType === this.addressTypes.FOR) {
      this.selectedCountry = 
        this.countryListData.find((c) => c.text === this.savedData?.country)
        || this.emptySelectData;
    } else {
      // US or Military addreses - set country obj to USA
      this.selectedCountry = { text: "United States of America", value: "US" };

      // Military addresses - set selectedStateCode and selectedMilitaryPO
      if (this.selectedAddressType === this.addressTypes.MIL && this.stateCodeListData) {
        this.selectedStateCode = 
          this.stateCodeListData.find((s) => s.value === this.stateOrProvince)
          || this.emptySelectData;
        
        this.selectedMilitaryPO = 
          this.militaryPostOfficeOptions.find((p) => p.value === this.city)
          || this.emptySelectData;

      // US addresses - set selectedState
      } else if (this.selectedAddressType === this.addressTypes.USA && this.stateListData) {
        this.selectedState = 
          this.stateListData.find((stateObj) => stateObj.value === this.stateOrProvince) 
          || this.emptySelectData;
      }
    }
  }

  private selectedCountry: SelectData = this.emptySelectData;

  public countryListData: SelectData[] = [this.emptySelectData];
  public async mounted(): Promise<void> {
    this.countryListData = ContactData.countryListData(["US"]);
    await this.loadOnEnter();
    this.setSelectedData();
  }

  // getters
  private get currentData(): OrganizationDTO {
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
      disa_organization: this.selectedDisaOrg.value || "",
      organization_name: this.organizationName,
      dodaac: this.dodAddressCode,
      service_agency: this.selectedServiceOrAgency.value || "",
      address_type: this.selectedAddressType,
      street_address_1: this.streetAddress1,
      street_address_2: this.streetAddress2,
      city,
      zip_code: this.zipCode,
      state,
      country: this.selectedCountry.text,
    };
  }

  private savedData = {
    disa_organization: "",
    organization_name: "",
    dodaac: "",
    service_agency: "",
    address_type: "",
    street_address_1: "",
    street_address_2: "",
    city: "",
    zip_code: "",
    state: "",
    country: "",
  } as Record<string, string>


  // watchers
  @Watch("selectedServiceOrAgency")
  protected serviceOrAgencyChanged(newVal: SelectData): void {
    AcquisitionPackage.setSelectedServiceOrAgency(newVal);
  }

  // methods

  public async loadOnEnter(): Promise<void> {
    this.serviceOrAgencyData = convertSystemChoiceToSelect(OrganizationData.service_agency_data);
    this.disaOrgData = convertSystemChoiceToSelect(OrganizationData.disa_org_data);
    this.stateListData = ContactData.stateChoices;
    const storeData = await AcquisitionPackage
      .loadData<OrganizationDTO>({storeProperty: 
      StoreProperties.Organization}) as Record<string, string>;

    if (storeData) {
      const keys: string[] = [
        "disa_organization",
        "organization_name",
        "dodaac",
        "service_agency",
        "address_type",
        "street_address_1",
        "street_address_2",
        "city",
        "zip_code",
        "state",
        "country",        
      ];
      keys.forEach((key: string) => {
        if (Object.prototype.hasOwnProperty.call(storeData, key)) {
          this.savedData[key] = storeData[key];
        }
      });

      const selectedAgencyIndex = this.serviceOrAgencyData.findIndex(
        (svc) => svc.value === storeData.service_agency
      );

      if (selectedAgencyIndex > -1) {
        this.selectedServiceOrAgency =
          this.serviceOrAgencyData[selectedAgencyIndex];
      }

      const selectedDisaOrgIndx = this.disaOrgData.findIndex(
        (org) => org.value === storeData.disa_organization
      );

      if (selectedDisaOrgIndx > -1) {
        this.selectedDisaOrg = this.disaOrgData[selectedDisaOrgIndx];
      }

      this.organizationName = storeData.organization_name;
      this.dodAddressCode = storeData.dodaac;

      const selectedAddressTypeIndx = this.addressTypeOptions.findIndex(
        (options) => options.value === storeData.address_type
      );

      this.selectedAddressType =
        selectedAddressTypeIndx > -1
          ? this.addressTypeOptions[selectedAddressTypeIndx].value
          : "";
          
      this.streetAddress1 = storeData.street_address_1;
      this.streetAddress2 = storeData.street_address_2;
      this.city = storeData.city;
      this.zipCode = storeData.zip_code;
      this.stateOrProvince = storeData.state;

    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveData( {data: this.currentData, 
          storeProperty: StoreProperties.Organization});
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}
</script>
