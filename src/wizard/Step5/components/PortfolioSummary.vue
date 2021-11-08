<template>
  <v-container fluid>
    <v-row class="body-lg">
      <v-col class="content-max-width">
        <h1 tabindex="-1">Let’s wrap up your Portfolio</h1>
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
    return this.$store.state.erroredSteps.length > 0;
  }

  public getValidationResults(): ValidationSummaryItem[] {
    return [
      {
        id: 1,
        title: "Portfolio Details (or Portfolio Settings)",
        description: "Ensures your Portfolio is set up correctly",
        name: "addportfolio",
      },
      {
        id: 2,
        title: "Funding Details",
        description: "Ensures you have Task Orders to fund your Portfolio",
        name: "addfunding",
      },
      {
        id: 3,
        title: "Applications and Environments",
        description: "Ensures your cloud workspaces are correct",
        name: "addapplication",
      },
      {
        id: 4,
        title: "Team Members",
        description:
          "Ensures your team can access their workspaces within the cloud console",
        name: "addteammembers",
      },
    ].filter((item) => this.$store.state.erroredSteps.indexOf(item.id) > -1);
  }

  created(): void {
    this.portfolio = this.$store.getters.getPortfolio;
    this.taskOrders = this.$store.getters.getTaskOrders;
  }

  public mounted(): void {
    this.$store.state.portfolioSteps.forEach((step: any) => {
      if (!step.valid && step.step != 5) {
        this.$store.dispatch("setErroredStep", [step.step, true]);
      }
    });
  }
}
</script>
