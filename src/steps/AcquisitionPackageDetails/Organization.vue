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
            />

            <ATATTextField
              id="DoDAAC"
              label="DoD Activity Address Code (DoDAAC)"
              class="_input-max-width"
              tooltipText="A DoDAAC is a 6-character code that uniquely identifies a unit, activity, or organization that has the authority to requisition, contract for, or fund/pay bills for materials and services."
              :value.sync="dodAddressCode"
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
              :selectedCountryData.sync="selectedCountryData"

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
      :disabled="true"
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
import { Component, Watch, Mixins } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";

import ATATAddressForm from "@/components/ATATAddressForm.vue";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATTextField from "../../components/ATATTextField.vue";

import { RadioButton, SelectData } from "types/Global";

import AcquisitionPackage from "@/store/acquisitionPackage";
import { OrganizationDTO } from "@/models/OrganizationDTO";
import { hasChanges } from "@/helpers";

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

  private DisaOrgName = "DEFENSE_INFORMATION_SYSTEMS_AGENCY";

  private addressTypes = {
    USA: "US",
    MIL: "MILITARY",
    FOR: "FOREIGN",
  };

  private organizationName = "";
  private dodAddressCode = "";
  private selectedAddressType = this.addressTypes.USA;
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
      label: "Military (APO or FPO)",
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
  ];

  private selectedDisaOrg: SelectData = { text: "", value: "" };
  private disaOrgData: SelectData[] = AcquisitionPackage.disaOrgData;

  private selectedServiceOrAgency: SelectData = { text: "", value: "" };
  private serviceOrAgencyData: SelectData[] =
    AcquisitionPackage.serviceOrAgencyData;

  private selectedStateCode: SelectData = { text: "", value: "" };
  private stateCodeListData: SelectData[] = [
    { text: "AA - Armed Forces Americas", value: "AA" },
    { text: "AE - Armed Forces Europe", value: "AE" },
    { text: "AP - Armed Forces Pacific", value: "AP" },
  ];

  private selectedState: SelectData = { text: "", value: "" };
  private stateListData: SelectData[] = AcquisitionPackage.stateListData;

  // EJY todo - remove this, rename selectedCountryData to selectedCountry 
  // - now returning an obj from ATATAddress.vue
  private selectedCountry = this.addressTypes.USA; 
  private selectedCountryData: SelectData = { text: "", value: "" };

  public countryListData: SelectData[] = [{ text: "", value: "" }];
  public async mounted(): Promise<void> {
    this.countryListData = await AcquisitionPackage.getCountryListData(["US"]);
    await this.loadOnEnter();
  }

  // getters
  private get current(): OrganizationDTO {
    let state = "";
    let city = this.city;
    let country = this.country;

    if (this.selectedAddressType == this.addressTypes.USA) {
      state = this.selectedState.value as string;
    }

    if (this.selectedAddressType == this.addressTypes.FOR) {
      state = this.stateOrProvince;
      country = this.selectedCountryData.text;
    }

    if (this.selectedAddressType == this.addressTypes.MIL) {
      state = this.selectedStateCode.value as string;
      city = this.selectedMilitaryPO.value as string;
    }

    const data: OrganizationDTO = {
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
      country,
    };

    return data;
  }

  private get saved(): OrganizationDTO {
    const {
      disa_organization,
      organization_name,
      dodaac,
      service_agency,
      address_type,
      street_address_1,
      street_address_2,
      city,
      zip_code,
      state,
      country,
    } = AcquisitionPackage.organization as OrganizationDTO;

    return {
      disa_organization,
      organization_name,
      dodaac,
      service_agency,
      address_type,
      street_address_1,
      street_address_2,
      city,
      zip_code,
      state,
      country,
    };
  }

  // watchers
  @Watch("selectedServiceOrAgency")
  protected serviceOrAgencyChanged(newVal: SelectData): void {
    AcquisitionPackage.setSelectedServiceOrAgency(newVal);
  }

  // methods

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadOrganization();

    if (storeData) {
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
          : this.addressTypes.USA;
      this.streetAddress1 = storeData.street_address_1;
      this.streetAddress2 = storeData.street_address_2;
      this.city = storeData.city;

      if (this.selectedAddressType === this.addressTypes.USA) {
        const selectedStateIndex = this.stateListData.findIndex(
          (state) => state.value === storeData.state
        );
        if (selectedStateIndex > -1) {
          this.selectedState = this.stateListData[selectedStateIndex];
        }
      }

      if (this.selectedAddressType === this.addressTypes.MIL) {
        const selectedMilitaryPoIndx = this.militaryPostOfficeOptions.findIndex(
          (po) => po.value === this.city
        );
        if (selectedMilitaryPoIndx > -1) {
          this.selectedMilitaryPO =
            this.militaryPostOfficeOptions[selectedMilitaryPoIndx];
        }
        const selectedStateCodeIndx = this.stateCodeListData.findIndex(
          (state) => state.value == storeData.state
        );
        if (selectedStateCodeIndx > -1) {
          this.selectedStateCode =
            this.stateCodeListData[selectedStateCodeIndx];
        }
      }

      if (this.selectedAddressType === this.addressTypes.FOR) {
        const selectedCountryIndx = this.countryListData.findIndex(
          (country) => country.text === storeData.country
        );
        if (selectedCountryIndx > -1) {
          this.selectedCountryData = this.countryListData[selectedCountryIndx];
          this.selectedCountry = this.selectedCountryData.text;
        }
        this.stateOrProvince = storeData.state;
      }

      this.zipCode = storeData.zip_code;
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.current, this.saved);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveOrganization(this.current);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}
</script>
