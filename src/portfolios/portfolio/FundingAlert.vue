<template>
  <ATATAlert :type="alertType">
    <template v-slot:content>

      <div id="PoPorFundingAlert" class="mb-0">
        <h3 v-if="showAlertHeading">
          {{ getAlertHeading }}
        </h3>
        <p v-html="getAlertText" />
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
  @Prop({}) private fundingAlertType?: string;
  @Prop({ default: 0 }) private timeRemaining?: number;

  public get isErrorAlert(): boolean {
    return this.fundsAt100Percent || this.fundsDepleted || this.popExpired;
  }
  public get showAlertHeading(): boolean {
    return this.alertHeading !== "" && this.isErrorAlert;
  }
  public get alertHeading(): string {
    if (this.popExpired) {
      return "This portfolio’s period of performance has expired."
    } else if (this.fundsAt100Percent || this.fundsDepleted) {
      return "This portfolio is out of funds."
    }
    return "";
  }

  get alertType(): string {
    if (this.expiresSoonWithCLIN) {
      return "info"
    } else if (this.expiresSoonNoCLIN || this.expiresSoonLowFunds || this.lowFunds) {
      return "warning";
    }
    return "error"
  }

  // blue
  public get expiresSoonWithCLIN(): boolean {
    return this.fundingAlertType === FundingAlertTypes.POPExpiresSoonWithTOClin;
  }
  // yellow
  public get expiresSoonNoCLIN(): boolean {
    return this.fundingAlertType === FundingAlertTypes.POPExpiresSoonNoTOClin;
  }
  public get expiresSoonLowFunds(): boolean {
    return this.fundingAlertType === FundingAlertTypes.POPExpiresSoonWithLowFunds;
  }
  public get lowFunds(): boolean {
    return this.fundingAlertType === FundingAlertTypes.POPLowFunds;
  }
  // red
  public get fundsAt100Percent(): boolean {
    return this.fundingAlertType === FundingAlertTypes.POPFundsAt100Percent;
  }
  public get fundsDepleted(): boolean {
    return this.fundingAlertType === FundingAlertTypes.POPFundsDepleted;
  }
  public get popExpired(): boolean {
    return this.fundingAlertType === FundingAlertTypes.POPExpired;
  }

  public get getAlertText(): string {
    let str = "";
    if (this.expiresSoonWithCLIN || this.expiresSoonNoCLIN) {
      str = `The current period of performance is <strong>expiring in ${this.timeRemaining}
        days</strong>`;
      str += this.expiresSoonWithCLIN
        ? `. You have obligated funds in an upcoming CLIN, so there will be no gap in
          funding for this portfolio.`
        : ", and there are no obligated funds in an upcoming period of performance.";
    } else if (this.expiresSoonLowFunds || this.lowFunds) {
      str = "This portfolio is almost out of funds";
      str += this.lowFunds
        ? `. Review your task order details to ensure your portfolio is funded until 
          the end of the period of performance.`
        : ` and will be <strong>expiring in ${this.timeRemaining} days.</strong>`;
    } else if (this.fundsAt100Percent || this.lowFunds) {
      str = ``;
    } else if (this.popExpired) {
      str = ``;
    }
    return str;
  }

}
</script>
