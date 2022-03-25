<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Will government equipment be furnished, provided or acquired under this acquisition?
          </h1>
          <div class="copy-max-width">
            <ATATRadioGroup
              class="copy-max-width mb-10 max-width-740"
              id="RecurringOptions"
              :card="true"
              :items="equipmentProvidedOptions"
              :value.sync="selectedEquipmentProvidedOption"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue"

import { RadioButton } from "../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})

export default class WillGovtEquipBeFurnished extends Vue {
  private selectedEquipmentProvidedOption = "";
  private equipmentProvidedOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes.",
      value: "Yes",
    },
    {
      id: "No",
      label: "No. GFP/GFE will NOT be furnished to the contractor.",
      value: "No",
    },
  ];
}
</script>
