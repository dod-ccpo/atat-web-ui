<template>
    <ATATAlert
      :type="alertType"
      class="mt-5"
    >
      <template v-slot:content>
        <div class="mb-0" v-if="fundingAlertType === pOPExpiresSoonNoTOClin">
         The current period of performance is <strong>expiring in {{timeRemaining}} days. </strong> 
         <a role="button">Modify your existing task order</a> to extend the current PoP 
         or to exercise an option period. You can also <a role="button">add a new task order</a> 
         to continue working with this portfolio.
        </div>
         <div class="mb-0" v-if="fundingAlertType === popExpiresSoonWithTOClin">
         The current period of performance is <strong>expiring in {{timeRemaining}} days.</strong> 
         You have obligated funds in an upcoming CLIN, so there will be no gap in 
         funding for this portfolio.
        </div>
         <div class="mb-0" v-if="fundingAlertType === popExpiresSoonWithLowFunds">
         This portoflio is almost out of funds and is <strong>expiring in 
          {{timeRemaining}} days. </strong>  
         <a role="button">Modify your existing task order</a> or 
         <a role="button">add a new task order</a> 
         to ensure there are no gaps in funding for this portfolio.
        </div>
         <div class="mb-0" v-if="fundingAlertType === popExpired">
         <div class="h3">This portfolio is out of funds.</div>
         <p><a role="button">Exercise an option on your existing task order</a> or 
         <a role="button">add a new task order</a> to continue funding this portfolio. 
         Funding Tracker details below reflect the status of your portfolio at the end 
         of the most recent PoP.</p>
        </div>
      </template>
    </ATATAlert>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";

export const FundingAlertTypes = {
  POPExpiresSoonNoTOClin: "POPExpiresSoonDaysNoTOClin",
  POPExpiresSoonWithTOClin: "POPExpiresSoonWithTOClin",
  POPExpiresSoonWithLowFunds: "POPExpiresSoonWithLowFunds",
  POPExpired:"POPExpired"
}

@Component({
  components: {
    ATATAlert,
  }
})
export default class FundingAlert extends Vue { 
  @Prop({default: FundingAlertTypes.POPExpiresSoonNoTOClin}) 
  private fundingAlertType?: string;
  @Prop({default: 0}) 
  private timeRemaining?: number;

  private pOPExpiresSoonNoTOClin = FundingAlertTypes.POPExpiresSoonNoTOClin;
  private popExpiresSoonWithTOClin = FundingAlertTypes.POPExpiresSoonWithTOClin;
  private popExpiresSoonWithLowFunds = FundingAlertTypes.POPExpiresSoonWithLowFunds;
  private popExpired = FundingAlertTypes.POPExpired;

  get alertType():string {
    let alert = "warning";

    if(this.fundingAlertType === this.popExpired){
      alert = "error";
    }

    if(this.fundingAlertType === this.popExpiresSoonWithTOClin){
      alert = "info";
    }

    return alert;
  }

}
</script>