<template>
  <div v-if="isForm">
    <ATATTextField
        :id="id"
        :label="label"
        :rules="rules"
        class="_input-max-width"
        :value.sync="_value"
        :isMaskRegex="true"
        :mask="['^[a-zA-Z0-9]*$']"
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
import {Component, Prop, PropSync} from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextField
  },
})
export default class ContractNumber extends Vue {
  @PropSync("value", {default: "contract number goes here"})
  private _value!: number;
  @Prop({default: "ContractNumber"}) private id!: string;
  @Prop({default: "Contract Number"}) private label!: string;
  @Prop({default: "contract number goes here"}) private helpText!: string;
  @Prop({default: true}) private isForm!: boolean;
  @PropSync("rules") private _rules!: "";
}
</script>
