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
      <span
       class="text-base"
       id="TaskOrderNumber"
      >
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
    <div class="
    pt-5
    d-flex
    ">
      <v-card
        class="_task-order-card"
        elevation="0"
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
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total Lifecycle amount</span>
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
                { '_new-clin-group' : item.startNewClinGroup},
                {'bg-info-lighter': item.status === 'Processing'},
                {'d-none': item.isExpired && !showInactive },
                {'d-none': item.isPending && !showInactive },
              ]"
              v-for="item in props.items" 
              :key="item.CLINNumber"
            >

              <td>
                <div class="d-flex flex-column font-weight-400">
                  {{item.CLINNumber}}
                  <span class="font-size-12 text-base">
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
                      :name="statusImgs[item.status].name"
                      :width="Number(statusImgs[item.status].width)"
                      :height="Number(statusImgs[item.status].height)"
                      :color="statusImgs[item.status].color"
                    />
                     
                  </div>
                  <div class="d-flex flex-column font-weight-500">
                    {{item.status}}
                  </div>
                </div>

              </td>
              <td>
                <div class="d-flex flex-column">
                  {{item.PoP.PoP}}
                  <span
                    v-if="item.isActive"
                    class="font-size-12 text-base d-flex"
                  >
                    <ATATSVGIcon
                      v-if="item.status === 'At Risk'
                      || item.status === 'Expiring PoP'"
                      width="14"
                      height="16"
                      name="warning"
                      color="warning-dark2"
                      class="mr-1"
                    />
                    {{item.PoP.expiration}}
                  </span>
                </div>
              </td>
              <td align="right">{{item.totalCLINValue}}</td>
              <td align="right">{{item.obligatedFunds}}</td>
              <td>
                <div
                  class="d-flex flex-column">
                  <div
                    :class="{'text-error font-weight-500': item.status === 'Delinquent'}"
                    class="d-flex align-center justify-end"
                  >
                    {{item.totalFundsSpent}}
                    <span
                      :class="{'text-error font-weight-500': item.status === 'Delinquent'}"
                      class="font-size-12 text-base ml-3">
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
                    Overspent
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
                      v-if="item.status === 'Funding At-Risk' 
                        || item.status.indexOf('At Risk') > -1
                      "
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
          </tbody>
        </template>
        <!-- eslint-disable vue/valid-v-slot -->
        <template v-slot:footer>
          <div class="_table-pagination pr-6">
              <div class="mr-auto pl-6 font-weight-400 font-size-14">
                <a
                  @click="toggleInactive"
                  role="button"
                >
                  {{ showHide() }} inactive CLINs
                </a>
                <span class="font-size-14 text-base ml-2">
                  ({{ inactiveCount }})
                </span>
              </div>
            <div
              style="min-width: 160px"
              class="d-flex font-weight-700 text-base-dark ml-auto justify-end">
              Total
            </div>
            <div
              style="min-width: 160px"
              class="d-flex font-weight-700 text-base-darkest justify-end">
              <span v-if="!showInactive">
                ${{convertToString(totalFundingObj.totalCLINValue)}}
              </span>
              <span v-else>
                ${{convertToString(totalFundingObj.withInactiveTotal)}}
              </span>
            </div>
            <div
              style="min-width: 144px"
              class="d-flex font-weight-700 text-base-darkest mr-6 justify-end"
            >
              <span v-if="!showInactive">
                ${{convertToString(totalFundingObj.totalObligatedFunds)}}
              </span>
              <span v-else>
                ${{convertToString(totalFundingObj.withInactiveObligatedFunds)}}
              </span>
            </div>
            <div
              style="min-width: 180px">
               <div v-if="!showInactive">
                 <div class="d-flex justify-end align-center font-weight-700 text-base-darkset">
                   ${{convertToString(totalFundingObj.totalFundsSpent)}}
                   <span class="font-size-12 text-base ml-3 font-weight-500">
                     ({{totals.percent }}%)
                   </span>
                 </div>
                 <span class="d-flex font-size-12 text-base justify-end">
                 {{totals.fundsRemaining}}
                </span>
              </div>
              <div v-else>
                <div class="d-flex justify-end align-center font-weight-700 text-base-darkset">
                  ${{convertToString(totalFundingObj.withInactiveFundsSpent)}}
                  <span class="font-size-12 text-base ml-3 font-weight-500 ">
                     ({{totalsWithInactive.percent}}%)
                   </span>
                </div>
                <span class="d-flex font-size-12 text-base justify-end">
                 {{totalsWithInactive.fundsRemaining}}
                </span>
              </div>
            </div>
          </div>
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
import Vue from "vue";

import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import { ClinTableRowData, TaskOrderCardData } from "../../../../../types/Global";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import TaskOrderCard from "@/portfolios/portfolio/components/TaskOrder/TaskOrderCard.vue";
import { 
  capitalizeFirstLetter, 
  createDateStr, 
  currencyStringToNumber, 
  toCurrencyString 
} from "@/helpers";


import AcquisitionPackage from "@/store/acquisitionPackage";
import { differenceInDays, differenceInMonths } from "date-fns";
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
  @Prop() private selectedTaskOrder!: TaskOrderCardData;
  @PropSync("showDetails",{default: false}) private _showDetails!: boolean;

  public clins: ClinDTO[] = this.selectedTaskOrder.clins || [];
  public tableData: ClinTableRowData[] = [];
  public expiredClins: ClinTableRowData[] = [];
  public optionPendingClins: ClinTableRowData[] = []
  public showInactive = false


  @Watch("showInactive")
  public showHide():string {
    return this.showInactive? 'Hide':'Show'
  }

  public totalFundingObj: {
    totalCLINValue:number,
    withInactiveTotal:number,
    totalObligatedFunds:number,
    withInactiveObligatedFunds:number,
    totalFundsSpent:number,
    withInactiveFundsSpent:number,
  } = {
    totalCLINValue:0,
    withInactiveTotal:0,
    totalObligatedFunds:0,
    withInactiveObligatedFunds:0,
    totalFundsSpent:0,
    withInactiveFundsSpent:0,
  }

  public totalsWithInactive = {percent:"",fundsRemaining:""}
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
  public handleClick(): void {
    this._showDetails = false
  }

  public convertToString(value: number): string {
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
    debugger;
    this.showInactive = !this.showInactive
  }

  public fundsRemaining(obligatedFunds:string | number, fundsSpent:string | number):
    {percent:string,fundsRemaining:string} {
    if(obligatedFunds == "0" && fundsSpent == "0"){
      return {
        percent: "0",
        fundsRemaining: ""
      }
    }
    let percent = Math.round((Number(fundsSpent) / Number(obligatedFunds)) * 100);
    let remaining = Number(obligatedFunds) - Number(fundsSpent);
    return {
      percent: String(percent),
      fundsRemaining:"$" + toCurrencyString(remaining) + " remaining"
    }
  }

  public timeToExpiration(start:string,end:string): { PoP:string, expiration:string } {
    const formattedStartDate = createDateStr(start, true);
    const formattedEndDate = createDateStr(end, true);
    const difInDays = differenceInDays(new Date(end), new Date());
    const difInMonths = differenceInMonths(new Date(end), new Date());

    const useDays = difInDays <= 60;
    const numberOfTimeUnits = useDays ? difInDays : difInMonths;
    let unitOfTime = useDays ? "day" : "month";
    if (numberOfTimeUnits !== 1) {
      unitOfTime = unitOfTime + "s";
    }

    return {
      PoP: `${formattedStartDate} - ${formattedEndDate}`,
      expiration: `${numberOfTimeUnits} ${unitOfTime} to expiration`
    }
  }

  public async collectTableData(): Promise<void> {
    const inactiveStatuses = ["Option Pending", "Expired"]

    this.clins.forEach((clin)=>{
      const formattedStatus = capitalizeFirstLetter(clin.clin_status)
        .replaceAll("_", " " ).replaceAll("Pop", "PoP");
      const isClinActive = !(inactiveStatuses.includes(formattedStatus)) 
        && formattedStatus !== "Option Exercised";
      const tableRowData: ClinTableRowData = {
        isActive: isClinActive,
        isExercised: formattedStatus === "Option Exercised",
        isPending: formattedStatus === "Option Pending",
        isExpired: formattedStatus === "Expired",
        CLINNumber: clin.clin_number,
        CLINTitle: clin.clin_title,
        PoP: this.timeToExpiration(clin.pop_start_date,clin.pop_end_date),
        popStartDate: clin.pop_start_date,
        status: formattedStatus,
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
      if (clin.clin_status.toUpperCase() === "EXPIRED" ){
        this.expiredClins.push(tableRowData)
      } else if (clin.clin_status.toUpperCase() === "OPTION_PENDING" ){
        this.optionPendingClins.push(tableRowData)
      } else {
        this.tableData.push(tableRowData)
      }

      this.calculateTotalFundingObj(tableRowData);
      this.totalsWithInactive = this.fundsRemaining(
        this.totalFundingObj.withInactiveObligatedFunds, this.totalFundingObj.withInactiveFundsSpent
      )
      this.totals = this.fundsRemaining(
        this.totalFundingObj.totalObligatedFunds, this.totalFundingObj.totalFundsSpent
      )
    });
    this.inactiveCount = this.expiredClins.length + this.optionPendingClins.length;

  }

  public async addSeparators() : Promise<void> {
    this.tableData[0].startNewClinGroup = true;
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


  public calculateTotalFundingObj(clin: ClinTableRowData): void{
    const totalCLINValue = currencyStringToNumber(clin.totalCLINValue || "0");
    const obligatedFunds = currencyStringToNumber(clin.obligatedFunds || "0");
    const totalFundsSpent = currencyStringToNumber(clin.totalFundsSpent || "0");
    debugger;

    if (clin.isActive || clin.isExercised) {
      this.totalFundingObj.totalCLINValue += totalCLINValue;
      this.totalFundingObj.totalObligatedFunds += obligatedFunds;
      this.totalFundingObj.totalFundsSpent += (totalFundsSpent);
    } 

    this.totalFundingObj.withInactiveTotal += totalCLINValue;
    this.totalFundingObj.withInactiveObligatedFunds += obligatedFunds;
    this.totalFundingObj.withInactiveFundsSpent += totalFundsSpent;
  }

  public statusImgs: Record<string, Record<string, string | undefined>> = {};

  public generateStatusImgs(
    key?: string,
    name?: string,
    width?: string,
    height?: string,
    color?: string,
    bgColor?: string
  ): void {
    const imgKey = key || "";

    this.statusImgs[imgKey] = {
      name, width, height, color, bgColor
    }
  }

  public async loadOnEnter(): Promise<void> {
    this.createTableData();
    const statusImgValues = [
      ["Delinquent", "failed", "16", "16", "error", "bg-error-lighter"],
      ["Expired","failed", "16", "16", "error", "bg-error-lighter"],
      ["Expiring PoP","warningAmber", "18", "15", "warning-dark2", "bg-warning-lighter"],
      ["Funding At Risk","warningAmber", "18", "15", "warning-dark2", "bg-warning-lighter"],
      
      ["At Risk","warningAmber", "18", "15", "warning-dark2", "bg-warning-lighter"],
      // EJY "At Risk" needs hyphen per Melissa

      ["Option Pending","optionPending", "16", "16", "info-dark", "bg-info-lighter"],
      ["Option Exercised","requestQuote", "13", "16", "info-dark", "bg-info-lighter"],
      ["On Track","taskAlt", "17", "17", "success-dark", "bg-success-lighter"],
    ];
    statusImgValues.forEach((values) => {
      this.generateStatusImgs(...values);
    });
  }
  public mounted(): void {
    this.loadOnEnter();
  }
}
</script>

