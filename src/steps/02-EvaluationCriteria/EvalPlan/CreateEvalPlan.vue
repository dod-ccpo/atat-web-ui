
<template>
  <div class="container-max-width">
    <h1 class="page-header">
      Let’s work on an evaluation plan for your requirement
    </h1>
    <div class="copy-max-width">
      <p class="page-intro">
        In this section, we’ll establish the basis for how your acquisition will 
        be evaluated to assist you and your Contracting Officer (KO) during the 
        source selection process. To begin, select the most applicable evaluation 
        method below. In the following screens, we’ll identify any compliance standards, 
        differentiators, or assessment areas that CSPs must address in their response 
        to the solicitation. You’ll have an opportunity to customize these standards 
        for your specific needs.
      </p>

      <ATATRadioGroup 
        id="EvalPlanOptions"
        legend="Which source selection process is applicable to your requirement?
          <a role='button' class='font-weight-400'>Learn more</a>"
        :value.sync="selectedOption"
        :items="evalOptions"
        :rules="[
          $validators.required('Please select an option.'),
        ]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue"
import { RadioButton } from "types/Global"

@Component({
  components: {
    ATATRadioGroup,
  }
})

export default class CreateEvalPlan extends Vue {
  public selectedOption = "";
  public evalOptions: RadioButton[] = [
    {
      label: `I do not require a technical proposal. Award will be made on a 
        Lowest Price, Technically Acceptable (LPTA) basis.`,
      id: "LPTA",
      value: "LPTA"
    },
    {
      label: `I require a technical proposal. Award will be made on either a 
        LPTA or Best Value Trade-Off (BVTO) basis.`,
      id: "LPTAorBVTO",
      value: "LPTAorBVTO",
    },
    {
      label: `I would like to purchase a set lump sum dollar amount of offerings 
        from any one CSP. Award will be made to the CSP offering either the 
        “best use” or “lowest risk” solution.`,
      id: "LumpSumOneCSP",
      value: "LumpSumOneCSP",
    },
    {
      label: `I would like to purchase an equal set lump sum dollar amount of 
        offerings from each CSP. The Government will issue equal awards to each CSP.`,
      id: "LumpSumMultiCSP",
      value: "LumpSumMultiCSP",
    }
  ];
}
</script>
