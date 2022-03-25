<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>

        <h1 class="page-header">
          Do you have an Alternate Contracting Officer’s Representative (ACOR)?
        </h1>

        <ATATRadioGroup
          id="HasAlternateCOR"
          legend="Indicate if you have an ACOR"
          :legend-sr-only="true"
          card="true"
          :value.sync="hasAlternateCOR"
          :items="alternateCoreOptions"
          name="hasAlternateCOR"
          class="mt-3 mb-8"
          width="180"
        />

      </v-col>
    </v-row>

  </v-container>
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
      id: "YesAlternateCOR",
      label: "Yes",
      value: "true",
    },
    {
      id: "NoAlternateCOR",
      label: "No",
      value: "false",
    },
  ];

  public get hasAlternateCOR(): string {
    const ACORValue = AcquisitionPackage.hasAlternativeContactRep;
    if (ACORValue) {
      return ACORValue.toString();
    }
    return "";
  }

  public set hasAlternateCOR(value: string) {
    AcquisitionPackage.setHasAlternateCOR(value === "true" ? true : false);
  }
}
</script>
