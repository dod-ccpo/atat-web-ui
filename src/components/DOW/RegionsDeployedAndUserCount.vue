
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
    :value.sync="selectedRegions"
    @checkboxTextfieldDataUpdate="regionsUserDataUpdate"
    :isFormattedNumber="true"
    :rules="rules"
    :textfieldRules="textfieldRules"
  />
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { Checkbox } from "types/Global";
import acquisitionPackage from "@/store/acquisitionPackage";

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
  @Prop() private selectedDeployedRegionsOnLoad?: string[];
  @Prop() private regionUsersOnLoad?: string;
  @Prop({default:0}) private componentIndex?: number;

  public selectedRegions: string[] = [];
  public regions: Checkbox[] = [];

  @Watch("selectedRegions")
  public selectedRegionsChanged(): void {
    this.$emit("selectedRegionsUpdate", this.selectedRegions);
  }

  public regionsUserDataUpdate(data: Checkbox[]): void {
    const regionsWithUserCount = data.filter(
      checkbox => checkbox.textfieldValue && checkbox.textfieldValue !== ""
    );
    const regionUserData: Record<string, string>[] = [];
    regionsWithUserCount.forEach(checkboxObj => {
      const key = `${checkboxObj.value}`;
      const val = checkboxObj.textfieldValue || "";
      const thisRegionUserObj = { [key]: val };
      regionUserData.push(thisRegionUserObj);
    })
    const jsonStr = JSON.stringify(regionUserData)
    this.$emit("regionUserDataUpdate", jsonStr,this.componentIndex);
  }

  @Watch("regionUsersOnLoad")
  public regionUsersOnLoadChange(newVal: string): void {
    this.updateRegionUsers(newVal)
  }

  public updateRegionUsers(value:string): void {
    if(value) { // this check eliminates console errors when the user toggles between cloud/on-prem
      const regionUsersArray = JSON.parse(value);
      const selectedRegions: string[] = [];
      regionUsersArray.forEach((regionUsers: Record<string, string>) => {
        const region = Object.keys(regionUsers)[0];
        selectedRegions.push(region);
        const userCount = Object.values(regionUsers)[0];
        const i = this.regions.findIndex(obj => obj.value === region);
        this.regions[i].textfieldValue = userCount;
      });

      this.$nextTick(() => {
        this.selectedRegions = selectedRegions;
      })
    }
  }

  public async mounted(): Promise<void> {
    //eslint-disable-next-line prefer-const 
    let regionsData = acquisitionPackage.regions
    regionsData?.sort((a, b) => a.sequence > b.sequence ? 1 : -1)
      .forEach(region => {
        //eslint-disable-next-line prefer-const 
        let item = {
          id : region.name,
          label : region.name,
          value : region.sys_id,
          textfieldValue : ""
        }
        this.regions.push(item);
      })

    Vue.nextTick(() => {
      if (this.regionUsersOnLoad) {
        this.updateRegionUsers(this.regionUsersOnLoad)
      }
      if (this.selectedDeployedRegionsOnLoad) {
        this.selectedRegions = this.selectedDeployedRegionsOnLoad;
      }
    })
  }

}
</script>

