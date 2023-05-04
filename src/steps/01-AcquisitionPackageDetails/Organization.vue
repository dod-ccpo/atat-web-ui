
<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Next, we’ll gather information about your organization
          </h1>

          <ATATAutoComplete
            id="Agency"
            class="_input-max-width mb-2"
            label="What service or agency are you affiliated with?"
            :label-sr-only="false"
            titleKey="text"
            :searchFields="['text']"
            :items="agencyData"
            :selectedItem.sync="selectedAgency"
            :rules="[$validators.required('Please select your agency or service.')]"
            placeholder="Find your agency or service"
            icon="arrow_drop_down"
          />

          <div v-if="selectedAgency" class="mt-10">
            <hr />
            <section id="Section1">
              <h2 class="form-section-heading">
                1. Tell us more about your organization
              </h2>
              <ATATAutoComplete
                id="DisaOrg"
                v-if="isAgencyDisa"
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
                v-if="!isAgencyDisa"
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
                activity, or organization that has the authority to request, contract 
                for, or fund/pay bills for materials and services."
                :value.sync="dodAddressCode"
                :rules="[
                  $validators.required('Please enter your 6-character DoDAAC.'), 
                  $validators.minLength(6, 'Your DoDAAC must be 6 characters.'),
                  $validators.maxLength(6, 'Your DoDAAC must be 6 characters.')
                ]"
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
        id="AddAgencyModal"
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
            level. If you would like to add your agency, please send us
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
  // computed

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

  private selectedMilitaryPO: SelectData = { text: "", value: ""};
  private militaryPostOfficeOptions: SelectData[] = [
    { text: "Army Post Office (APO)", value: "APO" },
    { text: "Fleet Post Office (FPO)", value: "FPO" },
    { text: "Diplomatic Post Office (DPO)", value: "DPO" },
  ];

  private selectedDisaOrg: SelectData = { text: "", value: ""};
  private disaOrgData: SelectData[] = [];
  private selectedAgency: SelectData = { text: "", value: ""};
  private agencyData: SelectData[] = [];

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

  private selectedCountry: SelectData = {text: "", value: ""};

  public countryListData: SelectData[] = [{text: "", value: ""}];
  public async mounted(): Promise<void> {
    this.countryListData = ContactData.countryListData(["US"]);
    await this.loadOnEnter();
    this.setSelectedData();
  }

  // getters
  get isAgencyDisa(): boolean{
    return (this.selectedAgency.text as string)?.toUpperCase().indexOf("DISA")> -1
  }
 
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
      disa_organization: this.selectedDisaOrg.value as string,
      organization_name: this.organizationName,
      dodaac: this.dodAddressCode,
      agency: this.selectedAgency.value as string,
      address_type: this.selectedAddressType,
      street_address_1: this.streetAddress1,
      street_address_2: this.streetAddress2,
      city,
      zip_code: this.zipCode,
      state,
      country: this.selectedCountry.text as string,
    };
  }

  private savedData = {
    disa_organization: "",
    organization_name: "",
    dodaac: "",
    agency: "",
    address_type: "",
    street_address_1: "",
    street_address_2: "",
    city: "",
    zip_code: "",
    state: "",
    country: "",
  } as Record<string, any>


  // watchers
  @Watch("selectedAgency")
  protected agencyChanged(newVal: SelectData): void {
    AcquisitionPackage.setSelectedAgency(newVal);
    
    //reset two attribs below depending on agency dropdown update
    this.selectedDisaOrg = this.isAgencyDisa ? this.selectedDisaOrg :  { text: "", value: ""};
    this.organizationName = this.isAgencyDisa ? "" : this.organizationName;
  }

  // methods

  public async loadOnEnter(): Promise<void> {
    this.agencyData = convertAgencyRecordToSelect(OrganizationData.agency_data);
    this.disaOrgData = convertSystemChoiceToSelect(OrganizationData.disa_org_data);
    this.stateListData = ContactData.stateChoices;
    const storeData = await AcquisitionPackage
      .loadData<OrganizationDTO>({storeProperty: 
      StoreProperties.Organization}) as Record<string, any>;

    if (storeData) {
      const keys: string[] = [
        "disa_organization",
        "organization_name",
        "dodaac",
        "agency",
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

      const selectedAgencyIndex = this.agencyData.findIndex(
        (svc) => svc.value === storeData.agency.value
      );

      if (selectedAgencyIndex > -1) {
        this.selectedAgency =
          this.agencyData[selectedAgencyIndex];
      }

      this.selectedDisaOrg = this.disaOrgData.find(
        (disaOrg) => disaOrg.value === storeData.disa_organization
      ) as SelectData

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
