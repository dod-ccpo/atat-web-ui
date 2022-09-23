<template>
  <ATATAutoComplete
    :id="id"
    class="_input-max-width mb-10"
    :label="label"
    :label-sr-only="false"
    titleKey="text"
    :searchFields="['text']"
    :items="disaOrgData"
    :selectedItem.sync="_selectedDisaOrg"
    :rules="rules"
    placeholder="Find your DISA organization"
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
export default class DisaOrganization extends Vue {
  @Prop({ default: "DisaOrg" }) private id!: string;
  @Prop({ default: "DISA Organization" })
  private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: true }) private isForm!: boolean;
  @PropSync("rules") private _rules!: "";
  @PropSync("selectedDisaOrg", { default: emptySelectData })
  private _selectedDisaOrg!: SelectData;
  private disaOrgData: SelectData[] = [];

  public async loadOnEnter(): Promise<void> {
    this.disaOrgData = convertSystemChoiceToSelect(
      OrganizationData.disa_org_data
    );
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
