<template>
  <ATATRadioGroup                                  
    class="max-width-500"
    id="currentContractOptions"
    name="currentContractOptions"
    :legend="legend"
    :card="card"
    :items="currentContractOptions" 
    :value.sync="_selectedOption"
    :rules="rules"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})

export default class CurrentContractOptions extends Vue {
  @Prop({default: true}) private isForm!: boolean;
  @Prop({default: false}) private card!: boolean;
  @Prop({default: false}) private isWizard!: boolean; 
  @Prop({default: ""}) private legend!: string;
  @Prop({default: ""}) private classes!: string;
  @PropSync("selectedOption", { default: "" }) private _selectedOption!: string | null;
  @Prop() private rules?: [];
  
  private currentContractOptions: RadioButton[] = [
    {
      id: "Yes_CurrentContract",
      label: this.isWizard ? "Yes. There is a current contract for this effort." : "Yes.",
      value: "YES",
      readonly: !this.isForm,
    },
    {
      id: "No_CurrentContract",
      label: this.isWizard ? "No. This is a new requirement." : "No.",
      value: "NO",
      readonly: !this.isForm,
    },
  ];

}
</script>
