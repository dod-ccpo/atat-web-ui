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
              border1 border-base-lighter pa-8 mb-10">
              <h2 class="mb-4">Task Order #{{ awardedTaskOrder.taskOrderNumber }} </h2>
              <dl class="d-flex flex-wrap">
                <dt>Cloud Service Provider</dt>
                <dd>{{ awardedTaskOrder.contractor }}</dd>
                <dt>Contract Issuing Office</dt>
                <dd>{{ awardedTaskOrder.contractIssuingOffice }}</dd>
              </dl>
              <hr class="my-4" />
              <dl class="d-flex flex-wrap">
                <dt>Period of Performance</dt>
                <dd>{{ awardedTaskOrder.periodOfPerformance }}</dd>
                <dt>Total Obligated Amount</dt>
                <dd>{{ convertToCurrency(awardedTaskOrder.totalObligatedAmount) }}</dd>
                <dt>Total Task Order Amount</dt>
                <dd>{{ convertToCurrency(awardedTaskOrder.totalAmount) }}</dd>
                <dt>Classification Level</dt>
                <dd>{{ awardedTaskOrder.classificationLevel }}</dd>
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
                  will be used to track your cloud usage and manage spending throughout the \
                  duration of the task order.
                </p>
              </template>
            </ATATExpandableLink>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { AwardedTaskOrderDetails } from "types/Global";
import { getCurrencyString } from "@/helpers";

import ATATExpandableLink from "@/components/ATATExpandableLink.vue";

@Component({
  components:{
    ATATExpandableLink
  }
})
export default class AwardedTaskOrder extends Vue {
  public awardedTaskOrder: AwardedTaskOrderDetails = {
    taskOrderNumber: "HC102817F1349",
    contractor: "Microsoft, Inc.",
    contractIssuingOffice: "DITCO",
    periodOfPerformance: "10/01/2022-09/20/2023",
    totalObligatedAmount: 10000000,
    totalAmount: 50000000,
    classificationLevel: "Unclassified"
  };

  public convertToCurrency(num: number): string{
    return getCurrencyString(num);
  }

}
</script>
