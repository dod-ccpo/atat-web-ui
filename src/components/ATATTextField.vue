<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <div class="d-flex align-center mb-2" v-if="label">
      <label
        :id="id + '_text_field_label'"
        class="form-field-label mr-1"
        :class="{ 'd-sr-only': labelSrOnly }"
        :for="id + '_text_field'"
      > 
        <span v-html="label"></span>
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

    <div 
      class="_atat-textfield d-flex _input-wrapper" 
      :class="{
        '_append-dropdown' : appendDropdown,
        'is-errored': errorMessages.length>0 }"
    >
      <v-text-field
        ref="atatTextField"
        :id="id + '_text_field'"
        variant="outlined"
        density="compact"
        :model-value="_value"
        @update:modelValue="_value = $event"
        :placeholder="placeHolder"
        class="text-primary"
        :class="[{ 'text-right' : alignRight }]"
        :disabled="disabled"
        :hide-details="counter.toString() === ''"
        :suffix="suffix"
        :style="'max-width: ' + width + 'px; width: ' + width + 'px'"
        :rules="rules"
        :counter="counter"
        @blur="onBlur"
        @focus="onFocus"
        autocomplete="off"
        :type="type"
        @keypress="filterNumbers($event)"
        :validate-on="validationString"
      >

        <template v-slot:prepend-inner>
          <ATATSVGIcon
            v-if="isCurrency"
            name="currency"
            :color="getIconColor"
            :width="9"
            :height="16"
            class="mr-1 mt-n1"
          />
        </template>
        <template v-slot:append-inner v-if="appendText">
          <span class="_append-text">
            {{ appendText }}
          </span>
        </template>
      </v-text-field>
      <ATATSelect
        v-if="appendDropdown"
        ref="atatSelectRef"
        :id="id"
        :items="dropdownOptions"
        :showSelectedValue="true"
        :selectedValue="_selectedDropdownValue"
        @update:selectedValue="_selectedDropdownValue = $event"
        @errorMessage = "addDropDownErrorMessage"
        :rules="dropDownRules"
      /> 
    </div>


    <ATATErrorValidation :errorMessages="errorMessages" v-if="showErrorMessages" />
    <div v-if="showHelpText()" class="help-text mt-2">
      {{ helpText }}
    </div>
  </div>
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import { ComponentPublicInstance } from "vue";
import { Component, Prop, Watch, Vue, toNative } from "vue-facing-decorator";
import {PropSync} from "@/decorators/custom";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { mask, SelectData, ValidationRule } from "types/Global";
import Inputmask from "inputmask/";
import { toCurrencyString, currencyStringToNumber } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  emits: ["errorMessage", "blur", "focus"],
  components: {
    ATATTooltip,
    ATATErrorValidation,
    ATATSelect,
    ATATSVGIcon,
  },
})
class ATATTextField extends Vue  {
  // refs
  $refs!: {
    atatTextField: ComponentPublicInstance & {
      validate: () => Promise<string[]>;
      resetValidation(): void
    },
    atatSelectRef: ComponentPublicInstance & {
      validate: () => Promise<string[]>;
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
  @Prop({ default: () => [] }) private rules!: ValidationRule[];
  @Prop({ default: () => [] }) private dropDownRules!: ValidationRule[];
  @Prop({ default: ""}) private suffix!: string;
  @Prop({ default: "" }) private optional!: boolean;
  @Prop({ default: "" }) private width!: string;
  @Prop({ default: "" }) private counter!: number;
  @Prop({ default: true }) private validateOnBlur!: boolean;
  @Prop() private extraEmitVal!: string;
  @Prop({ default: ()=>[] }) private mask!: string[];
  @Prop({ default: false }) private isMaskRegex!: boolean;
  @Prop({ default: false }) private isCurrency!: boolean;
  @Prop({ default: false }) private isFormattedNumber!: boolean;
  @Prop({ default: false }) private alignRight?: boolean;
  @Prop({ default: false }) private disabled?: boolean;
  @Prop({ default: true }) private showErrorMessages?: boolean;
  @Prop({ default: false }) private hideHelpTextOnErrors?: boolean;
  @Prop({ default: "text" }) private type?: string;
  @Prop({ default: true }) private allowDecimals?: boolean;
  @Prop({ default: false }) private appendDropdown?: boolean;
  @Prop() private dropdownOptions?: SelectData[];
  @Prop( {default: false }) private labelSrOnly?: boolean;
  @Prop({ default: true }) private allowZeroDefault?: boolean;
  @Prop({ default: false }) private isManuallyErrored?: boolean;

  @PropSync("selectedDropdownValue") private _selectedDropdownValue?: string;
  @PropSync("value", { default: "" }) private _value!: string;

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch('validateFormNow')
  public validateNowChange(): void {
    this.setErrorMessage()
  }

  //data
  private errorMessages: string[] = [];

  public get validationString(){
    return this.validateOnBlur ? "blur" : undefined
  }

  public setErrorMessage(): void {
    this.errorMessages = [];
    if (this.validateOnBlur) {
      this.$refs.atatTextField.validate().then(
        async (response: string[]) => {
          if (response.length>0){
            this.errorMessages = [...response];
            this.$emit('errorMessage', this.errorMessages);
          }
        }
      );
    
    } else {
      this.resetValidation();
    }
  }

  //@Events
  public addDropDownErrorMessage(errorMsgs: string[]): void{
    this.errorMessages = [...errorMsgs]
  }

  public onBlur(e: FocusEvent) : void{
    const input = e.target as HTMLInputElement;
    if (this.validateOnBlur) {
      this.setErrorMessage();
      if (this.isCurrency) {
        const currStr = toCurrencyString(currencyStringToNumber(input.value) || 0);
        this._value = currStr === "0.00" && !this.allowZeroDefault ? "" : currStr;
      }
    } else {
      this.resetValidation();
    }
    this.$emit('blur', input.value, this.extraEmitVal);
  }

  public onFocus(e: FocusEvent): void {
    const input = e.target as HTMLInputElement;
    this.$emit('focus', input.value, this.extraEmitVal);
  }

  public resetValidation(): void {
    this.errorMessages = [];
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
    } else if (this.isFormattedNumber) {
      maskObj.alias = "decimal";
      maskObj.groupSeparator = ",";
      maskObj.digits = 0;
      maskObj.autoGroup = true;
      maskObj.digitsOptional = true;
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
      this.$nextTick(()=>{
        const inputField = document.getElementById(
          this.id + '_text_field'
        ) as HTMLInputElement;
        Inputmask(maskObj).mask(inputField);
      });
    }
  }

  private mounted(): void{
    this.setMasks();
  }

  private get getIconColor(): string {
    if(this.isManuallyErrored){
      return "error"
    }
    return this._value || this.disabled ? "base-darkest" : "base-light";    
  }

  private showHelpText(): boolean {
    if(this.errorMessages?.length && this.hideHelpTextOnErrors){
      return false;
    }
    return this.helpText?.length > 0;
  }

  public filterNumbers(evt: KeyboardEvent): void {
    if (this.type === "number") {
      const keyPressed = evt.key.toString();
      const regex = this.allowDecimals
        ? /^[0-9]*\.?[0-9]*$/
        : /^[0-9]+$/
      if (!regex.test(keyPressed)) {
        evt.preventDefault();
      }
    }
  }

}
export default toNative(ATATTextField)
</script>
