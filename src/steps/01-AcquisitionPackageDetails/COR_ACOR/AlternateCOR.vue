<template>
  <v-form ref="form" lazy-validation>
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
            :rules="[$validators.required('Please select Yes or No.')]"
            name="hasAlternateCOR"
            class="mt-3 mb-8"
            width="180"
          />

        </v-col>
      </v-row>

    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { VForm, VContainer, VRow, VCol } from "vuetify/lib";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class AlternateCOR extends Mixins(SaveOnLeave) {
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
    if (ACORValue !== null) {
      return ACORValue.toString();
    }
    return "";
  }

  public set hasAlternateCOR(value: string) {
    AcquisitionPackage.setHasAlternateCOR(value === "true" ? true : false);
  }

  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }
}
</script>
