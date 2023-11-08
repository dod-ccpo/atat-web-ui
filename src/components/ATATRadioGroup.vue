<template>
  <v-form :id="id+'_radio_group_control'" 
    ref="radioButtonGroup"
    :lazy-validation="true">
    <v-radio-group
      class="_atat-radio-group"
      :hide-details="false"
      v-model="_selectedValue"
      :rules="rules"
      :error="hasErrors"
    >
      <fieldset>
        <div class="d-flex" :class="{ 'mb-3' : !helpText }">
          <legend
            v-if="legend"
            class="form-field-label pb-0 mr-2"
            :class="{ 'd-sr-only': legendSrOnly, 'font-weight-normal': legendFontNormalWeight }"
          >
            {{ legend }}
            <span v-if="legendLink">
              <a 
                role="button"
                tabindex="0"
                class="ml-1 font-weight-400"
                :id="legendLink.id"
                @click="legendLinkClicked"
                @keydown.enter="legendLinkClicked"
                @keydown.space="legendLinkClicked"
              >
                {{ legendLink.linkText }}
              </a>
            </span>
          </legend>
          <ATATTooltip 
            v-if="tooltipText"
            :tooltipText="tooltipText"
            :tooltipTitle="tooltipTitle"
            :id="id"
            :label="getTooltipLabel()"
          />
        </div>
        <div v-if="helpText" class="font-size-14 text-base mb-3 max-width-740">
          {{ helpText }} &nbsp;
          <span v-if="helpTextLink">
              <a 
                role="button"
                tabindex="0"
                class="font-weight-400"
                :id="helpTextLink.id"
                @click="helpTextLinkClicked"
                @keydown.enter="helpTextLinkClicked"
                @keydown.space="helpTextLinkClicked"
              >
                <span 
                  :class="[{'_external-link--small': isHelpTextLinkExternal}]">
                  {{ helpTextLink.linkText }}</span>
              </a>
            </span>
        </div>

        <v-radio
          v-for="item in items"
          :id="'Radio_' + getIdText(item.id)"
          :class="[
            radioClasses,
            { '_has-other': item.value === otherValue },
            { '_other-selected': showOtherEntry(item.value) },
            { '_readonly' : item.readonly}
          ]"
          :key="item.id"
          :value="item.value"
          :style="{ width: width + 'px' }"
          :name="name"
          :disabled="item.disabled || disabled"
          :readonly="item.readonly"
          @blur="onBlur"
          @click="onClick"
          validate-on="blur"
          color="#544496"
        >
          <template v-if="item.description || card || item.value === otherValue" v-slot:label>
            <div class="d-flex flex-column">
              <div
                :class="[
                  item.description ? 'card-label' : 'mb-0',
                  {'mb-0': item.value === otherValue}
                ]"
                v-html="item.label"
              ></div>

              <div 
                v-if="item.description" 
                class="mb-0" 
                :class="{'_description-small' : !card }"
                v-html="item.description"
              ></div>
              
              <ATATTextArea
                v-if="otherEntryType === 'textarea'"
                ref="atatTextInput"
                v-show="showOtherEntry(item.value)"
                :id="otherId"
                class="width-100 mb-6"
                :rows="3"
                :validateItOnBlur="_validateOtherOnBlur"
                :value.sync="_otherValueEntered"
                :rules="otherRequiredRule"
              />
              <ATATTextField
                v-if="otherEntryType === 'textfield'"
                ref="atatTextInput"
                v-show="showOtherEntry(item.value)"
                :id="otherId"
                class="mb-6 mt-2 _input-wrapper-max-width"
                :validateItOnBlur="_validateOtherOnBlur"
                :value.sync="_otherValueEntered"
                :rules="otherRequiredRule"
              />

            </div>
          </template>
          <template v-else v-slot:label >
              <span v-html="item.label"></span>
          </template>

        </v-radio>
      </fieldset>
    </v-radio-group>
    <ATATErrorValidation :errorMessages="errorMessages" />
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATTooltip from "@/components/ATATTooltip.vue"

import { LegendLink, RadioButton, ValidationRule } from "../../types/Global";
import { getIdText } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { ComponentPublicInstance } from "vue";
import { SubmitEventPromise } from './../../node_modules/vuetify/lib/index.mjs';

@Component({
  emits:["radioButtonSelected"],
  components: {
    ATATErrorValidation,
    ATATTextArea,
    ATATTextField,
    ATATTooltip,
  }
})

class ATATRadioGroup extends Vue {
  $refs!: {
    radioButtonGroup: ComponentPublicInstance & {
      errorBucket: string[]; 
      errorCount: number;
      validate: ()=> Promise<SubmitEventPromise>
     
    };
    atatTextInput: ComponentPublicInstance & {
      errorBucket: string[]; 
      errorCount: number;
      validate: () => Promise<boolean>;
    };
  }; 

  // props
  @PropSync("value") private _selectedValue!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: "" }) private legend!: string;
  @Prop({ default: "" }) private helpText?: string;
  @Prop({ default: [""] }) private items!: RadioButton[];
  @Prop({ default: () => []}) private rules!: ValidationRule[];
  @Prop({ default: false }) private card!: boolean;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: false }) private disabled!: boolean;
  @Prop({ default: false }) private legendSrOnly!: boolean;
  @Prop({ default: "" }) private width!: string;
  @Prop() private name!: string;
  @Prop() private tooltipText?: string;
  @Prop() private tooltipTitle?: string;
  @Prop() private tooltipLabel?: string;
  @Prop({ default: false }) private hasOtherValue!: boolean;
  @Prop({ default: "" }) private otherValueRequiredMessage!: string;
  @Prop({ default: "" }) private otherValue!: string;
  @Prop({ default: "textfield" }) private otherEntryType?: string;
  @PropSync("otherValueEntered") private _otherValueEntered!: string;
  @Prop({ default: false }) private validateOtherNow?: boolean;
  @Prop({ default: false}) private clearOtherValidation?: boolean;
  @PropSync("validateOtherOnBlur") private _validateOtherOnBlur?: boolean;
  @Prop() public legendLink?: LegendLink;
  @Prop() public helpTextLink?: LegendLink;
  @Prop() public isHelpTextLinkExternal?: boolean;
  @PropSync("clearErrorMessages") public _clearErrorMessages?: boolean;
  @Prop({default: false}) public legendFontNormalWeight?: boolean;

  // data
  private errorMessages: string[] = [];
  private hideOtherInput = false;
  private hasErrors = false;

  private otherRequiredRule = this.otherValueRequiredMessage && this._validateOtherOnBlur
    ? [this.$validators.required(this.otherValueRequiredMessage)]
    : [];

  @Watch("validateOtherOnBlur")
  public validateOtherOnBlurChange(): void {
    this.otherRequiredRule = this.otherValueRequiredMessage && this._validateOtherOnBlur
      ? [this.$validators.required(this.otherValueRequiredMessage)]
      : [];
  }

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch('validateFormNow')
  public validateNowChange(): void {
    this.$refs.radioButtonGroup.validate().then(
      async (response: SubmitEventPromise) => {
        if (!((await response).valid as boolean)){ 
          this.setErrorMessage() }
      }
    );
  }

  // methods
  private setErrorMessage(): void {
    this.clearErrorMessage();
    this.$refs.radioButtonGroup.validate().then(
      async (response:SubmitEventPromise)=>{
        this.errorMessages = (await (response)).errors[0].errorMessages;
        this.hasErrors = this.errorMessages.length>0
      }
    )
  } 
  private clearErrorMessage(): void {
    this.hasErrors = false;
    this.errorMessages = [];
    this._clearErrorMessages = false;
    // this.$refs.radioButtonGroup.resetValidation();
  } 
  @Watch("clearErrorMessages")
  public clearErrorMessagesChanged(newVal: boolean): void {
    if (newVal) {
      this.clearErrorMessage();
    }
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  private getTooltipLabel(): string {
    return this.tooltipLabel || this.legend;
  }

  private showOtherEntry(value: string): boolean {
    return this.hasOtherValue 
      && value === this.otherValue
      && this._selectedValue !== undefined
      && this._selectedValue.indexOf(this.otherValue) > -1
      && !this.hideOtherInput;
  }

  get radioClasses(): string {
    let classes = this.card ? "_radio-button-card" : "_radio-button";
    classes += this.errorMessages?.length > 0 ? ' error--text v-input--has-state' : '';
    return classes;
  }

  get otherId(): string {
    return getIdText(this.otherValue);
  }

  // events
  private onClick(e: PointerEvent): void {
    const target = e.currentTarget as Element;
    const value = target.querySelector("input")?.value as string;
    this._selectedValue = value;
    this.clearErrorMessage();
  }

  private onBlur(): void {
    this.setErrorMessage();
  }
  

  // watch
  @Watch("_selectedValue")
  protected valueChange(newVal: string): void {
    this.$emit("radioButtonSelected", this._selectedValue);
    this.hasErrors = false;
    if (newVal === this.otherValue) {
      this._validateOtherOnBlur = true;
      this.hideOtherInput = false;
      this.$nextTick(() => {
        const id = this.otherEntryType === "textarea" 
          ? this.otherId + "_text_area" 
          : this.otherId + "_text_field";
        document.getElementById(id)?.focus();
      });
    } else {
      this._validateOtherOnBlur = false;
      this.hideOtherInput = true;
      this._otherValueEntered = "";
    }
  }

  @Watch("validateOtherNow")
  public async validateOtherNowChanged(): Promise<void> {
    const id = this.otherEntryType === "textarea" 
      ? this.otherId + "_text_area" 
      : this.otherId + "_text_field";
    document.getElementById(id)?.focus();
    document.getElementById(id)?.blur();
    const header = document.getElementsByClassName("page-header")[0] as HTMLElement;
    header.focus();

    this.setErrorMessage();
  }

  @Watch("clearOtherValidation")
  public resetOtherValidation(): void {
    this.$refs.atatTextInput.errorBucket = [];
    this.$refs.atatTextInput.errorCount = 0;
  }

  public legendLinkClicked(e: Event): void {
    if (this.legendLink) {
      this.$emit(this.legendLink.emitText, e)
    }
  }

  public helpTextLinkClicked(e: Event): void {
    if (this.helpTextLink) {
      this.$emit(this.helpTextLink.emitText, e)
    }
  }

}

export default toNative(ATATRadioGroup)

</script>
