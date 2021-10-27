<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex class="d-flex align-center">
      <label
        :id="id + '_text_field_label'"
        class="form-field-label my-1 mr-2"
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
            ><v-icon class="ma-0 pa-0" small color="primary"
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
            outlined
            dense
            :success="isSuccess"
            :prefix="prefix"
            :error="isErrored"
            :error-messages="errorMessages"
            :height="42"
            :rounded="rounded"
            :value.sync="_value"
            hide-details="auto"
            :validate-on-blur="true"
            :validate-on-load="validateOnLoad"
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
        </div>
        <div class="d-flex align-end mb-3">
          <v-btn
            v-if="showDeleteIcon"
            plain
            :disabled="isDeleteDisabled"
            class="pointer icon-24 pa-1 ml-2"
            :class="[isErrored ? 'mb-1' : 'mb-0']"
            @click="$emit('deleteItem', id)"
          >
            <v-icon>delete </v-icon>
          </v-btn>
        </div>
      </div>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { VTextField } from "vuetify/lib";
import { Component, Emit, Prop, PropSync } from "vue-property-decorator";

import Vue from "vue";

@Component({})
export default class ATATTextField extends VTextField {
  // props
  @Prop({ default: "auto" }) private hideDetails!: boolean | string;
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: false }) private optional!: boolean;
  @PropSync("value", { default: "" }) private _value!: string;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: false }) private success!: boolean;
  @Prop({ default: () => [] }) private errorMessages!: string[];
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: "" }) private prefix!: string;
  @Prop({ default: false }) private showDeleteIcon!: boolean;
  @Prop({ default: false }) private isDeleteDisabled!: boolean;
  @Prop({ default: false }) private validateOnLoad!: boolean;

  //data
  private rounded = false;
  private isFieldValid = false;
  private isFieldDirty = false;

  get isSuccess(): boolean {
    return this.isFieldDirty === true && this.isFieldValid === true;
  }

  get isErrored(): boolean {
    return this.isFieldDirty === true && this.isFieldValid === false;
  }

  private inputActions(v: string) {
    this._value = v;
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
    this.$nextTick(() => {
      if (this.validateOnLoad) {
        this.validateField();
      }
    });
  }
}
</script>
