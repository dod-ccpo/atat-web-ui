<template>
  <div v-if="isForm">
    <ATATTextField
      :id="id"
      :label="label"
      :rules="_rules"
      class="_input-max-width"
      :value="_value"
      @update:value="_value = $event"
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
import { PropSync } from '@/decorators/custom';
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextField,
  },
})
class IncumbentContractorName extends Vue {
  @PropSync("value", {default: ""}) private _value!: string;
  @Prop({default: "IncumbentContractorName"}) private id!: string;
  @Prop({default: "Incumbent Contractor Name"}) private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: true}) private isForm!: boolean;
  @PropSync("rules") private _rules!: "";
}

export default toNative(IncumbentContractorName)
</script>
