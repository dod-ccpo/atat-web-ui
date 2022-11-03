
<template>
  <div>
    Future Environment Details page

    <!-- <ATATCheckboxGroup
      id="RegionsDeployed"
      :items.sync="regions"
      groupLabel="In which region(s) is this instance deployed?"
      :optional="true"
      tooltipText="testing 123 testing"
      :hasTextFields="true"
      textFieldAppendText="users"
      :textFieldWidth="164"
      textFieldType="number"
      :labelWidth="130"
      :value.sync="selectedRegions"
    /> -->
    <RegionsDeployedAndUserCount 
      :hasTextFields="false"
      groupLabel="In which region(s) is this instance deployed?"
      @selectedRegionsUpdate="regionsDeployedUpdate"
      tooltipText="testing 123 testing"
      :optional="true"
    />
    
    <hr />

    <RegionsDeployedAndUserCount 
      :hasTextFields="true"
      :optional="false"
      groupLabel="Where are your users located?"
      @regionUserDataUpdate="regionUserDataUpdate"
    />

  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

// import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import RegionsDeployedAndUserCount from "@/components/DOW/RegionsDeployedAndUserCount.vue";


import { Checkbox } from "types/Global";

@Component({
  components: {
    RegionsDeployedAndUserCount,
    // ATATCheckboxGroup
  }
})
export default class EnvironmentDetails extends Vue {

  public regionsDeployed: string [] = [];
  public regionsDeployedUpdate(selected: string[]): void {
    this.regionsDeployed = selected;
  }

  public regionUserData: Checkbox[] = [];
  public regionUserDataUpdate(data: Checkbox[]): void {
    debugger;
    this.regionUserData = data;
  }

  // public selectedRegions: string[] = [];
  // public regions: Checkbox[] = [
  //   {
  //     id: "CONUSEast",
  //     label: "CONUS East",
  //     value: "CONUSEast",
  //   },
  //   {
  //     id: "CONUSCentral",
  //     label: "CONUS Central",
  //     value: "CONUSCentral",
  //   },
  //   {
  //     id: "CONUSWest",
  //     label: "CONUS West",
  //     value: "CONUSWest",
  //   },
  //   {
  //     id: "AFRICOM",
  //     label: "AFRICOM",
  //     value: "AFRICOM",
  //   },
  //   {
  //     id: "CENTCOM",
  //     label: "CENTCOM",
  //     value: "CENTCOM"
  //   },
  //   {
  //     id: "EUCOM",
  //     label: "EUCOM",
  //     value: "EUCOM"
  //   },
  //   {
  //     id: "INDOPACOM",
  //     label: "INDOPACOM",
  //     value: "INDOPACOM"
  //   },
  //   {
  //     id: "PACCOM",
  //     label: "PACCOM",
  //     value: "PACCOM"
  //   },
  //   {
  //     id: "SOUTHCOM",
  //     label: "SOUTHCOM",
  //     value: "SOUTHCOM"
  //   },
  // ];

}
</script>

