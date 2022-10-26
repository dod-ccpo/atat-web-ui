
<template>
  <div class="container-max-width">
    <h1 class="page-header">
      Now let’s review compliance standards when no technical proposal is required
    </h1>
    <Callout 
    />
    
    <ATATRadioGroup
      id="CustomStandards"
      :items="radioGroupItems"
      :legend="radioGroupLegend"
      :value.sync="selectedRadioItem"
      :rules="[
        $validators.required('Please select an option.'),
      ]"
    />

    <section id="CustomSpecifications" v-show="selectedRadioItem === 'YES'">
      <hr>
      ... to be completed in AT-8135 ...
    </section>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import Callout from "./components/Callout.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import { EvaluationPlanDTO } from "@/api/models";
import { RadioButton } from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
    Callout,
  }
})

export default class LumpSum extends Vue {

  public evalPlan: EvaluationPlanDTO = {
    /* eslint-disable camelcase */
    source_selection: "",
    method: "",
    has_custom_specifications: false,
    standard_specifications: [],
    custom_specifications: [],
    /* eslint-enable camelcase */
  }

  public selectedRadioItem = "";
  public radioGroupItems: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes, I want to write my own custom compliance standard(s).",
      value: "YES",
    },    
    {
      id: "No",
      label: "No.",
      value: "NO",
    },    
  ];
  public radioGroupLegend = `In addition to the required standards listed above, 
    do you want to include any custom compliance standards that CSPs must meet to 
    be determined technically acceptable?`;

  public savedData: EvaluationPlanDTO = {
    // eslint-disable-next-line camelcase
    source_selection: "",
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = AcquisitionPackage.getEvaluationPlan;
    if (storeData) {
      this.evalPlan = storeData;
      this.savedData = storeData;
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }


}
</script>
