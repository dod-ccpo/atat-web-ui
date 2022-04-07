<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Is property being provided by the Government that must be accounted for in accordance 
            with DISAI 270-165-8?
          </h1>
          <div class="copy-max-width">
            <a 
              href="https://www.disa.mil/~/media/Files/DISA/About/Publication/Instruction/di2701658.pdf"
              class="mb-10 d-inline-block _text-link"
              target="_blank"
              id="DISAEquipmentInfoLink"
            >
              DISAI 270-165-8, Accountability and International Controls for DISA Equipment
            </a>
            <ATATRadioGroup
              class="copy-max-width mb-10 max-width-740"
              id="RecurringOptions"
              :card="true"
              :items="propertyOptions"
              :value.sync="selectedPropertyOption"
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

export default class PropertyDetails extends Vue {
  private selectedPropertyOption = "";
  private propertyOptions: RadioButton[] = [
    {
      id: "YesAccountable",
      label: "Yes. Accountable.",
      value: "Yes",
    },
    {
      id: "NoAccountable",
      label: "No. Non-accountable.",
      value: "No",
    },
  ];
}
</script>
