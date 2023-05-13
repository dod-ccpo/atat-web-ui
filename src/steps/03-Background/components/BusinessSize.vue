<template>
  <div>
    <ATATRadioGroup
      v-if="isForm"
      id="businessSizeOptions"
      :legend="legend" 
      :value.sync="_businessSize"
      :items="businessSizeOptions"
      name="business-size-radio-group"
      :class="classes"
      :rules="rules"
      :isForm="true"
    />
    <ATATRadioGroup
      v-if="!isForm"
      id="businessSizeOptions"
      :legend="legend" 
      :value="selectedBusinessSizeReadOnly"
      :items="businessSizeOptionsReadOnly"
      name="business-size-radio-group"
      :class="classes"
      :isForm="false"
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

export default class BusinessSize extends Vue {
  @Prop({default: true}) private isForm!: boolean;
  @Prop({default: ""}) private legend!: string;
  @Prop({default: ""}) private classes!: string;
  @PropSync("businessSize", { default: "" }) public _businessSize!: string | null;
  @Prop() private rules?: [];
  
  private selectedBusinessSizeReadOnly = "";

  private businessSizeOptions: RadioButton[] = [
    {
      id: "LARGE",
      label: `Large business`,
      value: "LARGE",
      readonly: !this.isForm,
    },
    {
      id: "SMALL",
      label: `Small business`,
      value: "SMALL",
      readonly: !this.isForm,
    },
    {
      id: "SMALL_BA",
      label: `8(a) small business`,
      value: "SMALL_BA",
      readonly: !this.isForm,
    },
    {
      id: "HUBZONE",
      label: `HUBZone`,
      value: "HUBZONE",
      readonly: !this.isForm,
    },
    {
      id: "SDVOSB",
      label: `Service-Disabled Veteran-Owned Small Business (SDVOSB)`,
      value: "SDVOSB",
      readonly: !this.isForm,
    },
    {
      id: "WOSB",
      label: `Women-Owned Small Business (WOSB)`,
      value: "WOSB",
      readonly: !this.isForm,
    },
    
  ];

  public businessSizeOptionsReadOnly: RadioButton[] =  [
    {
      id: "Yes_FOException",
      label: "Yes, a Justification & Approval is required.",
      value: "YES",
      readonly: true,
    },
    {
      id: "No_FOException",
      label: "No.",
      value: "NO",
      readonly: true,
    }
  ];

  public async setReadOnly(): Promise<void> {
    if (!this.isForm) {
      this.selectedBusinessSizeReadOnly = this._businessSize !== "NO_NONE" 
        ? "YES"
        : "NO";
    }
  }

  public async mounted(): Promise<void> {
    await this.setReadOnly();
  }
}
</script>
