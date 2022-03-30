
<template>
   <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
           Do you have a current contract for this effort?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              if you acquistion is a follow-on requirement, we'll gather some details about your contract next.
            </p>
            <ATATRadioGroup
              class="copy-max-width mb-10 max-width-740"
              id="currentContractOptions"
              :card="true"
              :items="currentContractOptions"
              :value.sync="currentContractOption"
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
import { RadioButton } from "../../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class CurrentContract extends Vue {
  private currentContractOption = "";
  private currentContractOptions: RadioButton[] = [
    {
      id: "YesCurrentContract",
      label: "Yes. There is a current contract for this effort.",
      value: "YesCurrentContract",
    },
    {
      id: "NoCurrentContract",
      label: "No. This is a new requirement.",
      value: "NoCurrentContract",
    },
  ];
}
</script>

