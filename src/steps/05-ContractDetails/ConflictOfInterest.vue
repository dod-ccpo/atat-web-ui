
<template>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you have a potential conflict of interest?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              An organizational conflict of interest (COI) is a situation where, 
              because of other relationships or activities, a person or company 
              (1) is unable or potentially unable to render impartial assistance 
              or advice to the government, (2) cannot objectively perform 
              contract work, or (3) has an unfair competitive advantage. 
              Learn more about COI            
            </p>
            <ATATRadioGroup                                  
              class="copy-max-width max-width-760"
              id="COIOptions"
              :card="true"
              :items="conflictOfInterestOptions" 
              :value.sync="hasConflict"
              :rules="[$validators.required('Please select an option')]"            
            />
          </div>
          <div v-show="hasConflict === 'true'">
            <hr class="mt-5" />
            <ATATTextArea
              id="Explanation"
              label="Please provide an explanation of your conflict of interest."
              class="width-100"
              :rows="7"
              :rules="[
                $validators.required(
                  'Please provide an explanation of your COI.'
                ),
                $validators.maxLength(
                  1600,
                  'Please limit your description to 1600 characters or less'
                ),
              ]"
              :value.sync="explanation"
              maxChars="1600"
            />

          </div>
        </v-col>
      </v-row>
    </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

import { RadioButton } from "../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextArea,
  }
})

export default class ConflictOfInterest extends Vue {
  private explanation = "";
  private hasConflict = null;
  private conflictOfInterestOptions: RadioButton[] = [
    {
      id: "Yes",
      label: `Yes. There is a potential COI that may influence which CSP should 
        be awarded this task order.`,
      value: "true",
    },
    {
      id: "No",
      label: "No. This is a new requirement.",
      value: "false",
    },
  ];

}
</script>
