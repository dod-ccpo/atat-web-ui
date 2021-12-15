<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex class="d-flex align-center">
      <label
        :id="id + '_text_field_label'"
        class="form-field-label mr-2"
        :class="[hasError ? 'font-weight-bold' : '']"
        :for="id + '_text_field'"
      >
        {{ label }}
      </label>
      <span class="optional mr-2" v-show="optional">Optional</span>
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
      <v-textarea
        :rules="rules"
        auto-grow
        rows="4"
        :id="id + '_text_field'"
        outlined
        :success="isSuccess"
        :error="isErrored"
        :error-messages="errorMessages"
        :append-outer-icon="appendedOuterIcon"
        :rounded="rounded"
        :value.sync="_value"
        :validate-on-blur="true"
        :validate-on-load="validateOnLoad"
        :class="[
          isErrored ? 'invalid-icon' : '',
          isSuccess ? 'valid-icon' : '',
          isErrored || isSuccess ? 'show-validation-icon' : '',
        ]"
        hide-details="auto"
        class="atat-text-area"
        @keyup="$emit('update:value', $event.target.value)"
        @change="$emit('change')"
        @blur="validateField()"
      >
      </v-textarea>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { VTextarea } from "vuetify/lib";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

@Component({})
export default class ATATTextArea extends VTextarea {

  // props
  @Prop({ default: "auto" }) private hideDetails!: boolean | string;
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "color" }) private color!: string;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: false }) private validateOnLoad!: boolean;
  @Prop({ default: () => [] }) private errorMessages!: string[];
  @PropSync("value", { default: "" }) private _value!: string;
  
  //data
  private isFieldValid: undefined | boolean  = false;
  private rounded = false;
  private appendedOuterIcon = "";
  private isFieldDirty = false;
  private hasInitialValue = false;

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

  get isSuccess(): boolean {
    return this.isFieldDirty === true && this.isFieldValid === true;
  }

  get isErrored(): boolean {
    return (this.isFieldDirty || this.hasInitialValue) && !this.isFieldValid;
  }

  @Watch("validateOnLoad")
  protected watchValidateOnLoad(newVal: boolean): void {
    if (newVal) {
      this.validateField();
    }
  }

  public mounted(): void {
    this.$nextTick(() => {
      this.hasInitialValue = this._value.length > 0;
      if (this.validateOnLoad || this.hasInitialValue) {
        this.validateField();
      }
    });
  }
}
</script>
