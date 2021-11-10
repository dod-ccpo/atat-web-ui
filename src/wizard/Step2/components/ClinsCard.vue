<template>
  <v-form ref="form" lazy-validation>
    <v-container
      fluid
      class="clins-card width-100"
      style="width: 900px !important"
    >
      <v-row>
        <v-col cols="11" class="width-100 d-block">
          <v-expansion-panels v-model="openItem">
            <v-expansion-panel @click="toggleClinCard">
              <v-expansion-panel-header
                class="body-lg font-weight-bold pt-2"
                :hide-actions="true"
              >
                <template v-slot:default="{ open }">
                  <v-container class="pa-0">
                    <div class="d-flex h3 text--base-darkest py-4 width-100">
                      <div class="text-center" style="width: 54px;">
                        {{ card_number }}
                      </div>
                      <div style="flex-grow: 1;">
                        {{ `CLIN ${clin_number}` }}
                      </div>
                      <div class="text-center" style="width: 54px;">
                        <v-icon
                          class="text-right text--base-darkest"
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
                          <td>{{ _idiq_clin }}</td>
                          <td>{{ formatCurrency(total_clin_value) }}</td>
                          <td>{{ formatCurrency(_obligated_funds) }}</td>
                          <td style="white-space: nowrap;">
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
              <v-expansion-panel-content>
                <div class="input-max-width pb-10">
                  <atat-text-field
                    class="mb-3"
                    name="clin-number"
                    id="clin-number"
                    label="CLIN Number"
                    :rules="clinNumberRules"
                    :value.sync="_clin_number"
                  />
                  <atat-select
                    class="clin-idiq-select"
                    label="Corresponding IDIQ CLIN"
                    placeholder="- Select -"
                    :items="idiq_clin_items"
                    :selectedValue.sync="_idiq_clin"
                    :rules="correspondingIDIQRules"
                  >
                  </atat-select>
                </div>

                <fieldset class="input-max-width pb-10">
                  <legend class="h3 mb-4">CLIN Funding</legend>
                  <v-form ref="fundFields">
                    <atat-currency-field
                      class="mb-3"
                      id="total-clin-value"
                      label="Total CLIN Value"
                      :rules="totalClinRules"
                      :helpText="clinHelpText"
                      :value.sync="isTotalClin"
                      prefix="$"
                      :class="[isTotalClin === '' ? 'empty-funds' : '']"
                    />

                    <atat-currency-field
                      class="mb-5"
                      id="obligated-funds"
                      label="Obligated Funds"
                      :rules="obligatedFundRules"
                      :helpText="obligatedFundsHelpText"
                      :value.sync="isObligatedFunds"
                      :class="[isObligatedFunds === '' ? 'empty-funds' : '']"
                      @onkeyup="calculateObligatedPercent"
                      prefix="$"
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
                    <v-form ref="dateFields">
                      <atat-date-picker
                        :id="'clin_' + card_number"
                        :errormessages.sync="datePickerErrorMessages"
                        :title.sync="datepickerTitle"
                        :daterange.sync="dateRange"
                        :pop_start_date.sync="_pop_start_date"
                        :pop_end_date.sync="_pop_end_date"
                        :startDateRules.sync="popStartRules"
                        :endDateRules.sync="popEndRules"
                        :isDatePickerBlurred.sync="isDatepickerBlurred"
                        :isTextBoxFocused.sync="isDatepickerTextBoxFocused"
                        :nudgeleft="1"
                        :min="minDate"
                        :max="maxDate"
                      />
                    </v-form>
                  </div>
                </fieldset>

              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col>
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
                class="pt-6"
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
                >This CLIN will be deleted from your Task Order. Any changes you
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
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import moment from "moment";
import { validateNumber } from "@/validation/";
import { TaskOrderModel } from "../../../../types/Wizard";

@Component({
  components: {},
})
export default class ClinsCard extends Vue {
  @Prop({ required: true, default: () => -1 }) card_number!: number;
  @PropSync("clin_number") _clin_number!: string;
  @PropSync("idiq_clin") _idiq_clin!: string;
  @PropSync("total_clin_value") _total_clin_value!: number;
  @PropSync("obligated_funds") _obligated_funds!: number;
  @PropSync("pop_start_date") _pop_start_date!: string;
  @PropSync("pop_end_date") _pop_end_date!: string;

  private datepickerTitle = "What is the PoP Start Date?";
  private isDatePickerClicked = false;
  private isDatepickerBlurred = false;
  private isDatepickerTextBoxFocused = false;
  private returnFocusDeleteClinOK = "addClinButton";
  private returnFocusDeleteClinCancel = "";
  private focusClinNumberOnCardOpen = true;

  model: TaskOrderModel = this.$store.getters.getStepModel(2);

  get isDisabled(): boolean {
    return (
      this.model.clins.length === 1 && this.model.clins[0].clin_number === ""
    );
  }

  get validateDatePicker(): boolean {
    return this._pop_start_date !== "" || this._pop_end_date !== "";
  }
  get isObligatedFunds(): number | string {
    return this._obligated_funds > 0 ? this._obligated_funds : "";
  }

  set isObligatedFunds(value: number | string) {
    if (typeof value === "string") {
      value = parseFloat(value);
    }
    this._obligated_funds = value;
  }

  get isTotalClin(): number | string {
    return this._total_clin_value > 0 ? this._total_clin_value : "";
  }

  set isTotalClin(value: number | string) {
    if (typeof value === "string") {
      value = parseFloat(value);
    }
    this._total_clin_value = value;
  }

  get isValidStartDate(): boolean {
    return /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(
      this._pop_start_date
    );
  }

  get isValidEndDate(): boolean {
    return /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(
      this._pop_end_date
    );
  }
  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  get FundFields(): Vue & { validate: () => boolean } {
    return this.$refs.fundFields as Vue & { validate: () => boolean };
  }

  get DateFields(): Vue & { validate: () => boolean } {
    return this.$refs.dateFields as Vue & { validate: () => boolean };
  }

  @Watch("_pop_start_date")
  protected setStartDate(): void {
    this.setDateRange();
  }

  @Watch("_pop_end_date")
  protected setEndDate(): void {
    this.setDateRange();
  }

  private setDateRange(): void {
    if (moment(this._pop_start_date).isBefore(this._pop_end_date)) {
      this.dateRange[0] = this._pop_start_date;
      this.dateRange[1] = this._pop_end_date;
    }
  }

  private openItem = -1;

  private clinHelpText =
    "This is the full amount of money requested\n" +
    "in a task order. It does not have to be spent\n" +
    "duing the CLIN’s period of performance.";
  private obligatedFundsHelpText =
    "Obligated funds are the legal amount allocated\n" +
    "for a project or contract that can be spent during\n" +
    "the CLIN’s period of performance.";

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
  private minDate = "2020-10-01";
  private maxDate = "2022-09-30";
  private validateFormWhenLeaving = false;

  public rules = {};

  public allowedDates(val: string): boolean {
    if (this._pop_start_date) {
      return val >= new Date(this._pop_start_date).toISOString().substr(0, 10);
    }
    return true;
  }

  public formatCurrency(value: string | number): string {
    const amount =
      typeof value === "string" ? Number(value.replace(",", "")) : value;
    return this.formatter.format(amount);
  }

  public formatDate(value: string): string {
    return moment(new Date(`${value} 00:00:00`)).format("MMM DD, YYYY");
  }

  public JWCCContractEndDate = "2022-09-14";

  public toggleClinCard(): void {
    this.focusClinNumberOnCardOpen = true;
    this.calculateObligatedPercent();
  }

  public calculateObligatedPercent(): void {
    const progress = this.$refs["progress-bar"] as HTMLProgressElement;
    const percent: number =
      (this.removeCurrencyFormat(this._obligated_funds) /
        this.removeCurrencyFormat(this._total_clin_value)) *
      100;
    this.obligatedPercent = percent > 100 ? "0" : percent.toFixed(2);
    if (progress) {
      progress.style.width = this.obligatedPercent + "%";
    }
  }

  //todo apply removeCurrencyformat to variables in validation
  //currency validation rules
  public removeCurrencyFormat(formattedCurrency: number): number {
    return parseFloat(formattedCurrency.toString().replace(/,/g, ""));
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
      (v: string) => v.length < 5 || "CLIN number cannot exceed 4 characters"
    );
    return validationRules;
  }

  get totalClinRules(): any[] {
    const validationRules = [];
    validationRules.push((v: string) => v !== "" || "Please enter CLIN value");
    validationRules.push((v: string) => validateNumber(v));
    validationRules.push((v: number) => {
      v = parseFloat(v.toString().replace(/,/g, ""));
      let ob = parseFloat(this._obligated_funds.toString().replace(/,/g, ""));
      return v >= ob || "Obligated Funds cannot exceed total CLIN Values";
    });

    return validationRules;
  }

  get obligatedFundRules(): any[] {
    const validationRules = [];
    validationRules.push(
      (v: number) => v.toString() !== "" || "Please enter your obligated Funds"
    );
    validationRules.push((v: string) => validateNumber(v));
    validationRules.push((v: number) => {
      v = parseFloat(v.toString().replace(/,/g, ""));
      let totalClin = parseFloat(
        this._total_clin_value.toString().replace(/,/g, "")
      );
      return (
        v <= totalClin || "Obligated Funds cannot exceed total CLIN Values"
      );
    });
    return validationRules;
  }

  get popStartRules(): any[] {
    const validationRules = [];
    if (this._pop_start_date !== "") {
      validationRules.push(() => {
        return (
          this.isValidStartDate ||
          "Please enter a start date using the format 'YYYY-MM-DD'"
        );
      });
      if (this.isValidStartDate && this.isValidEndDate) {
        validationRules.push(() => {
          return (
            moment(this._pop_start_date).isBefore(this._pop_end_date) ||
            "The period of performance start date must be before the end date"
          );
        });
      }
      if (this.isValidStartDate) {
        validationRules.push(
          () =>
            moment(this._pop_start_date).isBefore(this.JWCCContractEndDate) ||
            "Start Date must be before or on " + this.JWCCContractEndDate
        );
      }
    } else {
      if (
        (this.validateFormWhenLeaving ||
          !this.isDatePickerClicked ||
          this.isDatepickerBlurred) &&
        !this.isDatepickerTextBoxFocused
      ) {
        validationRules.push(
          (v: string) =>
            v !== "" ||
            "Please enter the start date for your CLIN's period of performance"
        );
      }
    }
    return this.validateDatePicker ? validationRules : [];
  }

  get popEndRules(): any[] {
    const validationRules = [];
    if (this._pop_end_date !== "") {
      validationRules.push(() => {
        return (
          this.isValidEndDate ||
          "Please enter an end date using the format 'YYYY-MM-DD'"
        );
      });
      if (this.isValidStartDate && this.isValidEndDate) {
        validationRules.push(
          () =>
            moment(this._pop_end_date).isAfter(this._pop_start_date) ||
            "The period of performance end date must be after the start date"
        );
      }
      if (this.isValidEndDate) {
        validationRules.push(
          () =>
            moment(this._pop_end_date).isBefore(this.JWCCContractEndDate) ||
            "The end date must be before or on " + this.JWCCContractEndDate
        );
      }
    } else {
      if (
        (this.validateFormWhenLeaving ||
          !this.isDatePickerClicked ||
          this.isDatepickerBlurred) &&
        !this.isDatepickerTextBoxFocused
      ) {
        validationRules.push(
          (v: string) =>
            v !== "" ||
            "Please enter the end date for your CLIN's period of performance"
        );
      }
    }
    return this.validateDatePicker ? validationRules : [];
  }

  get correspondingIDIQRules(): any[] {
    const validationRules = [];
    validationRules.push(
      (v: string) => v !== "" || "Please select an IDIQ CLIN type"
    );
    return validationRules;
  }

  @Watch("_obligated_funds")
  @Watch("_total_clin_value")
  validateFundsFields(): void {
    this.FundFields.validate();
  }

  @Watch("_clin_number")
  @Watch("_idiq_clin")
  validateFormFields(): void {
    this.Form.validate();
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

  // @Watch("_pop_start_date")
  // @Watch("_pop_end_date")
  // validateDateFields(): void {
  //   this.DateFields.validate();
  // }

  public async validateForm(): Promise<boolean> {
    let validated = false;
    this.validateFormWhenLeaving = true;
    await this.$nextTick(() => {
      validated = this.Form.validate();
      this.validateFormWhenLeaving = false;
    });
    return validated;
  }

  public open(isPageLoad: boolean): void {
    this.focusClinNumberOnCardOpen = !isPageLoad;
    this.openItem = 0;
  }

  private updated(): void {
    this.calculateObligatedPercent();
  }

  private async clinFormClicked(event: Event): Promise<void> {
    const clickedElement = event.target as HTMLElement;
    const datepickerControl = document.getElementsByClassName(
      "clin-datepicker-control"
    )[0];
    if (datepickerControl) {
      const datepickerControlId = datepickerControl.getAttribute("id") || "";
      this.isDatePickerClicked =
        clickedElement.closest("#" + datepickerControlId) !== null;
    }
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
    this.$emit('delete', card_number);
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
  }

  private destroyed(): void {
    document.removeEventListener("click", this.clinFormClicked);
    document.removeEventListener("blur", this.clinFormClicked);
  }
}
</script>
