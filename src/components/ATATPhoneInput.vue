<template>
  <div id="PhoneControl" class="_atat-phone-field">
    <div :class="wrapperClass">
      <div>
        <div class="d-flex align-center" v-if="label">
          <label
            :id="id + '_TextFieldLabel'"
            class="form-field-label mb-2 mr-2"
            :for="id + '_TextField'"
          >
            {{ label }}
          </label>
        </div>
        <div class="d-flex">
          <v-menu
            v-model="menuOpen"
            ref="atatPhoneDropdown"
            id="CountryCodeDropdown"
            class="_country-select"
            :hide-details="true"
            @update:v-model="_selectedCountry = $event"
            :return-object="true"
            :eager="true"
            attach
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="_country-select-button">
                <span class="fi" :class="`fi-` + _selectedCountry?.abbreviation"></span>
                <ATATSVGIcon
                  class="ml-1"
                  name="chevronDown"
                  width="10"
                  height="7"
                  color="base-dark"
                />
              </v-btn>
            </template>

            <v-list>
              <div class="_country-search">
                <v-text-field
                  v-model="searchTerm"
                  @update:model-value="searchCountries"
                  class="_dropdown-text-field"
                  placeholder="Search"
                  persistent-placeholder
                  append-inner-icon="mdi-magnify"
                  id="DropdownTextField"
                  :clearable="true"
                  clear-icon="mdi-close"
                  :autofocus="true"
                  :autocomplete="false"
                  :hide-details="true"
                />
              </div>              
              <v-list-item
                v-for="(item, idx) in searchResults"
                :key="item.abbreviation + idx"
                class="_country-item"
                :class="[
                  item.suggested ? '_suggested' : '',
                  item.active ? '_active' : '',
                  { '_suggested-label' : idx === 0 && item.suggested }
                ]"
                @click="menuItemClick(item)"
              >
                <v-list-item-title class="body _country">
                  <span class="mr-3 fi" :class="[`fi-${item.abbreviation}`]"></span>
                  <span class="mr-2 _country-name">{{ item.name }}</span>
                  <span class="color-base body-sm">{{ item.countryCode }}</span>
                </v-list-item-title>
              </v-list-item>
              <div v-if="searchResults.length === 0" class="py-2 px-4">
                Country not found
              </div>
            </v-list>
          </v-menu>

          <v-text-field
            ref="atatPhoneTextField"
            :id="id + '_textField'"
            variant="outlined"
            density="compact"
            :model-value="_value"
            @update:modelValue="_value = $event"
            :placeholder="placeHolder"
            @blur="validate"
            class="_phone-number-input"
            :hide-details="true"
            :suffix="suffix"
            :prefix="prefix"
            autocomplete="off"
            :rules="rules"
          >
          </v-text-field>
        </div>
        
        <ATATErrorValidation :errorMessages="errorMessages" />

      </div>

      <div
        v-if="isPhoneExtensionVisible !== false"
        id="PhoneExtensionControl"
        class="_atat-phone-extension-field"
        :class="extensionClass"
      >
        <div class="d-flex align-center">
          <label
            :id="id + '_ExtensionTextFieldLabel'"
            class="form-field-label mb-2 mr-2"
            :for="id + '_ExtensionTextFieldLabel'"
          >
            Extension
            <span class="optional"> Optional </span>
          </label>
        </div>

        <ATATTextField
          ref="atatExtensionText"
          :id="id + '_PhoneExtension'"
          outlined
          dense
          :height="42"
          :value="_extension"
          @update:value="_extension = $event"
          class="_phone-extension-input"
          @input="inputActions"
          autocomplete="off"
        >
        </ATATTextField>
      </div>
    </div>
  
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance } from "vue";
import {Vue, Component, Prop, Watch, toNative } from "vue-facing-decorator";
import {PropSync} from "@/decorators/custom";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import Inputmask from "inputmask/";
import { CountryObj, ValidationRule } from "../../types/Global";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

export const Countries: CountryObj[] = [
  {
    name: "United States",
    countryCode: "+1",
    abbreviation: "us",
    active: false,
    suggested: true,
    mask: ["999-999-9999"],
  },
  {
    name: "Defense Switched Network",
    countryCode: "DSN",
    abbreviation: "dsn",
    active: false,
    suggested: true,
    mask: ["999-9999", "999-999-9999"],
  },
  {
    name: "Albania",
    countryCode: "+355 4",
    abbreviation: "al",
    active: false,
    mask: ["999 999"],
  },
  {
    name: "Belgium",
    countryCode: "+32",
    abbreviation: "be",
    active: false,
    mask: ["99 999 99 99"],
  },
  {
    name: "Bulgaria",
    countryCode: "+359",
    abbreviation: "bg",
    active: false,
    mask: ["99 999 9999"],
  },
  {
    name: "Canada",
    countryCode: "+1",
    abbreviation: "ca",
    active: false,
    mask: ["999-999-9999"],
  },
  {
    name: "Croatia",
    countryCode: "+385",
    abbreviation: "hr",
    active: false,
    mask:["99 9999 999"],
  },
  {
    name: "Czech Republic",
    countryCode: "+420",
    abbreviation: "cz",
    active: false,
    mask:["999 999 999"],
  },
  {
    name: "Denmark",
    countryCode: "+45",
    abbreviation: "dk",
    active: false,
    mask:["99 99 99 99"],
  },
  {
    name: "Estonia",
    countryCode: "+372",
    abbreviation: "ee",
    active: false,
    mask:["999 9999"],
  },
  {
    name: "France",
    countryCode: "+33",
    abbreviation: "fr",
    active: false,
    mask:["99 99 99 99 99"],
  },
  {
    name: "Germany",
    countryCode: "+49",
    abbreviation: "de",
    active: false,
    mask:["999 99999999"],
  },
  {
    name: "Greece",
    countryCode: "+30",
    abbreviation: "gr",
    active: false,
    mask: ["99 9999 9999"],
  },
  {
    name: "Greenland",
    countryCode: "+299",
    abbreviation: "gl",
    active: false,
    mask: ["99 99 99"]
  },
  {
    name: "Hungary",
    countryCode: "+36",
    abbreviation: "hu",
    active: false,
    mask: ["(9) 999 9999"]
  },
  {
    name: "Iceland -- missing",
    countryCode: "+354",
    abbreviation: "is",
    active: false,
    mask: ["999-9999"]
  },
  {
    name: "Italy",
    countryCode: "+39",
    abbreviation: "it",
    active: false,
    mask: ["99 9999 9999"]
  },
  {
    name: "Latvia",
    countryCode: "+371",
    abbreviation: "lv",
    active: false,
    mask: ["99 999 999"],
  },
  {
    name: "Lithuania",
    countryCode: "+370",
    abbreviation: "lt",
    active: false,
    mask:["(9-9) 999 9999"]
  },
  {
    name: "Luxembourg",
    countryCode: "+352",
    abbreviation: "lu",
    active: false,
    mask: ["99 99 99 99"],
  },
  {
    name: "Montenegro",
    countryCode: "+382 0",
    abbreviation: "me",
    active: false,
    mask: ["99 999 999"]
  },
  {
    name: "Netherlands",
    countryCode: "+31",
    abbreviation: "nl",
    active: false,
    mask: ["999 999 9999"],
  },
  {
    name: "Norway",
    countryCode: "+47",
    abbreviation: "no",
    active: false,
    mask: ["99 99 99 99"],
  },
  {
    name: "Poland",
    countryCode: "+48",
    abbreviation: "pl",
    active: false,
    mask: ["99 999 99 99"],
  },
  {
    name: "Portugal",
    countryCode: "+351",
    abbreviation: "pt",
    active: false,
    mask: ["999 999 999"],
  },
  {
    name: "Romania",
    countryCode: "+40",
    abbreviation: "ro",
    active: false,
    mask: ["999 999 9999"],
  },
  {
    name: "Slovakia",
    countryCode: "+421",
    abbreviation: "sk",
    active: false,
    mask: ["99/999 999 99"],
  },
  {
    name: "Slovenia",
    countryCode: "+386",
    abbreviation: "si",
    active: false,
    mask: ["(99) 999 99 99"],
  },
  {
    name: "Spain",
    countryCode: "+34",
    abbreviation: "es",
    active: false,
    mask: ["999 99 99 99"],
  },
  {
    name: "Turkey",
    countryCode: "+90",
    abbreviation: "tr",
    active: false,
    mask: ["999 999 9999"],
  },
  {
    name: "United Kingdom",
    countryCode: "+44",
    abbreviation: "gb",
    active: false,
    mask: ["999 9999 9999"],
  },
];

@Component({
  components: {
    ATATTextField,
    ATATAutoComplete,
    ATATErrorValidation,
    ATATSVGIcon,
  },
})
class ATATPhoneInput extends Vue {
  // refs
  $refs!: {
    atatPhoneTextField: ComponentPublicInstance &
    {
      errorBucket: string[];
      errorCount: number;
      reset: ()=> void;
      blur: ()=> void;
      focus: ()=> void;
      validate: () => boolean;
    };
    atatPhoneDropdown: ComponentPublicInstance &
    {
      blur: ()=> void;
      focus: ()=> void;
    };
  };

  // props
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: true }) private singleLine!: boolean;
  @Prop({ default: "PhoneNumber" }) private id!: string;
  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private appendIcon!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: "" }) private suffix!: string;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: "351" }) private width!: string;
  @Prop({ default: () => [] }) private rules!: ValidationRule[];
  @Prop({ default: true }) private isPhoneExtensionVisible!: boolean;
  @PropSync("value", { default: "" }) private _value!: string | null;
  @PropSync("extensionValue", {default: ""}) private _extension!: string;

  @PropSync("country", {
    default: {
      "name": "United States",
      "countryCode": "+1",
      "abbreviation": "us",
      "active": true,
      "mask": ["999-999-9999"],
      "suggested": true,
    },
    type: Object as () => CountryObj
  }) private _selectedCountry!: CountryObj;

  public menuItemClick(item: CountryObj): void {
    this.menuOpen = false;
    this._selectedCountry = item;
  }

  public menuOpen = false;  
  
  // data
  private searchResults: CountryObj[] = [];
  private searchTerm = "";
  private errorMessages: string[] = [];
  private countries = Countries;

  private inputActions(v:any) {
    this._extension = v.target.value;
    this.setExtensionMask();
  };

  private searchCountries() {
    if (!this.searchTerm) {
      this.searchResults = this.countries;
    }else{
      this.searchResults = this.countries.filter((country) => {
        if(country.name) {
          return (
            country.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
          );
        }
      });
    }
  }

  //getters 

  private get prefix():string {
    return this._selectedCountry?.countryCode || "+1";
  }

  //ATATErrorValidation
  private setErrorMessage(): void {
    this.errorMessages = this.$refs.atatPhoneTextField.errorBucket;
  }

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch('validateFormNow')
  public validateNowChange(): void {
    if(!this.$refs.atatPhoneTextField.validate())
      this.setErrorMessage();
  }


  @Watch("_value")
  private onValueChange(): void{
    this.setPhoneMask();
  }
  //@Events
  private validate(e: FocusEvent,) : void{
    const input = e.target as HTMLInputElement;
    this._value = input.value
    // this.setErrorMessage();
    this.$emit('blur', input.value);
  }

  //@Events
  private onChange(val: CountryObj): void {
    this.setDropdownValue(val);
    this.resetTextBox();
    this.clearErrorMessages();
    this.blurDropDown();
    this.focusTextBox();
    this.setPhoneMask();
    this.setExtensionMask()
  }

  private setDropdownValue(val: CountryObj): void{
    this._selectedCountry = val;
    this._selectedCountry.active = true;
    this.searchTerm = "";
    this.countries
      .filter((country) => country.name !== val.name)
      .forEach((country) => {
        country.active = false;
      });
    this.searchResults = this.countries;
  }

  private resetTextBox():void{
    this.$refs.atatPhoneTextField.reset();
  }

  private clearErrorMessages(): void{
    this.$nextTick(()=>{
      this.$refs.atatPhoneTextField.errorBucket = [];
      this.errorMessages = [];
    });
  }

  private blurDropDown(): void{
    this.$nextTick(()=>{
      this.$refs.atatPhoneDropdown.blur();
    });
  }

  private focusTextBox():void{
    this.$nextTick(()=>{
      this.$refs.atatPhoneTextField.focus();
    });
  }

  // mask
  private setPhoneMask(): void{
    this.$nextTick(()=>{
      const phoneTextField = document.getElementById(
        this.id + "_textField"
      ) as HTMLElement;
      return Inputmask({
        mask: this._selectedCountry?.mask || [],
        placeholder: "",
        jitMasking: true
      }).mask(phoneTextField);
    });
  }
  private setExtensionMask(): void{
    if(this.isPhoneExtensionVisible === true) {
      this.$nextTick(()=>{
        const extensionTextField = document.getElementById(
          this.id + "_PhoneExtension_text_field"
        ) as HTMLElement;
        return Inputmask({
          regex:"^[0-9]{1,6}?",
          placeholder: "",
          jitMasking: true
        }).mask(extensionTextField);
      });
    }
    return
  }

  /** life cycle hooks  */
  private mounted(): void {
    this.searchResults = [...this.countries];
    this.setPhoneMask();
    this.setExtensionMask();
  }

  get wrapperClass(): string {
    return this.$vuetify.display.mdAndDown ? "d-block" : "d-flex";
  }

  get extensionClass(): string {
    return this.$vuetify.display.mdAndDown ? "mt-6" : "ml-6";
  }
  
}
export default toNative(ATATPhoneInput)
</script>
