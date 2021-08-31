<template>
  <v-container fluid class="my-9">
    <v-row>
      <v-col cols="12">
        <h2 class="h2">Let’s wrap up your Portfolio</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <p class="body-lg" v-if="!invalidStepsExist()">
          In this last step, we will review the information that you provided to
          make sure everything is complete and accurate. Once you have verified
          your Portfolio details, we will be able to provision your cloud
          resources.
        </p>
        <!-- Invalid steps found -->
        <p v-else>
          We found a few details that you need to review before we can provision
          your cloud resources. Let's take care of these details now.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!--        <portfolio-validation-summary-->
        <!--          v-if="invalidStepsExist()"-->
        <!--          :items="getValidationResults()"-->
        <!--        />-->
        <summary-stepper></summary-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import SummaryStepper from "./SummaryStepper.vue";
import PortfolioValidationSummary from "./PortfolioValidationSummary.vue";
import { ValidationSummaryItem } from "types/Wizard";

@Component({
  components: {
    SummaryStepper,
    // PortfolioValidationSummary,
  },
})
export default class PortfolioSummary extends Vue {
  public invalidStepsExist(): boolean {
    return false;
  }

  public getValidationResults(): ValidationSummaryItem[] {
    debugger;
    return [
      {
        title: "Portfolio Details (or Portfolio Settings)",
        description: "Ensures your Portfolio is set up correctly",
        name: "createPortfolio",
      },
      {
        title: "Funding Details",
        description: "Ensures you have Task Orders to fund your Portfolio",
        name: "",
      },
    ];
  }
}
</script>
