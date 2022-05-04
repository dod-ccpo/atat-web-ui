<template>
  <div>
    <v-checkbox
      v-for="item in items"
      v-model="_selected"
      :id="'Checkbox_' + getIdText(item.id)"
      :class="[
        card ? '_checkbox-card' : '_checkbox',
        { 'flex-column _has-other': item.value === otherValue },
        { '_other-selected': showOtherTextarea(item.value) }
      ]"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :name="name"
      :error="error"
      :disabled="disabled"
      @mousedown="checkBoxClicked(item.value)"
    >
      <template v-if="card || item.value === otherValue" v-slot:label>
        <div class="d-flex flex-column width-100" tabindex="0">
          <div 
            v-if="item.label" 
            :class="[
              {'card-label': item.label}, 
              {'mb-0': item.label === otherValue }
            ]"
          >
            {{ item.label }}
          </div>
          <div
            v-if="item.description"
            class="mb-0" v-html="item.description"
          ></div>
        </div>
      </template>
      <template v-slot:append v-if="showOtherTextarea(item.value)">
        <ATATTextArea
          ref="atatTextArea"
          v-show="showOtherTextarea(item.value)"
          id="OtherEntry"
          class="width-100 ml-5 mb-6"
          :rows="3"
          :validateItOnBlur="validateOtherOnBlur"
          :value.sync="_otherValueEntered"
          :rules="textareaRequiredRule"
        />
      </template>

    </v-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, PropSync, Watch} from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";

import {Checkbox} from "../../types/Global";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATTextArea,
  }
})

export default class ATATCheckboxGroup extends Vue {
  // props
  @PropSync("value") private _selected!: string[];
  @PropSync("otherValueEntered") private _otherValueEntered!: string;

  @Prop({ default: [""], required: true }) private items!: Checkbox[];
  @Prop({ default: false }) private card!: boolean;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: false }) private disabled!: boolean;
  @Prop({ default: false }) private hasOtherValue!: boolean;
  @Prop({ default: "" }) private otherValueRequiredMessage!: string;
  @Prop({ default: "" }) private noneValue!: string;
  @Prop({ default: "" }) private otherValue!: string;
  @Prop() private name!: string;

  // data, methods, watchers, etc.
  private validateOtherOnBlur = true;
  private prevSelected: string[] = [];
  private errorMessages: string[] = [];

  private textareaRequiredRule = this.otherValueRequiredMessage 
    ? [this.$validators.required(this.otherValueRequiredMessage)]
    : [];

  @Watch("_selected")
  protected selectedOptionsChanged(newVal: string[]): void {
    const otherIndex = newVal.indexOf(this.otherValue) > -1;
    const otherPrevSelectedIndex = this.prevSelected.indexOf(this.otherValue) > -1;
    if (otherIndex && !otherPrevSelectedIndex) {
      Vue.nextTick(() => {
        document.getElementById("OtherEntry_text_area")?.focus();
      });
    }
    if (newVal.indexOf(this.noneValue) > -1) {
      const noneApplyIndex = this.prevSelected.indexOf(this.noneValue);
      if (newVal.length > 1 && noneApplyIndex === -1) {
        // uncheck the other options
        this._selected = [this.noneValue];
      } else if (newVal.length > 1) {
        // remove "None Apply"
        this._selected.splice(noneApplyIndex, 1);
      }
    }
    Vue.nextTick(() => {
      this.prevSelected = [...this._selected];
    })
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  private showOtherTextarea(value: string): boolean {
    return this.hasOtherValue 
      && value === this.otherValue
      && this._selected.indexOf(this.otherValue) > -1
      && !this.hideOtherTextarea;
  }

  private hideOtherTextarea = false;

  private checkBoxClicked(value: string): void {
    if (value === this.noneValue) {
      this.validateOtherOnBlur = false;
      this.hideOtherTextarea = true;
      if (this._selected.indexOf(this.otherValue) > -1) {
        this._selected = [this.noneValue];
      }
    } else {
      if (value === this.otherValue && this._selected.indexOf(this.otherValue) > -1) {
        this.validateOtherOnBlur = false;
        this.hideOtherTextarea = true;
      } else {
        this.validateOtherOnBlur = true;
        this.hideOtherTextarea = false;
      }
    }
  }
}
</script>
