<template>
  <ATATRadioGroup                                  
    class="max-width-540"
    id="currentContractOptions"
    :card="isCard"
    :items="currentContractOptions" 
    :value.sync="selectedOption"
    :rules="[$validators.required('Please select an option')]"            
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
  @Prop({default: true}) private isCard!: boolean;
  @Prop({default: ""}) private legend!: string;
  @Prop({default: ""}) private classes!: string;
  @PropSync("selectedOption", { default: "" }) private _selectedOption!: string | null;
  @Prop() private rules?: [];
  
  private currentContractOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes. There is a previous contract for this effort.",
      value: "YES",
    },
    {
      id: "No",
      label: "No. This is a new requirement.",
      value: "NO",
    },
  ];

}
</script>
