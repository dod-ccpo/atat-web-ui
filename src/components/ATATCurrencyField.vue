<template>
  <atat-text-field
    ref="field"
    :rules="rules"
    :prefix="prefix"
    @focus="onFocus"
    @keyup="onKeyUp"
    :error-messages="errorMessages"
    v-bind="$attrs"
    @change="onChange"
    @blur="onBlur"
    :value.sync="model"
    :label="label"
    :helpText="helpText"
  >
  </atat-text-field>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import { VTextField } from "vuetify/lib";

@Component({})
export default class ATATCurrencyField extends VTextField {
  @PropSync("value", { default: "" }) private _value!: string;
  @Prop({ default: "" }) private prefix!: string;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: false }) private success!: boolean;
  @Prop({ default: () => [] }) private errorMessages!: string[];
  @Prop({ default: "" }) private helpText!: string;

  allowNegative = false;
  model = "";
  numberValue!: number;
  isMasked = true;
  hasFocus = false;
  thousandsSeperator = ",";
  decimalSeperator = ".";
  thousandsSeparatorRegex = new RegExp(`\\${this.thousandsSeperator}`, "g");
  decimalSeparatorRegex = new RegExp(`\\${this.decimalSeperator}`, "g");
  languageCode = "en-US";

  private formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  private onChange() {
    
    //todo: fill out change

  }

  private onBlur() {
     //todo: fill out blur
  } 

 private onKeyUp(){

   //todo: fill out onkey up
 }
  private tryParseFloat(str: string, defaultValue?: number): number {
    var retValue = defaultValue || 0;
    let value = str.replace("$", "");

    if (str !== null) {
      if (str.length > 0) {
        const v = parseFloat(value);

        if (!isNaN(v)) {
          retValue = v;
        }
      }
      return retValue;
    }
    return NaN;
  }

  @Watch("value")
  onValueChanged() {
    this.numberValue = this.tryParseFloat(this._value);
    this.model = this.numberValue.toString();
  }
}
</script>
