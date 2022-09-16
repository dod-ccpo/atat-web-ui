<template>
  <ATATRadioGroup
    id="ExceptionRadioOptions"
    :legend="legend" 
    :value.sync="_selectedException"
    :items="isForm ? exceptionOptions : exceptionOptionsPreview"
    name="fair-opportunity-exceptions-radio-group"
    :class="classes"
    :rules="rules"
    :isForm="isForm"
  >
  </ATATRadioGroup>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})

export default class FairOppExceptions extends Vue {
  @Prop({default: true}) private isForm!: boolean;
  @Prop({default: ""}) private legend!: string;
  @Prop({default: ""}) private classes!: string;
  @PropSync("selectedException", { default: "" }) private _selectedException!: string | null;
  @Prop() private rules?: [];
  
  private exceptionOptions: RadioButton[] = [
    {
      id: "OnlyOneCSPCapable",
      label: `Only one CSP is capable of providing the supplies or services required at the level 
        of quality required because the supplies or services ordered are unique or highly 
        specialized. <span class="text-base">FAR 16.505(b)(2)(i)(B)</span>`,
      value: "YES_FAR_16_505_B_2_I_B",
      readonly: !this.isForm,
    },
    {
      id: "AllFair",
      label: `The order must be issued on a sole-source basis in the interest of economy and 
        efficiency because it is a logical follow-on to an order already issued under the JWCC 
        contracts, provided that all awardees were given a fair opportunity to be considered for 
        the original order. <span class="text-base">FAR 16.505(b)(2)(i)(C)</span>`,
      value: "YES_FAR_16_505_B_2_I_C",
      readonly: !this.isForm,
    },
    {
      id: "Urgent",
      label: `The agency need for supplies or services is so urgent that providing a fair 
        opportunity would result in unacceptable delays. <span class="text-base">
        FAR 16.505(b)(2)(i)(A)</span><br /><span class="font-size-14 text-base">
        NOTE: This is an uncommon exception.<span>`,
      value: "YES_FAR_16_505_B_2_I_A",
      readonly: !this.isForm,
    },
    {
      id: "NoneApply",
      label: "None of these exceptions apply to this acquisition.",
      value: "NO_NONE",
      readonly: !this.isForm,
    },
  ];

  public exceptionOptionsPreview: RadioButton[] =  [
    {
      id: "YesFOException",
      label: "Yes, a Justification & Approval is required.",
      value: "YES",
      readonly: !this.isForm,
    },
    {
      id: "NoFOException",
      label: "No.",
      value: "NO_NONE",
      readonly: !this.isForm,
    }
  ];

  @Watch("selectedException")
  public exceptionChange(value: string): void {
    debugger;
    if (!this.isForm && value !== "YES" && this._selectedException !== "NO_NONE") {
      this._selectedException = "YES";
    }

  }

  // public async mounted(): Promise<void> {
  //   debugger;
  //   if (!this.isForm && this._selectedException !== "NO_NONE") {
  //     this._selectedException = "YES";
  //   }
  // }
}
</script>
