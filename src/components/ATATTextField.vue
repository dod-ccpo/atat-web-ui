<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex class="d-flex align-center" v-if="label">
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
          v-if="helpText"
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
        <span>{{ helpText }}</span>
      </v-tooltip>
    </v-flex>
    <v-flex>
      <div class="d-flex">
        <div class="width-100">
          <v-text-field
              :id="id + '_text_field'"
              outlined
              dense
              :height="42"
              :value.sync="_value"
              hide-details="auto"
              :placeholder="placeHolder"
              @input="inputActions"
              class="text-primary"
          >
          </v-text-field>
        </div>
      </div>
    </v-flex>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, PropSync} from "vue-property-decorator";

@Component({})
export default class ATATTextField extends Vue {
  // props
  @Prop({default: true}) private dense!: boolean;
  @Prop({default: true}) private singleLine!: boolean;
  @Prop({default: "id_is_missing"}) private id!: string;
  @Prop({default: "Form Field Label"}) private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @PropSync("value", {default: ""}) private _value!: string;
  //data
  private placeHolder = "";

  private inputActions(v: string) {
    this._value = v;
  }
}
</script>
