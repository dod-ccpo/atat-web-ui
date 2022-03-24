<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s see if you qualify for an exception to the fair opportunity process
          </h1>

          <ATATAlert type="info" :showIcon="false" class="copy-max-width my-10">
            <template v-slot:content>
              <h2>Fair opportunity</h2>
              <p class="mt-2 mb-0">
                Each Cloud Service Provider (CSP) available within the JWCC contract must be given 
                a fair opportunity to be considered for task orders exceeding the micro-purchase 
                threshold, unless a statutory exception applies. Any exceptions will require 
                written justification, in accordance with 
                  <a href="#" target="_blank" class="text-link">
                    <span class="external-link">FAR 16.505(b)(2)</span>
                  </a>.
                We will help you 
                complete justification documentation, if needed.
              </p>
            </template>
          </ATATAlert>

          <ATATRadioGroup
            class="copy-max-width mb-10"
            id="ContactAffiliation"
            legend="Based on your market research, do any of the following exceptions to fair 
              opportunity apply to your acquisition?"
            :items="exceptionOptions"
            :value.sync="selectedException"
          />

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue"

import { RadioButton } from "../../../types/Global";

@Component({
  components: {
    ATATAlert,
    ATATRadioGroup,
  },
})

export default class FairOpportunity_Exceptions extends Vue {
  private selectedException = "";
  private exceptionOptions: RadioButton[] = [
    {
      id: "OnlyOneCSPCapable",
      label: `Only one CSP is capable of providing the supplies or services required at the level 
        of quality required because the supplies or services ordered are unique or highly 
        specialized. <span class="text-base">FAR 16.505(b)(2)(i)(B)</span>`,
      value: "OnlyOneCSPCapable",
    },
    {
      id: "AllFair",
      label: `The order must be issued on a sole-source basis in the interest of economy and 
        efficiency because it is a logical follow-on to an order already issued under the JWCC 
        contracts, provided that all awardees were given a fair opportunity to be considered for 
        the original order. <span class="text-base">FAR 16.505(b)(2)(i)(C)</span>`,
      value: "AllFair",
    },
    {
      id: "NoneApply",
      label: "None of these exceptions apply to this acquisition.",
      value: "NoneApply",
    },
  ];

}
</script>
