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
import { Component, Prop,  Vue, toNative } from "vue-facing-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import { FundingAlertTypes } from "@/store/portfolio";

@Component({
  components: {
    ATATAlert,
  },
})
class FundingAlert extends Vue {
  @Prop({}) private fundingAlertType?: string;
  @Prop({ default: 0 }) private timeRemaining?: number;

  public get isErrorAlert(): boolean {
    return this.fundsDelinquent || this.popExpired || this.zeroFundsRemaining;
  }
  public get showAlertHeading(): boolean {
    return this.getAlertHeading !== "" && this.isErrorAlert;
  }
  public get getAlertHeading(): string {
    if (this.popExpired) {
      return "This portfolio’s period of performance has expired."
    } else if (this.fundsDelinquent || this.zeroFundsRemaining) {
      return "This portfolio is out of funds."
    }
    return "";
  }

  get alertType(): string {
    if (this.expiresSoonWithCLIN) {
      return "info"
    } else if(this.zeroFundsRemaining){
      return 'error'
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
  public get fundsDelinquent(): boolean {
    return this.fundingAlertType === FundingAlertTypes.POPFundsDelinquent;
  }
  public get popExpired(): boolean {
    return this.fundingAlertType === FundingAlertTypes.POPExpired;
  }
  public get zeroFundsRemaining(): boolean {
    return this.fundingAlertType === FundingAlertTypes.POPZeroFundsRemaining
  }

  public get getAlertText(): string {
    let str = "";
    const dayOrDays = this.timeRemaining === 1 ? "day" : "days";
    if (this.expiresSoonWithCLIN || this.expiresSoonNoCLIN) {
      str = `The current period of performance is <strong>expiring in ${this.timeRemaining}
        ${dayOrDays}</strong>`;
      str += this.expiresSoonWithCLIN
        ? `. You have obligated funds in an upcoming CLIN, so there will be no gap in
          funding for this portfolio.`
        : ", and there are no obligated funds in an upcoming period of performance.";
    } else if(this.zeroFundsRemaining){
      str = `This portfolio has reached the authorized funding limit. Additional performance without
      additional funding is not authorized under this portfolio and is a potential violation of the
      AntiDeficiency Act. Contact your Task Order Contracting Officer immediately.`;
    } else if (this.expiresSoonLowFunds || this.lowFunds) {
      str = "This portfolio is almost out of funds";
      str += this.lowFunds
        ? `. Review your task order details to ensure your portfolio is funded until 
          the end of the period of performance.`
        : ` and will be <strong>expiring in ${this.timeRemaining} ${dayOrDays}.</strong>`;
    } else if (this.fundsDelinquent) {
      str = `Please ensure your portfolio is funded until the end of the period of performance 
        to avoid potential violation of the Antideficiency Act.`;
    } else if (this.popExpired) {
      str = `Funding Tracker details below reflect the status of your portfolio at 
        the end of the most recent PoP.`;
    }
    return str;
  }

}
export default toNative(FundingAlert)
</script>
