<template>
  <div :id="id">
    <p
      v-if="groupLabel"
      :id="groupLabelId"
      class="_checkbox-group-label d-flex align-center"
      :class="{ 'mb-0': groupLabelHelpText }"
    >
      <span :class="{ 'mr-2': !optional }">{{ groupLabel }}</span>
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
    <div class="_checkboxes" :class="{'_inline' : inline}">
      <v-checkbox
        v-for="(item, index) in _items"
        v-model="_selected"
        :id="'Checkbox_' + getIdText(item.id) + checkboxLabelSuffix"
        :class="[
          card ? '_checkbox-card' : '_checkbox',
          color ? '_checkbox-' + color : '',
          { 'flex-column _has-other': item.value === otherValue },
          { '_other-selected': otherIsSelected },
          { '_no-description': noDescriptions },
          { '_has-text-fields': hasTextFields },
          { '_big-bold-label': boldText },
        ]"
        :style="cardStyles"
        :key="id + '_' + item.value"
        :label="item.label"
        :value="item.value"
        :error="error"
        :disabled="disabled"
        :rules="checkboxRules"
        multiple
        :hide-details="true"
        :ref="index === 0 ? 'checkboxGroup' : ''"
        :data-group-id="id + '_Group'"
      >
      <!-- @mouseup="checkBoxClicked(item.value)" -->


        <template
          v-if="
            card ||
            item.description ||
            item.value === otherValue ||
            hasTextFields ||
            showMessage
          "
          v-slot:label
        >
          <div
            class="d-flex"
            :class="[
              { 'flex-column width-100': !hasTextFields },
              { 'align-center': (hasTextFields) },
            ]"
          >
            <div
              v-if="item.label"
              :class="[
                { 'card-label': item.label },
                { 'mb-0': item.value === otherValue },
                { '_no-description': noDescriptions },
              ]"
              :style="labelStyles"
            >
              {{ item.label }} 
            </div>
            <div
              v-if="item.description"
              class="mb-0 _description"
              :class="[{'_normal':descriptionNormal}]"
            v-html="item.description"
            ></div>
          </div>
        </template>

        <template v-slot:append>
          <template v-if="
            hasOtherValue && (otherIsSelected || hasTextFields) && item.value === otherValue
          ">
            <ATATTextArea
              v-if="otherEntryType === 'textarea'"
              ref="atatTextInput"
              name="otherTextArea"
              :id="otherId"
              class="width-100 ml-5 mb-6"
              :rows="3"
              :validateItOnBlur="validateOtherOnBlur"
              :value="_otherValueEntered"
              @update:value="_otherValueEntered = $event"
              :rules="otherRequiredRule"
            />
            <ATATTextField
              v-if="otherEntryType === 'textfield'"
              ref="atatTextInput"
              name="otherTextField"
              :id="otherId"
              class="ml-5 mb-6 mt-2 _input-wrapper-max-width"
              :validateItOnBlur="validateOtherOnBlur"
              :value="_otherValueEntered"
              @update:value="_otherValueEntered = $event"
              :rules="otherRequiredRule"
            />

            <ATATTextField
              v-if="hasTextFields"
              ref="atatTextInput"
              :id="id + '_TextField' + index"
              :appendText="textFieldAppendText"
              :width="textFieldWidth"
              type="text"
              @blur="textFieldBlur(index)"
              :isFormattedNumber="isFormattedNumber"
              :rules="textfieldRules"
              :value="item.textfieldValue"
              @update:value="item.textfieldValue = $event"
            />
          </template>
          <template v-if="showMessage">
            <div v-if="showPerformanceRequirementTotal"
              class="d-flex align-center text-align-right width-100 text-no-wrap mr-4">
              <ATATSVGIcon
                v-if="getPerformanceRequirementTotal(item.value) !==''"
                name="warning"
                class="mt-n1"
                color="warning-dark2"
                width="16"
                height="16"
              >
              </ATATSVGIcon>
              <div class="body-sm text-base-light ml-2">
              {{ getPerformanceRequirementTotal(item.value) }}
              </div>
            </div>
          </template>
        </template>
        
      </v-checkbox>
    </div>

    <ATATErrorValidation :errorMessages="errorMessages" />
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance } from "vue";
import { Component, Prop, Vue, Watch, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
import { Checkbox, totalClassLevelsInDOWObject, ValidationRule } from "../../types/Global";
import { getIdText, setItemToPlural } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ClassificationRequirements from "@/store/classificationRequirements";

@Component({
  emits: ["update:value"],
  components: {
    ATATTextArea,
    ATATTextField,
    ATATErrorValidation,
    ATATTooltip,
    ATATSVGIcon
  },
})
class ATATCheckboxGroup extends Vue {
  // refs
  $refs!: {
    checkboxGroup: (ComponentPublicInstance & {
      errorBucket: string[];
      errorCount: number;
      validate: () => boolean;
    })[];
    atatTextInput: (ComponentPublicInstance & { errorBucket: string[]; errorCount: number })[];
  };

  // props
  @Prop({ default: [] }) private value!: string[];
  public _selected: string[] = this.value;
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
  @Prop({ default: () => [] }) private rules!: ValidationRule[];
  @Prop({ default: () => [] }) private textfieldRules!: Array<unknown>;
  @Prop({ default: "textfield" }) private otherEntryType?: string;
  @Prop({ default: "" }) private color!: string;
  @Prop({ default: false }) private optional?: boolean;
  @Prop() private tooltipText?: string;
  @Prop() private tooltipTitle?: string;
  @Prop() private tooltipLabel?: string;
  @Prop({ default: false }) private noDescriptions?: boolean;
  @Prop({ default: false }) private hasTextFields?: boolean;
  @Prop({ default: false }) private boldText?: boolean;
  @Prop() private labelWidth?: string;
  @Prop() private cardWidth?: string;
  @Prop({ default: false }) private cardNormal?: boolean;
  @Prop() private labelFontSize?: string;
  @Prop() private labelFontWeight?: string;
  @Prop() private labelSuffix?: string;
  @Prop() private textFieldAppendText?: string;
  @Prop() private textFieldWidth?: string;
  @Prop({ default: "text" }) private textFieldType?: string;
  @Prop({ default: false }) private isFormattedNumber?: boolean;
  @Prop({ default: false }) private showIconWithMessage?: boolean;
  @Prop({ default: false }) private showPerformanceRequirementTotal?: boolean;
  @Prop({ default: false }) private inline?: boolean;
  @Prop({ default: false }) private validateOnLoad?: boolean;
  @Prop({ default: false }) private descriptionNormal?: boolean;

  // data, methods, watchers, etc.
  private validateOtherOnBlur = true;
  private prevSelected: string[] = [];
  private errorMessages: string[] = [];
  public blurredCheckboxes: Record<string, string[]> = {};
  private validateCheckboxesNow = false;
  private totalRequirementsInDOW: totalClassLevelsInDOWObject[] = []
  public isLoading = false;

  public checkboxRules: ValidationRule[] = [];

  @Watch("rules", {deep: true})
  public rulesChanged(): void {
    this.checkboxRules = [];
    if (!this.isLoading) {
      this.clearErrorMessage();
    }
  }

  @Watch("validateCheckboxesNow")
  protected setCheckboxValidation(): void {
    this.checkboxRules = this.rules;
  }

  get showMessage(): boolean{
    return [this.showPerformanceRequirementTotal].includes(true);
  }

  private otherRequiredRule = this.otherValueRequiredMessage
    ? [this.$validators?.required(this.otherValueRequiredMessage)]
    : [];

  get otherId(): string {
    return "Other_" + getIdText(this.otherValue);
  }

  public textFieldBlur(index: number): void {
    const textfield = this.getTextField(index);
    if (textfield) {
      this._items[index].textfieldValue = textfield.value;
      this.$emit("checkboxTextfieldDataUpdate", this._items);
    }
  }

  private selectedIndices: number[] = [];

  public getSelectedIndex(value: string): number {
    return this._items.findIndex((obj) => obj.value === value);
  }

  public getTextField(index: number): HTMLInputElement {
    return document.getElementById(
      `${this.id}_TextField${index}_text_field`
    ) as HTMLInputElement;
  }

  @Watch("_selected")
  protected selectedOptionsChanged(newVal: string[], oldVal: string[]): void {
    if (!oldVal || newVal.length > oldVal.length) {
      // new checkbox checked - get the index, push to this.selectedIndices
      const newCheckedVals = newVal.filter((val) => !oldVal.includes(val));
      newCheckedVals.forEach((v) => {
        const checkedIndex = this.getSelectedIndex(v);
        this.selectedIndices.push(checkedIndex);
      });
    } else if (newVal.length < oldVal.length) {
      // checkbox UNchecked - get the index from oldVal, remove from this.selectedIndices
      const uncheckedVal = oldVal.find((val) => !newVal.includes(val)) || "";
      const uncheckedIndex = this.getSelectedIndex(uncheckedVal);
      this.selectedIndices = this.selectedIndices.filter(
        (idx) => idx !== uncheckedIndex
      );
      this._items[uncheckedIndex].textfieldValue = "";
      const textfieldToReset = this.getTextField(uncheckedIndex);
      if (textfieldToReset) {
        textfieldToReset.value = "";
      }
    }

    const otherIndex = newVal.indexOf(this.otherValue) > -1;
    const otherPrevSelectedIndex =
      this.prevSelected.indexOf(this.otherValue) > -1;
    if (otherIndex && !otherPrevSelectedIndex) {
      this.$nextTick(() => {
        const id =
          this.otherEntryType === "textarea"
            ? this.otherId + "_text_area"
            : this.otherId + "_text_field";
        document.getElementById(id)?.focus();
      });
    }
    if (newVal.includes(this.noneValue)) {
      this._otherValueEntered = "";
      const noneApplyIndex = this.prevSelected.indexOf(this.noneValue);
      if (newVal.length > 1 && noneApplyIndex === -1) {
        // uncheck the other options
        this._selected = [this.noneValue];
      } else if (newVal.length > 1) {
        // remove "None Apply"
        this._selected.splice(noneApplyIndex, 1);
      }
    }
    this.$nextTick(() => {
      this.prevSelected = [...this._selected];
      this.$emit("update:value", [...this._selected]);
      this.validateOtherOnBlur = this.otherIsSelected ? true : false;
      if (this.checkboxRules.length === 0) {
        this.checkboxRules = this.rules;
        this.validateCheckboxesNow = true;
      }      
    });
    if (newVal.length || oldVal.length) {
      this.setErrorMessage();
    }
  }

  private getIdText(string: string) {
    return getIdText(string);
  }
  public get otherIsSelected(): boolean {
    return this._selected.includes(this.otherValue)
  }

  private setErrorMessage(): void {
    if (this._selected.length) {
      this.clearErrorMessage();
    } else {
      setTimeout(() => {
        const checkbox = this.$refs.checkboxGroup;
        if (checkbox && checkbox.length) {
          this.errorMessages = checkbox[0].errorBucket;
        }
        AcquisitionPackage.setValidateNow(false);
      }, 0);
    }
    this.isLoading = false;
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

  private getPerformanceRequirementTotal(classLevelSysId: string): string{
    const totalClassLevelInDOW = ClassificationRequirements.classLevelsInDOWTotal.find(
      cl => cl.classLevelSysId === classLevelSysId
    )?.DOWObjectTotal || 0;
    const hasBeenDeleted = totalClassLevelInDOW === 0;
    if (hasBeenDeleted){ return ""; } 
    return totalClassLevelInDOW > 0 && this._selected.includes(classLevelSysId)
      ? totalClassLevelInDOW + " " + setItemToPlural(totalClassLevelInDOW, 'requirement') 
      : "";
  }

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch("validateFormNow")
  public validateNowChange(): void {
    if ((!this.validateCheckboxesNow && this.rules.length) || this.validateOnLoad) {
      this.validateCheckboxesNow = true;
    }

    if (this.checkboxRules.length === 0) {
      this.checkboxRules = this.rules;
    }

    this.setErrorMessage();
  }

  @Watch("_items")
  protected checkboxItemsChange(): void {
    if (this._items.length) {
      this.$nextTick(() => {
        this.setEventListeners();
      });
    }
  }
  
  public get cardStyles(): string {
    return this.cardWidth ? `min-width: ${this.cardWidth}px; max-width: ${this.cardWidth}px;` : "";
  }

  public get labelStyles(): string {
    return this.labelWidth ? `min-width: ${this.labelWidth}px;` : "";
  }

  public get checkboxLabelSuffix(): string {
    return this.labelSuffix ? "_" + this.labelSuffix : "";
  }

  public async created(): Promise<void>{
    // necessary prep to show getPerformanceRequirementTotal
    await ClassificationRequirements.getTotalClassLevelsInDOW();
    this.totalRequirementsInDOW = ClassificationRequirements.classLevelsInDOWTotal;
  } 

  public mounted(): void {
    this.isLoading = true;
    this.setEventListeners();
   
    // if validateOnLoad, then validate checkboxes immediately
    if (this.validateOnLoad){
      this.validateCheckboxesNow = true;
      setTimeout(()=>{
        this.setErrorMessage();
      }, 0)
    }
  }

  public setCheckboxEventListeners(event: FocusEvent): void {
    const thisCheckbox = event.currentTarget as HTMLInputElement;
    const id = thisCheckbox.id;
    const groupId: string = thisCheckbox.dataset.groupId || "CheckboxGroup";
    if (id && groupId && groupId === this.id + "_Group") {
      if (
        !Object.prototype.hasOwnProperty.call(this.blurredCheckboxes, groupId)
      ) {
        this.blurredCheckboxes[groupId] = [];
      }
      if (this.blurredCheckboxes[groupId].indexOf(id) === -1) {
        // only clear if validation hasn't been set yet
        if (!this.validateCheckboxesNow) {
          this.clearErrorMessage();
        }
        this.blurredCheckboxes[groupId].push(id);
      }

      if (this.blurredCheckboxes[groupId].length === this._items.length) {
        if (this.checkboxRules.length === 0) {
          this.checkboxRules = this.rules;
          this.validateCheckboxesNow = true;
        }
        this.setErrorMessage();
      }
    }
  }
}
export default toNative(ATATCheckboxGroup)
</script>
