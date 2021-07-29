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
        dense
        :success="success"
        :error="error"
        :append-outer-icon="appendedOuterIcon"
        :rounded="rounded"
        v-model="textAreaValue"
        hide-details="auto"
        @blur="blurAction"
      >
      </v-textarea>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { VTextarea } from "vuetify/lib";
import { Component, Emit, Prop } from "vue-property-decorator";

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

  @Emit()
  private blurAction(e: MouseEvent): string {
    return this.textAreaValue;
  }
  //data
  private rounded = false;
  private appendedOuterIcon = "";
  private textAreaValue = "";

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
