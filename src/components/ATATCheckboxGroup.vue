<template>
  <div :id="id">
    <p 
      v-if="groupLabel" 
      :id="groupLabelId" 
      class="_checkbox-group-label d-flex align-center"
      :class="{ 'mb-0' : groupLabelHelpText }"
    >
      <span :class="{'mr-2' : !optional}">{{ groupLabel }}</span> 
      <span class="optional mr-2" v-if="optional">Optional</span>
      <ATATTooltip 
        v-if="tooltipText"
        :tooltipText="tooltipText"
        :tooltipTitle="tooltipTitle"
        :id="id"
      />
    </p>
    <p v-if="groupLabelHelpText" class="text-base font-size-14 mb-3">
      {{ groupLabelHelpText }}
    </p>
    <div class="_checkboxes">
      <v-checkbox
        v-for="(item, index) in _items"
        v-model="_selected"
        :id="'Checkbox_' + getIdText(item.id)"
        :class="[
          card ? '_checkbox-card' : '_checkbox',
          color ? '_checkbox-' + color : '',
          { 'flex-column _has-other': item.value === otherValue },
          { '_other-selected': showOtherEntry(item.value) },
          { '_no-description': noDescriptions },
          { '_has-text-fields' : hasTextFields }
        ]"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :error="error"
        :disabled="disabled"
        :rules="checkboxRules"
        @mouseup="checkBoxClicked(item.value, index)"
        multiple
        :hide-details="true"
        :ref="index === 0 ? 'checkboxGroup' : ''"
        :data-group-id="id + '_Group'"
      >
        <template 
          v-if="card || item.description || item.value === otherValue || hasTextFields" 
          v-slot:label
        >
          <div 
            class="d-flex "
            :class="[
              { 'flex-column width-100' : !hasTextFields },
              { 'align-center foobar' : hasTextFields }
            ]"
          >
            <div 
              v-if="item.label" 
              :class="[
                {'card-label': item.label}, 
                {'mb-0': item.value === otherValue},
                {'_no-description': noDescriptions}
              ]"
              :style="labelStyles"
            >
              {{ item.label }}
            </div>
            <div
              v-if="item.description"
              class="mb-0 _description" v-html="item.description"
            ></div>
          </div>
        </template>
        <template v-slot:append v-if="showOtherEntry(item.value) || hasTextFields">
          <ATATTextArea
            v-if="otherEntryType === 'textarea' && showOtherEntry(item.value)"
            ref="atatTextInput"
            name="otherTextArea"
            v-show="showOtherEntry(item.value)"
            :id="otherId"
            class="width-100 ml-5 mb-6"
            :rows="3"
            :validateItOnBlur="validateOtherOnBlur"
            :value.sync="_otherValueEntered"
            :rules="otherRequiredRule"
          />
          <ATATTextField
            v-if="otherEntryType === 'textfield' && showOtherEntry(item.value)"
            ref="atatTextInput"
            name="otherTextField"
            v-show="showOtherEntry(item.value)"
            :id="otherId"
            class="ml-5 mb-6 mt-2 _input-wrapper-max-width"
            :validateItOnBlur="validateOtherOnBlur"
            :value.sync="_otherValueEntered"
            :rules="otherRequiredRule"
          />

          <ATATTextField 
            v-if="hasTextFields && showTextField(index)"
            :id="id + '_TextField' + index"
            :appendText="textFieldAppendText"
            :width="textFieldWidth"
            type="text"
            @blur="textFieldBlur(index)"   
            :isFormattedNumber="isFormattedNumber" 
            :rules="textfieldRules"        
          /> 

        </template>
      </v-checkbox>
    </div>

    <ATATErrorValidation :errorMessages="errorMessages" />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, PropSync, Watch} from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATTooltip from "@/components/ATATTooltip.vue"

import {Checkbox} from "../../types/Global";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATTextArea,
    ATATTextField,
    ATATErrorValidation,
    ATATTooltip,
  }
})

export default class ATATCheckboxGroup extends Vue {
  // refs
  $refs!: {
    checkboxGroup: (Vue & { errorBucket: string[]; errorCount: number })[];
    atatTextInput: (Vue & { errorBucket: string[]; errorCount: number })[];
  }; 

  // props
  @PropSync("value") private _selected!: string[];
  @PropSync("otherValueEntered") private _otherValueEntered!: string;

  @PropSync("items") private _items!: Checkbox[];
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
  @Prop() private groupLabelHelpText?: string;
  @Prop({ default: () => []}) private rules!: Array<unknown>;
  @Prop({ default: () => []}) private textfieldRules!: Array<unknown>;
  @Prop({ default: "textfield" }) private otherEntryType?: string;
  @Prop({ default: "" }) private color!: string;
  @Prop({ default: false }) private optional?: boolean;
  @Prop() private tooltipText?: string;
  @Prop() private tooltipTitle?: string;
  @Prop() private tooltipLabel?: string;
  @Prop({ default: false }) private noDescriptions?: boolean;
  @Prop({ default: false }) private hasTextFields?: boolean;
  @Prop() private labelWidth?: string;
  @Prop() private textFieldAppendText?: string;
  @Prop() private textFieldWidth?: number;
  @Prop({ default: "text" }) private textFieldType?: string;
  @Prop({ default: false }) private isFormattedNumber?: boolean;

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

  private otherRequiredRule = this.otherValueRequiredMessage 
    ? [this.$validators.required(this.otherValueRequiredMessage)]
    : [];

  get otherId(): string {
    return getIdText(this.otherValue);
  }

  public textFieldBlur(index: number): void {
    const textfield = this.getTextField(index);
    if (textfield) {
      this._items[index].textfieldValue = textfield.value;
      this.$emit("checkboxTextfieldDataUpdate", this._items)
    }
  }

  private selectedIndices: number[] = [];

  public getSelectedIndex(value: string): number {
    return this._items.findIndex(obj => obj.value === value);
  }

  public getTextField(index: number): HTMLInputElement {
    return document.getElementById(
      `${this.id}_TextField${index}_text_field`
    ) as HTMLInputElement;
  }

  @Watch("_selected")
  protected selectedOptionsChanged(newVal: string[], oldVal: string[]): void {
    if (newVal.length > oldVal.length) {
      // new checkbox checked - get the index, push to this.selectedIndices
      const checkedVal = newVal.find(val => !oldVal.includes(val)) || "";
      const checkedIndex = this.getSelectedIndex(checkedVal);
      this.selectedIndices.push(checkedIndex);
      this.$nextTick(() => {
        const textfieldToFocus = this.getTextField(checkedIndex);
        if (textfieldToFocus) {
          textfieldToFocus.focus();
        }
      });
    } else if (newVal.length < oldVal.length) {
      // checkbox UNchecked - get the index from oldVal, remove from this.selectedIndices
      const uncheckedVal = oldVal.find(val => !newVal.includes(val)) || "";
      const uncheckedIndex = this.getSelectedIndex(uncheckedVal);
      this.selectedIndices = this.selectedIndices.filter(idx => idx !== uncheckedIndex);
      this._items[uncheckedIndex].textfieldValue = "";
      const textfieldToReset = this.getTextField(uncheckedIndex);
      if (textfieldToReset) {
        textfieldToReset.value = "";
      }
    }

    const otherIndex = newVal.indexOf(this.otherValue) > -1;
    const otherPrevSelectedIndex = this.prevSelected.indexOf(this.otherValue) > -1;
    if (otherIndex && !otherPrevSelectedIndex) {
      Vue.nextTick(() => {
        const id = this.otherEntryType === "textarea" 
          ? this.otherId + "_text_area" 
          : this.otherId + "_text_field";
        document.getElementById(id)?.focus();
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

  private showOtherEntry(value: string): boolean {
    return this.hasOtherValue 
      && value === this.otherValue
      && this._selected.indexOf(this.otherValue) > -1
      && !this.hideOtherTextarea;
  }

  private hideOtherTextarea = false;

  private showTextField(index: number): boolean {
    return this.selectedIndices.includes(index);
  }

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
    if (this._items.length) {
      this.$nextTick(() => {
        this.setEventListeners();
      })
    }
  }
  
  public get labelStyles(): string {
    return this.labelWidth ? `min-width: ${this.labelWidth}px;` : "";
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

      if (this.blurredCheckboxes[groupId].length === this._items.length) {
        if (this.checkboxRules.length === 0) {
          this.validateCheckboxes = true;
        }
        this.setErrorMessage();
      }
    }
  }

}
</script>
