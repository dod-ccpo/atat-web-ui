<template>
  <div :id="id + '_text_field_control'" class="atat-textarea">
    <div class="d-flex align-center" v-if="label">
      <label
        :id="id + '_text_field_label'"
        class="form-field-label width-100"
        :class="{ 'd-sr-only': labelSrOnly }"
        :for="id + '_text_area'"
      >
        <span v-html="label"></span>
        <span v-if="optional" class="optional">
          Optional
        </span>
      </label>
      <v-tooltip
        transition="slide-y-reverse-transition"
        color="rgba(0,0,0,1)"
        location="top"
        v-if="tooltipText"
      >
        <!--TODO: validate that this still works after removal of on from activator-->
        <template v-slot:activator>
          <v-btn
            class="mb-2 ml-1 pa-0 link-button no-border"
            icon
            size="x-small"
            :ripple="false"
            :aria-label="'Help for ' + label"
          >
            <v-icon class="icon-16 ma-0 pa-0" size="small" color="#544496"
            >help_outline
            </v-icon>
          </v-btn>
        </template>
        <span>{{ tooltipText }}</span>
      </v-tooltip>
    </div>
    <div class="width-100 mb-2 help-text" v-html="helpText"></div>
    <div class="d-flex flex-column width-100">
      <v-textarea
        ref="atatTextArea"
        :id="id + '_text_area'"
        variant="outlined"
        :model-value.sync="_value"
        :placeholder="placeHolder"
        @update:model-value="onInput"
        class="text-primary"
        :rules="getRules"
        :rows="rows"
        :readonly="readOnly"
        :no-resize="noResize"
        @blur="onBlur"
        :hide-details="maxChars === ''"
        :counter="maxChars"
        :auto-grow="autoGrow"
        :style="getStyles"
      >
      </v-textarea>
      <ATATErrorValidation
        :errorMessages="errorMessages" 
        :textAreaWithCounter="maxChars !== ''"
        :id="id"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance } from "vue";
import { Component, Prop, Watch, Vue, toNative, Emit } from "vue-facing-decorator";
import {PropSync} from "@/decorators/custom"
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { ValidationRule } from "types/Global";

@Component({
  emits: ['input'],
  components: {
    ATATErrorValidation
  }
})
class ATATTextArea extends Vue {
  // refs
  $refs!: {
    atatTextArea: ComponentPublicInstance & {
      errorBucket: string[]; 
      errorCount: number;
      validate: () => boolean;
    };
  };

  // props
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: "" }) private tooltipText!: string;
  @PropSync("value", { default: "" }) private _value!: string;
  @Prop({ default: 4 }) private rows!: number;
  @Prop({ default: false }) private readOnly!: boolean;
  @Prop({ default: ()=>[]}) private rules!: ValidationRule[];
  @Prop({ default: true }) private noResize!: boolean;
  @Prop({ default: "" }) private maxChars!: string;
  @Prop({ default: true }) private validateItOnBlur!: boolean;
  @Prop({ default: false }) private optional?: boolean;
  @PropSync("turnRulesOff", { default: false }) private _turnRulesOff?: boolean;
  @Prop( {default: false }) private labelSrOnly?: boolean;
  @Prop( {default: false }) private autoGrow?: boolean;
  @Prop({ default: "" }) private minHeight!: string;
  @Prop({ default: "" }) private maxHeight!: string;
  

  //data
  private placeHolder = "";
  private errorMessages: string[] = [];
  
  private onInput(v: string) {
    this._value = v;
    this.$emit("input", v);
    this._turnRulesOff = false;
  }

  public get getRules(): ValidationRule[] {
    return this._turnRulesOff ? [] : this.rules;
  }

  private setErrorMessage(): void {
    this.errorMessages = this.$refs.atatTextArea.errorBucket;
  }

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch('validateFormNow')
  public validateNowChange(): void {
    if(!this.$refs.atatTextArea.validate())
      this.setErrorMessage();
  }

  @Watch('rules')
  public rulesChanged(): void {
    this.$refs.atatTextArea.validate();
  }

  public get getStyles(): string {
    let styles = "";
    if (this.minHeight) {
      styles += "min-height: " + this.minHeight + "px;"
    }
    if (this.maxHeight) {
      styles += "max-height: " + this.maxHeight + "px;"
    }

    return styles;
  }

  //@Events
  private onBlur() : void{
    this._turnRulesOff = false;
    if (this.validateItOnBlur) {
      this.$nextTick(() => {
        this.setErrorMessage();
      })
      this.$emit("blur");
    }
  }
}
export default toNative(ATATTextArea)
</script>
