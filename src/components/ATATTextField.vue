<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <div class="d-flex align-center" v-if="label">
      <label
        :id="id + '_text_field_label'"
        class="form-field-label mb-2 mr-1"
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
      :hide-details="counter === ''"
      :suffix="suffix"
      :style="'width: ' + width + 'px'"
      :validate-on-blur="validateOnBlur"
      :rules="rules"
      :counter="counter"
      @blur="onBlur"
      @update:error="setErrorMessage"
    >
    </v-text-field>
    <ATATErrorValidation :errorMessages="errorMessages" />
    <div v-if="helpText" class="help-text mt-2">
      {{ helpText }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATTooltip from "@/components/ATATTooltip.vue"
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import { mask } from "types/Global";
import Inputmask from "inputmask/";

@Component({
  components: {
    ATATTooltip,
    ATATErrorValidation
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
  
  @PropSync("value", { default: "" }) private _value!: string;

  //data
  private errorMessages: string[] = [];
  private onInput(v: string) {
    this._value = v;
  }

  private setErrorMessage(): void {
    Vue.nextTick(()=>{
      this.errorMessages = this.$refs.atatTextField.errorBucket;
    });
  }

  //@Events
  private onBlur(e: FocusEvent) : void{
    const input = e.target as HTMLInputElement;
    this.setErrorMessage();
    this.$emit('blur', input.value, this.extraEmitVal);
  }

  public resetValidation(): void {
    this.$refs.atatTextField.errorBucket = [];
    this.$refs.atatTextField.resetValidation();
  }

  private setMasks(): void {
    if (this.mask.length > 0){
      Vue.nextTick(()=>{
        const inputField = document.getElementById(
          this.id + '_text_field'
        ) as HTMLInputElement;

        const maskObj: mask ={
          placeholder: "",
          jitMasking: true
        }
        if (this.isMaskRegex){
          maskObj.regex = this.mask[0] || "";
        } else {
          maskObj.mask = this.mask || [];
        }
        Inputmask(maskObj).mask(inputField);
        
      })
    }
    
  }

  private mounted(): void{
    this.setMasks();
  }

}
</script>