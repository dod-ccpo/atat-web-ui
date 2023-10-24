<template>
  <div v-if="isForm">
    <ATATTextField
        :id="id"
        :label="label"
        :rules="_rules"
        class="_input-max-width"
        :value.sync="_value"
        :optional="isOptional"
        :tooltip-text="tooltipText"
        :isMaskRegex="true"
        :mask="['^[a-zA-Z0-9]*$']"
    />
  </div>
  <div v-else>
    <dl :id="id">
      <dt>{{ label }}:</dt>
      <dd>{{ _value }}</dd>
    </dl>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Prop } from "vue-facing-decorator";
import { PropSync } from '@/decorators/custom';
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextField
  },
})
export default class TaskOrderNumber extends Vue {
  @PropSync("value", {default: "task order number goes here"})
  private _value!: number;
  @Prop({default: "TaskOrderNumber"}) private id!: string;
  @Prop({default: "Task Order Number"}) private label!: string;
  @Prop({default: "task order number goes here"}) private helpText!: string;
  @Prop({default: true}) private isForm!: boolean;
  @Prop({default: true}) private isOptional!: boolean;
  @Prop({default: "task order number goes here"}) private tooltipText!: string;
  @PropSync("rules") private _rules!: "";
}
</script>
