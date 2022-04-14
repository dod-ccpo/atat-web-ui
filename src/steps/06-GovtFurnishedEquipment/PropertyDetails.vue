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
              :value.sync="showAlert"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
          <ATATAlert v-if="isDISA" 
            type="info" :showIcon="true" 
            class="copy-max-width mt-16">
            <template v-slot:content>
              <p class="ma-0">
                As a DISA mission owner, your GFP must be reviewed and approved by the Workforce Services
                Directorate (WSD) Property Office. Once you are ready to submit your acquisition package, 
                we’ll take care of sending your GFP documents for review.
              </p>
            </template>
          </ATATAlert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import { RadioButton } from "../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATRadioGroup,
    ATATAlert
  },
})

export default class WillGovtEquipBeFurnished extends Vue {
  private showAlert = "No";


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

  public get isDISA(): boolean {
    return AcquisitionPackage.selectedServiceOrAgency.value?.toUpperCase() 
              === "DEFENSE_INFORMATION_SYSTEMS_AGENCY";
  }

}
</script>
