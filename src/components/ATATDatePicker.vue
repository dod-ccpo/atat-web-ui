<template>
  <div
    :id="id + 'DatePickerContainer'" 
    class="atat-date-picker"
    >
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
      :model-value="_value"
      @update:model-value="_value = $event"
      
      :style="'width: ' + width + 'px'"
      density="compact"
      :rules="rules"
      @blur="onBlur"
      validate-on="blur"
      autocomplete="off"
    />
       
     
    <ATATErrorValidation v-if="showErrors" :errorMessages="errorMessages" />
    <div v-if="displayHelpText" class="help-text mt-2">
      {{ helpText }}
    </div>
  </div>
</template>
<script lang="ts">
import { ComponentPublicInstance } from "vue";
import { Vue, Component, Prop, Watch, toNative } from "vue-facing-decorator";
import { format, formatISO, isValid } from "date-fns";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {ValidationRule} from "../../types/Global";
import { PropSync } from "@/decorators/custom";

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
      validate: () => Promise<string[]>;
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
  @PropSync("value", { default: "" }) private _value!: string;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: "140" }) private width!: string;
  @Prop({ default: "MM/DD/YYYY" }) private helpText!: string;
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
    this.dateFormatted = this.reformatDate(this._value);
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
   * validates and set error msgs if necessary
   */

  private onBlur(): void {
    this.setErrorMessage();
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
      async (response: string[]) => {
        this.errorMessages = response as string[];
        this.$emit("hasErrorMessages", this.errorMessages );

      }
    );
  }

  public async setDateFromValue(): Promise<void> {
    if (this._value && this._value.indexOf("-") > -1) {
      this.date[0] = this._value;
    } else if (this._value && this._value.indexOf("/") > -1) {
      this.date[0] = this.reformatDate(this._value);
    }
  }

  /**
   * LIFECYCLE HOOKS
   */
  private async mounted(): Promise<void> {
    await this.setDateFromValue();
    this.formatDateWatcher();
    this.dateInputMask();
  }

}
export default toNative(ATATDatePicker)
</script>
