<template>
  <div>
    <v-checkbox
      v-for="item in items"
      v-model="_selected"
      :id="'Checkbox_' + getIdText(item.id)"
      :class="[
        card ? '_checkbox-card' : '_checkbox',
        { 'flex-column _has-other': item.label === 'Other' },
        { '_other-selected': showOtherTextarea(item.label) }
      ]"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :name="name"
      :error="error"
      :disabled="disabled"
      @mousedown="checkBoxClicked(item.value)"
    >
      <!--  -->
      <template v-if="card || item.label === 'Other' " v-slot:label>
        <div class="d-flex flex-column width-100" tabindex="0">
          <div 
            v-if="item.label" 
            :class="[
              {'card-label': item.label}, 
              {'mb-0': item.label === 'Other'}
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
        <template v-slot:append v-if="showOtherTextarea(item.label)">
          <ATATTextArea
            ref="atatTextArea"
            v-show="showOtherTextarea(item.label)"
            id="OtherEntry"
            class="width-100 ml-5 mb-6"
            :rows="3"
            :validateItOnBlur="validateOtherOnBlur"
            :value.sync="_otherValue"
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
  // refs
  $refs!: {
    atatTextArea: Vue & { errorBucket: string[]; errorCount: number };
  };

  // props
  @PropSync("value") private _selected!: string[];
  @PropSync("otherValue") private _otherValue!: string;

  @Prop({default: [""], required: true}) private items!: Checkbox[];
  @Prop({default: false}) private card!: boolean;
  @Prop({default: false}) private error!: boolean;
  @Prop({default: false}) private disabled!: boolean;
  @Prop({default: false}) private hasOtherValue!: boolean;
  @Prop({ default: "" }) private otherValueRequiredMessage!: string;
  @Prop({ default: "" }) private noneValue!: string;
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
    const otherIndex = newVal.indexOf("Other") > -1;
    const otherPrevSelectedIndex = this.prevSelected.indexOf("Other") > -1;
    if (otherIndex && !otherPrevSelectedIndex) {
      Vue.nextTick(() => {
        document.getElementById("OtherEntry_text_area")?.focus();
      });
    }
    Vue.nextTick(() => {
      this.prevSelected = [...this._selected];
    })
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  private showOtherTextarea(label: string): boolean {
    return this.hasOtherValue 
      && label === 'Other'
      && this._selected.indexOf("Other") > -1
      && !this.hideOtherTextarea;
  }

  private hideOtherTextarea = false;
  private checkBoxClicked(value: string): void {
    if (value === this.noneValue) {
      this.validateOtherOnBlur = false;
      this.hideOtherTextarea = true;
      if (this._selected.indexOf("Other") > -1) {
        this._selected = [this.noneValue];
      }
    } else {
      if (value === "Other" && this._selected.indexOf("Other") > -1) {
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
