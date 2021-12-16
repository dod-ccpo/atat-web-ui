/* eslint-disable prettier/prettier */
<template>
  <v-form :ref="getId('form')" lazy-validation>
    <v-container
      fluid
      class="clins-card width-100"
      style="width: 900px !important"
    >
      <v-row>
        <v-col cols="11" class="width-100 d-block">
          <v-expansion-panels v-model="openItem">
            <v-expansion-panel
              :id="getId('clins-card')"
              :class="{ errored: isValidated === false }"
              @click="toggleClinCard"
              @change="validateOnOpen"
            >
              <v-expansion-panel-header
                class="body-lg font-weight-bold"
                :hide-actions="true"
              >
                <template v-slot:default="{ open }">
                  <v-container class="pa-0">
                    <div class="d-flex h3 text--base-darkest py-4 width-100">
                      <div
                        class="text-center"
                        id="card_number"
                        style="width: 54px"
                      >
                        {{ card_number }}
                      </div>
                      <div style="flex-grow: 1">
                        {{ `CLIN ${clin_number}` }}
                      </div>
                      <div
                        class="text-center d-flex flex-column align-start mr-4"
                      >
                        <v-icon
                          class="text-right text--base-darkest icon-24"
                          :class="{ 'icon-rotate': open }"
                          >expand_more</v-icon
                        >
                      </div>
                    </div>
                    <div
                      v-if="!open && _idiq_clin !== ''"
                      class="v-expansion-panel-content__wrap pb-4"
                    >
                      <table class="data-summary-table">
                        <tr class="micro">
                          <th>IDIQ Type</th>
                          <th>Total Value</th>
                          <th>Obligated Funds</th>
                          <th>Period of Performance</th>
                        </tr>
                        <tr class="body">
                          <td class="idiq_clin">{{ _idiq_clin }}</td>
                          <td>
                            {{ formatCurrency(_total_clin_value) }}
                          </td>
                          <td>{{ formatCurrency(_obligated_funds) }}</td>
                          <td style="white-space: nowrap">
                            <span v-if="_pop_start_date !== ''">
                              {{
                                `${formatDate(_pop_start_date)} -
                                  ${formatDate(_pop_end_date)}`
                              }}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </v-container>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content eager transition="slide-y-transition">
                <div class="input-max-width pb-10">
                  <atat-text-field
                    class="mb-3"
                    name="clin-number"
                    :id="getId('clin-number')"
                    label="CLIN Number"
                    :rules="clinNumberRules"
                    :value.sync="_clin_number"
                    mask="numeric"
                    :max-length="4"
                    :validate-on-load="isValidateOnLoad"
                  />
                  <atat-select
                    class="clin-idiq-select max-width-100"
                    :id="getId('corresponding-idiq-clin')"
                    label="Corresponding IDIQ CLIN"
                    placeholder="- Select -"
                    :items="idiq_clin_items"
                    :selectedValue.sync="_idiq_clin"
                    :rules="correspondingIDIQRules"
                    :validate-on-load="isValidateOnLoad"
                  >
                  </atat-select>
                </div>

                <fieldset class="input-max-width pb-10">
                  <legend class="h3 mb-4">CLIN Funding</legend>
                  <v-form :ref="getId('fundFields')">
                    <atat-text-field
                      class="mb-3"
                      :id="getId('total_clin_value')"
                      mask="currency"
                      label="Total CLIN Value"
                      :rules="totalClinRules"
                      :helpText="clinHelpText"
                      :value.sync="_total_clin_value"
                      :validate-on-load="isValidateOnLoad"
                    />
                    <atat-text-field
                      class="mb-5"
                      :id="getId('obligated_funds')"
                      mask="currency"
                      label="Obligated Funds"
                      :rules="obligatedFundRules"
                      :helpText="obligatedFundsHelpText"
                      :value.sync="_obligated_funds"
                      @onkeyup="calculateObligatedPercent"
                      :validate-on-load="isValidateOnLoad"
                    />

                    <div v-if="obligatedPercent <= 100" role="alert">
                      <span class="h3 font-weight-bold"
                        >{{
                          obligatedPercent.split(".")[1] === "00"
                            ? obligatedPercent.split(".")[0]
                            : obligatedPercent
                        }}%</span
                      >
                      of your Total Funds are obligated
                    </div>
                    <div id="progressBarWrapper" class="width-100">
                      <div
                        name="progresBar"
                        id="progressBar"
                        value="0"
                        max="100"
                        ref="progress-bar"
                      ></div>
                    </div>
                  </v-form>
                </fieldset>

                <fieldset>
                  <legend class="h3 mb-4">Period of Performance (PoP)</legend>
                  <div
                    class="d-flex align-center mt-0"
                    style="position: relative"
                  >
                    <v-form :ref="getId('dateFields')">
                      <atat-date-picker
                        :id="getId('datepicker')"
                        :errormessages.sync="datePickerErrorMessages"
                        :title.sync="datepickerTitle"
                        :daterange.sync="dateRange"
                        :pop_start_date.sync="_pop_start_date"
                        :pop_end_date.sync="_pop_end_date"
                        :startDateRules.sync="popStartRules"
                        :endDateRules.sync="popEndRules"
                        :isDatePickerBlurred.sync="isDatePickerBlurred"
                        :isTextBoxFocused.sync="isDatePickerTextBoxFocused"
                        :isDatePickerVisible.sync="isDatePickerVisible"
                        :nudgeleft="1"
                        :min="minDate"
                        :max="JWCCContractEndDate"
                        :validateOnLoad="isValidateOnLoad"
                        :menu.sync="isDatePickerVisible"
                      />
                    </v-form>
                  </div>
                </fieldset>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col class="pl-0">
          <v-dialog
            v-model="dialog"
            role="alertdialog"
            persistent
            max-width="450"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                class="pt-4"
                :disabled="isDisabled"
                :aria-label="'Delete CLIN ' + clin_number"
                :id="'delete_Clin_' + card_number + '_Button'"
                @click="
                  openDeleteClinModal('delete_Clin_' + card_number + '_Button')
                "
              >
                <v-icon aria-hidden="true">delete</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="h2" id="RemoveClinModalTitle" tabindex="-1">
                Remove CLIN {{ clin_number }}?
              </v-card-title>
              <v-card-text class="body-lg"
                >This CLIN will be deleted from your task order. Any changes you
                made to CLIN details will not be saved.</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="link-button"
                  @click="cancelDeleteClin"
                  :ripple="false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  class="primary"
                  width="140px"
                  @click="deleteClin(card_number)"
                  :ripple="false"
                >
                  Remove CLIN
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-icon
            v-if="isValidated === false"
            aria-hidden="true"
            :class="[
              { errored: isValidated === false },
              ' pt-4 position-absolute',
            ]"
          >
            error</v-icon
          >
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import moment from "moment";
import { TaskOrderModel } from "../../../../../types/Wizard";
import Inputmask from "inputmask";

@Component({})
export default class ClinsCard extends Vue {
  @Prop({ required: true, default: () => -1 }) card_number!: number;
  @PropSync("clin_number") _clin_number!: string;
  @PropSync("idiq_clin") _idiq_clin!: string;
  @PropSync("total_clin_value") _total_clin_value!: number;
  @PropSync("obligated_funds") _obligated_funds!: number;
  @PropSync("pop_start_date") _pop_start_date!: string;
  @PropSync("pop_end_date") _pop_end_date!: string;
  @Prop({ default: false }) private validateOnLoad!: boolean;

  private datepickerTitle = "What is the PoP Start Date?";
  private isDatePickerBlurred = true;
  private isDatePickerTextBoxFocused = false;
  private returnFocusDeleteClinOK = "addClinButton";
  private returnFocusDeleteClinCancel = "";
  private focusClinNumberOnCardOpen = true;
  private isDatePickerVisible = false;
  private isStartDatePickerValid = true;
  private isEndDatePickerValid = true;
  private isValidateOnLoad = this.validateOnLoad;
  private isValidated = true;

  get isClinFormDirty(): boolean {
    return (
      this._clin_number !== "" ||
      this._idiq_clin !== "" ||
      this._total_clin_value > 0 ||
      this._obligated_funds > 0 ||
      this._pop_start_date !== "" ||
      this._pop_end_date !== ""
    );
  }

  private model: TaskOrderModel = this.$store.getters["wizard/getStepModel"](2);

  get isDisabled(): boolean {
    return this.model.clins.length === 1;
  }

  get validateDatePickerOnSave(): boolean {
    return this._pop_start_date !== "" || this._pop_end_date !== "";
  }

  get isValidStartDate(): boolean {
    return /((0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/[12]\d{3})$/.test(
      this._pop_start_date
    );
  }

  get isValidEndDate(): boolean {
    return /((0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/[12]\d{3})$/.test(
      this._pop_end_date
    );
  }
  get Form(): Vue & { validate: () => boolean } {
    return this.$refs[this.getId("form")] as Vue & { validate: () => boolean };
  }

  get FundFields(): Vue & { validate: () => boolean } {
    return this.$refs[this.getId("fundFields")] as Vue & {
      validate: () => boolean;
    };
  }

  get DateFields(): Vue & { validate: () => boolean } {
    return this.$refs[this.getId("dateFields")] as Vue & {
      validate: () => boolean;
    };
  }

  @Watch("_pop_start_date")
  protected setStartDate(): void {
    this.setDateRange();
  }

  @Watch("_pop_end_date")
  protected setEndDate(): void {
    this.setDateRange();
  }

  public formatCurrency(value: number): string {
    return Inputmask.format(value.toString(), {
      alias: "currency",
      prefix: "$",
    });
  }

  private getId(prepend: string) {
    return prepend + "_" + this.card_number;
  }

  private setDateRange(): void {
    if (moment(this._pop_start_date).isBefore(this._pop_end_date)) {
      this.dateRange[0] = this._pop_start_date;
      this.dateRange[1] = this._pop_end_date;
    }
  }

  private openItem = -1;

  private clinHelpText =
    "This is the full amount of money requested in a task order. It does not have to be spent during the CLIN’s period of performance.";
  private obligatedFundsHelpText =
    " Obligated funds are the legal amount allocated for a project or contract that can be spent during the CLIN’s period of performance.";

  private idiq_clin_items = [
    "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
    "IDIQ CLIN 0002 Classified IaaS/PaaS",
    "IDIQ CLIN 0003 Unclassified Cloud Support Package",
    "IDIQ CLIN 0004 Classified Support Package",
  ];
  private obligatedPercent = "";

  private dateRange = ["", ""];
  private datePickerErrorMessages = [];
  private formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  private dialog = false;
  private progress: HTMLProgressElement | undefined;
  private minDate = "2019-09-14";
  public JWCCContractEndDate = "2022-09-14";

  public rules = {};

  public allowedDates(val: string): boolean {
    if (this._pop_start_date) {
      return val >= new Date(this._pop_start_date).toISOString().substr(0, 10);
    }
    return true;
  }

  public formatDate(value: string): string {
    return moment(new Date(`${value} 00:00:00`)).format("MMM DD, YYYY");
  }

  public toggleClinCard(): void {
    this.focusClinNumberOnCardOpen = true;
    this.calculateObligatedPercent();
  }

  public validateOnOpen(): void {
    if (this.isClinFormDirty) {
      this.validateForm();
    }
  }

  public calculateObligatedPercent(): void {
    const progress = this.$refs["progress-bar"] as HTMLProgressElement;
    const percent: number =
      (this._obligated_funds / this._total_clin_value) * 100;
    this.obligatedPercent = percent > 100 ? "0" : percent.toFixed(2);
    if (progress) {
      progress.style.width = this.obligatedPercent + "%";
    }
  }

  get clinNumberRules(): any[] {
    const validationRules = [];
    validationRules.push(
      (v: string) => v !== "" || "Please enter your 4-digit CLIN Number"
    );
    validationRules.push(
      (v: string) =>
        /^\d+$/.test(v) || "Please enter a valid 4-digit CLIN Number"
    );
    validationRules.push(
      (v: string) => v.length === 4 || "CLIN number must be 4 digits"
    );

    return validationRules;
  }

  get correspondingIDIQRules(): any[] {
    const validationRules = [];
    validationRules.push(
      (v: string) => v !== "" || "Please select an IDIQ CLIN type"
    );
    return validationRules;
  }

  get totalClinRules(): any[] {
    const validationRules = [];
    validationRules.push(
      () =>
        this._total_clin_value.toString() !== "" || "Please enter CLIN value"
    );
    validationRules.push(() => {
      return this._total_clin_value > -1 || "Please enter CLIN value";
    });
    validationRules.push(() => {
      return (
        this._total_clin_value >= this._obligated_funds ||
        "Obligated funds cannot exceed total CLIN value"
      );
    });
    return validationRules;
  }

  get obligatedFundRules(): any[] {
    const validationRules = [];
    validationRules.push(
      () =>
        this._obligated_funds.toString() !== "" ||
        "Please enter your obligated funds"
    );
    validationRules.push(
      () => this._obligated_funds > -1 || "Please enter your obligated funds"
    );
    validationRules.push(() => {
      return (
        this._obligated_funds <= this._total_clin_value ||
        "Obligated funds cannot exceed total CLIN value"
      );
    });
    return validationRules;
  }

  get popStartRules(): any[] {
    const validationRules = [];
    const textBox = document.getElementById(
      this.getId("start-date-text-box-datepicker")
    ) as HTMLInputElement;
    const textBoxValue = this._pop_start_date;
    const isDateValid = moment(textBoxValue).isValid();
    if (this._pop_start_date !== "" || this.isValidateOnLoad) {
      validationRules.push(() => {
        return (
          !this.isPartialDate(textBoxValue) ||
          "Please enter the start date for your CLIN’s period of performance"
        );
      });
      validationRules.push(() => {
        return (
          isDateValid ||
          "Please enter a start date using the format 'MM/DD/YYYY'"
        );
      });
      if (isDateValid && this.isValidEndDate) {
        validationRules.push(() => {
          return (
            moment(textBoxValue).isBefore(this._pop_end_date) ||
            "The period of performance start date must be before the end date"
          );
        });
      }
      if (isDateValid) {
        validationRules.push(
          () =>
            moment(textBoxValue).isBefore(this.JWCCContractEndDate) ||
            "Start Date must be before or on " +
              moment(this.JWCCContractEndDate).format("MM/DD/YYYY")
        );
      }
    }

    this.isStartDatePickerValid = validationRules.every((vr) => vr() === true);

    return validationRules;
  }

  get popEndRules(): any[] {
    const validationRules = [];
    const textBox = document.getElementById(
      this.getId("end-date-text-box-datepicker")
    ) as HTMLInputElement;
    const textBoxValue = this._pop_end_date;
    const isDateValid = moment(textBoxValue).isValid();

    if (this._pop_end_date !== "" || this.isValidateOnLoad) {
      validationRules.push(() => {
        return (
          !this.isPartialDate(textBoxValue) ||
          "Please enter the end date for your CLIN’s period of performance"
        );
      });
      validationRules.push(() => {
        return (
          isDateValid ||
          "Please enter an end date using the format 'MM/DD/YYYY'"
        );
      });
      if (isDateValid && this.isValidStartDate) {
        validationRules.push(() => {
          return (
            moment(textBoxValue).isAfter(this._pop_start_date) ||
            "The period of performance end date must be after the start date"
          );
        });
      }
      if (isDateValid) {
        validationRules.push(
          () =>
            moment(textBoxValue).isBefore(this.JWCCContractEndDate) ||
            "The end date must be before or on " +
              moment(this.JWCCContractEndDate).format("MM/DD/YYYY")
        );
      }
    }
    this.isEndDatePickerValid = validationRules.every((vr) => vr() === true);
    return validationRules;
  }

  get isDatePickerValid(): boolean {
    return this.isStartDatePickerValid && this.isEndDatePickerValid;
  }

  public isPartialDate(val: string): boolean {
    return val
      ? val.indexOf("M") > 0 || val.indexOf("D") > 0 || val.indexOf("Y") > 0
      : true;
  }

  @Watch("openItem")
  onOpenItemChanged(): void {
    if (this.openItem == 0 && this.focusClinNumberOnCardOpen) {
      setTimeout(() => {
        this.$nextTick(() => {
          // when the clins card is opened the first input (clins number)
          // recieves the focus
          const form = this.Form.$el as HTMLFormElement;
          const clinNumberInput = form.elements.namedItem(
            "clin-number_text_field"
          ) as HTMLInputElement;
          if (clinNumberInput) {
            clinNumberInput.focus();
          }
        });
      }, 500);
    }
  }

  @Watch("isValidateOnLoad")
  protected getValidateOnLoad(newVal: boolean): void {
    if (newVal) {
      Vue.nextTick(() => {
        this.validateForm();
      });
    }
  }

  public async validateForm(): Promise<boolean> {
    this.isValidated = this.isClinFormDirty
      ? this.Form.validate() &&
        this.FundFields.validate() &&
        this.isDatePickerValid
      : true;
    return this.isValidated;
  }

  public async validateDateFields(): Promise<boolean> {
    return this.isClinFormDirty ? await this.DateFields.validate() : false;
  }

  public open(isPageLoad: boolean): void {
    this.focusClinNumberOnCardOpen = !isPageLoad;
    this.openItem = 0;
  }

  private updated(): void {
    this.calculateObligatedPercent();
  }

  private async clinFormClicked(event: Event): Promise<void> {
    this.isValidateOnLoad = false;

    //close datepicker
    const clickedElement = event.target as HTMLElement;
    const datepickerControl = clickedElement.closest(
      "#" + this.getId("clin-datepicker-text-boxes-datepicker")
    );
    if (datepickerControl !== null) {
      this.isDatePickerVisible = true;
      if (this.isClinFormDirty) {
        this.validateDateFields();
      }
    } else {
      this.isDatePickerVisible = false;
    }

    // click outside Clincard to validate ClinsCard
    this.$nextTick(() => {
      const clinsCardControl = clickedElement.closest(
        "#" + this.getId("clins-card")
      );

      if (clinsCardControl === null) {
        if (this.isClinFormDirty) {
          this.isValidateOnLoad = true;
          this.validateForm();
        }
      }
    });
  }

  private async clinFormFocused(event: Event): Promise<void> {
    const isDatePickerFocused =
      (event.target as HTMLElement).closest(".clin-datepicker-control") !==
      null;
    this.isDatePickerVisible = isDatePickerFocused;
  }

  private openDeleteClinModal(btnId: string) {
    this.returnFocusDeleteClinCancel = btnId;
    this.$nextTick(() => {
      setTimeout(function () {
        document.getElementById("RemoveClinModalTitle")?.focus();
      }, 100);
    });
  }
  private deleteClin(card_number: number): void {
    this.$emit("delete", card_number);
    this.dialog = false;
    this.returnFocus(this.returnFocusDeleteClinOK);
  }
  private cancelDeleteClin(): void {
    this.dialog = false;
    this.returnFocus(this.returnFocusDeleteClinCancel);
  }
  private returnFocus(elementId: string): void {
    this.$nextTick(() => {
      const focusEl =
        document.getElementById(elementId) ||
        document.getElementsByTagName("h1")[0];
      focusEl?.focus();
    });
  }

  private mounted(): void {
    document.addEventListener("click", this.clinFormClicked);
    document.addEventListener("blur", this.clinFormClicked);
    document.addEventListener("keydown", this.clinFormClicked);
    document.addEventListener("focus", this.clinFormFocused, true);
  }

  private destroyed(): void {
    document.removeEventListener("click", this.clinFormClicked);
    document.removeEventListener("blur", this.clinFormClicked);
    document.removeEventListener("keydown", this.clinFormClicked);
    document.addEventListener("focus", this.clinFormFocused);
  }
}
</script>
