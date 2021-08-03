<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex>
      <label
        :id="id + '_text_field_label'"
        class="form-field-label my-1"
        :for="id + '_text_field'"
      >
        {{ label }}
        <span v-show="optional">Optional</span>
      </label>
    </v-flex>
    <v-flex>
      <v-text-field
        :rules="rules"
        :id="id + '_text_field'"
        outlined
        dense
        :success="isFieldValid"
        :error="hasError"
        :height="42"
        :append-outer-icon="appendedOuterIcon"
        :rounded="rounded"
        :value="value"
        hide-details="auto"
        @keyup="$emit('update:value', $event.target.value)"
      >
      </v-text-field>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { VTextField } from "vuetify/lib";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATTextField extends VTextField {
  private isFieldValid = false;
  // props
  @Prop({ default: "auto" }) private hideDetails!: boolean | string;
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: false }) private optional!: boolean;

  //data
  private rounded = false;
  private appendedOuterIcon = "";

  private getStatusIcon() {
    this.isFieldValid = this.$data["valid"];
    this.appendedOuterIcon = this.isFieldValid
      ? "mdi-check-circle"
      : "mdi-alert-circle";
  }

  private updated() {
    this.getStatusIcon();
  }
}
</script>
