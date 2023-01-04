<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      How will my Contracting Office affect the final 
      acquisition package generated within DAPPS?
    </h2>
    <p>
      The documents that are generated upon completion of this form are 
      intended for DITCO. Other contracting offices may accept these documents 
      or may require specific templates for processing task orders within their 
      organization. Please check with your Contracting Office directly for 
      further instructions.
    </p>
    <p>
      <strong>If you plan to use DITCO,</strong> upon completion of the interview process, your 
      requirements package will be automatically sent to DITCO. All feedback 
      and processing will be managed within DAPPS. There is a 2.25% processing 
      fee for DITCO contracting services.
    </p>
    <p>
      <strong>If you plan to use a different Contracting Office,</strong> you will be able to 
      download your signed documents to submit to your Contracting Office. 
      Feedback from your Contracting Office will not be managed within DAPPS, 
      but you will be able to edit your responses within the system, re-sign, 
      and download the documents again. In addition to any processing fees required 
      by your Contracting Office, there will be a 1% external ordering agency fee 
      added to your Requirements Cost Estimate.
    </p>
    <ATATAlert
      id="DITCOQuestionLearnMoreAlert"
      type="info"
      :showIcon="true"
      class="mt-5"
    >
      <template v-slot:content>
        <p class="font-weight-500">
          Before proceeding, we recommend that you verify that your Contracting 
          Office will accept DITCO templates for the following documents:
        </p>
        <div class="mb-0">
          <ul>
            <li>Requirements Checklist</li>
            <li>Description of Work</li>
            <li>Independent Government Cost Estimate (IGCE)</li>
            <li>Incremental Funding Plan</li>
            <li>
              Justification &amp; Approval (J&amp;A) for Exception to Fair Opportunity
            </li>
            <li>Market Research Report</li>
            <li>Evaluation Plan</li>
          </ul>
        </div>
        
      </template>
    </ATATAlert>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert
  }
})
export default class ContractingShopLearnMore extends Vue {}
</script>