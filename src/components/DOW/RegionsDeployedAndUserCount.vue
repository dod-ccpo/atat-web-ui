
<template>
  <ATATCheckboxGroup
    :id="id"
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
    :labelWidth="180"
    :value.sync="_selectedRegions"
    @checkboxTextfieldDataUpdate="regionsUserDataUpdate"
    :isFormattedNumber="true"
    :rules="rules"
    :textfieldRules="textfieldRules"
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
  @Prop({ default: "Regions" }) id!: string;
  @Prop({ default: false }) hasTextFields?: boolean;
  @Prop() groupLabel?: string;
  @Prop() groupLabelId?: string;
  @Prop() groupLabelHelpText?: string;
  @Prop() optional!: boolean;
  @Prop() tooltipText?: string;
  @Prop({ default: () => []}) private rules!: Array<unknown>;
  @Prop({ default: () => []}) private textfieldRules!: Array<unknown>;
  @PropSync("selectedRegions") private _selectedRegions!: string[];


  // public selectedRegions: string[] = [];
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

  // @Watch("_selectedRegions")
  // public selectedRegionsChanged(): void {
  //   this.$emit("selectedRegionsUpdate", this.selectedRegions);
  // }

  public regionsUserDataUpdate(data: Checkbox[]): void {
    const regionsWithUserCount = data.filter(
      checkbox => checkbox.textfieldValue && checkbox.textfieldValue !== ""
    );
    const regionUserData: Record<string, string>[] = [];
    regionsWithUserCount.forEach(checkboxObj => {
      const key = `${checkboxObj.value}`;
      const val = checkboxObj.textfieldValue || "";
      const thisRegionUserObj = { [key]: val };
      debugger;
      regionUserData.push(thisRegionUserObj);
    })
    const jsonStr = JSON.stringify(regionUserData)
    this.$emit("regionUserDataUpdate", jsonStr);
  }

}
</script>

