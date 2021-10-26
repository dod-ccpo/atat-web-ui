<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex>
      <label
        :id="id + '_text_field_label'"
        class="form-field-label my-1"
        :for="id + '_text_field'"
      >
        {{ label }}
        <span class="mx-2 optional" v-show="optional">Optional</span>
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
      <v-textarea
        auto-grow
        rows="4"
        :id="id + '_text_field'"
        outlined
        :success="isFieldValid"
        :error="hasError"
        :append-outer-icon="appendedOuterIcon"
        :rounded="rounded"
        :value="value"
        hide-details="auto"
        class="atat-text-area"
        @keyup="$emit('update:value', $event.target.value)"
        @change="showStatusIcon"
      >
      </v-textarea>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { VTextarea } from "vuetify/lib";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATTextArea extends VTextarea {
  private isFieldValid = false;
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

  //data
  private rounded = false;
  private appendedOuterIcon = "";

  private showStatusIcon() {
    this.isFieldValid = this.optional
      ? this.$props["value"].length > 0
      : this.$data["valid"];

    this.appendedOuterIcon = this.isFieldValid ? "check_circle" : "";
  }
}
</script>
