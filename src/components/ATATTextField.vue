<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex class="d-flex align-center">
      <label
          :id="id + '_text_field_label'"
          class="form-field-label mb-2"
          :class="['mr-2']"
          :for="id + '_text_field'"
      >
        {{ label }}
        <span v-if="optional" class="optional">
          Optional
        </span>
      </label>
    </v-flex>
    <v-flex :style="{ 'width': width }">
      <v-text-field
          :id="id + '_text_field'"
          outlined
          dense
          :height="42"
          :value.sync="_value"
          hide-details="auto"
          :placeholder="placeHolder"
          @input="inputActions"
      >
      </v-text-field>
    </v-flex>
    <v-flex v-if="inputHelperText" class="input-helper-text">
      {{ inputHelperText }}
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
  @Prop({default: false}) private optional!: string;
  @Prop({default: "auto"}) private width!: string;
  @Prop({default: null}) private inputHelperText!: string;
  @PropSync("value", {default: ""}) private _value!: string;


  //data
  private placeHolder = "";

  private inputActions(v: string) {
    this._value = v;
  }
}
</script>
