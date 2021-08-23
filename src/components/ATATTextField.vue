<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex class="d-flex align-center">
      <label
        :id="id + '_text_field_label'"
        class="form-field-label my-1 mr-2"
        :for="id + '_text_field'"
      >
        {{ label }}
        <span v-show="optional">Optional</span>
      </label>
      <v-tooltip max-width="250px" color="rgba(0,0,0,1)" top v-if="helpText">
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
      <v-text-field
        :rules="rules"
        :id="id + '_text_field'"
        outlined
        dense
        :success="isFieldValid"
        :prefix="prefix"
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
  @Prop({ default: "" }) private value!: string;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: "" }) private prefix!: string;

  //data
  private rounded = false;
  private appendedOuterIcon = "";

  private getStatusIcon() {
    // if the rules property isn't set we won't display an icon
    // when the rules property is populated (i.e when the parent form is saved)
    // we evalute the rules to determine what icon to display
    if (this.$props["rules"].length > 0) {
      let value = this.value;

      this.isFieldValid = this.$props["rules"].every(
        (rule: (a: unknown) => string | boolean) => rule(value) === true
      );

      this.appendedOuterIcon = this.isFieldValid ? "check_circle" : "error";
    }
  }

  private updated() {
    this.getStatusIcon();
  }
}
</script>
