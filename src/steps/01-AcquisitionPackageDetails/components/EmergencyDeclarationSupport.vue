<template>
  <div class="d-flex align-start flex-column">
    <ATATRadioGroup
      :ref="id + 'radioButtonGroupRef'"
      :id="id"
      :legend="legend" 
      :value="_emergencyDeclaration"
      @update:value="_emergencyDeclaration = $event"
      :items="radioGroupItems"
      name="emergency-declaration-support-requirement-radio-group"
      :rules="_rules"
    >
    </ATATRadioGroup>
  </div>
</template>
 
<script lang="ts">
/* eslint-disable camelcase */
 
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})
class EmergencyDeclarationSupport extends Vue {
  @PropSync("emergencyDeclaration", { default: "" }) private _emergencyDeclaration!: string | null;
  @Prop({default: "emergency-declaration-support-requirement"}) private id!: string;
  @Prop({default: true}) private isForm!: boolean;
  @Prop({default: ""}) private legend!: string;
  @PropSync("rules") private _rules!: "";

  private radioGroupItems: RadioButton[] = [
    {
      id: "Yes_EmergencyDeclaration",
      label: "Yes.",
      value: "YES",
      readonly: !this.isForm,
    },
    {
      id: "No_EmergencyDeclaration",
      label: "No.",
      value: "NO",
      readonly: !this.isForm,
    },
  ];
}
export default toNative(EmergencyDeclarationSupport)
</script>
