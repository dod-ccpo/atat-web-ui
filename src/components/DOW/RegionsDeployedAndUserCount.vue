
<template>
  <ATATCheckboxGroup
    id="RegionsDeployed"
    :items.sync="regions"
    :groupLabel="groupLabel"
    :groupLabelId="groupLabelId"
    :groupLabelHelpText="groupLabelHelpText"
    :optional="optional"
    :tooltipText="tooltipText"
    :hasTextFields="hasTextFields"
    textFieldAppendText="users"
    :textFieldWidth="164"
    textFieldType="number"
    :labelWidth="130"
    :value.sync="selectedRegions"
    @checkboxTextfieldDataUpdate="regionsUserDateUpdate"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { Checkbox } from "types/Global";

@Component({
  components: {
    ATATCheckboxGroup
  }
})
export default class RegionsDeployedAndUserCount extends Vue {
  @Prop({ default: false }) hasTextFields?: boolean;
  @Prop() groupLabel?: string;
  @Prop() groupLabelId?: string;
  @Prop() groupLabelHelpText?: string;
  @Prop() optional!: boolean;
  @Prop() tooltipText?: string;

  public selectedRegions: string[] = [];
  public regions: Checkbox[] = [
    {
      id: "CONUSEast",
      label: "CONUS East",
      value: "CONUSEast",
    },
    {
      id: "CONUSCentral",
      label: "CONUS Central",
      value: "CONUSCentral",
    },
    {
      id: "CONUSWest",
      label: "CONUS West",
      value: "CONUSWest",
    },
    {
      id: "AFRICOM",
      label: "AFRICOM",
      value: "AFRICOM",
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

  // @Watch("regions", {deep: true})
  // public regionsChanged(): void {
  //   debugger;
  //   this.$emit("regionUserDataUpdate", this.regions);
  // }

  @Watch("selectedRegions")
  public selectedRegionsChanged(): void {
    this.$emit("selectedRegionsUpdate", this.selectedRegions);
  }

  public regionsUserDateUpdate(): void {
    debugger;
    this.$emit("regionUserDataUpdate", this.regions);
  }

}
</script>

