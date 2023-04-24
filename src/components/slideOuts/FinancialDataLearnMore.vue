<template>
  <div class="_panel-padding">
    <h2 class="mb-5">About ATAT Funding Tracker</h2>
    <p>
      Each portfolio has a Funding Tracker to help Mission Owners and Contracting Officer's
      Representatives (CORs) gauge how much cloud they are using and how much money they have
      remaining on their associated task order(s).
    </p>
    <p>
      <strong>
        ATAT is not an invoicing or records management system.
      </strong>
      The financial details depicted in ATAT only provide an approximation of
      real-time estimates. Invoices with the actual cloud usage and charges will
      come directly from the CSP and are generally 30 to 60 days behind,
      depending on your billing cycle.
    </p>
    <p>
      To avoid overspend and potential violations of the Antideficiency Act, you should log into
      your account via the CSP console on a regular basis to get more detailed cost analyses and
      usage breakdowns.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class FinancialDataLearnMore extends Vue {

}
</script>
