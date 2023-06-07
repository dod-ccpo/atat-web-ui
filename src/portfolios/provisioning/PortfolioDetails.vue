<template>
  <v-form ref="form">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-1 py-0">
            {{pageHeaderText}}
          </h1>

            <p v-if="!selectedPackage">
              The following information will be used to refer to this project throughout ATAT and
              will be sent to your CSP during provisioning.<strong>
              Please do not include any Controlled Unclassified Information (CUI) or classified
              information within your portfolio title.
            </strong>
            </p>
            <p v-else>
              Select all that apply
            </p>
          <div v-if="!selectedPackage" class="copy-max-width">
          <ATATTextField 
            label="Portfolio title"
            class="_input-max-width mb-10"
            :value.sync="portfolioTitle"
            :rules="[
              $validators.required('Please enter your project title.'),
              $validators.maxLength(60, 'Title cannot exceed 60 characters')
            ]"
          />

          <ATATAutoComplete
            id="Agency"
            class="_input-max-width mb-10"
            label="What service or agency is this portfolio affiliated with?"
            :label-sr-only="false"
            titleKey="text"
            :searchFields="['text']"
            :items="agencyData"
            :selectedItem.sync="serviceOrAgency"
            :rules="[$validators.required('Please select your service or agency.')]"
            placeholder="Find your service/agency"
            icon="arrow_drop_down"
          />
          </div>
          <ATATCheckboxGroup
            v-if="showCheckbox"
            :groupLabel="checkboxLabel"
            :groupLabelHelpText="checkboxHelpText"
            id="ImpactLevelCheckboxes"
            :value.sync="selectedILs"
            :items="checkboxItems"
            name="checkbox-card"
            :card="true"
            cardWidth="800"
            :rules="[
                $validators.required('Select at least one impact level')
              ]"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ATATTextField from "@/components/ATATTextField.vue";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";

import PortfolioStore from "@/store/portfolio";
import { Checkbox, PortfolioProvisioning, SelectData } from "types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { convertAgencyRecordToSelect } from "@/helpers";
import OrganizationData from "@/store/organizationData";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

@Component({
  components: {
    ATATTextField,
    ATATAutoComplete,
    ATATCheckboxGroup,
  }
})

export default class PortfolioDetails extends Mixins(SaveOnLeave) {
  public portfolioTitle = "";
  public serviceOrAgency: SelectData = { text: "", value: "" };
  public selectedCSPProvider = "";
  public checkboxLabel = ""
  public checkboxHelpText = ""
  public containsUnclassified = false


  private agencyData: SelectData[] = [];
  private selectedILs: string[] = [];
  private checkboxItems: Checkbox[] = [
    {
      id: "IL2",
      label: "IL2 - Azure Commercial ",
      value: "azure_il2_dev",
      description: "Microsoft Azure Commercial cloud meant for use by DoD organizations with" +
        " IL2 workloads",
    },
    {
      id: "IL4",
      label: "IL4 - Azure Government ",
      value: "azure_il4_dev",
      description: "Microsoft Azure Government cloud meant for use by DoD organizations with" +
        " IL4 workloads",
    },
    {
      id: "IL5",
      label: "IL5 - Azure Government ",
      value: "azure_il5_dev",
      description: "Microsoft Azure Government cloud meant for use by DoD organizations with" +
        " IL5 workloads",
    },
  ];

  public get selectedPackage():string {
    return PortfolioStore.selectedAcquisitionPackageSysId
  }

  public get showCheckbox():boolean {
    return this.selectedCSPProvider === 'Azure' && this.containsUnclassified
  }
  public get currentData(): PortfolioProvisioning {
    return {
      portfolioTitle: this.portfolioTitle,
      serviceOrAgency: this.serviceOrAgency.value,
      selectedILs: this.selectedILs,
    }
  }
  public get pageHeaderText():string{
    return this.selectedPackage !== ""
      ? "What impact level(s) do you need to provision?"
      : "Now, let's gather details about your portfolio."
  }

  public savedData: PortfolioProvisioning = {
    portfolioTitle: "",
    serviceOrAgency: "",
    selectedILs: [],
  }

  public async setTaskOrderData(): Promise<void> {
    const storeData = PortfolioStore.portfolioProvisioningObj;
    if (storeData) {
      this.portfolioTitle = storeData.portfolioTitle as string;
      const selectedServiceOrAgency 
        = this.agencyData.find(obj => obj.value === storeData.serviceOrAgency);
      if (selectedServiceOrAgency) {
        this.serviceOrAgency = selectedServiceOrAgency;
      }
      this.savedData = {
        portfolioTitle:  this.portfolioTitle,
        serviceOrAgency: this.serviceOrAgency.value,
        selectedILs: this.selectedILs,
      }
      this.containsUnclassified = !!storeData.classificationLevels?.includes('Unclassified')
      this.selectedCSPProvider = storeData.csp || ""
      this.checkboxHelpText = this.selectedPackage? "":"Select all that apply"
      this.checkboxLabel = this.selectedPackage? "":"What impact level(s) do you need to" +
      " provision?"
    }
  }

  public async loadOnEnter(): Promise<void> {
    if (!OrganizationData.agency_data || OrganizationData.agency_data.length === 0) {
      await OrganizationData.getAgencyData();
    }
    this.agencyData = convertAgencyRecordToSelect(OrganizationData.agency_data); 
    await this.setTaskOrderData();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async saveOnLeave(): Promise<boolean> {
    try {
      await PortfolioStore.setPortfolioProvisioning(this.currentData);
    } catch (error) {
      console.error(error);
    }
    return true;
  }

}
</script>
