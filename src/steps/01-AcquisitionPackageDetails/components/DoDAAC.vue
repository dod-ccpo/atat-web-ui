<template>
  <div v-if="isForm">
    <ATATTextField
      :id="corOrAcor + '_DoDAAC'"
      :ref="corOrAcor + '_DoDAACRef'"
      class="_input-max-width"
      label="DoD Activity Address Code (DoDAAC)"
      tooltipText="A DoDAAC is a 6-character code that uniquely identifies a 
      unit, activity, or organization that has the authority to request, 
      contract for, or fund/pay bills for materials and services."
      :value="_dodaac"
      @update:value="_dodaac = $event"
      :mask="['^[0-9A-Za-z]{1,6}$']"
      :isMaskRegex="true"
      :rules="rules"
      @focus="onFocus"
      @blur="onBlur"
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
 
import { Component, Prop, Vue, toNative } from "vue-facing-decorator"
import { PropSync } from "@/decorators/custom";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextField,
  },
})
class DoDAAC extends Vue {
  @PropSync("dodaac") private _dodaac!: string;
  @Prop() private corOrAcor!: string;
  @Prop({ default: true}) private isForm!: boolean;
  @Prop({ default: false}) private isWizard!: boolean;
  @Prop() private rules!: [];

  private valueOnFocus = "";

  private onFocus(val: string): void {
    this.valueOnFocus = val;
  }

  private onBlur(val: string): void {
    if (val !== this.valueOnFocus) {
      this.$emit("valueChange", val, this.corOrAcor);
    }
  }
}
export default toNative(DoDAAC)
</script>
