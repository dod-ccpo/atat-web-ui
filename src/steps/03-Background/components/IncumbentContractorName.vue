<template>
  <div v-if="isForm">
    <ATATTextField
      :id="id"
      :label="label"
      :rules="rules"
      class="_input-max-width"
      :value.sync="_value"
    />
  </div>
  <div v-else> 
      <dl>
        <dt>{{ label }}:</dt>
        <dd>{{ _value }}</dd>
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
export default class IncumbentContractorName extends Vue {
  @PropSync("value", {default: "incumbent contractor name goes here"})
  private _value!: string;
  @Prop({default: "IncumbentContractorName"}) private id!: string;
  @Prop({default: "Incumbent Contractor Name"}) private label!: string;
  @Prop({ default: "incumbent contractor name goes here" }) private helpText!: string;
  @Prop({ default: true}) private isForm!: boolean;
  @PropSync("rules") private _rules!: "";
}
</script>
