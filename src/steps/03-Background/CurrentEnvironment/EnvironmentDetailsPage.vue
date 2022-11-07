
<template>
  <div>
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

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import CurrentUsage from "@/components/DOW/CurrentUsage.vue";
import RegionsDeployedAndUserCount from "@/components/DOW/RegionsDeployedAndUserCount.vue";

import { Checkbox, CurrentEnvUsageData } from "types/Global";

@Component({
  components: {
    CurrentUsage,
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

  public regionsDeployedTooltipText = `This is the geographic location where your 
    public cloud resources are located, e.g., within the continental U.S. (CONUS) 
    or outside of the continental U.S. (OCONUS).`;

}
</script>

