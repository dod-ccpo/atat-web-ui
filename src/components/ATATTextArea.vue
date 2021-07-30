<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex>
      <label
        :id="id + '_text_field_label'"
        class="form-field-label my-1"
        :for="id + '_text_field'"
      >
        {{ label }}
        <span class="ml-2 optional" v-show="optional">Optional</span>
      </label>
    </v-flex>
    <v-flex>
      <v-textarea
        auto-grow
        rows="4"
        :id="id + '_text_field'"
        outlined
        :success="success"
        :error="error"
        :append-outer-icon="appendedOuterIcon"
        :rounded="rounded"
        :value="value"
        hide-details="auto"
        class="atat-text-area"
        @keyup="$emit('update:value', $event.target.value)"
      >
      </v-textarea>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { VTextarea } from "vuetify/lib";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATTextArea extends VTextarea {
  // props
  @Prop({ default: "auto" }) private hideDetails!: boolean | string;
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "color" }) private color!: string;
  @Prop({ default: false }) private success!: boolean;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "input" }) private label!: string;
  @Prop({ default: false }) private optional!: boolean;

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
