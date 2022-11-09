
<template>
  <div class="container-max-width">
    <h1 class="mb-10">
      Future env details page
    </h1>

    <RegionsDeployedAndUserCount 
      :hasTextFields="false"
      id="RegionsDeployed"
      groupLabelId="RegionsDeployedLabel"
      groupLabel="In which region(s) is this instance deployed?"
      @selectedRegionsUpdate="regionsDeployedUpdate"
      :tooltipText="regionsDeployedTooltipText"
      :optional="true"
    />
    
    <hr />

    <h2 class="mb-4">2. Current usage and users</h2>

    <CurrentUsage 
      class="mb-10"
      :currentUsage.sync="currentUsage"   
    />

    <RegionsDeployedAndUserCount 
      :hasTextFields="true"
      id="RegionsUsers"
      :optional="false"
      groupLabelId="RegionUsersLabel"
      groupLabel="Where are your users located?"
      groupLabelHelpText="Enter the approximate number of users for each selected region."
      @regionUserDataUpdate="regionUserDataUpdate"
      :rules="[$validators.required('Select at least one region.'),]"
      :textfieldRules="[$validators.required('Enter the number of users in this region.'),]"
    />

    <hr />

    <h2 class="mb-4">3. Instance configurations</h2>

    <InstanceConfig
      :instanceConfig.sync="instanceConfig"
      :storageUnits="storageUnits"
    />

    <PerformanceTier 
      :performanceTier.sync="performanceTier"
      :storageUnits="storageUnits"
    />

    <hr />

    <h2 class="mb-4">4. Pricing details</h2>

    <PricingDetails :pricingDetails.sync="pricingDetails" />

    <hr />

    <h2 class="mb-4">
      5. Additional information 
      <span class="text-base font-weight-400">(Optional)</span>
    </h2>

    <AdditionalInfo :additionalInfo.sync="additionalInfo" />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import AdditionalInfo from "@/components/DOW/AdditionalInfo.vue";
import CurrentUsage from "@/components/DOW/CurrentUsage.vue";
import InstanceConfig from "@/components/DOW/InstanceConfig.vue";
import PerformanceTier from "@/components/DOW/PerformanceTier.vue";
import PricingDetails from "@/components/DOW/PricingDetails.vue";
import RegionsDeployedAndUserCount from "@/components/DOW/RegionsDeployedAndUserCount.vue";

import { 
  Checkbox, 
  CurrentEnvInstanceConfig, 
  CurrentEnvUsageData, 
  CurrentEnvPerformanceTier,
  SelectData,
  CurrentEnvPricingDetails,
} from "types/Global";

@Component({
  components: {
    AdditionalInfo,
    CurrentUsage,
    InstanceConfig, 
    PerformanceTier,
    PricingDetails,
    RegionsDeployedAndUserCount,
  }
})

export default class EnvironmentDetails extends Vue {

  public regionsDeployed: string [] = [];
  public regionsDeployedUpdate(selected: string[]): void {
    this.regionsDeployed = selected;
  }

  public regionUserData: Checkbox[] = [];
  public regionUserDataUpdate(data: Checkbox[]): void {
    this.regionUserData = data;
  }

  public currentUsage: CurrentEnvUsageData = {
    currentUsageDescription: "",
    trafficSpikeCauses: [],
    surgeUsageEvent: "",
    surgeUsagePeriods: "",
  }

  public instanceConfig: CurrentEnvInstanceConfig = {
    licensing: "",
    operatingSystem: "",
    numberOfVCPUs: null,
    processorSpeed: null,
    memory: null,
    storageType: "",
    storageAmount: null,
    storageUnit: "GB",
  }

  public performanceTier: CurrentEnvPerformanceTier = {
    performanceTier: "",
    numberOfSimilarInstances: null,
    dataEgressMonthlyAmount: null,
    dataEgressMonthlyUnit: "GB",
  }

  public pricingDetails: CurrentEnvPricingDetails = {
    currentPaymentArrangement: "",
    pricingPeriodExpirationDate: "",
  }

  public additionalInfo = "";

  public regionsDeployedTooltipText = `This is the geographic location where your 
    public cloud resources are located, e.g., within the continental U.S. (CONUS) 
    or outside of the continental U.S. (OCONUS).`;

  public storageUnits: SelectData[] = [
    { text: "Gigabyte (GB)", value: "GB" },
    { text: "Terabyte (TB)", value: "TB" },
    { text: "Petabyte (PB)", value: "PB" },
  ];

}

</script>
