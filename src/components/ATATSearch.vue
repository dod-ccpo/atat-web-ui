<template>
  <div
    id="SearchWrapper"
    :style="'width: ' + wrapperWidth + '; max-width: ' + wrapperWidth"
  >
    <div class="d-flex align-center mb-2" v-if="label">
      <label
        :id="id + '_Label'"
        class="form-field-label mr-1"
        :class="labelClass"
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
    <div class="d-flex" :style="'width: ' + width">
      <v-text-field
        :ref="isModal ? 'atatSearchInputModal' : 'atatSearchInput'"
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
        @click:clear="clearErrorMessages"
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
        :disabled="searchButtonDisabled || searchDisabled"
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

    <div
      class="mt-3"
      style="max-width: 560px"
      v-show="showErrorAlert && searchType === 'G-Invoicing'"
    >
      <div class="d-flex justify-start align-top atat-text-field-error mt-2">
        <div>
          <v-icon class="text-base-error icon-20 ma-1 mt-0" color="error"
            >error</v-icon
          >
        </div>
        <div class="field-error ml-2 text-left">
          <p>
            Unable to locate your {{ gInvoicingNotVerifiedText }}. Enter a valid
            number and search again. If you need assistance,
            <a
              href="https://community.hacc.mil/s/contact?RequestTopic=Account%20Trackin
              g%20and%20Automation%20Tool%20%28ATAT%29&RoleType=Customer"
              target="_blank"
            >
              contact Customer Support <ATATSVGIcon
                name="launch"
                style="display: inline;"
                width="13"
                height="13"
                color="primary"
              /> </a
            >.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="
        helpText &&
        showHelpText &&
        !showGtcVerifiedIndicator &&
        !showLoader &&
        !errorMessages.length &&
        !(showErrorAlert && searchType === 'G-Invoicing')
      "
      class="help-text mt-2"
    >
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
      <span class="text-base"> Locating your order in {{ searchType }} </span>
    </div>

    <div
      id="GtcVerifedIndicator"
      v-show="showGtcVerifiedIndicator && !errorMessages.length"
    >
      <div
        class="mt-4 d-flex justify-start"
        style="align-items: center; gap: 7px"
      >
        <ATATSVGIcon
          name="check-circle"
          color="success"
          width="22"
          height="22"
        />
        <span class="font-weight-500">{{ gInvoicingVerifiedText }}</span>
      </div>
    </div>

    <ATATAlert
      :id="id + '_SearchAlertError'"
      type="error"
      v-show="showErrorAlert && searchType === 'EDA'"
      maxWidth="740"
      class="mt-5"
    >
      <template v-slot:content>
        <p>
          We could not find your order within {{ searchType }}. Please enter a
          valid order number and search again.
        </p>
        <p class="mb-0">
          If you confirmed your order within {{ searchType }} and continue to
          receive this message, please
          <a
            href="https://community.hacc.mil/s/contact?RequestTopic=Account%20Trackin
            g%20and%20Automation%20Tool%20%28ATAT%29&RoleType=Customer"
            target="_blank"
          >
            contact Customer Support </a
          >.
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
import Vue, {ComponentPublicInstance} from "vue";
import { Component, Prop, PropSync, Watch } from "vue-facing-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import api from "@/api";

import { mask } from "types/Global";
import Inputmask from "inputmask/";
import PortfolioStore from "@/store/portfolio";
import AcquisitionPackage from "@/store/acquisitionPackage";

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
    atatSearchInput: ComponentPublicInstance & {
      errorBucket: string[];
      errorCount: number;
      resetValidation(): void;
      value: string;
    };
    atatSearchInputModal: ComponentPublicInstance & {
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
  @Prop({ default: "" }) private labelClass?: string;
  @Prop({ default: "" }) private tooltipTitle?: string;
  @Prop({ default: "" }) private tooltipText?: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: () => [] }) private mask?: string[];
  @Prop({ default: false }) private isMaskRegex?: boolean;
  @Prop({ default: () => [] }) private rules?: Array<unknown>;
  @Prop({ default: true }) private hideHelpTextOnErrors?: boolean;
  @Prop({ default: true }) private showErrorMessages?: boolean;
  @Prop({ default: false }) private validateOnBlur!: boolean;
  @Prop({ default: "" }) private searchType?: string;
  @Prop({ default: "" }) private buttonText?: string;
  @Prop({ default: false }) private searchButtonDisabled?: boolean;
  @Prop({ default: false }) private isModal?: boolean;
  @Prop({ default: undefined }) private gInvoicingSearchType?:
    | "GtcNumber"
    | "OrderNumber";
  @PropSync("triggerSearch", { default: false })
  private _triggerSearch?: boolean;

  @PropSync("value", { default: "" }) public _value!: string;
  @PropSync("resetValidationNow") public _resetValidationNow!: boolean;

  private error = false;
  private errorMessages: string[] = [];

  private showLoader = false;
  private showGtcVerifiedIndicator = false;
  private showSuccessAlert = false;
  private showErrorAlert = false;
  private maskObj: mask = {};

  private searchDisabled = true;

  private hideHelpText = false;
  private showHelpText(): boolean {
    if (this.hideHelpText) return false;
    if (this.errorMessages.length && this.hideHelpTextOnErrors) {
      return false;
    }
    return this.helpText.length > 0;
  }

  private get gInvoicingVerifiedText() {
    return this.gInvoicingSearchType === "GtcNumber"
      ? "GT&C verified"
      : "Order verified";
  }

  private get gInvoicingNotVerifiedText() {
    return this.gInvoicingSearchType === "GtcNumber"
      ? "GT&C number"
      : "Order number";
  }

  @Watch("_resetValidationNow")
  public async resetValidationNowChange(newVal: boolean): Promise<void> {
    if (newVal) {
      await this.resetValidation();
      this.clearErrorMessages();
      this.$nextTick(() => {
        this._resetValidationNow = false;
      });
    }
  }

  @Watch("_value")
  public valueChanged(newVal: string): void {
    this.showGtcVerifiedIndicator = false;
    const hasContent = newVal && newVal.length > 0;
    this.searchDisabled = !hasContent || Boolean(this.errorMessages.length);
  }

  @Watch("errorMessages")
  private errorMessagesChanged(newVal: Array<unknown>): void {
    this.hideHelpText = Boolean(
      !(newVal.length === 0 && !this.showLoader) && !this.hideHelpTextOnErrors
    );
  }

  @Watch("_triggerSearch")
  private intiateSearch(): void {
    if (this._value) this.search();
    this._triggerSearch = false;
  }

  public onInput(v: string): void {
    this._value = v;
    if (this.errorMessages.length > 0) {
      this.clearErrorMessages();
    }
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.hideHelpText = false;
  }

  private async search(): Promise<void> {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.hideHelpText = true;
    this.showGtcVerifiedIndicator = false;
    this.showLoader = false;

    if (this.searchType === "EDA") {
      try {
        this.showLoader = true;
        await PortfolioStore.reset();
        const response = await api.edaApi.search(this._value);
        if (response.success !== undefined && !response.success) {
          // set error messages for Refs
          const errorMessage = [response.message ?? "Unknown error"];
          if (!this.isModal) {
            this.$refs.atatSearchInput.errorBucket = errorMessage;
          } else {
            this.$refs.atatSearchInputModal.errorBucket = errorMessage;
          }
          this.errorMessages = errorMessage;
        } else {
          await PortfolioStore.initProvisioningFromResponse(response);
          this.$emit("search");
        }
      } catch (error) {
        this.showErrorAlert = true;
      } finally {
        this.showLoader = false;
      }
    } else if (
      this.searchType === "G-Invoicing" &&
      this.gInvoicingSearchType === "GtcNumber"
    ) {
      try {
        if (this.errorMessages.length > 0) return;
        this.showLoader = true;
        const gInvoicingResponse = await api.gInvoicingApi.searchGtc(
          this._value,
          AcquisitionPackage.packageId
        );
        if (gInvoicingResponse.valid) {
          this.showGtcVerifiedIndicator = true;
          this.$emit("onGInvoiceSearchComplete", true);
        } else {
          this.$emit("onGInvoiceSearchComplete", false);
          this.showErrorAlert = true;
        }
      } catch (error) {
        this.$emit("onGInvoiceSearchComplete", false);
        this.showErrorAlert = true;
      } finally {
        this.showLoader = false;
        this.$emit("search");
      }
    } else if (
      this.searchType === "G-Invoicing" &&
      this.gInvoicingSearchType === "OrderNumber"
    ) {
      try {
        if (this.errorMessages.length > 0) return;
        this.showLoader = true;
        const gInvoicingResponse = await api.gInvoicingApi.searchOrder(
          this._value,
          AcquisitionPackage.packageId
        );
        if (gInvoicingResponse.valid) {
          this.showGtcVerifiedIndicator = true;
          this.$emit("onGInvoiceSearchComplete", true);
        } else {
          this.showErrorAlert = true;
          this.$emit("onGInvoiceSearchComplete", false);
        }
      } catch (error) {
        this.showErrorAlert = true;
        this.$emit("onGInvoiceSearchComplete", false);
      } finally {
        this.showLoader = false;
        this.$emit("search");
      }
    }
  }

  private setErrorMessage(): void {
    Vue.nextTick(() => {
      this.errorMessages = !this.isModal
        ? this.$refs.atatSearchInput.errorBucket
        : this.$refs.atatSearchInputModal.errorBucket;
    });
  }

  private clearErrorMessages(): void {
    Vue.nextTick(() => {
      if (!this.isModal) {
        this.$refs.atatSearchInput.errorBucket = [];
      } else {
        this.$refs.atatSearchInputModal.errorBucket = [];
      }
      this.errorMessages = [];
    });
    this.$emit("clear");
  }

  private onBlur(e: FocusEvent): void {
    const input = e.target as HTMLInputElement;
    this.setErrorMessage();
    this.$emit("blur", input.value);
  }

  public async resetValidation(): Promise<void> {
    if (!this.isModal) {
      this.$refs.atatSearchInput.errorBucket = [];
      this.$refs.atatSearchInput.resetValidation();
    } else {
      this.$refs.atatSearchInputModal.errorBucket = [];
      this.$refs.atatSearchInputModal.resetValidation();
    }
  }

  private setMask(): void {
    this.maskObj = {};

    if (this.mask && this.mask.length > 0) {
      if (this.isMaskRegex) {
        this.maskObj.regex = this.mask[0] || "";
      } else {
        this.maskObj.mask = this.mask;
      }
    }

    if (Object.keys(this.maskObj).length > 0) {
      this.maskObj.placeholder = "";
      this.maskObj.jitMasking = true;
      Vue.nextTick(() => {
        const inputField = document.getElementById(
          this.id + "_SearchInput"
        ) as HTMLInputElement;
        Inputmask(this.maskObj).mask(inputField);
      });
    }
  }

  private mounted(): void {
    this.setMask();
  }
}
</script>
