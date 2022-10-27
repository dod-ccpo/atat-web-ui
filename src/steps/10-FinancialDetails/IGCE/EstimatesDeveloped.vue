<template>
  <v-container class="container-max-width" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Next, tell us about how your estimates were developed
        </h1>
        <div class="copy-max-width">
          <p id="IntroP" class="mb-7">
            Contracting officers rely on the IGCE to assist in the determination 
            of the acquisition strategy, as well as an estimated cost for the 
            proposed effort. Along with your cost breakdown, the contracting 
            office needs to clearly understand the methodology that you used to 
            determine your price estimates. 
          </p>

          <ATATCheckboxGroup
            id="UsedForEstimatingCheckboxes"
            groupLabel="What information and/or tools were used to generate your estimated prices?"
            class="copy-max-width mb-10"
            :value.sync="selectedTools"
            :hasOtherValue="true"
            otherValue="Other"
            :otherValueEntered.sync="otherValueEntered"
            otherValueRequiredMessage="Please enter your other type of information or tool."
            :items="toolsOptions"
            name="checkboxes"
            :card="false"
            :rules="[
              $validators.required(`Please select at least one type of information
                or tool used to estimate your costs.`)
            ]"
            otherEntryType="textfield"
          />

          <ATATTextArea
            id="HowEstimateMade"
            label="How was your cost estimate made?"
            class="max-width-740 mb-7"
            rows="7"
            :rules="[
              $validators.required('Please describe how your cost estimate was made.'),
              $validators.maxLength(1000, 
                'Please limit your description to 1,000 characters or less.')
            ]"
            helpText="Briefly explain the rationale used to formulate your projected 
              prices, and identify any and all assumptions used (e.g., schedule or 
              budget constraints, technology expectations, inflation, travel costs, 
              etc.)."
            :value.sync="howEstimateMade"
            maxChars="1000"
          />

          <ATATRadioGroup
            id="PriceComparison"
            class="mb-10"
            legend="Thinking of your previous contract for this requirement, how 
              did the cost estimate compare with the prices that you actually paid 
              for services and/or support?" 
            :value.sync="selectedPriceComparison"
            :items="priceComparisonOptions"
            name="price-comparison"
            :rules="[
              $validators.required(`Please select the option that best describes
                your previous cost estimates.`)
            ]"
          />
          
          <ATATTextField
            v-if="showPercentage"
            ref="percentOverUnder"
            :label="percentageLabel"
            id="PricePercentage"
            suffix="%"
            width="150"
            :value.sync="percentOverUnder"
            :rules="percentageRules"
            type="number"
          />

        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { RadioButton, Checkbox } from "../../../../types/Global";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATTextArea,
    ATATTextField,
  }
})

export default class EstimatesDeveloped extends Vue {
  $refs!: {
    percentOverUnder: Vue & {
      resetValidation(): void
    };
  };

  public selectedPriceComparison = "";
  public howEstimateMade = "";
  public otherValueEntered = "";
  public percentOverUnder = "";
  
  public selectedTools: string[] = [];
  private toolsOptions: Checkbox[] = [
    {
      id: "AWSCalc",
      label: "AWS pricing calculator",
      value: "AWSCalc",
    },
    {
      id: "GoogleCalc",
      label: "Google Cloud pricing calculator",
      value: "GoogleCalc",
    },
    {
      id: "AzureCalc",
      label: "Microsoft Azure pricing calculator",
      value: "AzureCalc",
    },
    {
      id: "OracleCalc",
      label: "Oracle Cloud pricing calculator",
      value: "OracleCalc",
    },
    {
      id: "VendorInvoices",
      label: "Vendor invoices from a previous requirement",
      value: "VendorInvoices",
    },
    {
      id: "Other",
      label: "Other",
      value: "Other",
    },
  ];

  public priceComparisonOptions: RadioButton[] = [
    {
      id: "More",
      label: "The previous cost estimate was <strong>more than</strong> the actual prices paid.",
      value: "More",
    },
    {
      id: "Less",
      label: "The previous cost estimate was <strong>less than</strong> the actual prices paid.",
      value: "Less",
    },
    {
      id: "Same",
      label: `The previous cost estimate was approximately the <strong>same</strong> 
        as the actual prices paid.`,
      value: "Same",
    },
  ];

  public get percentageLabel(): string {
    const label = "By approximately what percentage was your previous IGCE total price <strong>" + 
      this.overUnderStr + "</strong>?";
    return label;
  } 

  public get showPercentage(): boolean {
    return this.selectedPriceComparison === "More" || this.selectedPriceComparison === "Less";
  }

  public get percentRequiredMessage(): string {
    return  "Please enter the approximate percentage that your previous total was " 
      +  this.overUnderStr + ".";
  } 

  public get overUnderStr(): string {
    return this.selectedPriceComparison === "More" ? "overestimated" : "underestimated";
  }

  public percentageRules: unknown[] = []

  @Watch("selectedPriceComparison")
  public async selectedPriceComparisonChanged(): Promise<void> {
    this.$nextTick(()=> {
      this.$refs.percentOverUnder?.resetValidation();
      this.percentageRules = [this.$validators.required(this.percentRequiredMessage)]
    })
  }

}
</script>
