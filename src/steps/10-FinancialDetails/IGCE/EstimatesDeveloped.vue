<template>
  <v-container class="container-max-width" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Now tell us about how your estimates were developed
        </h1>
        <div class="copy-max-width">
          <p id="IntroP" class="mb-7">
            Along with your cost breakdown, the contracting 
            office needs to clearly understand the methodology that you used to 
            determine your price estimates. 
          </p>

          <ATATCheckboxGroup
            id="UsedForEstimatingCheckboxes"
            groupLabel="What information and/or tools were used to generate your estimated prices?"
            class="copy-max-width mb-10"
            :value.sync="selectedTools"
            :hasOtherValue="true"
            otherValue="OTHER"
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
            label="How was your cost estimated?"
            class="max-width-740 mb-7"
            rows="7"
            :rules="[
              $validators.required('Please describe how your cost was estimated.'),
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
              does the cost estimate compare with the prices that you actually paid 
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
/* eslint-disable camelcase */
import Vue from "vue";
import {Component, Mixins, Watch} from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import {RadioButton, Checkbox} from "../../../../types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";
import IGCEStore from "@/store/IGCE";
import {RequirementsCostEstimateDTO} from "@/api/models";
import {hasChanges} from "@/helpers";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATTextArea,
    ATATTextField,
  }
})

export default class EstimatesDeveloped extends Mixins(SaveOnLeave) {
  $refs!: {
    percentOverUnder: Vue & {
      resetValidation(): void
    };
  };

  public selectedPriceComparison: "" | "MORE_THAN" | "LESS_THAN" | "SAME" = "";
  public howEstimateMade = "";
  public otherValueEntered = "";
  public percentOverUnder: number | null = null;
  public selectedTools: string[] = [];
  public savedData: RequirementsCostEstimateDTO["how_estimates_developed"] = {
    tools_used: "",
    other_tools_used: "",
    cost_estimate_description: "",
    previous_cost_estimate_comparison: {
      options: "",
      percentage: null
    }
  };
  private toolsOptions: Checkbox[] = [
    {
      id: "AWSCalc",
      label: "AWS pricing calculator",
      value: "AWS",
    },
    {
      id: "GoogleCalc",
      label: "Google Cloud pricing calculator",
      value: "GOOGLE_CLOUD",
    },
    {
      id: "AzureCalc",
      label: "Microsoft Azure pricing calculator",
      value: "MICROSOFT_AZURE",
    },
    {
      id: "OracleCalc",
      label: "Oracle Cloud pricing calculator",
      value: "ORACLE_CLOUD",
    },
    {
      id: "VendorInvoices",
      label: "Prices previously paid on a same or similar contract",
      value: "PREVIOUSLY_PAID_PRICES",
    },
    {
      id: "Other",
      label: "Other",
      value: "OTHER",
    },
  ];

  public priceComparisonOptions: RadioButton[] = [
    {
      id: "More",
      label: "The previous cost estimate was <strong>more than</strong> the actual prices paid.",
      value: "MORE_THAN",
    },
    {
      id: "Less",
      label: "The previous cost estimate was <strong>less than</strong> the actual prices paid.",
      value: "LESS_THAN",
    },
    {
      id: "Same",
      label: `The previous cost estimate was approximately the <strong>same</strong> 
        as the actual prices paid.`,
      value: "SAME",
    },
  ];

  public get percentageLabel(): string {
    const label = "By approximately what percentage was your previous IGCE total price <strong>" + 
      this.overUnderStr + "</strong>?";
    return label;
  } 

  public get showPercentage(): boolean {
    return this.selectedPriceComparison === "MORE_THAN"
        || this.selectedPriceComparison === "LESS_THAN";
  }

  public get percentRequiredMessage(): string {
    return  "Please enter the approximate percentage that your previous total was " 
      +  this.overUnderStr + ".";
  } 

  public get overUnderStr(): string {
    return this.selectedPriceComparison === "MORE_THAN" ? "overestimated" : "underestimated";
  }

  public percentageRules: unknown[] = []

  @Watch("selectedPriceComparison")
  public async selectedPriceComparisonChanged(): Promise<void> {
    this.$nextTick(()=> {
      this.$refs.percentOverUnder?.resetValidation();
      this.percentageRules = [this.$validators.required(this.percentRequiredMessage)]
    })
  }

  get currentData(): RequirementsCostEstimateDTO["how_estimates_developed"] {
    return{
      tools_used: this.selectedTools.toString(),
      other_tools_used: this.otherValueEntered,
      cost_estimate_description: this.howEstimateMade,
      previous_cost_estimate_comparison: {
        options: this.selectedPriceComparison,
        percentage: this.percentOverUnder
      }
    }
  };

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  private async loadOnEnter(): Promise<void> {
    const store = await IGCEStore.getRequirementsCostEstimate();
    this.savedData = store.how_estimates_developed;
    this.selectedTools = store.how_estimates_developed.tools_used.split(",");
    this.otherValueEntered = store.how_estimates_developed.other_tools_used;
    this.howEstimateMade = store.how_estimates_developed.cost_estimate_description;
    this.selectedPriceComparison =
        store.how_estimates_developed.previous_cost_estimate_comparison.options;
    this.percentOverUnder =
        store.how_estimates_developed.previous_cost_estimate_comparison.percentage;
  }

  private async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      const store = await IGCEStore.getRequirementsCostEstimate();
      store.how_estimates_developed = this.currentData;
      await IGCEStore.setRequirementsCostEstimate(store);
      await IGCEStore.saveRequirementsCostEstimate();
    }
    return true;
  }

}
</script>
