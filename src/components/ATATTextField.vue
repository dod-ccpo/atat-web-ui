<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex>
      <label
        :id="id + '_text_field_label'"
        class="form-field-label my-1"
        :for="id + '_text_field'"
      >
        {{ label }}
      </label>
    </v-flex>
    <v-flex>
      <v-text-field
        :id="id + '_text_field'"
        outlined
        dense
        :success="success"
        :error="error"
        :height="42"
        :append-outer-icon="appendedOuterIcon"
        :rounded="rounded"
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
  // props
  @Prop({ default: "auto" }) private hideDetails!: boolean | string;
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "color" }) private color!: string;
  @Prop({ default: false }) private success!: boolean;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop( {default: "text input"}) private label: string;

  //data
  private rounded = false;
  private appendedOuterIcon = "";

  private getStatusIcon() {
    if (this.success) {
      this.appendedOuterIcon = "mdi-check-circle";
    } else if (this.error) {
      this.appendedOuterIcon = "mdi-alert-circle";
    }
  }

  private beforeMount() {
    this.getStatusIcon();
  }
}
</script>
