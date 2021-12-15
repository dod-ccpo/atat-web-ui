<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex class="d-flex align-center">
      <label
        :id="id + '_text_field_label'"
        class="form-field-label mr-2"
        :class="[isErrored ? 'font-weight-bold' : '']"
        :for="id + '_text_field'"
      >
        {{ label }}
        <span v-show="optional">Optional</span>
      </label>
      <v-tooltip
        transition="slide-y-reverse-transition"
        max-width="250px"
        color="rgba(0,0,0,1)"
        top
        v-if="helpText"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            class="ma-0 pa-0 link-button no-border"
            icon
            x-small
            v-on="on"
            :ripple="false"
            :aria-label="'Help for ' + label"
            ><v-icon class="icon-20 ma-0 pa-0" small color="primary"
              >help_outline
            </v-icon>
          </v-btn>
        </template>
        <span>{{ helpText }}</span>
      </v-tooltip>
    </v-flex>
    <v-flex>
      <div class="d-flex">
        <div class="width-100">
          <v-text-field
            :rules="rules"
            :id="id + '_text_field'"
            :aria-describedby="id + '_input_hint'"
            outlined
            dense
            :success="isSuccess"
            :prefix="getPrefix"
            :error="isErrored"
            :error-messages="errorMessages"
            :height="42"
            :rounded="rounded"
            :value.sync="_value"
            hide-details="auto"
            :validate-on-blur="validateOnBlur"
            :validate-on-load="validateOnLoad"
            :placeholder="placeHolder"
            :class="[
              isErrored ? 'invalid-icon' : '',
              isSuccess ? 'valid-icon' : '',
              isErrored || isSuccess ? 'show-validation-icon' : '',
              showDeleteIcon ? 'additional-button' : '',
            ]"
            @input="inputActions"
            @blur="validateField()"
            @change="$emit('change')"
            @keyup="$emit('keyup')"
            @focus="$emit('focus')"
          >
          </v-text-field>

          <p v-if="hint !== ''" class="input-hint" :id="id + '_input_hint'">
            {{ hint }}
          </p>
        </div>
        <div class="d-flex align-end mb-3">
          <v-btn
            v-if="showDeleteIcon"
            plain
            :disabled="isDeleteDisabled"
            class="pointer icon-24 pa-1 ml-2"
            :class="[isErrored ? 'mb-1' : 'mb-0']"
            @click="$emit('deleteItem', id)"
            :aria-label="'Delete ' + _value"
          >
            <v-icon aria-hidden="true">delete </v-icon>
          </v-btn>
        </div>
      </div>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { VTextField } from "vuetify/lib";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import Inputmask from "inputmask";

@Component({})
export default class ATATTextField extends VTextField {
  // props
  @Prop({ default: "auto" }) private hideDetails!: boolean | string;
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: false }) private optional!: boolean;
  @PropSync("value", { default: "" }) private _value!: string | number | null;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: false }) private success!: boolean;
  @Prop({ default: () => [] }) private errorMessages!: string[];
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: "" }) private hint!: string;
  @Prop({ default: "" }) private prefix!: string;
  @Prop({ default: false }) private showDeleteIcon!: boolean;
  @Prop({ default: false }) private isDeleteDisabled!: boolean;
  @Prop({ default: false }) private validateOnLoad!: boolean;
  @Prop({ default: true }) private validateOnBlur!: boolean;
  @Prop({ default: 50 }) private maxLength!: number;
  @Prop({ default: "" }) private mask!: string;

  //data
  private rounded = false;
  private isFieldValid = false;
  private isFieldDirty = false;
  private hasInitialValue = false;
  private placeHolder = "";
  private input: HTMLInputElement | undefined;

  get isSuccess(): boolean {
    return this.isFieldDirty === true && this.isFieldValid === true;
  }

  get isErrored(): boolean {
    return (this.isFieldDirty || this.hasInitialValue) && !this.isFieldValid;
  }

  private inputActions(v: string) {
    if (this.mask === "currency") {
      this._value = parseInt(v) >= 0 ? v : "";
    } else {
      this._value = v;
    }
  }

  @Watch("validateOnLoad")
  protected watchValidateOnLoad(newVal: boolean): void {
    if (newVal) {
      this.validateField();
    }
  }

  private validateField() {
    // if the rules property isn't set we won't display an icon
    // when the rules property is populated (i.e when the parent form is saved)
    // we evalute the rules to determine what icon to display
    this.isFieldDirty = true;

    if (this.$props["rules"].length > 0) {
      let value = this._value;
      this.isFieldValid = this.$props["rules"].every(
        (rule: (a: unknown) => string | boolean) => rule(value) === true
      );
    }

    this.$emit("blur");
  }

  public mounted(): void {
    this.input = document.getElementById(
      this.id + "_text_field"
    ) as HTMLInputElement;
    this.addMasks();
    //this.addAttributes();

    this.$nextTick(() => {
      this.hasInitialValue =
        typeof this._value === "string" && this._value.length > 0;
      if (this.validateOnLoad || this.hasInitialValue) {
        this.validateField();
      }
    });
  }

  get getPrefix(): string {
    let prefix = "";
    switch (this.mask) {
      case "currency":
        prefix = "$";
        break;
      default:
        break;
    }
    return prefix || this.prefix;
  }

  private addAttributes(): void {
    if (this.input !== undefined) {
      if (this.maxLength > 0) {
        this.input.setAttribute("maxlength", this.maxLength.toString());
      }
    }
  }

  private addMasks(): void {
    if (this.input !== undefined) {
      if (this.mask === "currency") {
        Inputmask({
          alias: "currency",
          autoUnmask: true,
          digitsOptional: true,
          rightAlign: false,
          showMaskOnHover: false,
          showMaskOnFocus: false,
          allowMinus: false,
        }).mask(this.input);

        // if (typeof this._value === "number"){
        //   this._value == this.+va
        // }

        // this._value =
        //   typeof this._value === "number" && parseInt(this._value) > -1
        //     ? this._value
        //     : null;
      }
      if (this.mask === "numeric") {
        Inputmask({
          regex: "\\d{" + this.maxLength + "}",
          placeholder: "",
        }).mask(this.input);
      }
      this.placeHolder = "";
    }
  }
}
</script>
