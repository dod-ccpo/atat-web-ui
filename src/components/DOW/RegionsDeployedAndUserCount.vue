
<template>
  <ATATCheckboxGroup
    :id="id"
    :ref="id + 'Ref'"
    :index="index"
    :items="regions"
    @update:items="regions = $event"
    :groupLabel="groupLabel"
    :groupLabelId="groupLabelId"
    :labelSuffix="labelSuffix"
    :groupLabelHelpText="groupLabelHelpText"
    :optional="optional"
    :tooltipText="tooltipText"
    :hasTextFields="hasTextFields"
    textFieldAppendText="users"
    :textFieldWidth="164"
    textFieldType="number"
    :labelWidth="180"
    :value="selectedRegions"
    @update:value="selectedRegions = $event"
    @checkboxTextfieldDataUpdate="regionsUserDataUpdate"
    :isFormattedNumber="true"
    :rules="rules"
    :textfieldRules="textfieldRules"
  />
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import { Component, Prop, Vue, Watch, toNative } from "vue-facing-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { Checkbox } from "types/Global";
import acquisitionPackage from "@/store/acquisitionPackage";

@Component({
  emits:[
    "selectedRegionsUpdate",
    "regionUserDataUpdate"
  ],
  components: {
    ATATCheckboxGroup
  }
})

class RegionsDeployedAndUserCount extends Vue {
  @Prop({ default: "Regions" }) id!: string;
  @Prop({ default: false }) hasTextFields?: boolean;
  @Prop({default: 0}) private index?: number;
  @Prop() groupLabel?: string;
  @Prop() groupLabelId?: string;
  @Prop() groupLabelHelpText?: string;
  @Prop() labelSuffix?: string;
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
    if (this.labelSuffix === "Regions") {
      this.$emit("selectedRegionsUpdate", this.selectedRegions);
    }
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
    const regionsData = acquisitionPackage.regions
    regionsData?.sort((a, b) => a.sequence > b.sequence ? 1 : -1)
      .forEach(region => {
        const item = {
          id : `${region.name}_${this.index}`,
          label : region.name,
          value : region.sys_id,
          textfieldValue : ""
        }
        this.regions.push(item);
      })

    this.$nextTick(() => {
      if (this.regionUsersOnLoad) {
        this.updateRegionUsers(this.regionUsersOnLoad)
      }
      if (this.selectedDeployedRegionsOnLoad) {
        this.selectedRegions = this.selectedDeployedRegionsOnLoad;
      }
    })
  }
}

export default toNative(RegionsDeployedAndUserCount)
</script>

