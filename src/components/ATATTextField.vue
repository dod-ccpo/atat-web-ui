<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <v-flex class="d-flex align-center" v-if="label">
      <label
        :id="id + '_text_field_label'"
        class="form-field-label mb-2 mr-2"
        :for="id + '_text_field'"
      >
        {{ label }}
        <span v-if="optional" class="optional">
          Optional
        </span>
      </label>
      <ATATTooltip 
        :tooltipText="tooltipText"
        :tooltipTitle="tooltipTitle"
        :id="id"
        :label="label"
      />
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
        class="text-primary"
        :suffix="suffix"
        :rules="rules"
      >
        <template v-slot:message="{ message }">
        <div class="d-flex justify-start align-center atat-text-field-error">
          <v-icon class="text-base-error icon-20">error</v-icon>
          <div class="field-error ml-2">{{message}}</div>
        </div>
      </template>
      </v-text-field>
    </v-flex>
    <v-flex v-if="helpText" class="help-text mt-2">
      {{ helpText }}
    </v-flex>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATTooltip from "@/components/ATATTooltip.vue"

@Component({
  components: {
    ATATTooltip,
  }
})
export default class ATATTextField extends Vue {
  // props
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: "" }) private tooltipTitle!: string;
  @Prop({ default: "" }) private tooltipText!: string;
  @Prop({ default: "" }) private appendIcon!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: ()=>[]}) private rules!: Array<unknown>;
  @Prop({ default: ""}) private suffix!: string;
  @Prop({ default: "" }) private optional!: boolean;
  @Prop({ default: "" }) private width!: string;
  
  @PropSync("value", { default: "" }) private _value!: string;

  //data
  private inputActions(v: string) {
    this._value = v;
  }
}
</script>
