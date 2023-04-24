<template>
  <v-form ref="form">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-1 py-0">
            Now, let’s gather details about your portfolio.
          </h1>
        
          <div class="copy-max-width">
            <p>
              We’ll use the following information to refer to your project throughout ATAT.
            </p>
          </div>

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
import { PortfolioProvisioning, SelectData } from "types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { convertAgencyRecordToSelect } from "@/helpers";
import OrganizationData from "@/store/organizationData";

@Component({
  components: {
    ATATTextField,
    ATATAutoComplete,
  }
})

export default class PortfolioDetails extends Mixins(SaveOnLeave) {
  public portfolioTitle = "";
  public serviceOrAgency: SelectData = { text: "", value: "" };
  
  private agencyData: SelectData[] = [];

  public get currentData(): PortfolioProvisioning {
    return {
      portfolioTitle: this.portfolioTitle,
      serviceOrAgency: this.serviceOrAgency.value,
    }
  }

  public savedData: PortfolioProvisioning = {
    portfolioTitle: "",
    serviceOrAgency: "",
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
      }
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
