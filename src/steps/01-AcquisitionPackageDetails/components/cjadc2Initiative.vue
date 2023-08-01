<!-- eslint-disable max-len -->
<template>
    <div >
      <ATATRadioGroup
        :id="id"
        :legend="legend" 
        :value.sync="_cjadc2Initiative"
        :items="radioGroupItems"
        @helpTextLinkClicked="helpTextLinkClicked"
        :isHelpTextLinkExternal="true"
        @radioButtonSelected='radioButtonSelected'
        name="cjadc2-initiative-radio-group"
        :rules="_rules"
        :help-text-link="helpTextLink"
        :helpText="helpText"
      >
      </ATATRadioGroup>
      <div v-if='_cjadc2Initiative=== "YES"' class="mt-4">
        <ATATTextField
          label="Estimate the total percentage of funds that will go towards these efforts."
          :value.sync='_cjadc2Percentage'
          id="CJADC2PricePercentage"
          :v-model='_cjadc2Percentage'
          :rules="[
            $validators.isBetween(1, 100, percentageErrorMessage),
            $validators.required(percentageErrorMessage),
          ]"
          placeHolder="1-100"
          suffix="%"
          width="100"
        />
      </div>
    </div>
</template>
 
<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Prop, PropSync} from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import { LegendLink, RadioButton } from "types/Global";

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
  @Prop({default: ""}) private helpText!: string;
  @PropSync("rules") private _rules!: "";
  public helpTextLink: LegendLink = {
    id: "LearnMore",
    linkText: "Learn more",
    emitText: "helpTextLinkClicked"
  }

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

  public percentageErrorMessage = "Please enter a number between 1-100";

  public radioButtonSelected(selectedValue: string):void {
    this._cjadc2Percentage = selectedValue === "NO"
      ? null
      : this._cjadc2Percentage
  }

  public helpTextLinkClicked(e:Event):void{
    // eslint-disable-next-line max-len
    const link = "https://media.defense.gov/2022/Mar/17/2002958406/-1/-1/1/SUMMARY-OF-THE-JOINT-ALL-DOMAIN-COMMAND-AND-CONTROL-STRATEGY.PDF"
    window.open(link, "_blank");
  }
    
}
</script>
