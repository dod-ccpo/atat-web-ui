<template>
  <div :id="id + '_text_field_control'" class="atat-text-field">
    <div class="d-flex align-center" v-if="label">
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
    </div>
    <div :style="'width: ' + width">
      <v-text-field
        ref="atatTextField"
        :id="id + '_text_field'"
        outlined
        dense
        :height="42"
        :value.sync="_value"
        :placeholder="placeHolder"
        @input="onInput"
        class="text-primary"
        :hide-details="true"
        :suffix="suffix"
        :style="{ 'max-width': width + 'px' }"
        :rules="rules"
        @blur="onBlur"
        @update:error="setErrorMessage"
      >
      </v-text-field>
    </div>
    <ATATErrorValidation :errorMessages="errorMessages" />
    <div v-if="helpText" class="help-text mt-2">
      {{ helpText }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATTooltip from "@/components/ATATTooltip.vue"
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";

@Component({
  components: {
    ATATTooltip,
    ATATErrorValidation
  }
})
export default class ATATTextField extends Vue {
  // refs
  $refs!: {
    atatTextField: Vue & { errorBucket: string[]; errorCount: number };
  }; 

  // props
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "" }) private label!: string;
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
  private errorMessages: string[] = [];
  private onInput(v: string) {
    this._value = v;
  }

   private setErrorMessage(): void {
    this.errorMessages = this.$refs.atatTextField.errorBucket;
  }

  //@Events
  private onBlur(value: string) : void{
    this.setErrorMessage();
    this.$emit('blur', value);
  }
}
</script>