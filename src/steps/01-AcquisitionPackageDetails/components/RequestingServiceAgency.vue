<template>
  <ATATAutoComplete
    :id="id"
    :label="label"
    :rules="rules"
    class="_input-max-width mb-2"
    :label-sr-only="false"
    titleKey="text"
    :searchFields="['text']"
    :items="serviceOrAgencyData"
    :selectedItem.sync="_selectedServiceOrAgency"
    placeholder="Find your service/agency"
    icon="arrow_drop_down"
  />
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop, PropSync } from "vue-property-decorator";
import Vue from "vue";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import { SelectData } from "types/Global";
import { convertSystemChoiceToSelect } from "@/helpers";
import OrganizationData from "@/store/organizationData";

const emptySelectData: SelectData = { text: "", value: "" };

@Component({
  components: {
    ATATAutoComplete,
  },
})
export default class RequestingServiceAgency extends Vue {
  @Prop({ default: "ServiceOrAgency" }) private id!: string;
  @Prop({ default: "What service or agency do you work for?" })
  private label!: string;
  @Prop({ default: "title goes here" }) private helpText!: string;
  @Prop({ default: true }) private isForm!: boolean;
  @PropSync("rules") private _rules!: "";
  @PropSync("selectedServiceOrAgency", {default: ()=> emptySelectData}) 
    private _selectedServiceOrAgency!: SelectData;

  private emptySelectData: SelectData = { text: "", value: "" };
  private DisaOrgName = "DEFENSE_INFORMATION_SYSTEMS_AGENCY";
  private serviceOrAgencyData: SelectData[] = [];


  public async loadOnEnter(): Promise<void> {
    this.serviceOrAgencyData = convertSystemChoiceToSelect(
      OrganizationData.service_agency_data
    );
  }

  public async mounted():Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
