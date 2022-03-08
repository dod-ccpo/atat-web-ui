<template>
  <v-flex>
    <h2>Do you have an Alternate Contracting Officer’s Representative (ACOR)?</h2>
    <ATATRadioGroup
      id="hasAlternateCOR"
      legend=""
      card="true"
      :value.sync="hasAlternateCOR"
      :items="alternateCoreOptions"
      name="hasAlternateCOR"
      class="mt-3 mb-8"
      style="width: 30%"
    />
  </v-flex>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class AlternateCOR extends Vue {
  private alternateCoreOptions: RadioButton[] = [
    {
      id: "YesAlternateCore",
      label: "Yes",
      value: "true",
    },
    {
      id: "NoAlternateCore",
      label: "No",
      value: "false",
    },
  ];

  public get hasAlternateCOR(): string {
    return AcquisitionPackage.hasAlternativeContactRep.toString();
  }

  public set hasAlternateCOR(value: string) {
    AcquisitionPackage.setHasAlternateCOR(value === "true" ? true : false);
  }
}
</script>
