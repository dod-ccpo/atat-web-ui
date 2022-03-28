<template>
  <div id="phone_control" class="atat-phone-field">
    <div class="d-flex align-center" v-if="label">
      <label
        :id="id + '_text_field_label'"
        class="form-field-label mb-2 mr-2"
        :for="id + '_text_field'"
      >
        {{ label }}
      </label>
    </div>
    <div class="d-flex">
      <v-select
        id="countrycode_dropdown'"
        class="country-select"
        :items="searchResults"
        outlined
        dense
        v-model="selectedValue"
        :height="42"
        :menu-props="{ bottom: true, offsetY: true }"
        @change="onChange"
      >
        <template v-slot:selection="{ item }">
          <span class="fi" :class="[`fi-${item.abbreviation}`]"> </span>
        </template>
        <template v-slot:prepend-item>
          <v-text-field
            v-model="searchTerm"
            class="dropdown-text-field"
            placeholder="Search"
            @input="searchCountries"
            append-icon="search"
            id="dropdown-text-field"
          />
          <v-divider class="search-divider"/>
        </template>
        <template v-slot:item="{ item, on }">
          <v-list-item class="country-list" :class="[item.suggested ? 'suggested' : '']" v-on="on">
            <v-list-item-content
              :id="id + '_DropdownListItem_' + item.name.replace(/[^A-Z0-9]/ig, '')"
              :item-value=item.name
            >
              <v-list-item-title class="body country">
                <v-row no-gutters align="center">
                  <span class=" mr-3 fi" :class="[`fi-${item.abbreviation}`]"> </span>
                  <span class="mr-2">{{ item.name }}</span>
                  <span class="color-base">{{ item.countryCode }}</span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
      <v-text-field
        ref="atatTextField"
        :id="id + '_text_field'"
        outlined
        dense
        :height="42"
        :value.sync="_value"
        :placeholder="placeHolder"
        @input="phoneMask"
        class="phone-number-input"
        :hide-details="true"
        :suffix="suffix"
        :prefix="this.selectedValue.countryCode"
      >
      </v-text-field>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, PropSync} from "vue-property-decorator";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import Inputmask from "inputmask";
import {CountryObj} from "../../types/Global";
import placeholder from "cypress/types/lodash/fp/placeholder";

@Component({
  components: {
    ATATTextField,
    ATATAutoComplete,
  }
})
export default class ATATPhoneInput extends Vue {
  // refs
  $refs!: {
    atatPhoneField: Vue & { errorBucket: string[]; errorCount: number };
  };

  // props
  @Prop({default: true}) private dense!: boolean;
  @Prop({default: true}) private singleLine!: boolean;
  @Prop({default: "phoneNumber"}) private id!: string;
  @Prop({default: ""}) private label!: string;
  @Prop({default: ""}) private appendIcon!: string;
  @Prop({default: ""}) private placeHolder!: string;
  @Prop({default: ""}) private suffix!: string;
  @Prop({default: ""}) private optional!: boolean;
  @Prop({default: "351"}) private width!: string;

  @PropSync("value", {default: ""}) private _value!: string;

  //data
  private countries: CountryObj[] = [
    {
      name: 'United States',
      countryCode: '+1',
      abbreviation: 'us',
      suggested: true
    },
    {
      name: 'Defense Switched Network',
      countryCode: 'DSN',
      abbreviation: 'dsn',
      suggested: true
    },
    {
      name: 'Albania',
      countryCode: '+355',
      abbreviation: 'al'
    },
    {
      name: 'Belgium',
      countryCode: '+32',
      abbreviation: 'be'
    },
    {
      name: 'Bulgaria',
      countryCode: '+359',
      abbreviation: 'bg'
    },
    {
      name: 'Canada',
      countryCode: '+1',
      abbreviation: 'ca'
    },
    {
      name: 'Croatia',
      countryCode: '+385',
      abbreviation: 'hr'
    },
    {
      name: 'Czech Republic',
      countryCode: '+420',
      abbreviation: 'cz'
    },
    {
      name: 'Denmark',
      countryCode: '+45',
      abbreviation: 'dk'
    },
    {
      name: 'Estonia',
      countryCode: '+372',
      abbreviation: 'ee'
    },
    {
      name: 'France',
      countryCode: '+33',
      abbreviation: 'fr'
    },
    {
      name: 'Germany',
      countryCode: '+49',
      abbreviation: 'de'
    },
    {
      name: 'Greece',
      countryCode: '+30',
      abbreviation: 'gr'
    },
    {
      name: 'Greenland',
      countryCode: '+299',
      abbreviation: 'gl'
    },
    {
      name: 'Hungary',
      countryCode: '+36',
      abbreviation: 'hu'
    },
    {
      name: 'Iceland',
      countryCode: '+354',
      abbreviation: 'is'
    },
    {
      name: 'Italy',
      countryCode: '+39',
      abbreviation: 'it'
    },
    {
      name: 'Latvia',
      countryCode: '+371',
      abbreviation: 'lv'
    },
    {
      name: 'Lithuania',
      countryCode: '+370',
      abbreviation: 'lt'
    },
    {
      name: 'Luxembourg',
      countryCode: '+352',
      abbreviation: 'lu'
    },
    {
      name: 'Montenegro',
      countryCode: '+382',
      abbreviation: 'me'
    },
    {
      name: 'Netherlands',
      countryCode: '+31',
      abbreviation: 'nl'
    },
    {
      name: 'Norway',
      countryCode: '+47',
      abbreviation: 'no'
    },
    {
      name: 'Poland',
      countryCode: '+48',
      abbreviation: 'pl'
    },
    {
      name: 'Portugal',
      countryCode: '+351',
      abbreviation: 'pt'
    },
    {
      name: 'Romania',
      countryCode: '+40',
      abbreviation: 'ro'
    },
    {
      name: 'Slovakia',
      countryCode: '+421',
      abbreviation: 'sk'
    },
    {
      name: 'Slovenia',
      countryCode: '+386',
      abbreviation: 'si'
    },
    {
      name: 'Spain',
      countryCode: '+34',
      abbreviation: 'es'
    },
    {
      name: 'Turkey',
      countryCode: '+90',
      abbreviation: 'tr'
    },
    {
      name: 'United Kingdom',
      countryCode: '+44',
      abbreviation: 'gb'
    },
  ];
  private searchResults: CountryObj[] = [];
  private searchTerm = '';
  private selectedValue: CountryObj = {name: '', countryCode: '', abbreviation: ''};
  private errorMessages: string[] = [];

  private inputActions(v: string) {
    this._value = v;
  };

  private searchCountries(event: Event) {
    if (!this.searchTerm) {
      this.searchResults = this.countries;
    }
    this.searchResults = this.countries.filter((country) => {
      return country.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  };

//@Events
  private onChange(val: CountryObj): void {
    this.selectedValue = val;
    this.searchTerm = '';
    this.searchResults = this.countries;
  };

  private phoneMask(val: string): void {
    this._value = val;
    switch (this.selectedValue.abbreviation) {
      case 'us':
        return Inputmask('999-999-9999',{placeholder:''}).mask(document.getElementById(this.id + '_text_field'));
      case 'dsn':
        this._value = this.selectedValue.countryCode + val;
        return Inputmask('999-999-9999',{placeholder:''}).mask(document.getElementById(this.id + '_text_field'));
      default:
        return Inputmask.remove(document.getElementById(this.id + '_text_field'));
    };
  };

  mounted() {
    this.searchResults = [...this.countries]
  };
};
</script>