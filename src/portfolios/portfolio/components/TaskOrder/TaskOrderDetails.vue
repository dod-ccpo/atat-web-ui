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
        {{selectedTaskOrder.taskOrderNumber}}
      </span>
    </div>
    <div class="pt-3 d-flex justify-space-between pb-5">
      <h1>{{selectedTaskOrder.taskOrderNumber}}</h1>
      <v-btn
        id="ModifyTaskOrderButton"
        outlined
        class="secondary"
      >
        Request to modify task order
      </v-btn>
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
        <div class="h1">{{selectedTaskOrder.totalObligated}}</div>
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
        <div class="h1">{{selectedTaskOrder.totalValue}}</div>
      </v-card>
      <v-card
        class="_task-order-card"
        elevation="0"
        id="Card_TotalLifecycleAmount"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total lifecycle amount</span>
          <ATATTooltip
            :tooltipText="lifecycleTooltip"
            id="LifecycleToolTip"
          />
        </div>
        <div class="h1">{{selectedTaskOrder.totalLifeCycle}}</div>
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
        <div class="h1">{{selectedTaskOrder.totalFundsSpent}}</div>
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
          <tbody name="expand" >
          <template >
            <tr
              class="row-item"
              :class="[
                { '_section-divider' : item.startNewClinGroup},
                {'bg-info-lighter': item.status === 'Processing'},
                {'d-none': item.isExpired && !showInactive },
                {'d-none': item.isPending && !showInactive },
              ]"
              v-for="item in props.items" 
              :key="item.CLINNumber"
            >

              <td>
                <div class="d-flex flex-column font-weight-400">
                  <span class="_clin-number">{{item.CLINNumber}}</span>
                  <span class="font-size-12 text-base _clin-title">
                    {{item.CLINTitle}}
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
              <td :style="{ verticalAlign: getValign(item)}">
                <div class="d-flex flex-column">
                  <span class="nowrap _pop-dates">
                    {{ item.PoP.startDate }}&ndash;{{ item.PoP.endDate }}
                  </span>
                  <span
                    v-if="item.isActive"
                    class="font-size-12 text-base d-flex _expiration-wrapper"
                  >
                    <ATATSVGIcon
                      v-if="item.status === statuses.AtRisk.value
                       || item.status === statuses.ExpiringPop.value"
                      width="14"
                      height="16"
                      name="warning"
                      color="warning-dark2"
                      class="mr-1 _alert-icon"
                    />
                    <span class="_expiration">{{item.PoP.expiration}}</span>
                  </span>
                </div>
              </td>
              <td
                class="text-right _total-clin-value"
                :class="'_' + item.status"
                :style="{ verticalAlign: getValign(item)}"
              >
                  {{item.totalCLINValue}}
              </td>
              <td class="text-right _obligated-funds" :style="{ verticalAlign: getValign(item)}">
                {{item.obligatedFunds}}
              </td>
              <td :style="{ verticalAlign: getValign(item)}">
                <div
                  class="d-flex flex-column">
                  <div
                    :class="{'text-error font-weight-500': item.status === 'Delinquent'}"
                    class="d-flex align-center justify-end"
                  >
                    <span class="_total-funds-spent">{{item.totalFundsSpent}}</span>
                    <span
                      :class="{'text-error font-weight-500': item.status === 'Delinquent'}"
                      class="font-size-12 text-base ml-3 _funds-spent-percent">
                    ({{item.fundsRemaining.percent}}%)
                  </span>
                  </div>
                  <div
                    v-if="item.status === 'Delinquent' || item.isOverspent"
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
                    v-else-if="item.isActive"
                    class="d-flex font-size-12 align-center justify-end"
                    :class="[
                      'nowrap',
                      {'text-base-darkest': item.status === 'Funding At-Risk'},
                      {'text-base': item.status !== 'Funding At-Risk'},
                    ]"
                  >
                    <ATATSVGIcon
                      v-if="item.status === statuses.FundingAtRisk.value 
                        || item.status === statuses.AtRisk.value"
                      name="warning"
                      width="14"
                      height="12"
                      color="warning-dark2"
                      class="mr-1"
                    />
                    {{item.fundsRemaining.fundsRemaining}}
                  </div>
                </div>
              </td>
            </tr>
          </template>
            <tr class="_section-divider">
              <td colspan="2" class="font-weight-400">
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
              </td>
              <td align="right" class="font-weight-700">
                Total
              </td>
              <td align="right" class="font-weight-700 _grand-total-clin-value">
                <span v-if="!showInactive">
                  ${{ toCurrencyString(currentPeriodFundingTotals.CLINValue) }}
                </span>
                <span v-else>
                  {{ selectedTaskOrder.totalLifeCycle }}
                </span>
              </td>
              <td align="right" class="font-weight-700 _grand-total-obligated-funds">
                <span v-if="!showInactive">
                  ${{ toCurrencyString(currentPeriodFundingTotals.obligatedFunds) }}
                </span>
                <span v-else>
                  {{ selectedTaskOrder.totalObligated }}
                </span>
              </td>
              <td align="right">
                <div v-if="!showInactive">
                  <div class="d-flex justify-end align-center font-weight-700 text-base-darkset">
                    <span class="_grand-total-funds-spent">
                      ${{ toCurrencyString(currentPeriodFundingTotals.fundsSpent) }}
                    </span>
                    <span class="_grand-total-spent-percent
                      font-size-12 text-base ml-3 font-weight-500"
                    >
                      ({{ totals.percent }}%)
                    </span>
                  </div>
                  <span class="d-flex font-size-12 text-base justify-end _grand-total-remaining">
                    {{ totals.fundsRemaining }}
                  </span>
                </div>
                <div v-else>
                  <div class="d-flex justify-end align-center font-weight-700 text-base-darkset">
                    <span class="_grand-total-funds-spent">
                      {{ selectedTaskOrder.totalFundsSpent }}
                    </span>
                    <span class="_grand-total-spent-percent
                      font-size-12 text-base ml-3 font-weight-500"
                    >
                      ({{ taskOrderRemainingFunds.percent }}%)
                    </span>
                  </div>
                  <span class="d-flex font-size-12 text-base justify-end _grand-total-remaining">
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
      <ATATAlert
        id="TaskOrderDetailsAlert"
        type="info"
        closeButton="true"
      >
        <template v-slot:content>
          <p class="mb-0">
            NOTE: Spend data is provided by your CSP to assist with tracking expended funds across
            each CLIN. Values and percentages are based on your latest monthly invoice and may not
            reflect real-time cloud and support charges. Before requesting a task order
            modification, we recommend logging in to your CSP console to get detailed cost
            analyses and breakdowns.
          </p>
        </template>
      </ATATAlert>
    </div>
    <div>
      <v-expansion-panels class="pt-6" ripple="false" elevation="0">
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
      </v-expansion-panels>
    </div>
  </div>
</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";

import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import { ClinTableRowData, TaskOrderCardData } from "../../../../../types/Global";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import TaskOrderCard from "@/portfolios/portfolio/components/TaskOrder/TaskOrderCard.vue";
import { 
  currencyStringToNumber, 
  differenceInDaysOrMonths, 
  getStatusLabelFromValue, 
  toCurrencyString 
} from "@/helpers";

import AcquisitionPackage, { Statuses } from "@/store/acquisitionPackage";
import { ClinDTO } from "@/api/models";

@Component({
  components: {
    TaskOrderCard,
    ATATSVGIcon,
    ATATTooltip,
    ATATAlert
  }
})

export default class TaskOrderDetails extends Vue {
  @Prop() private selectedTaskOrder: TaskOrderCardData = {};
  @PropSync("showDetails",{default: false}) private _showDetails!: boolean;

  public clins: ClinDTO[] = this.selectedTaskOrder.clins || [];
  public tableData: ClinTableRowData[] = [];
  public expiredClins: ClinTableRowData[] = [];
  public optionPendingClins: ClinTableRowData[] = []
  public showInactive = false
  public statuses = Statuses;

  @Watch("showInactive")
  public showHide():string {
    return this.showInactive? 'Hide':'Show'
  }

  public currentPeriodFundingTotals: {
    CLINValue:number,
    obligatedFunds:number,
    fundsSpent:number,
  } = {
      CLINValue:0,
      obligatedFunds:0,
      fundsSpent:0,
    }

  public taskOrderRemainingFunds = {percent:"",fundsRemaining:""}
  public totals = {percent:"",fundsRemaining:""}
  public inactiveCount = 0;

  public obligatedFundsToolTip = "Total of all obligations (i.e. funded CLINs) in the base period" +
    " and exercised option periods. This may represent 100% of your total task order value, or a" +
    " portion of it.";
  public totalValueToolTip = "Total of all exercised CLINs in the base period and exercised" +
    " option periods.";
  public lifecycleTooltip = " Total value of all CLINs in all periods, both exercised and" +
    " options. This is the full amount of money requested in the task order, but " +
    "it does not have to be spent.";
  public totalFundsToolTip = "Total amount of the task order that has been spent and invoiced;" +
    " your expended obligations. Spend data is provided by your CSP, as of the last" +
    " monthly invoice.";
  get isAlertClosed(): boolean {
    return AcquisitionPackage.taskOrderDetailsAlertClosed
  }

  public getValign(item: ClinTableRowData): string {
    return item.isPending || (item.isExpired && !item.isOverspent) ? "middle" : "top"
  }

  public handleClick(): void {
    this._showDetails = false
  }

  public toCurrencyString(value: number): string {
    return toCurrencyString(value)
  }

  public tableHeaders: Record<string, string>[] = [
    { text: "CLIN", value: "CLINNumber" },
    { text: "Status", value: "status" },
    { text: "Period of performance", value: "PoP" },
    { text: "Total CLIN value", value: "totalCLINValue" },
    { text: "Obligated funds", value: "obligatedFunds" },
    { text: "Total funds spent (%)", value: "totalFundsSpent" },
  ];
 
  public toggleInactive():void {
    this.showInactive = !this.showInactive
  }

  public fundsRemaining(obligatedFunds:string | number, fundsSpent:string | number):
    { percent:string, fundsRemaining:string } {
    if(obligatedFunds == "0" && fundsSpent == "0"){
      return {
        percent: "0",
        fundsRemaining: ""
      }
    }
    //eslint-disable-next-line prefer-const
    let percent = Math.round((Number(fundsSpent) / Number(obligatedFunds)) * 100);
    //eslint-disable-next-line prefer-const
    let remaining = Number(obligatedFunds) - Number(fundsSpent);
    return {
      percent: String(percent),
      fundsRemaining:"$" + toCurrencyString(remaining) + " remaining"
    }
  }

  public async collectTableData(): Promise<void> {
    const inactiveStatuses = [Statuses.OptionPending.value, Statuses.Expired.value]

    this.clins.forEach((clin)=>{
      const isClinActive = !(inactiveStatuses.includes(clin.clin_status));
      const tableRowData: ClinTableRowData = {
        isActive: isClinActive,
        isExercised: clin.clin_status === Statuses.OptionExercised.value,
        isPending: clin.clin_status === Statuses.OptionPending.value,
        isExpired: clin.clin_status === Statuses.Expired.value,
        CLINNumber: clin.clin_number,
        CLINTitle: clin.idiq_clin_display?.display_value,
        PoP: differenceInDaysOrMonths(clin.pop_start_date,clin.pop_end_date),
        popStartDate: clin.pop_start_date,
        status: clin.clin_status,
        statusLabel: getStatusLabelFromValue(clin.clin_status),
        obligatedFunds: '$' + toCurrencyString(clin.funds_obligated),
        totalCLINValue: '$' + toCurrencyString(clin.funds_total),
        totalFundsSpent: '$' + toCurrencyString(clin.funds_spent_clin || 0),
        isOverspent: clin.funds_spent_clin ? clin.funds_spent_clin > clin.funds_obligated : false,
        fundsRemaining: this.fundsRemaining(
          clin.funds_obligated,
          String(clin.funds_spent_clin)
        ),
        startNewClinGroup: false
      }
     
      //add row to appropriate temporary table
      if (clin.clin_status === Statuses.Expired.value ){
        this.expiredClins.push(tableRowData)
      } else if (clin.clin_status === Statuses.OptionPending.value){
        this.optionPendingClins.push(tableRowData)
      } else {
        this.tableData.push(tableRowData)
      }

      this.calculateCurrentPeriodTotals(tableRowData);

      this.totals = this.fundsRemaining(
        this.currentPeriodFundingTotals.obligatedFunds, 
        this.currentPeriodFundingTotals.fundsSpent
      )
    });
    this.inactiveCount = this.expiredClins.length + this.optionPendingClins.length;

  }

  public async addSeparators() : Promise<void> {
    this.optionPendingClins[0].startNewClinGroup = true;
    this.expiredClins[0].startNewClinGroup = true;
  }

  public async sortRows() : Promise<void>{
    this.tableData.sort((a, b) => (a.CLINNumber || "") > (b.CLINNumber || "") ? 1 : -1) 
    this.sortArrayByDateThenNumber(this.optionPendingClins);
    this.sortArrayByDateThenNumber(this.expiredClins);
  }

  public sortArrayByDateThenNumber(array: ClinTableRowData[]): void{
    array.sort((a, b)=> {
      if (a.popStartDate === b.popStartDate){
        return (a.CLINNumber || "") > (b.CLINNumber || "") ? 1 : -1
      } else {
        return a.popStartDate > b.popStartDate ? -1 : 1
      }
    })
  }

  public async createTableData(): Promise<void>{
    await this.collectTableData();
    await this.sortRows();
    await this.addSeparators();
    /// create table data
    this.tableData = [...this.tableData,...this.optionPendingClins, ...this.expiredClins]
  }


  public calculateCurrentPeriodTotals(clin: ClinTableRowData): void{
    if (clin.isActive || clin.isExercised) {
      const CLINValue = currencyStringToNumber(clin.totalCLINValue || "0");
      const obligatedFunds = currencyStringToNumber(clin.obligatedFunds || "0");
      const fundsSpent = currencyStringToNumber(clin.totalFundsSpent || "0");
      this.currentPeriodFundingTotals.CLINValue += CLINValue;
      this.currentPeriodFundingTotals.obligatedFunds += obligatedFunds;
      this.currentPeriodFundingTotals.fundsSpent += fundsSpent;
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
      svgName, width, height, color, bgColor
    }
  }

  public async generateStatusImages(): Promise<void> {
    const statusImgValues = [
      [Statuses.Delinquent.value, "failed", "16", "16", "error", "bg-error-lighter"],
      [Statuses.Expired.value, "failed", "16", "16", "error", "bg-error-lighter"],
      [Statuses.ExpiringPop.value,"warningAmber","18","15","warning-dark2","bg-warning-lighter"],
      [Statuses.FundingAtRisk.value,"warningAmber","18","15","warning-dark2","bg-warning-lighter"],
      [Statuses.AtRisk.value, "warningAmber", "18", "15", "warning-dark2", "bg-warning-lighter"],
      [Statuses.OptionPending.value, "optionPending", "16", "16", "info-dark", "bg-info-lighter"],
      [Statuses.OptionExercised.value, "requestQuote", "13", "16", "info-dark", "bg-info-lighter"],
      [Statuses.OnTrack.value, "taskAlt", "17", "17", "success-dark", "bg-success-lighter"],
    ];    

    statusImgValues.forEach((values) => {
      this.getStatusImgObjs(...values);
    });
  }

  public async loadOnEnter(): Promise<void> {
    try {
      await this.generateStatusImages();
      await this.createTableData();

      if (this.selectedTaskOrder.totalObligated && this.selectedTaskOrder.totalFundsSpent) {
        this.taskOrderRemainingFunds = this.fundsRemaining(
          currencyStringToNumber(this.selectedTaskOrder.totalObligated), 
          currencyStringToNumber(this.selectedTaskOrder.totalFundsSpent),
        );
      }

    } 
    catch {
      console.log("Error loading Task Order Details")
    }
  }

  public mounted(): void {
    this.loadOnEnter();
  }
}
</script>

