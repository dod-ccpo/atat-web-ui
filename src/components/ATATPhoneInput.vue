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
        attach
        id="CountryCodeDropdown"
        class="_country-select"
        :items="searchResults"
        outlined
        dense
        item-text="abbreviation"
        v-model="selectedCountry"
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
        ref="atatTextField"
        :id="id + '_textField'"
        outlined
        dense
        :height="42"
        :value.sync="_value"
        :placeholder="placeHolder"
        @input="phoneMask"
        class="_phone-number-input"
        :hide-details="true"
        :suffix="suffix"
        :prefix="this.selectedCountry.countryCode"
        autocomplete="off"
        :rules="rules"
      >
      </v-text-field>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
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
    atatPhoneField: Vue & { errorBucket: string[]; errorCount: number };
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

// @PropSync("country",{
//     default: {
//       "name":"United States",
//       "countryCode":"+1",
//       "abbreviation":"us",
//       "active":true,
//     },
//     type: Object as ()=> CountryObj}
//   ) private selectedCountry!: CountryObj;

  @Prop({
    default: ()=> ({
      "name":"United States",
      "countryCode":"+1",
      "abbreviation":"us",
      "active":true,
    }),
  }
  ) private selectedCountry!: CountryObj;

  @PropSync("value", { default: "" }) private _value!: string;

  // data
  private searchResults: CountryObj[] = [];
    
  private searchTerm = "";
  private errorMessages: string[] = [];

  private inputActions(v: string) {
    this._value = v;
  }

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
    this.errorMessages = this.$refs.atatPhoneField.errorBucket;
  }

  //@Events
  private onBlur(e: FocusEvent) : void{
    const input = e.target as HTMLInputElement;
    this.setErrorMessage();
    this.$emit('blur', input.value);
  }

  //@Events
  private onChange(val: CountryObj): void {
    this.selectedCountry = val;
    this.selectedCountry.active = true;
    this.searchTerm = "";
    this.countries
      .filter((country) => country.name !== val.name)
      .forEach((country) => {
        country.active = false;
      });
    this.searchResults = this.countries;
    this.$emit("country-changed", val);
  }


  // mask
  private phoneMask(val: string): Inputmask.Instance {
    this._value = val;
    const phoneTextField = document.getElementById(
      this.id + "_textField"
    ) as HTMLElement;
    switch (this.selectedCountry.abbreviation) {
      case "us":
        return Inputmask("999-999-9999", {
          placeholder: "",
          jitMasking: true,
        }).mask(phoneTextField);
      case "dsn":
        this._value = this.selectedCountry.countryCode + val;
        return Inputmask("999-999-9999", {
          placeholder: "",
          jitMasking: true,
        }).mask(phoneTextField);
      default:
        return Inputmask("*{20}", { placeholder: "", jitMasking: true }).mask(
          phoneTextField
        );
    }
  }

  private mounted(): void {
    this.searchResults = [...this.countries];
    this.$emit("country-changed", this.selectedCountry);
  }

  //data

  private countries: CountryObj[] = [
    {
      name: "United States",
      countryCode: "+1",
      abbreviation: "us",
      active: true,
      suggested: true,
    },
    {
      name: "Defense Switched Network",
      countryCode: "DSN",
      abbreviation: "dsn",
      active: false,
      suggested: true,
    },
    {
      name: "Albania",
      countryCode: "+355",
      abbreviation: "al",
      active: false,
    },
    {
      name: "Belgium",
      countryCode: "+32",
      abbreviation: "be",
      active: false,
    },
    {
      name: "Bulgaria",
      countryCode: "+359",
      abbreviation: "bg",
      active: false,
    },
    {
      name: "Canada",
      countryCode: "+1",
      abbreviation: "ca",
      active: false,
    },
    {
      name: "Croatia",
      countryCode: "+385",
      abbreviation: "hr",
      active: false,
    },
    {
      name: "Czech Republic",
      countryCode: "+420",
      abbreviation: "cz",
      active: false,
    },
    {
      name: "Denmark",
      countryCode: "+45",
      abbreviation: "dk",
      active: false,
    },
    {
      name: "Estonia",
      countryCode: "+372",
      abbreviation: "ee",
      active: false,
    },
    {
      name: "France",
      countryCode: "+33",
      abbreviation: "fr",
      active: false,
    },
    {
      name: "Germany",
      countryCode: "+49",
      abbreviation: "de",
      active: false,
    },
    {
      name: "Greece",
      countryCode: "+30",
      abbreviation: "gr",
      active: false,
    },
    {
      name: "Greenland",
      countryCode: "+299",
      abbreviation: "gl",
      active: false,
    },
    {
      name: "Hungary",
      countryCode: "+36",
      abbreviation: "hu",
      active: false,
    },
    {
      name: "Iceland",
      countryCode: "+354",
      abbreviation: "is",
      active: false,
    },
    {
      name: "Italy",
      countryCode: "+39",
      abbreviation: "it",
      active: false,
    },
    {
      name: "Latvia",
      countryCode: "+371",
      abbreviation: "lv",
      active: false,
    },
    {
      name: "Lithuania",
      countryCode: "+370",
      abbreviation: "lt",
      active: false,
    },
    {
      name: "Luxembourg",
      countryCode: "+352",
      abbreviation: "lu",
      active: false,
    },
    {
      name: "Montenegro",
      countryCode: "+382",
      abbreviation: "me",
      active: false,
    },
    {
      name: "Netherlands",
      countryCode: "+31",
      abbreviation: "nl",
      active: false,
    },
    {
      name: "Norway",
      countryCode: "+47",
      abbreviation: "no",
      active: false,
    },
    {
      name: "Poland",
      countryCode: "+48",
      abbreviation: "pl",
      active: false,
    },
    {
      name: "Portugal",
      countryCode: "+351",
      abbreviation: "pt",
      active: false,
    },
    {
      name: "Romania",
      countryCode: "+40",
      abbreviation: "ro",
      active: false,
    },
    {
      name: "Slovakia",
      countryCode: "+421",
      abbreviation: "sk",
      active: false,
    },
    {
      name: "Slovenia",
      countryCode: "+386",
      abbreviation: "si",
      active: false,
    },
    {
      name: "Spain",
      countryCode: "+34",
      abbreviation: "es",
      active: false,
    },
    {
      name: "Turkey",
      countryCode: "+90",
      abbreviation: "tr",
      active: false,
    },
    {
      name: "United Kingdom",
      countryCode: "+44",
      abbreviation: "gb",
      active: false,
    },
  ];
}
</script>
