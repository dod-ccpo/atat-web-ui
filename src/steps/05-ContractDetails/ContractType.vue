<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Which contract type applies to this acquisition?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Firm-Fixed-Price (FFP) is the standard contract type for JWCC task orders. 
              You must provide justification for a time-and-materials (T&amp;M) or 
              hybrid contract, in accordance with 
              <a 
                href="https://www.acquisition.gov/far/12.207" 
                target="_blank"
                class="_text-link"
              >
                <span class="_external-link">FAR 12.207.</span>
              </a>
              If you are considering a T&amp;M contract, we suggest contacting the
              DITCO Contracting Office for further guidance.            
            </p>
            <p>
              Select all that apply to your contracting effort.
            </p>
          <ATATCheckboxGroup
            id="checkbox card"
            :value.sync="selectedContractTypes"
            :items="checkboxItems"
            name="checkbox-card"
            :card="true"
            class="max-width-500"
          />
          </div>

          <div v-show="hasTM" class="max-width-740">
            <hr />
            <ATATTextArea
              id="JustificationForTM"
              :value.sync="justification"
              label="Please provide justification for your T&amp;M contract type."
              helpText="Briefly describe why the duration of work and/or costs cannot 
                be reasonably estimated and what control measures will be taken to 
                monitor contractor performance and costs in labor. 
                <a role='button' id='JustificationLearnMore' 
                  @click='openSlideoutPanel()'>Learn more</a>"
              maxChars="2000"
            />
          </div>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATTextArea,
  },
})

export default class ContractType extends Vue {
  private selectedContractTypes: string[] = [];
  
  public get hasTM(): boolean {
    return this.selectedContractTypes.indexOf("T&M") > -1;
  }

  private justification = "";
  private checkboxItems = [
    {
      id: "FFPCheckbox",
      label: "Firm-fixed-price (FFP)",
      value: "FFP",
      description: `<span class='badge badge-blue d-inline-block mr-1'>Recommended</span>
        <span class="font-size-14 text-base">Standard contract type</span>`,
    },
    {
      id: "TMCheckbox",
      label: "Time-and-materials (T&M)",
      value: "T&M",
      description: "This applies to any contract line items other than travel.",
    }

  ];

}
</script>
