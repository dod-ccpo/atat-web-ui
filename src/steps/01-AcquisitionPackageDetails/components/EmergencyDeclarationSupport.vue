<template>
  <div :class="topMarginClass + ' d-flex align-start flex-column'">
    <ATATRadioGroup
      :id="id"
      :legend="legend" 
      :value.sync="_emergencyDeclaration"
      :items="radioGroupItems"
      name="emergency-declaration-support-requirement-radio-group"
      class="mt-3"
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
  @Prop({default: "mt-6"}) private topMarginClass!: string;
  @PropSync("rules") private _rules!: "";

  private radioGroupItems: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes",
      value: "yes",
      readonly: !this.isForm,
    },
    {
      id: "No",
      label: "No",
      value: "no",
      readonly: !this.isForm,
    },
  ];
}
</script>
