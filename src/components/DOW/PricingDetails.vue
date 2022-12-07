<template>
  <section id="PricingDetails">
    <ATATRadioGroup 
      id="CurrentPaymentArrangement"
      legend="Current payment arrangement"
      tooltipText="<strong>Reserved/pre-paid/up-front instances</strong> allow you to save on 
      usage costs for a fixed term.  <br><br><strong>Pay-as-you-go instances</strong> let you pay 
	  for compute capacity by the hour or second with no long-term commitments."
      :items="paymentArrangements"
      :value.sync="_pricingDetails.currentPaymentArrangement"
      :rules="[
        $validators.required('Select a pricing model.'),
      ]"
    />

    <ATATDatePicker
      id="ExpirationDate"
      v-if="_pricingDetails.currentPaymentArrangement === 'PREPAID'"
      class="mt-8"
      :rules="[
        $validators.required(
          'Enter the expiration date for your reservation period.'
        ),
        $validators.isDateValid('Please enter a valid date.'),
      ]"
      :value.sync="_pricingDetails.pricingPeriodExpirationDate"
      label="Contract/Order expiration date"
      placeHolder="MM/DD/YYYY"
      tooltipText="Enter the date that your current reservation period, pre-paid 
        period, or up-front period will end."
    />

  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";

import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import { CurrEnvInstancePricingDetails, RadioButton } from "types/Global";

@Component({
  components: {
    ATATDatePicker,
    ATATRadioGroup,
  }
})

export default class PricingDetails extends Vue {
  @PropSync("pricingDetails") public _pricingDetails!: CurrEnvInstancePricingDetails;

  public paymentArrangements: RadioButton[] = [
    {
      id: "Reserved",
      label: "Reserved/Pre-paid/Up-front",
      value: "PREPAID",
    },
    {
      id: "PayAsYouGo",
      label: "Pay-as-you-go",
      value: "PAY_AS_YOU_GO",
    },
  ];

  @Watch("_pricingDetails.currentPaymentArrangement", {deep: true})
  public currentPmtArrangementChange(newVal: string): void {
    if (newVal === "PAY_AS_YOU_GO") {
      this._pricingDetails.pricingPeriodExpirationDate = "";
    }
  }
}

</script>
