<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <div class="d-flex align-center mb-2" v-if="label">
      <label
        :id="id + '_text_field_label'"
        class="form-field-label mr-1"
        :for="id + '_text_field'"
      >
        {{ label }}
        <span v-if="optional" class="optional">
          Optional
        </span>
      </label>
      <ATATTooltip 
        :tooltipText="tooltipText"
        :tooltipTitle="tooltipTitle"
        :id="id"
        :label="label"
      />
    </div>
    <v-text-field
      ref="atatTextField"
      :id="id + '_text_field'"
      outlined
      dense
      :height="42"
      :value.sync="_value"
      :placeholder="placeHolder"
      @input="onInput"
      class="text-primary"
      :class="[{ 'text-right' : alignRight }]"
      :disabled="disabled"
      :hide-details="counter === ''"
      :suffix="suffix"
      :style="'width: ' + width + 'px'"
      :validate-on-blur="validateOnBlur"
      :rules="rules"
      :counter="counter"
      @blur="onBlur"
      @update:error="setErrorMessage"
      autocomplete="off"
    >
      <template v-slot:prepend-inner>
        <ATATSVGIcon
          v-if="isCurrency"
          name="currency"
          :color="iconColor"
          :width="9"
          :height="16"
          class="pt-1 mr-1"
        />
      </template>
      <template v-slot:append v-if="appendText">
        <span class="_append-text">
          {{ appendText }}
        </span>
      </template>
    </v-text-field>
    <ATATErrorValidation :errorMessages="errorMessages" v-if="showErrorMessages" />
    <div v-if="showHelpText()" class="help-text mt-2">
      {{ helpText }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATTooltip from "@/components/ATATTooltip.vue"
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { mask } from "types/Global";
import Inputmask from "inputmask/";
import { toCurrencyString, currencyStringToNumber } from "@/helpers";

@Component({
  components: {
    ATATTooltip,
    ATATErrorValidation,
    ATATSVGIcon
  },
})
export default class ATATTextField extends Vue  {
  // refs
  $refs!: {
    atatTextField: Vue & { 
      errorBucket: string[]; 
      errorCount: number 
      resetValidation(): void
    };
  }; 

  // props
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: "" }) private tooltipTitle!: string;
  @Prop({ default: "" }) private tooltipText!: string;
  @Prop({ default: "" }) private appendIcon!: string;
  @Prop({ default: "" }) private appendText!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: () => [] }) private rules!: Array<unknown>;
  @Prop({ default: ""}) private suffix!: string;
  @Prop({ default: "" }) private optional!: boolean;
  @Prop({ default: "" }) private width!: string;
  @Prop({ default: "" }) private counter!: number;
  @Prop({ default: false }) private validateOnBlur!: boolean;
  @Prop() private extraEmitVal!: string;
  @Prop({ default: ()=>[] }) private mask!: string[];
  @Prop({ default: false }) private isMaskRegex!: boolean;
  @Prop({ default: false }) private isCurrency!: boolean;
  @Prop({ default: false }) private alignRight?: boolean;
  @Prop({ default: false }) private disabled?: boolean;
  @Prop({ default: true }) private showErrorMessages?: boolean;
  @Prop({ default: false }) private hideHelpTextOnErrors?: boolean;

  @PropSync("value", { default: "" }) private _value!: string;

  //data
  private errorMessages: string[] = [];
  private onInput(v: string) {
    this._value = v;
    if (this.isCurrency) {
      this.iconColor = v ? "base-darkest" : "base-light";
    }
  }

  private setErrorMessage(): void {
    Vue.nextTick(()=>{
      this.errorMessages = this.$refs.atatTextField.errorBucket;
    });
  }
  private iconColor = "base-light";

  //@Events
  private onBlur(e: FocusEvent) : void{
    const input = e.target as HTMLInputElement;
    this.setErrorMessage();
    this.$emit('blur', input.value, this.extraEmitVal);
    if (this.isCurrency) {
      this._value = toCurrencyString(currencyStringToNumber(input.value));
    }   
  }

  public resetValidation(): void {
    this.$refs.atatTextField.errorBucket = [];
    this.$refs.atatTextField.resetValidation();
  }

  private setMasks(): void {
    const maskObj: mask = {};

    if (this.isCurrency){
      maskObj.alias = "currency";
      maskObj.groupSeparator = ",";
      maskObj.digits = 2;
      maskObj.autoGroup = true;
      maskObj.digitsOptional = false;
      maskObj.rightAlign=false;
    } else if (this.mask.length > 0){
      if (this.isMaskRegex){
        maskObj.regex = this.mask[0] || "";
      } else {
        maskObj.mask = this.mask || [];
      }
    }
    
    if (Object.keys(maskObj).length>0){
      maskObj.placeholder="";
      maskObj.jitMasking=true;
      Vue.nextTick(()=>{
        const inputField = document.getElementById(
          this.id + '_text_field'
        ) as HTMLInputElement;
        Inputmask(maskObj).mask(inputField);
      });
    }
  }

  private mounted(): void{
    this.setMasks();
    if (this.isCurrency) {
      this.iconColor = this._value || this.disabled ? "base-darkest" : "base-light";
    }
  }

  private showHelpText(): boolean {
    if(this.errorMessages.length && this.hideHelpTextOnErrors){
      return false;
    }
    return  this.helpText.length > 0;
  }

}
</script>