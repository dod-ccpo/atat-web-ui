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
    <div :style="{ 'width': width }">
      <v-text-field
        ref="atatTextField"
        :id="id + '_text_field'"
        outlined
        dense
        :height="42"
        :value.sync="_value"
        :placeholder="placeHolder"
        @input="inputActions"
        class="text-primary"
        :hide-details="true"
        :suffix="suffix"
        :rules="rules"
        @blur="onBlur"
        @update:error="setErrorMessage"
      >
      </v-text-field>
    </div>
     <div v-if="errorMessage.length>0" class="d-flex justify-start align-center atat-text-field-error mt-2">
          <div><v-icon class="text-base-error icon-20 ma-1 mt-0">error</v-icon></div>
          <div class="field-error ml-2">{{errorMessage[0]}}</div>
        </div>
    <div v-if="helpText" class="help-text mt-2">
      {{ helpText }}
    </div>
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
  private errorMessage: string[] = [];
  private inputActions(v: string) {
    this._value = v;
  }

   private setErrorMessage(): void {
    this.errorMessage = this.$refs.atatTextField.errorBucket;
  }

  //@Events
  private onBlur() : void{
    this.setErrorMessage();
  }
}
</script>
