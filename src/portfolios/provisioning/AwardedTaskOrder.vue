<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-1 py-0">
            Great news! We found your task order.
          </h1>
        
          <div class="copy-max-width">
            <p>
              Please review the information that we retrieved for your task
              order below. If these details look accurate, click “Continue” and
              we’ll import the contract line number (CLIN) funding data to your
              ATAT portfolio.
            </p>
          </div>
       
          <div class=
             "width-50 body-sm awarded-task-order-details copy-max-width 
              border1 border-base-lighter border-rounded-more pa-8 mb-10">
              <h2 class="mb-4">Task Order #{{ awardedTaskOrder.taskOrderNumber }} </h2>
              <dl class="d-flex flex-wrap">
                <dt class="text-base">Cloud Service Provider (CSP)</dt>
                <dd>{{ awardedTaskOrder.cspLong }}</dd>
                <dt class="text-base">Contract Issuing Office</dt>
                <dd>{{ awardedTaskOrder.contractIssuingOffice }}</dd>
              </dl>
              <hr class="my-4" />
              <dl class="d-flex flex-wrap">
                <dt class="text-base">Period of Performance</dt>
                <dd>{{ awardedTaskOrder.periodOfPerformance }}</dd>
                <dt class="text-base">Total Obligated Amount</dt>
                <dd>{{ convertToCurrency(awardedTaskOrder.totalObligatedAmount) }}</dd>
                <dt class="text-base">Total Task Order Amount</dt>
                <dd>{{ convertToCurrency(awardedTaskOrder.totalAmount) }}</dd>
                <dt class="text-base mb-0">Classification Level</dt>
                <dd class="mb-0">{{ awardedTaskOrder.classificationLevel }}</dd>
              </dl>
          </div>

           <ATATExpandableLink aria-id="DataRetrievedFrom">
              <template v-slot:header>
                Where is this task order data retrieved from?
              </template>
              <template v-slot:content>
                <p class="mb-4">
                  Task order details are retrieved from Electronic Data Access (EDA). EDA is a 
                  web-based system that provides secure online access, storage, and retrieval of 
                  contracts and contract modifications to authorized users throughout the 
                  Department of Defense.
                </p>
              </template>
            </ATATExpandableLink>
            <ATATExpandableLink aria-id="FundingDetailsImport">
              <template v-slot:header>
                What funding details will be imported to my ATAT portfolio?
              </template>
              <template v-slot:content>
                <p class="mb-4">
                  In addition to the details listed above, ATAT imports the total and obligated 
                  values for each CLIN within all performance periods. This funding information 
                  will be used to track your cloud usage and manage spending throughout the
                  duration of the task order.
                </p>
              </template>
            </ATATExpandableLink>
        </v-col>
      </v-row>

    </v-container>
    <TaskOrderSearchModal
      :showTOSearchModal.sync="showTOSearchModal"
      :TONumber.sync="TONumber"
      :resetValidationNow.sync="resetValidationNow"
      @TOSearchCancelled="TOSearchCancelled"
      @startProvisionWorkflow="resetAwardedTaskOrderData"
    />        

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { AwardedTaskOrderDetails } from "types/Global";
import { getCurrencyString } from "@/helpers";

import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import TaskOrderSearchModal from "@/portfolios/components/TaskOrderSearchModal.vue";

import PortfolioStore from "@/store/portfolio";
import { format } from 'date-fns';
import AcquisitionPackage from "@/store/acquisitionPackage";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";

@Component({
  components:{
    ATATExpandableLink,
    TaskOrderSearchModal,
  }
})
export default class AwardedTaskOrder extends Vue {

  public showTOSearchModal = false;
  public TONumber = "";
  public resetValidationNow = false;
  
  public openSearchTOModal(): void {
    this.showTOSearchModal = true;
  }

  public TOSearchCancelled(): void {
    this.TONumber = "";
    this.resetValidationNow = true;
    this.showTOSearchModal = false;
  }

  public get openTOSearchPortfolio(): boolean {
    return PortfolioStore.openTOSearchPortfolio;
  }
  @Watch("openTOSearchPortfolio")
  public openTOSearchPortfolioChanged(newVal: boolean): void {
    this.showTOSearchModal = newVal;
  }

  public awardedTaskOrder: AwardedTaskOrderDetails = {
    taskOrderNumber: "",
    contractor: "",
    csp: "",
    cspLong: "",
    contractIssuingOffice: "",
    periodOfPerformance: "",
    totalObligatedAmount: 0,
    totalAmount: 0,
    classificationLevel: ""
  };

  public resetAwardedTaskOrderData(): void {
    this.setTaskOrderData();
    PortfolioStore.setOpenTOSearchModal(false);
  }

  public convertToCurrency(num: number): string{
    return getCurrencyString(num);
  }

  public async setTaskOrderData(): Promise<void> {
    const data = PortfolioStore.portfolioProvisioningObj;
    if (data) {
      const popEnd = data.popEndDate ? format(new Date(data.popEndDate), "MM/dd/yyyy") : "";
      const popStart = data.popStartDate ? format(new Date(data.popStartDate), "MM/dd/yyyy") : "";
      const pop = popEnd && popStart ? popStart + " — " + popEnd : "";

      this.awardedTaskOrder = {
        taskOrderNumber: data.taskOrderNumber as string,
        contractor: data.contractor as string,
        csp: data.csp as string,
        cspLong: data.cspLong as string,
        contractIssuingOffice: data.contractIssuingOffice as string,
        periodOfPerformance: pop,
        totalObligatedAmount: data.totalObligatedAmount as number,
        totalAmount: data.totalAmount as number,
        classificationLevel: data.classificationLevels?.length 
          ? data.classificationLevels.join(", ") : "",
      }
    }
  }

  public async mounted(): Promise<void> {
    await AcquisitionPackage.setDisableContinue(false);
    await this.setTaskOrderData();
    await AcquisitionPackageSummary.setPackagesWaitingForTaskOrder();
  }

}
</script>
