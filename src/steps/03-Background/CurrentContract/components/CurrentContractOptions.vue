<template>
  <ATATRadioGroup                                  
    class="max-width-500"
    id="currentContractOptions"
    ref="currentContractOptions"
    name="currentContractOptions"
    :legend="legend"
    :card="card"
    :items="currentContractOptions" 
    :value="_selectedOption"
    @update:value="_selectedOption = $event"
    :rules="rules"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from '@/decorators/custom';
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})

class CurrentContractOptions extends Vue {
  @Prop({default: true}) private isForm!: boolean;
  @Prop({default: false}) private card!: boolean;
  @Prop({default: false}) private isWizard!: boolean; 
  @Prop({default: ""}) private legend!: string;
  @Prop({default: ""}) private classes!: string;
  @Prop({default: false}) private hasExceptionToFairOpportunity!: boolean;
  @PropSync("selectedOption", { default: "" }) private _selectedOption!: string | null;
  @Prop() private rules?: [];
  
  get currentContractOptions(): RadioButton[]{
    return [
      {
        id: "Yes_CurrentContract",
        label: this.isWizard ? this.getYesLabel() : "Yes.",
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

  public getYesLabel():string{
    return "Yes. There is a current" + 
      (this.hasExceptionToFairOpportunity ? " or previous " : " ") +
      "contract for this effort."
  }

}

export default toNative(CurrentContractOptions)
</script>
