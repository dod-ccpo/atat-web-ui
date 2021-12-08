<template>
  <v-container fluid>
    <v-row class="body-lg">
      <v-col class="content-max-width pb-0">
        <h1 tabindex="-1">Let’s wrap up your portfolio</h1>
        <p class="body-lg" v-if="!invalidStepsExist()">
          In this last step, we will review the information provided to make
          sure everything is complete and accurate. Once verified, we will
          provision your cloud resources.
        </p>
        <!-- Invalid steps found -->
        <p v-else>
          We found a few details that you need to review before we can provision
          your cloud resources. Let’s take care of these details now.
        </p>
      </v-col>
    </v-row>
    <v-row class="my-0 review-stepper-wrapper">
      <v-col>
        <portfolio-validation-summary
          v-if="invalidStepsExist()"
          :items="getValidationResults()"
        />
        <summary-stepper
          v-if="!invalidStepsExist()"
          :portfolio="portfolio"
          :taskOrders="taskOrders"
          :applications="applications"
        ></summary-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ApplicationData from "@/mixins/ApplicationModuleData";

import SummaryStepper from "./SummaryStepper.vue";
import PortfolioValidationSummary from "./PortfolioValidationSummary.vue";
import { ApplicationModel, PortFolioDraftDTO } from "types/Portfolios";
import { ValidationSummaryItem, TaskOrderModel } from "types/Wizard";

@Component({
  components: {
    SummaryStepper,
    PortfolioValidationSummary,
  },
})
export default class PortfolioSummary extends mixins(ApplicationData) {
  public portfolio!: PortFolioDraftDTO;
  public taskOrders!: TaskOrderModel[];
  public invalidStepsExist(): boolean {
    return this.$store.state.wizard.erroredSteps.length > 0;
  }

  public getValidationResults(): ValidationSummaryItem[] {
    return [
      {
        id: 1,
        title: "Portfolio Details",
        description: "Ensures your Portfolio is set up correctly",
        name: "addportfolio",
      },
      {
        id: 2,
        title: "Funding Details",
        description: "Ensures you have Task Orders to fund your Portfolio",
        name: "fundingsummary",
      },
      {
        id: 3,
        title: "Applications and Environments",
        description: "Ensures your cloud workspaces are correct",
        name: "applicationsummary",
      },
      {
        id: 4,
        title: "Team Members",
        description:
          "Ensures your team can access their workspaces within the cloud console",
        name: "addteammembers",
      },
    ].filter(
      (item) => this.$store.state.wizard.erroredSteps.indexOf(item.id) > -1
    );
  }

  created(): void {
    this.portfolio = this.$store.getters["wizard/getPortfolio"];
    this.taskOrders = this.$store.getters["taskOrders/taskOrders"];
    this.$store.dispatch("wizard/setReturnToReview", false);
    this.$store.dispatch("wizard/setArrivedFromStep5", false);
  }
  public mounted(): void {
    const stepNumbers: number[] = [1, 2, 3, 4];
    stepNumbers.forEach((stepNumber) => {
      const isTouched = this.$store.getters["wizard/isStepTouched"](stepNumber);
      if (!isTouched) {
        this.$store.dispatch("wizard/updateStepModelValidity",
          {
            stepNumber: stepNumber,
            valid: false
          }
        );
      }
    });

  }
}
</script>
