
<template>
  <section class="mt-10">
    <h2 class="form-section-heading">
      Your COR’s Contact Information
    </h2>

    <ATATRadioGroup
      legend="What role best describes your COR’s affiliation with the DoD?"
      id="ContactAffiliation"
      :items="contactAffiliations"
      :value.sync="selectedContactAffiliation"
    />



  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import { RadioButton, SelectData } from "../../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
  }
})

export default class ContactInfoForm extends Vue {

  //props

  @Prop({default: true}) private isACOR!: boolean;

  // data

  private selectedContactAffiliation = "";
  private contactAffiliations: RadioButton[] = [
    {
      id: "Military",
      label: "Military",
      value: "MIL",
    },
    {
      id: "Civilian",
      label: "Civilian",
      value: "CIV",
    },
  ];

  // computed
  
  get corOrAcor(): string {
    return this.isACOR ? "ACOR" : "COR";
  }

}
</script>

           