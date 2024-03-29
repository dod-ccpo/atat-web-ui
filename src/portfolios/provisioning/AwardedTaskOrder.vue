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
              border1 border-base-lighter _border-rounded-more pa-8 mb-10">
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

            <ATATAlert 
              type="error" 
              id="AzureAlert"
              v-if="isAzure"
              class="mt-8"
            >
              <template v-slot:content>
                <h3 class="mb-2">
                  ATAT does NOT support migrating existing Azure Tenants to JWCC billing.
                </h3>
                <p>
                  Only proceed if you wish to provision a completely new Azure Tenant. 
                  If you are partially or fully migrating an already existing environment, 
                  stop here and contact 
                  <a href="mailto:ATAT_Microsoft@microsoft.com">ATAT_Microsoft@microsoft.com</a>.
                </p>
              </template>
            </ATATAlert>

        </v-col>
      </v-row>

    </v-container>
    <TaskOrderSearchModal
      :showTOSearchModal="showTOSearchModal"
      @update:showTOSearchModal="showTOSearchModal = $event"
      :TONumber="TONumber"
      @update:TONumber="TONumber = $event"
      :resetValidationNow="resetValidationNow"
      @update:resetValidationNow="resetValidationNow = $event"
      @TOSearchCancelled="TOSearchCancelled"
      @startProvisionWorkflow="resetAwardedTaskOrderData"
    />        

  </div>
</template>

<script lang="ts">
import { Component, Watch,  Vue, toNative } from "vue-facing-decorator";
import { AwardedTaskOrderDetails } from "types/Global";
import { getCurrencyString } from "@/helpers";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import TaskOrderSearchModal from "@/portfolios/components/TaskOrderSearchModal.vue";

import PortfolioStore from "@/store/portfolio";
import { format, parseISO } from 'date-fns';
import AcquisitionPackage from "@/store/acquisitionPackage";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";

@Component({
  components:{
    ATATAlert,
    ATATExpandableLink,
    TaskOrderSearchModal,
  }
})
class AwardedTaskOrder extends Vue {

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
    PortfolioStore.setOpenTOSearchModal(false)
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

  public get isAzure(): boolean {
    return this.awardedTaskOrder.csp.toLowerCase() === "azure";
  }

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
      const popEnd = data.popEndDate ? parseISO(data.popEndDate) : new Date();
      const popEndDateStr = format(popEnd, "MM/dd/yyyy");
      const popStart = data.popStartDate ? parseISO(data.popStartDate) : new Date();
      const popStartDateStr = format(popStart, "MM/dd/yyyy");

      const pop = `${popStartDateStr} — ${popEndDateStr}`;

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
    await PortfolioStore.resetCurrentPortfolio();
    await AcquisitionPackage.setDisableContinue(false);
    await this.setTaskOrderData();

    // Set packages with status WAITING_FOR_TASK_ORDER in the Acq Pkg store
    // for use in route resolver when continuing from this page
    await AcquisitionPackageSummary.setPackagesWaitingForTaskOrderCount();
  }

}
export default toNative(AwardedTaskOrder)
</script>
