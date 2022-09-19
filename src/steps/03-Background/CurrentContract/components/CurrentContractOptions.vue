<template>
  <div>
    <ATATRadioGroup                                  
      class="max-width-500"
      id="currentContractOptions"
      name="currentContractOptions"
      :legend="legend"
      :card="isCard"
      :items="currentContractOptions" 
      :value.sync="_selectedOption"
      :rules="[$validators.required('Please select an option')]"            
    />
  </div>
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
  @Prop({default: true}) private isCard!: boolean;
  @Prop({default: true}) private isWizard!: boolean;
  
  @Prop({default: ""}) private legend!: string;
  @Prop({default: ""}) private classes!: string;
  @PropSync("selectedOption", { default: "" }) private _selectedOption!: string | null;
  @Prop() private rules?: [];
  
  private currentContractOptions: RadioButton[] = this.isWizard ? [
    {
      id: "Yes_CurrentContract",
      label: "Yes. There is a previous contract for this effort.",
      value: "YES",
    },
    {
      id: "No_CurrentContract",
      label: "No. This is a new requirement.",
      value: "NO",
    },
  ] : [
    {
      id: "Yes_CurrentContract",
      label: "Yes.",
      value: "YES",
      readonly: !this.isForm,
    },
    {
      id: "No_CurrentContract",
      label: "No.",
      value: "NO",
      readonly: !this.isForm,
    },
  ];


}
</script>
