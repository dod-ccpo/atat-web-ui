<template>
  <div v-if="isForm">
    <ATATTextField
        :id="id"
        :label="label"
        :rules="_rules"
        class="_input-max-width"
        :tooltip-text="tooltipText"
        :value="_value"
        @update:value="_value = $event"
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
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import {PropSync} from "@/decorators/custom"
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextField
  },
})
class ContractNumber extends Vue {
  @PropSync("value", {default: "contract number goes here"})
  private _value!: number;
  @Prop({default: "ContractNumber"}) private id!: string;
  @Prop({default: "Contract Number"}) private label!: string;
  @Prop({default: "contract number goes here"}) private helpText!: string;
  @Prop({default: true}) private isForm!: boolean;
  @PropSync("rules") private _rules!: "";
  @Prop({default: ""}) private tooltipText!: string;
}

export default toNative(ContractNumber)
</script>
