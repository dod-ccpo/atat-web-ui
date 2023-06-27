<template>
  <v-form ref="form">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-1 py-0">
            {{pageHeaderText}}
          </h1>
          <div class="copy-max-width">
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
          </div>
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
            :descriptionNormal="true"
            name="checkbox-card"
            :card="true"
            cardWidth="800"
            :rules="checkboxRules"
            :validateOnLoad="false"
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
import AcquisitionPackage from "@/store/acquisitionPackage";

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

  private agencyData: SelectData[] = [];
  private selectedILs: string[] = [];
  
  public CSPProvisioningData = PortfolioStore.CSPProvisioningData;

  private checkboxItems: Checkbox[] = [];
  private checkboxRulesOn = false;
  public get checkboxRules(): unknown[] {
    return this.checkboxRulesOn
      ? [this.$validators.required('Select at least one impact level')]
      : []
  }

  public async buildILCheckboxItems(): Promise<void> {
    const cspData = PortfolioStore.CSPProvisioningData;
    cspData.forEach(obj => {
      if (obj.classification_level === "U" && obj.cloud_distinguisher) {
        const checkboxItem: Checkbox = {
          id: obj.cloud_distinguisher.name as string,
          label: obj.cloud_distinguisher.name + " – " + obj.cloud_distinguisher.display_name,
          value: obj.name,
          description: obj.cloud_distinguisher.description,
        }
        this.checkboxItems.push(checkboxItem);
      }
    });
    this.checkboxRulesOn = true;
  }

  public get selectedPackage():string {
    return PortfolioStore.selectedAcquisitionPackageSysId
  }

  public get showCheckbox():boolean {
    return PortfolioStore.doesCSPHaveImpactLevels;
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
      : "Now, let’s gather details about your portfolio."
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
      this.selectedCSPProvider = storeData.csp || ""
      this.checkboxHelpText = this.selectedPackage? "":"Select all that apply"
      this.checkboxLabel = this.selectedPackage? "":"What impact level(s) do you need to" +
      " provision?"

      this.selectedILs = storeData.selectedILs || [];
    }
  }

  public async loadOnEnter(): Promise<void> {
    if (!OrganizationData.agency_data || OrganizationData.agency_data.length === 0) {
      await OrganizationData.getAgencyData();
    }
    this.agencyData = convertAgencyRecordToSelect(OrganizationData.agency_data); 
    await this.setTaskOrderData();
    if (PortfolioStore.CSPHasImpactLevels) {
      await this.buildILCheckboxItems();
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async saveOnLeave(): Promise<boolean> {
    try {
      this.selectedILs.sort(); // ensure correct order e.g., IL2, IL4, IL5
      await PortfolioStore.setPortfolioProvisioning(this.currentData);
    } catch (error) {
      console.error(error);
    }
    return true;
  }

}
</script>
