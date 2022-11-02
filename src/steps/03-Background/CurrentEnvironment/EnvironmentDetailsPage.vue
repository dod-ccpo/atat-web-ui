
<template>
  <div>
    Future Environment Details page

    <ATATCheckboxGroup
      id="RegionsDeployed"
      :items="regions"
      groupLabel="In which region(s) is this instance deployed?"
      :optional="true"
      tooltipText="testing 123 testing"
      :hasTextFields="true"
      textFieldAppendText="users"
      :textFieldWidth="164"
      :labelWidth="130"
      :value.sync="selectedRegions"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import { Checkbox } from "types/Global";

@Component({
  components: {
    ATATCheckboxGroup
  }
})
export default class EnvironmentDetails extends Vue {

  public selectedRegions: string[] = [];
  public regions: Checkbox[] = [
    {
      id: "CONUSEast",
      label: "CONUS East",
      value: "CONUSEast"
    },
    {
      id: "",
      label: "CONUS Central",
      value: "CONUSCentral"
    },
    {
      id: "CONUSWest",
      label: "CONUS West",
      value: "CONUSWest"
    },
    {
      id: "AFRICOM",
      label: "AFRICOM",
      value: "AFRICOM"
    },
    {
      id: "CENTCOM",
      label: "CENTCOM",
      value: "CENTCOM"
    },
    {
      id: "EUCOM",
      label: "EUCOM",
      value: "EUCOM"
    },
    {
      id: "INDOPACOM",
      label: "INDOPACOM",
      value: "INDOPACOM"
    },
    {
      id: "PACCOM",
      label: "PACCOM",
      value: "PACCOM"
    },
    {
      id: "SOUTHCOM",
      label: "SOUTHCOM",
      value: "SOUTHCOM"
    },
  ];

}
</script>

