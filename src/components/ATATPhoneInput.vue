<template>
  <div id="PhoneControl" class="_atat-phone-field">
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
      <v-select
        ref="atatPhoneDropdown"
        attach
        id="CountryCodeDropdown"
        class="_country-select"
        :items="searchResults"
        outlined
        dense
        item-text="abbreviation"
        hide-details="true"
        :error="errorMessages.length>0"
        v-model="_selectedCountry"
        :height="42"
        :menu-props="{ bottom: true, offsetY: true }"
        @change="onChange"
        :return-object="true"
      >
        <template v-slot:selection="{ item }">
          <span class="fi" :class="[`fi-${item.abbreviation}`]"> </span>
        </template>
        <template v-slot:prepend-item>
          <v-text-field
            v-model="searchTerm"
            class="_dropdown-text-field"
            placeholder="Search"
            @input="searchCountries"
            append-icon="search"
            id="DropdownTextField"
            autocomplete="off"
          />
        </template>
        <template v-slot:item="{ item, on }">
          <v-list-item
            class="_country-list"
            :class="[
              item.suggested ? '_suggested' : '',
              item.active ? '_active' : '',
            ]"
            v-on="on"
          >
            <v-list-item-content
              :id="
                id + '_DropdownListItem_' + item.name.replace(/[^A-Z0-9]/gi, '')
              "
              :item-value="item.name"
            >
              <v-list-item-title class="body _country">
                <v-row no-gutters align="center">
                  <span class="mr-3 fi" :class="[`fi-${item.abbreviation}`]">
                  </span>
                  <span class="mr-2 _country-name">{{ item.name }}</span>
                  <span class="color-base body-sm">{{ item.countryCode }}</span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
      <v-text-field
        ref="atatPhoneTextField"
        :id="id + '_textField'"
        outlined
        dense
        :height="42"
        :value.sync="_value"
        :placeholder="placeHolder"
        @blur="validate"
        class="_phone-number-input"
        :hide-details="true"
        :suffix="suffix"
        :prefix="this._selectedCountry.countryCode"
        autocomplete="off"
        :rules="rules"
      >
      </v-text-field>
    </div>
     <ATATErrorValidation :errorMessages="errorMessages" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import Inputmask from "inputmask/";
import { CountryObj } from "../../types/Global";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";

@Component({
  components: {
    ATATTextField,
    ATATAutoComplete,
    ATATErrorValidation,
  },
})
export default class ATATPhoneInput extends Vue {
  // refs
  $refs!: {
    atatPhoneTextField: Vue & 
    { 
      errorBucket: string[]; 
      errorCount: number; 
      reset: ()=> void; 
      blur: ()=> void;
      focus: ()=> void;
    };
    atatPhoneDropdown: Vue & 
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
  @Prop({ default: () => [] }) private rules!: Array<unknown>;
  @Prop({ default: "" }) private suffix!: string;
  @Prop({ default: "" }) private optional!: boolean;
  @Prop({ default: "351" }) private width!: string;


  @PropSync("country", {
    default: {
      "name": "United States",
      "countryCode": "+1",
      "abbreviation": "us",
      "active": true,
      "mask": "999-999-9999"
    },
    type: Object as () => CountryObj } 
  )

  private _selectedCountry!: CountryObj;

  @PropSync("value", { default: "" }) private _value!: string | null;

  // data
  private searchResults: CountryObj[] = [];
  private searchTerm = "";
  private errorMessages: string[] = [];

  private searchCountries() {
    if (!this.searchTerm) {
      this.searchResults = this.countries;
    }
    this.searchResults = this.countries.filter((country) => {
      return (
        country.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
      );
    });
  }

  //ATATErrorValidation
  private setErrorMessage(): void {
    this.errorMessages = this.$refs.atatPhoneTextField.errorBucket;
  }


  //@Events
  private validate(e: FocusEvent) : void{
    const input = e.target as HTMLInputElement;
    this.setErrorMessage();
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
    Vue.nextTick(()=>{
      this.$refs.atatPhoneTextField.errorBucket = [];
      this.errorMessages = [];
    });
  }

  private blurDropDown(): void{
    Vue.nextTick(()=>{
      this.$refs.atatPhoneDropdown.blur();
    });
  }

  private focusTextBox():void{
    Vue.nextTick(()=>{
      this.$refs.atatPhoneTextField.focus();
    });
  }

  // mask
  private setPhoneMask(): void{
    Vue.nextTick(()=>{
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
  
  private mounted(): void {
    this.searchResults = [...this.countries];
    this.setPhoneMask();
  }

  //data

  private countries: CountryObj[] = [
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
}
</script>
