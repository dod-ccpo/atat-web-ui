<template>
  <div class="d-flex align-start flex-column">
    <ATATRadioGroup
      :id="id"
      :legend="legend" 
      :value.sync="_emergencyDeclaration"
      :items="radioGroupItems"
      name="emergency-declaration-support-requirement-radio-group"
      :rules="_rules"
    >
    </ATATRadioGroup>
  </div>
</template>
 
<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Prop, PropSync} from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})
export default class EmergencyDeclarationSupport extends Vue {
  @PropSync("emergencyDeclaration", { default: "" })
  private _emergencyDeclaration!: string | null;
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
</script>
