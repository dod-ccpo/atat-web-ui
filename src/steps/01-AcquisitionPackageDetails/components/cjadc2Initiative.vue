<!-- eslint-disable max-len -->
<template>
    <div >
      <ATATRadioGroup
        :id="id"
        :legend="legend" 
        :value.sync="_cjadc2Initiative"
        :items="radioGroupItems"
        @radioButtonSelected='radioButtonSelected'
        name="cjadc2-initiative-radio-group"
        :rules="_rules"
        tooltipText="Joint All-Domain Command and Control (JDAC2) is the Department 
                of Defense's (DoD's) concept to connect sensors from all of the military services-Air 
                Force, Army, Marine Corps, Navy, and Space Force-into a single network."
      >
      </ATATRadioGroup>
      <div v-if='_cjadc2Initiative=== "YES"'>
        <ATATTextField
          label="Estimate the total percentage of funds that will go towards these efforts."
          :value.sync='_cjadc2Percentage'
          id="CJADC2PricePercentage"
          :v-model='_cjadc2Percentage'
          :rules="[
            $validators.isBetween(1, 100, 'Please enter a number between 1-100'),
            $validators.required('Please enter a number between 1-100'),
          ]"
          placeHolder="1-100"
          suffix="%"
          width="100"
        />
        <a href='https://media.defense.gov/2022/Mar/17/2002958406/-1/-1/1/SUMMARY-OF-THE-JOINT-ALL-DOMAIN-COMMAND-AND-CONTROL-STRATEGY.PDF'>Learn More</a>
      </div>
    </div>
</template>
 
<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Prop, PropSync} from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import { RadioButton } from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField
  },
})
export default class CJADC2Initiative extends Vue {
  @PropSync("cjadc2Initiative", { default: "" }) private _cjadc2Initiative!: string | null;
  @PropSync("cjadc2Percentage", {}) public _cjadc2Percentage!: number | null;
  @Prop({default: "cjadc2-initiative"}) private id!: string;
  @Prop({default: true}) private isForm!: boolean;
  @Prop({default: ""}) private legend!: string;
  @PropSync("rules") private _rules!: "";

  private radioGroupItems: RadioButton[] = [
    {
      id: "Yes_cjadc2Initiative",
      label: "Yes.",
      value: "YES",
      readonly: !this.isForm,
    },
    {
      id: "No_cjadc2Initiative",
      label: "No.",
      value: "NO",
      readonly: !this.isForm,
    },
  ];

  public radioButtonSelected(selectedValue: string):void {
    this._cjadc2Percentage = selectedValue === "NO"
      ? null
      : this._cjadc2Percentage
  }
    
}
</script>
