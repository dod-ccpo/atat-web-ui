<template>
  <div class="_task-order-details">
    <div class="d-flex align-center">
      <a
        id="LinkToTaskOrders"
        role="button"
        tabindex="0"
        @keydown.space="handleClick"
        @keydown.enter="handleClick"
        @click="handleClick"
      >
        Task Orders
      </a>
      <ATATSVGIcon
        class="mx-4"
        name="chevronRight"
        width="7"
        height="12"
        color="base"
      />
      <span class="text-base" id="TaskOrderNumber">
        {{ getTaskOrderNumber }}
      </span>
    </div>
    <div class="pt-3 d-flex justify-space-between pb-5">
      <div class="d-flex flex-row align-center">
        <h1>{{ getTaskOrderNumber }}</h1>
        <v-chip 
        v-if="showStatusChip"
        id="StatusChip" 
        :color="statusChipColor" 
        style="height: 24px;" 
        class="ml-6"
        label
        >
          {{statusChipText}}
        </v-chip>
      </div>
      <!-- <v-btn
        id="ModifyTaskOrderButton"
        outlined
        class="secondary"
      >
        Request to modify task order
      </v-btn> -->
    </div>
    <div class="pt-5 d-flex">
      <v-card
        class="_task-order-card"
        elevation="0"
        id="Card_TotalObligatedFunds"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total obligated funds</span>
          <ATATTooltip
            :tooltipText="obligatedFundsToolTip"
            id="ObligatedFundsToolTip"
          />
        </div>
        <div class="h1">{{ selectedTaskOrder.totalObligated }}</div>
      </v-card>
      <v-card
        class="_task-order-card"
        elevation="0"
        id="Card_TotalTaskOrderValue"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total task order value</span>
          <ATATTooltip
            :tooltipText="totalValueToolTip"
            id="TotalValueToolTip"
          />
        </div>
        <div class="h1">{{ selectedTaskOrder.totalValue }}</div>
      </v-card>
      <v-card
        class="_task-order-card"
        elevation="0"
        id="Card_TotalLifecycleAmount"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total lifecycle amount</span>
          <ATATTooltip :tooltipText="lifecycleTooltip" id="LifecycleToolTip" />
        </div>
        <div class="h1">{{ selectedTaskOrder.totalLifeCycle }}</div>
      </v-card>
      <v-card
        class="_task-order-card _last"
        elevation="0"
        id="Card_TotalFundsSpent"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total funds spent</span>
          <ATATTooltip
            :tooltipText="totalFundsToolTip"
            id="TotalFundsToolTip"
          />
        </div>
        <div class="h1">{{ selectedTaskOrder.totalFundsSpent }}</div>
      </v-card>
    </div>
    <div class="mt-10">
      <v-data-table
        id="CLINDataTable"
        :headers="tableHeaders"
        :items="tableData"
        :disable-sort="true"
        :items-per-page="-1"
        hide-default-footer
        class="_clin-table border1 border-base-lighter"
      >
        <!-- eslint-disable vue/valid-v-slot -->
        <template v-slot:body="props">
          <tbody name="expand">
            <template>
              <tr
                class="row-item"
                :class="[
                  { '_section-divider': item.startNewClinGroup },
                  { 'bg-info-lighter': item.status === 'Processing' },
                  { 'd-none': item.isExpired && !showInactive },
                  { 'd-none': item.isPending && !showInactive },
                ]"
                v-for="item in props.items"
                :key="item.CLINNumber"
              >
                <td>
                  <div class="d-flex flex-column font-weight-400">
                    <span class="_clin-number">{{ item.CLINNumber }}</span>
                    <span class="font-size-12 text-base _clin-title">
                      {{ item.CLINTitle }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <div
                      class="_icon-circle"
                      :class="statusImgs[item.status].bgColor"
                    >
                      <ATATSVGIcon
                        :name="statusImgs[item.status].svgName"
                        :width="Number(statusImgs[item.status].width)"
                        :height="Number(statusImgs[item.status].height)"
                        :color="statusImgs[item.status].color"
                      />
                    </div>
                    <div class="d-flex flex-column font-weight-500">
                      <span class="_status">{{ item.statusLabel }}</span>
                    </div>
                  </div>
                </td>
                <td :style="{ verticalAlign: getValign(item) }">
                  <div class="d-flex flex-column">
                    <span class="nowrap _pop-dates">
                      {{ item.PoP.startDate }}&ndash;{{ item.PoP.endDate }}
                    </span>
                    <span
                      v-if="item.isActive"
                      class="font-size-12 text-base d-flex _expiration-wrapper"
                    >
                      <ATATSVGIcon
                        v-if="
                          item.status === statuses.AtRisk.value ||
                          item.status === statuses.ExpiringPop.value
                        "
                        width="14"
                        height="16"
                        name="warning"
                        color="warning-dark2"
                        class="mr-1 _alert-icon"
                      />
                      <span 
                      class="_expiration"
                      v-if="item.status !== statuses.OptionExercised.value"
                      >
                      {{ item.PoP.expiration }}
                    </span>
                    </span>
                  </div>
                </td>
                <td
                  class="text-right _total-clin-value"
                  :class="'_' + item.status"
                  :style="{ verticalAlign: getValign(item) }"
                >
                  {{ item.totalCLINValue }}
                </td>
                <td
                  class="text-right _obligated-funds"
                  :style="{ verticalAlign: getValign(item) }"
                >
                  {{ item.obligatedFunds }}
                </td>
                <td :style="{ verticalAlign: getValign(item) }">
                  <div class="d-flex flex-column">
                    <div
                      :class="{
                        'text-error font-weight-500':
                          item.status === statuses.Delinquent.value,
                      }"
                      class="d-flex align-center justify-end"
                    >
                      <span class="_total-funds-spent">{{
                        item.totalFundsSpent
                      }}</span>
                      <span
                        :class="{
                          'text-error font-weight-500':
                            item.status === statuses.Delinquent.value,
                        }"
                        class="font-size-12 text-base ml-3 _funds-spent-percent"
                      >
                        ({{ item.fundsRemaining.percent }}%)
                      </span>
                    </div>
                    <div
                      v-if="item.status === statuses.Delinquent.value || item.isOverspent"
                      class="d-flex justify-end font-size-12 text-error
                      font-weight-500 align-center justify-end"
                    >
                      <ATATSVGIcon
                        name="errorFilled"
                        width="13"
                        height="13"
                        color="error"
                        class="mr-1"
                      />
                      <span class="_overspent">Overspent</span>
                    </div>
                    <div
                      v-else-if="item.isActive && item.status !== statuses.OptionExercised.value"
                      class="d-flex font-size-12 align-center justify-end"
                      :class="[
                        'nowrap',
                        {
                          'text-base-darkest':
                            item.status === 'Funding At-Risk',
                        },
                        { 'text-base': item.status !== 'Funding At-Risk' },
                      ]"
                    >
                      <ATATSVGIcon
                        v-if="
                          item.status === statuses.FundingAtRisk.value ||
                          item.status === statuses.AtRisk.value
                        "
                        name="warning"
                        width="14"
                        height="12"
                        color="warning-dark2"
                        class="mr-1"
                      />
                      {{ item.fundsRemaining.fundsRemaining }}
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr class="_section-divider">
              <td colspan="2" class="font-weight-400">
                <span v-if="!isExpiredTO">
                  <a
                    id="InactiveToggle"
                    @click="toggleInactive"
                    @keydown.enter="toggleInactive"
                    @keydown.space="toggleInactive"
                    role="button"
                  >
                    {{ showHide() }} inactive CLINs
                  </a>
                  <span class="font-size-14 text-base ml-2">
                    ({{ inactiveCount }})
                  </span>
              </span>
              </td>
              <td align="right" class="font-weight-700">Total</td>
              <td align="right" class="font-weight-700 _grand-total-clin-value">
                <span v-if="!showInactive">
                  ${{ toCurrencyString(currentPeriodFundingTotals.CLINValue) }}
                </span>
                <span v-else>
                  {{ selectedTaskOrder.totalLifeCycle }}
                </span>
              </td>
              <td
                align="right"
                class="font-weight-700 _grand-total-obligated-funds"
              >
                <span v-if="!showInactive">
                  ${{
                    toCurrencyString(currentPeriodFundingTotals.obligatedFunds)
                  }}
                </span>
                <span v-else>
                  {{ selectedTaskOrder.totalObligated }}
                </span>
              </td>
              <td align="right">
                <div v-if="!showInactive">
                  <div
                    class="d-flex justify-end align-center font-weight-700 text-base-darkset"
                  >
                    <span class="_grand-total-funds-spent">
                      ${{
                        toCurrencyString(currentPeriodFundingTotals.fundsSpent)
                      }}
                    </span>
                    <span
                      class="_grand-total-spent-percent font-size-12 text-base ml-3 font-weight-500"
                    >
                      ({{ totals.percent }}%)
                    </span>
                  </div>
                  <span
                    class="d-flex font-size-12 text-base justify-end _grand-total-remaining"
                  >
                    {{ totals.fundsRemaining }}
                  </span>
                </div>
                <div v-else>
                  <div
                    class="d-flex justify-end align-center font-weight-700 text-base-darkset"
                  >
                    <span class="_grand-total-funds-spent">
                      {{ selectedTaskOrder.totalFundsSpent }}
                    </span>
                    <span
                      class="_grand-total-spent-percent font-size-12 text-base ml-3 font-weight-500"
                    >
                      ({{ taskOrderRemainingFunds.percent }}%)
                    </span>
                  </div>
                  <span
                    class="d-flex font-size-12 text-base justify-end _grand-total-remaining"
                  >
                    {{ taskOrderRemainingFunds.fundsRemaining }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </div>

    <div v-if="!isAlertClosed" class="mt-10">
      <ATATAlert id="TaskOrderDetailsAlert" type="info" closeButton="true">
        <template v-slot:content>
          <p class="mb-0">
            NOTE: Spend data is provided by your CSP to assist with tracking
            expended funds across each CLIN. Values and percentages are based on
            your latest monthly invoice and may not reflect real-time cloud and
            support charges. Before requesting a task order modification, we
            recommend logging in to your CSP console to get detailed cost
            analyses and breakdowns.
          </p>
        </template>
      </ATATAlert>
    </div>
    <div>
      <!-- <v-expansion-panels class="pt-6" ripple="false" elevation="0">
        <v-expansion-panel>
          <v-expansion-panel-header class="d-flex">
            <h2>
              Task Order
            </h2>
            <span
              class="text-base font-size-20 pl-2"
              id="TaskOrderHistoryNumber"
            >1</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <TaskOrderCard
              :isHistory="true"
              :taskOrders="[selectedTaskOrder]"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels> -->
    </div>
  </div>
</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";

import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import {
  ClinTableRowData,
  TaskOrderCardData,
} from "../../../../../types/Global";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import TaskOrderCard from "@/portfolios/portfolio/components/TaskOrder/TaskOrderCard.vue";
import {
  currencyStringToNumber,
  differenceInDaysOrMonths,
  toCurrencyString,
  getStatusChipBgColor
} from "@/helpers";

import { Statuses } from "@/store/acquisitionPackage";
import PortfolioStore from "@/store/portfolio";
import { ClinDTO } from "@/api/models";

@Component({
  components: {
    TaskOrderCard,
    ATATSVGIcon,
    ATATTooltip,
    ATATAlert,
  },
})
export default class TaskOrderDetails extends Vue {
  @Prop() private selectedTaskOrder!: TaskOrderCardData;
  @PropSync("showDetails", { default: false }) private _showDetails!: boolean;

  public clins: ClinDTO[] =  [];
  public tableData: ClinTableRowData[] = [];
  public expiredClins: ClinTableRowData[] = [];
  public optionPendingClins: ClinTableRowData[] = [];
  public showInactive = false;
  public statuses = Statuses;
  public isUpcomingTO = false;
  public isExpiredTO = false;
  public statusChipColor = "";
  public statusChipText = "";

  @Watch("showInactive")
  public showHide(): string {
    return this.showInactive ? "Hide" : "Show";
  }

  @Watch("selectedTaskOrder", {deep: true})
  public async selectedTaskOrderChanged():Promise<void>{
    this.clins = this.selectedTaskOrder.clins as ClinDTO[];
    if(this.selectedTaskOrder.status === this.statuses.Upcoming.value){
      this.isUpcomingTO = true;
    }
    if(this.selectedTaskOrder.status === this.statuses.Expired.value){
      this.showInactive = true;
      this.isExpiredTO = true;
    }
    this.getBgColor();
    await this.loadOnEnter();
  }

  /* eslint-disable indent */
  public currentPeriodFundingTotals: {
    CLINValue: number;
    obligatedFunds: number;
    fundsSpent: number;
  } = {
    CLINValue: 0,
    obligatedFunds: 0,
    fundsSpent: 0,
  };
  /* eslint-enable indent */

  public taskOrderRemainingFunds = { percent: "", fundsRemaining: "" };
  public totals = { percent: "", fundsRemaining: "" };
  public inactiveCount = 0;

  public obligatedFundsToolTip =
    "Total of all obligations (i.e. funded CLINs) in the base period" +
    " and exercised option periods. This may represent 100% of your total task order value, or a" +
    " portion of it.";
  public totalValueToolTip =
    "Total of all exercised CLINs in the base period and exercised" +
    " option periods.";
  public lifecycleTooltip =
    " Total value of all CLINs in all periods, both exercised and" +
    " options. This is the full amount of money requested in the task order, but " +
    "it does not have to be spent.";
  public totalFundsToolTip =
    "Total amount of the task order that has been spent and invoiced;" +
    " your expended obligations. Spend data is provided by your CSP, as of the last" +
    " monthly invoice.";
  get isAlertClosed(): boolean {
    return PortfolioStore.taskOrderDetailsAlertClosed;
  }

  public getValign(item: ClinTableRowData): string {
    return item.isPending || (item.isExpired && !item.isOverspent)
      ? "middle"
      : "top";
  }

  public get getTaskOrderNumber(): string {
    return this.selectedTaskOrder.taskOrderNumber !== "" 
      ? `#${this.selectedTaskOrder.taskOrderNumber}`
      : ""
  }

  public getExpiringStatus(CLINNumber: string): Record<string, string> {
    let firstTwo = CLINNumber.slice(0,2);
    const lastTwo = CLINNumber.slice(2, CLINNumber.length);
    let expectedClin = '';
    // if 2nd number in firstTwo is less than 9, increment the number and pad a 0
    if(parseInt(firstTwo) < 10){
      firstTwo = (parseInt(firstTwo) + 1).toString()
      expectedClin = firstTwo.padStart(2, '0') + lastTwo;
    } else {
    // else just increment the number, string it and add them together
      firstTwo = (parseInt(firstTwo) + 1).toString()
      expectedClin = firstTwo + lastTwo
    }
    // loop through all clins and if one matches the expected clin && status value return true
    const hasFollowOn = this.clins.some((clin) =>
      clin.clin_number === expectedClin && clin.clin_status === Statuses.OptionExercised.value
    );
    return hasFollowOn 
      ? Statuses.ExpiringPopOK
      : Statuses.ExpiringPop
  }

  public getClinStatus(clin: ClinDTO){
    if (
      this.isUpcomingTO
        && !(clin.clin_status === Statuses.Expired.value)
        && !(clin.clin_status === Statuses.OptionPending.value)
    ) {
      return Statuses.UpcomingPeriod
    } else if (clin.clin_status === Statuses.Expired.value) {
      return Statuses.ExpiredPoP;
    } else if (clin.clin_status === Statuses.ExpiringPop.value){
      return this.getExpiringStatus(clin.clin_number);
    }

    // find the values that match and send back based on the Statuses obj.
    const status = Object.keys(Statuses).find((s) =>
      Statuses[s].value === clin.clin_status) as string;
    
    return Statuses[status];
  }

  public getBgColor(): void {
    this.statusChipColor = this.selectedTaskOrder.status 
      ? getStatusChipBgColor(this.selectedTaskOrder.status) 
      : "";
  }

  public get showStatusChip(): boolean{
    const showChip = this.isUpcomingTO || this.isExpiredTO
    if(showChip){
      this.statusChipText = this.selectedTaskOrder.status as string;
    }
    return showChip;
  }

  public handleClick(): void {
    this._showDetails = false;
  }

  public toCurrencyString(value: number): string {
    return toCurrencyString(value);
  }

  public tableHeaders: Record<string, string>[] = [
    { text: "CLIN", value: "CLINNumber" },
    { text: "Status", value: "status" },
    { text: "Period of performance", value: "PoP" },
    { text: "Total CLIN value", value: "totalCLINValue" },
    { text: "Obligated funds", value: "obligatedFunds" },
    { text: "Total funds spent (%)", value: "totalFundsSpent" },
  ];

  public toggleInactive(): void {
    this.showInactive = !this.showInactive;
  }

  public fundsRemaining(
    obligatedFunds: string | number,
    fundsSpent: string | number
  ): { percent: string; fundsRemaining: string } {
    if (obligatedFunds == "0" && fundsSpent == "0") {
      return {
        percent: "0",
        fundsRemaining: "",
      };
    }
    //eslint-disable-next-line prefer-const
    let percent = Math.round(
      (Number(fundsSpent) / Number(obligatedFunds)) * 100
    );
    //eslint-disable-next-line prefer-const
    let remaining = Number(obligatedFunds) - Number(fundsSpent);
    return {
      percent: String(percent),
      fundsRemaining: "$" + toCurrencyString(remaining) + " remaining",
    };
  }

  public async collectTableData(): Promise<void> {
    const inactiveStatuses = [
      Statuses.OptionPending.value,
      Statuses.Expired.value,
    ];
    this.clins.forEach((clin) => {
      const isClinActive = !inactiveStatuses.includes(clin.clin_status);
      const clinStatus = this.getClinStatus(clin);
      console.log(clin.idiq_clin)
      const tableRowData: ClinTableRowData = {
        isActive: isClinActive,
        isExercised: clinStatus.value === Statuses.OptionExercised.value,
        isPending: clinStatus.value === Statuses.OptionPending.value,
        isExpired: clinStatus.value === Statuses.ExpiredPoP.value,
        CLINNumber: clin.clin_number,
        CLINTitle: clin.idiq_clin,
        PoP: differenceInDaysOrMonths(clin.pop_start_date, clin.pop_end_date),
        popStartDate: clin.pop_start_date,
        status: clinStatus.value,
        statusLabel: clinStatus.label,
        obligatedFunds: "$" + toCurrencyString(clin.funds_obligated),
        totalCLINValue: "$" + toCurrencyString(clin.funds_total),
        totalFundsSpent: "$" + toCurrencyString(clin.actual_funds_spent || 0),
        isOverspent: clin.actual_funds_spent
          ? clin.actual_funds_spent > clin.funds_obligated
          : false,
        fundsRemaining: this.fundsRemaining(
          clin.funds_obligated,
          String(clin.actual_funds_spent)
        ),
        startNewClinGroup: false,
      };
      //add row to appropriate temporary table
      if (clin.clin_status === Statuses.Expired.value) {
        this.expiredClins.push(tableRowData);
      } else if (clin.clin_status === Statuses.OptionPending.value) {
        this.optionPendingClins.push(tableRowData);
      } else {
        this.tableData.push(tableRowData);
      }
      this.calculateCurrentPeriodTotals(tableRowData);

      this.totals = this.fundsRemaining(
        this.currentPeriodFundingTotals.obligatedFunds,
        this.currentPeriodFundingTotals.fundsSpent
      );
    });
    this.inactiveCount =
      this.expiredClins.length + this.optionPendingClins.length;
  }

  public async addSeparators(): Promise<void> {
    // loop through the sorted table data and find the first IsExercised
    // set that as a newClinGroup
    for(let i = 0; i < this.tableData.length; i++){
      if(this.tableData[i].isExercised){
        this.tableData[i].startNewClinGroup = true;
        break;
      }
    }
    // check for values inside of the array first, 
    // if you don't there is a case that errors out the frontend
    if(this.optionPendingClins.length > 0){
      this.optionPendingClins[0].startNewClinGroup = true;
      this.optionPendingClins = this.seperateByClin(this.optionPendingClins);
    }
    if(this.expiredClins.length > 0){
      this.expiredClins[0].startNewClinGroup = true;
      this.expiredClins = this.seperateByClin(this.expiredClins);
    }
  }

  public seperateByClin(clinGroup: ClinTableRowData[]){
    let firstTwo = clinGroup[0].CLINNumber?.slice(0,2);
    for(let i = 0; i < clinGroup.length; i++){
      const tempFirstTwo = clinGroup[i].CLINNumber?.slice(0,2)
      if(firstTwo !== tempFirstTwo){
        clinGroup[i].startNewClinGroup = true;
        firstTwo = tempFirstTwo;
      }
    }
    return clinGroup;
  }

  public async sortRows(): Promise<void> {
    this.sortArrayByCLIN(this.tableData);
    this.sortArrayByCLIN(this.optionPendingClins);
    this.sortArrayByCLIN(this.expiredClins);
  }

  public sortArrayByCLIN(array: ClinTableRowData[]): void {
    array.sort((a, b) => {
      return (a.CLINNumber || "") > (b.CLINNumber || "") ? 1 : -1;
    });
  }

  public async createTableData(): Promise<void> {
    await this.collectTableData();
    await this.sortRows();
    await this.addSeparators();
    /// create table data
    this.tableData = [
      ...this.tableData,
      ...this.optionPendingClins,
      ...this.expiredClins,
    ];
  }

  public calculateCurrentPeriodTotals(clin: ClinTableRowData): void {
    if (clin.isActive || clin.isExercised) {
      const CLINValue = currencyStringToNumber(clin.totalCLINValue || "0");
      const obligatedFunds = currencyStringToNumber(clin.obligatedFunds || "0");
      const fundsSpent = currencyStringToNumber(clin.totalFundsSpent || "0");
      this.currentPeriodFundingTotals.CLINValue += CLINValue ?? 0;
      this.currentPeriodFundingTotals.obligatedFunds += obligatedFunds ?? 0;
      this.currentPeriodFundingTotals.fundsSpent += fundsSpent ?? 0;
    }
  }

  public statusImgs: Record<string, Record<string, string | unknown>> = {};

  public getStatusImgObjs(
    key?: string,
    svgName?: string,
    width?: string,
    height?: string,
    color?: string,
    bgColor?: string
  ): void {
    const imgKey = key || "";
    this.statusImgs[imgKey] = {
      svgName,
      width,
      height,
      color,
      bgColor,
    };
  }

  public async generateStatusImages(): Promise<void> {
    const statusImgValues = [
      [
        Statuses.Delinquent.value,
        "failed",
        "16",
        "16",
        "error",
        "bg-error-lighter",
      ],
      [
        Statuses.Expired.value,
        "failed",
        "16",
        "16",
        "error",
        "bg-error-lighter",
      ],
      [
        Statuses.ExpiredPoP.value,
        "failed",
        "16",
        "16",
        "error",
        "bg-error-lighter",
      ],
      [
        Statuses.ExpiringPop.value,
        "warningAmber",
        "18",
        "15",
        "warning-dark2",
        "bg-warning-lighter",
      ],
      [
        Statuses.ExpiringPopOK.value,
        "taskAlt",
        "17",
        "17",
        "success-dark",
        "bg-success-lighter",
      ],
      [
        Statuses.FundingAtRisk.value,
        "warningAmber",
        "18",
        "15",
        "warning-dark2",
        "bg-warning-lighter",
      ],
      [
        Statuses.AtRisk.value,
        "warningAmber",
        "18",
        "15",
        "warning-dark2",
        "bg-warning-lighter",
      ],
      [
        Statuses.OptionPending.value,
        "optionPending",
        "16",
        "16",
        "info-dark",
        "bg-info-lighter",
      ],
      [
        Statuses.OptionExercised.value,
        "requestQuote",
        "13",
        "16",
        "info-dark",
        "bg-info-lighter",
      ],
      [
        Statuses.UpcomingPeriod.value,
        "requestQuote",
        "13",
        "16",
        "info-dark",
        "bg-info-lighter",
      ],
      [
        Statuses.OnTrack.value,
        "taskAlt",
        "17",
        "17",
        "success-dark",
        "bg-success-lighter",
      ],
    ];

    statusImgValues.forEach((values) => {
      this.getStatusImgObjs(...values);
    });
  }

  public async loadOnEnter(): Promise<void> {
    if (Object.keys(this.selectedTaskOrder).length > 0) {
      try {
        await this.generateStatusImages();
        await this.createTableData();

        if (
          this.selectedTaskOrder.totalObligated &&
          this.selectedTaskOrder.totalFundsSpent
        ) {
          this.taskOrderRemainingFunds = this.fundsRemaining(
            currencyStringToNumber(this.selectedTaskOrder.totalObligated),
            currencyStringToNumber(this.selectedTaskOrder.totalFundsSpent)
          );
        }
      } catch {
        console.log("Error loading Task Order Details");
      }
    }
  }
}
</script>
