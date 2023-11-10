<template>
  <v-form
    :id="id + 'DatePickerContainer'" 
    class="atat-date-picker"
    ref="atatDatePickerForm"
    lazy-validation="true">
    <div class="d-flex align-center mb-2" v-if="label">
      <label
        :id="id + 'DatePickerLabel'"
        class="form-field-label mr-1"
        :for="id + 'DatePickerTextField'"
      >
        {{ label }}
        <span v-if="optional" class="optional"> Optional </span>
      </label>
      <ATATTooltip
        :tooltipText="tooltipText"
        :tooltipTitle="tooltipTitle"
        :id="id"
        :label="label"
      />
    </div>
    <v-text-field
      ref="atatDatePickerTextField"
      :id="id + 'DatePickerTextField'"
      :placeholder="placeHolder"
      class="text-primary _input-max-width d-flex align-center"
      :hide-details="true"
      variant="outlined"
      @update:model-value="onInput"
      v-model="dateFormatted"
      :style="'width: ' + width + 'px'"
      density="compact"
      :rules="rules"
      @blur="onBlur"
      validate-on="blur"
      autocomplete="off"
    ></v-text-field>  
       
     
    <ATATErrorValidation v-if="showErrors" :errorMessages="errorMessages" />
    <div v-if="displayHelpText" class="help-text mt-2">
      {{ helpText }}
    </div>
  </v-form>
</template>
<script lang="ts">
import { ComponentPublicInstance } from "vue";
import { Vue, Component, Prop, Watch, toNative } from "vue-facing-decorator";
import { format, formatISO, isValid } from "date-fns";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {ValidationRule} from "../../types/Global";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";

@Component({
  emits:[
    "update:value",
    "hasErrorMessages"
  ],
  components: {
    ATATTooltip,
    ATATErrorValidation,
  },
})

class ATATDatePicker extends Vue {
  // refs
  $refs!: {
    atatDatePickerTextField: ComponentPublicInstance & {
      validate: () => Promise<SubmitEventPromise>;
      value: string;
      resetValidation: ()=> boolean;
    };
  };

  /**
   * DATA
   */
  private date = [""];
  private dateFormatted = "";
  private errorMessages: string[] = [];

  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: "" }) private value!: string;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: "220" }) private width!: string;
  @Prop({ default: "mm/dd/yyyy" }) private helpText!: string;
  @Prop({ default: true }) private showHelpText!: boolean;
  @Prop({ default: "" }) private tooltipTitle!: string;
  @Prop({ default: "" }) private tooltipText!: string;
  @Prop({ default: () => [] }) private rules!: ValidationRule[];
  @Prop({ default: false }) private isRequired!: boolean;
  @Prop({ default: true }) private showErrors!: boolean;

  /**
   * WATCHERS
   */
  @Watch("date")
  protected formatDateWatcher(): void {
    this.dateFormatted = this.reformatDate(this.date[0]);
  }

  @Watch("value")
  public async valueChanged(): Promise<void> {
    await this.setDateFromValue();
  }

  /** 
   * GETTERS 
  */

  /**
   *  toggles between help text and error messages 
  */
  get displayHelpText(): boolean {
    return this.showHelpText && this.errorMessages.length === 0
  }

  /**
   * EVENTS
   */

  /**
   * onBlur event of the textbox.
   *
   * if textbox value is a valid date
   * [x] reformat textbox value date for datepicker
   * [x] update date value property
   * [x] remove any errors
   */

  private onBlur(): void {
    if (isValid(new Date(this.dateFormatted))) {
      this.date = [this.reformatDate(this.dateFormatted)];
      this.updateDateValueProperty();
      this.removeErrors();
    }
    this.$nextTick(() => {
      this.$refs.atatDatePickerTextField.validate()
      this.setErrorMessage();
    });
  }
  /**
   *
   * if textbox is cleared manually, resets necessary
   * date attribs
   */
  private onInput(date: string): void {
    if (date === "") {
      this.dateFormatted = "";
      this.date = [""];
    }
  }


  /**
   * emits 'update:date' value when dp is clicked or
   * textbox value is changed
   */
  private updateDateValueProperty(): void {
    if (isValid(new Date(this.dateFormatted))) {
      this.$emit("update:value", this.dateFormatted);
    } 
  }


  /**
   * utility function that removes errors from
   * Vuetify's errorBucket & this.errorMessages
   */
  private removeErrors(): void {
    this.errorMessages = [];
  }

  /**
   * FUNCTIONS
   */

  private dateInputMask() {
    const dp = document.getElementById(this.id + "DatePickerTextField") as HTMLInputElement;
    dp.addEventListener('keypress', (e: KeyboardEvent)=>{
      
      /// don't show menu when user is typing date
      // makes validation hard to manage
      if (e.key.toLowerCase()==="enter"){
        this.$refs.atatDatePickerTextField.validate();
      }
     
      if(Number.isNaN(parseInt(e.key))) {
        e.preventDefault();
      }
      
      const len = dp.value.length;
      switch(len){
      case 2:
      case 5:
        dp.value += '/';
        break;
      case 10:
        e.preventDefault();
        break;
      default:
        break;
      }

      
    });
  };



  /**
   * @date (string)
   * returns formatted date as yyyy-MM-dd if date isValid
   */
  private reformatDate(d: string): string {
    let formattedDate = "";
    if (isValid(new Date(d))) {
      formattedDate = d.includes("-")
        ? format(new Date(d+'T00:00:00'), 'P')
        : formatISO(new Date(d), { representation: 'date' })
    }
    return formattedDate;
  }


  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch('validateFormNow')
  public validateNowChange(): void {
    this.setErrorMessage();
  }

  private setErrorMessage(): void {
    this.$refs.atatDatePickerTextField.validate().then(
      (response: unknown) => {
        this.errorMessages = response as string[];

      }
    );
  }

  public async setDateFromValue(): Promise<void> {
    if (this.value && this.value.indexOf("-") > -1) {
      this.date[0] = this.value;
    } else if (this.value && this.value.indexOf("/") > -1) {
      this.date[0] = this.reformatDate(this.value);
    }
  }

  /**
   * LIFECYCLE HOOKS
   */
  private async mounted(): Promise<void> {
    await this.setDateFromValue();
    this.formatDateWatcher();
    this.dateInputMask();
    this.removeErrors();
  }

}
export default toNative(ATATDatePicker)
</script>
