<template>
  <div v-if="isForm">
    <ATATTextField
      id="DoDAAC"
      label="DoD Activity Address Code (DoDAAC)"
      class="_input-max-width"
      :tooltipText="tooltipText"
      :value.sync="_dodaac"
      :mask="['^[0-9A-Za-z]{1,6}$']"
      :isMaskRegex="true"
      :rules="rules"
    />
  </div>
  <div v-else> 
    <dl>
      <dt>Department of Defense Activity Address Code (DoDAAC):</dt>
      <dd>{{ _dodaac }}</dd>
    </dl>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextField,
  },
})
export default class DoDAAC extends Vue {
  @PropSync("dodaac") private _dodaac!: string;
  @Prop() private label!: string;
  @Prop() private tooltipText!: string;
  @Prop({ default: true}) private isForm!: boolean;
  @Prop({ default: false}) private isWizard!: boolean;
  @Prop() private rules!: [];
}
</script>
