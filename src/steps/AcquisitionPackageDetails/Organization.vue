<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header">
          Next, we’ll gather information about your organization
        </h1>

        <ATATAutoComplete
          id="ServiceOrAgency"
          class="input-max-width mb-2"
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
          class="text-link"
          :class="{ 'mb-10 d-inline-block': !selectedServiceOrAgency}"
          @click="showDialog = true"
        >
          Request to have your agency added
        </a>

        <div v-show="selectedServiceOrAgency" class="mt-10">
          <hr/>
          <section id="Section1">
            <h2 class="form-section-heading">1. Tell us more about your organization</h2>
            <ATATAutoComplete
              id="DisaOrg"
              v-show="selectedServiceOrAgency && selectedServiceOrAgency.value === 'DISA'"
              class="input-max-width mb-10"
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
              v-show="selectedServiceOrAgency && selectedServiceOrAgency.value !== 'DISA'"
              label="Organization name"
              class="input-max-width mb-10"
            />

            <ATATTextField
              id="DoDAAC"
              label="DoD Activity Address Code (DoDAAC)"
              class="input-max-width"
              tooltipText="A DoDAAC is a 6-character code that uniquely identifies a unit, activity, or organization that has the authority to requisition, contract for, or fund/pay bills for materials and services."
            />

            <hr/>
          </section>

          <section id="Section2">
            <h2 class="form-section-heading">2. What is your organization’s address?</h2>

            <ATATRadioGroup
              id="AddressType"
              legend="Type of mailing address"
              :value.sync="selectedAddressType"
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
                />
              </v-col>
              <v-col class="col-12 col-lg-3">
                <ATATTextField
                  id="UnitSuite"
                  label="Unit, suite, etc."
                  :optional="true"
                  :class="inputClass"
                  width="160px"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col 
                class="col-12"
                :class="[selectedAddressType !== 'FOR' ? 'col-lg-5' : 'col-lg-4']"
              >
                <ATATTextField
                  v-show="selectedAddressType !== 'MIL'"
                  id="City"
                  label="City"
                  :class="inputClass"
                />
                <ATATSelect
                  v-show="selectedAddressType === 'MIL'"
                  id="APO_FPO"
                  label="APO/FPO"
                  v-model="selectedMilitaryPO"
                  :class="inputClass"
                  :items="militaryPostOfficeOptions"
                  :selectedValue.sync="selectedMilitaryPO"
                  :returnObject="true"
                />
              </v-col>
              <v-col 
                class="col-12"
                :class="[selectedAddressType !== 'FOR' ? 'col-lg-3' : 'col-lg-4']"
              >
                <ATATAutoComplete
                  id="State"
                  label="State"
                  v-show="selectedAddressType === 'USA'"
                  :class="inputClass"
                  titleKey="text"
                  :searchFields="['text', 'value']"
                  :items="stateListData"
                  :selectedItem.sync="selectedState"
                  placeholder=""
                  icon="arrow_drop_down"
                />

                <ATATSelect
                  v-show="selectedAddressType === 'MIL'"
                  id="StateCode"
                  label="State code"
                  v-model="selectedStateCode"
                  :class="inputClass"
                  :items="stateCodeListData"
                  :selectedValue.sync="selectedStateCode"
                  :returnObject="true"
                />

                <ATATTextField
                  v-show="selectedAddressType === 'FOR'"
                  id="StateProvince"
                  label="State or Province"
                  :class="inputClass"
                />
              </v-col>
              <v-col class="col-12 col-lg-3">
                <ATATTextField
                  id="ZIP"
                  :label="zipLabel"
                  :class="inputClass"
                  width="160px"
                />
              </v-col>
            </v-row>
            <v-row v-show="selectedAddressType === 'FOR'">
              <v-col class="col-12 col-lg-4">
                <ATATAutoComplete
                  id="Country"
                  label="Country"
                  :class="inputClass"
                  titleKey="text"
                  :searchFields="['text', 'value']"
                  :items="countryListData"
                  :selectedItem.sync="selectedCountry"
                  placeholder=""
                  icon="arrow_drop_down"
                />
              </v-col>
            </v-row>
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
      width="632px"
      :disabled="true"
    >
      <template #content>
        <p class="body">
          The agency list is intended to represent activities at the highest level. If you would like to add your
          service or agency, please send us the following information for consideration.
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
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATRadioGroup from "../../components/ATATRadioGroup.vue"
import ATATSelect from "../../components/ATATSelect.vue";
import ATATTextField from "../../components/ATATTextField.vue";

import { RadioButton, SelectData } from "types/Global";

import AcquisitionPackage from "@/store/acquisitionPackage";


@Component({
  components: {
    ATATAutoComplete,
    ATATDialog,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
  }
})

export default class OrganizationInfo extends Vue {
  
  // computed
  get inputClass(): string {
    return this.$vuetify.breakpoint.mdAndDown ? "input-max-width my-2" : "my-2";
  }

  get zipLabel(): string {
    return this.selectedAddressType !== "FOR" ? "ZIP code" : "Postal Code";
  }

  // data
  private selectedAddressType = "USA";
  private showDialog = false;

  private addressTypeOptions: RadioButton[] = [
    {
      id: "USAddress",
      label: "U.S. address",
      value: "USA",
    },
    {
      id: "MilitaryAddress",
      label: "Military",
      value: "MIL",
    },
    {
      id: "ForeignAddress",
      label: "Foreign address",
      value: "FOR",
    },
  ];

  private selectedMilitaryPO: SelectData = { text: "", value: "" };
  private militaryPostOfficeOptions: SelectData[] = [
    { text: "Army Post Office (APO)", value: "APO" },
    { text: "Fleet Post Office (FPO)", value: "FPO" },
  ];

  private selectedDisaOrg: SelectData = { text: "", value: "" };
  private disaOrgData: SelectData[] = AcquisitionPackage.disaOrgData;

  @Watch("selectedServiceOrAgency")
  protected serviceOrAgencyChanged(newVal: SelectData): void {
    AcquisitionPackage.setSelectedServiceOrAgency(newVal);
  }

  private selectedServiceOrAgency: SelectData = { text: "", value: "" };
  private serviceOrAgencyData: SelectData[] = AcquisitionPackage.serviceOrAgencyData;

  private selectedStateCode: SelectData = { text: "", value: "" };
  private stateCodeListData: SelectData[] = [
    { text: "AA - Armed Forces Americas", value: "AA" },
    { text: "AE - Armed Forces Europe", value: "AE" },
    { text: "AP - Armed Forces Pacific", value: "AP" },
  ];

  private selectedState: SelectData = { text: "", value: "" };
  private stateListData: SelectData[] = AcquisitionPackage.stateListData;

  private selectedCountry = "US";
  
  public countryListData: SelectData[] = [{ text: "", value: "" }]; 
  public async mounted(): Promise<void> {
    this.countryListData = await AcquisitionPackage.getCountryListData(["US", "GB"]);
  }

  private addressTypeChange(addressType: string): void {
    this.selectedCountry = addressType === "FOR" ? "" : "US";
  }
}

</script>
