<template>
  <div id="SearchWrapper" :style="'width: ' + wrapperWidth">

    <div class="d-flex align-center mb-2" v-if="label">
      <label
        :id="id + '_Label'"
        class="form-field-label mr-1"
        :for="id + '_SearchInput'"
      >
        {{ label }}
      </label>
      <ATATTooltip 
        :tooltipText="tooltipText"
        :tooltipTitle="tooltipTitle"
        :id="id"
        :label="label"
      />
    </div>
    <div 
      class="d-flex"
      :style="'width: ' + width"
    >
      <v-text-field
        ref="atatSearchInput"
        :id="id + '_SearchInput'"
        class="_search-input"
        clearable
        @input="onInput"
        outlined
        dense
        :height="40"
        :value.sync="_value"
        :placeholder="placeHolder"
        :rules="rules"
        :validate-on-blur="validateOnBlur"
        @update:error="setErrorMessage"
        @click:clear="clear"
        @blur="onBlur"
        autocomplete="off"
        @keydown.enter="search"
      />
      <v-btn
        :id="id + '_SearchButton'" 
        class="primary _search-button"
        @click="search"
        @keydown.enter="search"
        @keydown.space="search"
      >
        <ATATSVGIcon 
          v-if="!buttonText"
          name="search"
          color="white"
          width="18"
          height="18"
        />
        <span v-else>{{ buttonText }}</span>
      </v-btn>
    </div>

    <div class="max-width-500 mt-3" v-show="errorMessages.length">
      <ATATErrorValidation :errorMessages="errorMessages" />
    </div>

    <div v-if="helpText && showHelpText" class="help-text mt-2">
      {{ helpText }}
    </div>

    <div id="Progress" v-show="showLoader" class="mt-4">
      <v-progress-circular
        indeterminate
        color="#544496"
        size="24"
        width="3"
        class="mr-2"
      />
      <span class="text-base">
        Locating your order in {{ searchType }}
      </span>
    </div>

    <ATATAlert
      :id="id + '_SearchAlertError'"
      type="error"
      v-show="showErrorAlert"
      maxWidth="740"
      class="mt-5"
    >
      <template v-slot:content>
        <p>
          We could not find your order within {{ searchType }}. Please enter a valid
          order number and search again.
        </p>
        <p class="mb-0">
          If you confirmed your order within {{ searchType }} and continue to
          receive this message, please
          <a href="https://community.hacc.mil/s/contact?RequestTopic=Account%20Trackin
            g%20and%20Automation%20Tool%20%28ATAT%29&RoleType=Customer" target="_blank">
            contact Customer Support
          </a>.
        </p>
      </template>
    </ATATAlert>

    <ATATAlert
      :id="id + '_SearchAlertSuccess'"
      type="success"
      v-show="showSuccessAlert"
      maxWidth="740"
      class="mt-5"
    >
      <template v-slot:content>
        <p class="mb-0">
          Good news! We found your order within {{ searchType }}.          
        </p>
      </template>
    </ATATAlert>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATTooltip from "@/components/ATATTooltip.vue"
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import api from "@/api";

import { mask } from "types/Global";
import Inputmask from "inputmask/";

@Component({
  components: {
    ATATAlert,
    ATATSVGIcon,
    ATATTooltip,
    ATATErrorValidation,
  },
})

export default class ATATSearch extends Vue {

  $refs!: {
    atatSearchInput: Vue & { 
      errorBucket: string[]; 
      errorCount: number;
      resetValidation(): void;
      value: string;
    };
  }; 

  @Prop({ default: "Search" }) private id!: string;
  @Prop({ default: "" }) private placeHolder?: string;
  @Prop({ default: "320px" }) private width?: string;
  @Prop({ default: "auto" }) private wrapperWidth?: string;
  @Prop({ default: "" }) private label?: string;
  @Prop({ default: "" }) private tooltipTitle?: string;
  @Prop({ default: "" }) private tooltipText?: string;
  @Prop({ default: "" }) private helpText?: string;
  @Prop({ default: ()=>[] }) private mask?: string[];
  @Prop({ default: false }) private isMaskRegex?: boolean;
  @Prop({ default: () => [] }) private rules?: Array<unknown>;
  @Prop({ default: true }) private showErrorMessages?: boolean;
  @Prop({ default: false }) private validateOnBlur!: boolean;
  @Prop({ default: "" }) private searchType?: string;
  @Prop({ default: "" }) private buttonText?: string;

  @PropSync("value", { default: "" }) public _value!: string;

  // remove isSimulation and all other simulation code when G-Invoicing search is actual
  @Prop({ default: false} ) private isSimulation?: boolean;

  private error = false;
  private errorMessages: string[] = [];

  private showHelpText = true;
  private showLoader = false;
  
  private searchCount = 0;          // for search simulation
  private showSuccessAlert = false; // for search simulation
  private showErrorAlert = false;   // for search simulation
  private maskObj: mask = {};

  @Watch("errorMessages")
  private errorMessagesChanged(newVal: Array<unknown>): void {
    this.showHelpText = newVal.length === 0 && !this.showLoader;
  }

  public onInput(v: string): void {
    this._value = v;
    if (this.errorMessages.length > 0) {
      this.clear();
    }
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.showHelpText = true;
  }

  private async search(): Promise<void> {
    if (this.isSimulation && this.errorMessages.length === 0 && this._value) {

      // simulate success on first search, error on second.
      this.showLoader = true;
      this.showSuccessAlert = false;
      this.showErrorAlert = false;
      this.showHelpText = false;
      this.searchCount = this.searchCount + 1;

      setTimeout(() => {
        this.showLoader = false;
        this.showSuccessAlert = this.searchCount % 2 !== 0;
        this.showErrorAlert = !this.showSuccessAlert;
      }, 3000);
    }
    
    if(this.searchType === "EDA"){

      try {

        this.showLoader = true;
        this.showSuccessAlert = false;
        this.showErrorAlert = false;
        this.showHelpText = false;

        const response = await api.edaApi.search(this._value);
        if(response.success){
          this.showSuccessAlert = true;
        }
        else{
          this.showErrorAlert = true;
        }
        
      } catch (error) {
        this.showErrorAlert = true;
      }finally{

        this.showLoader = false;
      }
    } else if (this.searchType === "G-Invoicing") {
      try {

        this.showLoader = true;
        this.showSuccessAlert = false;
        this.showErrorAlert = false;
        this.showHelpText = false;

        const gInvoicingResponse = await api.gInvoicingApi.search(this._value);
        if(gInvoicingResponse.valid){
          this.showSuccessAlert = true;
        }
        else{
          this.showErrorAlert = true;
        }

      } catch (error) {
        this.showErrorAlert = true;
      }finally{

        this.showLoader = false;
      }

    }

    this.$emit("search");

  }

  private setErrorMessage(): void {
    Vue.nextTick(()=>{
      this.errorMessages = this.$refs.atatSearchInput.errorBucket;
    });
  }

  private clear(): void {
    Vue.nextTick(()=>{
      this.$refs.atatSearchInput.errorBucket = [];
      this.errorMessages = [];
    });
    this.$emit("clear");
  }

  private onBlur(e: FocusEvent) : void{
    const input = e.target as HTMLInputElement;
    this.setErrorMessage();
    this.$emit('blur', input.value);
  }

  public resetValidation(): void {
    this.$refs.atatSearchInput.errorBucket = [];
    this.$refs.atatSearchInput.resetValidation();
  }

  private setMask(): void {
    this.maskObj = {};

    if (this.mask && this.mask.length > 0) {
      if (this.isMaskRegex){
        this.maskObj.regex = this.mask[0] || "";
      } else {
        this.maskObj.mask = this.mask || [];
      }
    }

    if (Object.keys(this.maskObj).length > 0){
      this.maskObj.placeholder = "";
      this.maskObj.jitMasking = true;
      Vue.nextTick(() => {
        const inputField = document.getElementById(
          this.id + '_SearchInput'
        ) as HTMLInputElement;
        Inputmask(this.maskObj).mask(inputField);
      });
    }
  }

  private mounted(): void{
    this.setMask();
  }

}

</script>
