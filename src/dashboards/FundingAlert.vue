<template>
  <ATATAlert :type="alertType" class="mt-5">
    <template v-slot:content>
      <div
        id="popExpiresSoonNoToClinAlert"
        class="mb-0"
        v-if="fundingAlertType === pOPExpiresSoonNoTOClin"
      >
        The current period of performance is
        <strong>expiring in {{ timeRemaining }} days. </strong>
        <a role="button">Modify your existing task order</a> to extend the
        current PoP or to exercise an option period. You can also
        <a role="button">add a new task order</a>
        to continue working with this portfolio.
      </div>
      <div
        id="popExpiresSoonWithToClinAlert"
        class="mb-0"
        v-if="fundingAlertType === popExpiresSoonWithTOClin"
      >
        The current period of performance is
        <strong>expiring in {{ timeRemaining }} days.</strong>
        You have obligated funds in an upcoming CLIN, so there will be no gap in
        funding for this portfolio.
      </div>
      <div
        id="popExpiresSoonWithLowFundsAlert"
        class="mb-0"
        v-if="fundingAlertType === popExpiresSoonWithLowFunds"
      >
        This portfolio is almost out of funds and is
        <strong>expiring in {{ timeRemaining }} days. </strong>
        <a role="button">Modify your existing task order</a> or
        <a role="button">add a new task order</a>
        to ensure there are no gaps in funding for this portfolio.
      </div>
      <div
        id="popLowFundsAlert"
        class="mb-0"
        v-if="fundingAlertType === popLowFunds"
      >
        This portfolio is almost out of funds.
        <a role="button">Review your task order details</a>
        to ensure your portfolio is funded until the end of the
        period of performance. You can request a modification
        or add a new task order, if necessary.
      </div>
      <div
        id="popFundsAt100Percent"
        class="mb-0"
        v-if="fundingAlertType === popFundsDepleted"
      >
        <div class="h3">This portfolio is out of funds.</div>
        <p class="mb-0">
          To avoid potential violation of the Antideficiency Act,
          <a role="button">modify your existing task order</a> or
          <a role="button">add a new task order</a>
          as soon as possible to ensure this portfolio is funded until the end
          of the period of performance.
        </p>
      </div>
      <div
        id="popFundsDepleted"
        class="mb-0"
        v-if="fundingAlertType === popFundsAt100Percent"
      >
        <p class="mb-0">
          You have <strong>0%</strong> remaining in your portfolio for this
          period of performance. Add funds to a new or existing task order as
          soon as possible to continue working with this portfolio.
        </p>
      </div>
      <div id="popExpired" class="mb-0" v-if="fundingAlertType === popExpired">
        <div class="h3">
          This portfolio&#8217;s period of performance has expired.
        </div>
        <p class="mb-0">
          <a role="button">Exercise an option on your existing task order</a> or
          <a role="button">add a new task order</a> to continue funding this
          portfolio. Funding Tracker details below reflect the status of your
          portfolio at the end of the most recent PoP.
        </p>
      </div>
    </template>
  </ATATAlert>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import { FundingAlertTypes } from "@/store/portfolio";

@Component({
  components: {
    ATATAlert,
  },
})
export default class FundingAlert extends Vue {
  @Prop({ default: FundingAlertTypes.POPExpiresSoonNoTOClin })
  private fundingAlertType?: string;
  @Prop({ default: 0 })
  private timeRemaining?: number;

  private pOPExpiresSoonNoTOClin = FundingAlertTypes.POPExpiresSoonNoTOClin;
  private popExpiresSoonWithTOClin = FundingAlertTypes.POPExpiresSoonWithTOClin;
  private popExpiresSoonWithLowFunds =
    FundingAlertTypes.POPExpiresSoonWithLowFunds;
  private popLowFunds = FundingAlertTypes.POPLowFunds;
  private popFundsAt100Percent = FundingAlertTypes.POPFundsAt100Percent;
  private popFundsDepleted = FundingAlertTypes.POPFundsDepleted;
  private popExpired = FundingAlertTypes.POPExpired;

  get alertType(): string {
    let alert = "warning";

    if (
      this.fundingAlertType === this.popExpired ||
      this.fundingAlertType === this.popFundsAt100Percent ||
      this.fundingAlertType === this.popFundsDepleted
    ) {
      alert = "error";
    }

    if (this.fundingAlertType === this.popExpiresSoonWithTOClin) {
      alert = "info";
    }

    return alert;
  }
}
</script>
