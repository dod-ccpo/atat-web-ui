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
    this.updateNumberValue();
    this.format();
  }

  private onKeyUp() {
    //todo: fill out onkey up
  }

  format() {
    if (this.numberValue === undefined) return;
    let v = this.numberValue.toString();
    v = Number(this.numberValue).toLocaleString(this.languageCode);
    if (
      v.length !== 1 &&
      v.slice(v.indexOf(this.decimalSeperator) + 1).length === 1
    )
      v += "0";
    this.model = this.formatter.format(this.numberValue).replace("$", "");
  }

  private updateNumberValue() {
    let v = this.model.toString();
    let parsed;
    v = v.replace(this.thousandsSeparatorRegex, "");
    if (this.decimalSeperator !== ".")
      v = v.replace(this.decimalSeparatorRegex, this.thousandsSeperator);
    const result = this.tryParseFloat(v);
    if (!result) parsed = 0;
    else parsed = result;
    if (!this.allowNegative && result < 0) parsed = 0;
    this.numberValue = Math.round(parsed * 100) / 100;
    this.$emit("input", this.numberValue);
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

  mounted() {
    this.model = this._value;
    this.updateNumberValue();
    this.format();
  }

  @Watch("value")
  onValueChanged() {
    this.model = this._value;
    this.updateNumberValue();
  }
}
</script>
