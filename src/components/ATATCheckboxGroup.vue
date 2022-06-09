<template>
  <div :id="id">

    <p v-if="groupLabel" :id="groupLabelId" class="_checkbox-group-label">
      {{ groupLabel }}
    </p>

    <v-checkbox
      v-for="(item, index) in items"
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
      :error="error"
      :disabled="disabled"
      :rules="checkboxRules"
      @mousedown="checkBoxClicked(item.value)"
      multiple
      :hide-details="true"
      :ref="index === 0 ? 'checkboxGroup' : ''"
      :data-group-id="id + '_Group'"
    >
      <template v-if="card || item.description || item.value === otherValue" v-slot:label>
        <div class="d-flex flex-column width-100">
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
            class="mb-0 _description" v-html="item.description"
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
    <ATATErrorValidation :errorMessages="errorMessages" />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, PropSync, Watch} from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";

import {Checkbox} from "../../types/Global";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATTextArea,
    ATATErrorValidation,
  }
})

export default class ATATCheckboxGroup extends Vue {
  // refs
  $refs!: {
    checkboxGroup: (Vue & { errorBucket: string[]; errorCount: number })[];
  }; 

  // props
  @PropSync("value") private _selected!: string[];
  @PropSync("otherValueEntered") private _otherValueEntered!: string;

  @Prop({ default: [""], required: true }) private items!: Checkbox[];
  @Prop({ default: false }) private card!: boolean;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: false }) private disabled!: boolean;
  @Prop({ default: false }) private hasOtherValue!: boolean;
  @Prop({ default: "" }) private otherValueRequiredMessage!: string;
  @Prop({ default: "NONE" }) private noneValue!: string;
  @Prop({ default: "" }) private otherValue!: string;
  @Prop({ default: "CheckboxGroup" }) private id!: string;
  @Prop({ default: "CheckboxGroupLabel" }) private groupLabelId!: string;
  @Prop() private groupLabel!: string;
  @Prop({ default: () => []}) private rules!: Array<unknown>;

  // data, methods, watchers, etc.
  private validateOtherOnBlur = true;
  private prevSelected: string[] = [];
  private errorMessages: string[] = [];
  public blurredCheckboxes: Record<string, string[]> = {};
  private validateCheckboxes = false;

  public checkboxRules = this.validateCheckboxes
    ? this.rules
    : [];

  @Watch("validateCheckboxes")
  protected setCheckboxValidation(): void {
    this.checkboxRules = this.rules;
  }

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
    });
    
    this.setErrorMessage();
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
    if (this.checkboxRules.length === 0) {
      this.validateCheckboxes = true;;
    }
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

  // methods
  private setErrorMessage(): void {
    if (this._selected.length) {
      this.clearErrorMessage();
    } else {
      setTimeout(() => {
        const checkbox = this.$refs.checkboxGroup;
        if (checkbox && checkbox.length) {
          this.errorMessages = checkbox[0].errorBucket;
        }
      }, 0)
    }
  } 
  private clearErrorMessage(): void {
    this.errorMessages = [];
  } 

  private setEventListeners(): void {
    document.querySelectorAll('input[type="checkbox"]').forEach((elem) => {
      const checkbox = elem as HTMLInputElement;
      checkbox.addEventListener("blur", this.setCheckboxEventListeners);
    });   
  }

  @Watch("items")
  protected checkboxItemsChange(): void {
    if (this.items.length) {
      this.$nextTick(() => {
        this.setEventListeners();
      })
    }
  }
  
  public mounted(): void {
    this.setEventListeners();
  }

  public setCheckboxEventListeners(event: FocusEvent): void {
    const thisCheckbox = event.currentTarget as HTMLInputElement;
    const id = thisCheckbox.id;
    const groupId: string = thisCheckbox.dataset.groupId || "CheckboxGroup";
    if (id && groupId && (groupId === this.id + "_Group")) {
      if (!Object.prototype.hasOwnProperty.call(this.blurredCheckboxes, groupId)) {
        this.blurredCheckboxes[groupId] = [];
      }
      if (this.blurredCheckboxes[groupId].indexOf(id) === -1) {
        // only clear if validation hasn't been set yet
        if (!this.validateCheckboxes) {
          this.clearErrorMessage();
        }
        this.blurredCheckboxes[groupId].push(id);
      }

      if (this.blurredCheckboxes[groupId].length === this.items.length) {
        if (this.checkboxRules.length === 0) {
          this.validateCheckboxes = true;
        }
        this.setErrorMessage();
      }
    }

  }

}
</script>
