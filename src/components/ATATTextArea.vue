<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex class="d-flex align-center">
      <label
          :id="id + '_text_field_label'"
          class="form-field-label mb-2"
          :for="id + '_text_field'"
      >
        {{ label }}
      </label>
      <v-tooltip
          transition="slide-y-reverse-transition"
          max-width="250px"
          color="rgba(0,0,0,1)"
          top
          v-if="tooltipText"
      >
        <template v-slot:activator="{ on }">
          <v-btn
              class="mb-2 ml-1 pa-0 link-button no-border"
              icon
              x-small
              v-on="on"
              :ripple="false"
              :aria-label="'Help for ' + label"
          ><v-icon class="icon-16 ma-0 pa-0" small color="#544496"
          >help_outline
          </v-icon>
          </v-btn>
        </template>
        <span>{{ tooltipText }}</span>
      </v-tooltip>
    </v-flex>
    <v-flex class="d-flex width-100">
        <v-textarea
            :id="id + '_text_area'"
            :value.sync="_value"
            hide-details="auto"
            :placeholder="placeHolder"
            @input="inputActions"
            :rows="rows"
            class="text-primary"
            :readonly="readOnly"
            :no-resize="noResize"
            outlined
        >
        </v-textarea>
    </v-flex>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, PropSync} from "vue-property-decorator";

@Component({})
export default class ATATTextArea extends Vue {
  // props
  @Prop({default: true}) private dense!: boolean;
  @Prop({default: true}) private singleLine!: boolean;
  @Prop({default: "id_is_missing"}) private id!: string;
  @Prop({default: "Form Field Label"}) private label!: string;
  @Prop({ default: "" }) private tooltipText!: string;
  @PropSync("value", {default: ""}) private _value!: string;
  @Prop ({default: 4}) private rows!: number;
  @Prop ({default: false}) private readOnly!: boolean;
  @Prop ({default: true}) private noResize!: boolean;
  //data
  private placeHolder = "";

  private inputActions(v: string) {
    this._value = v;
  }
}
</script>
