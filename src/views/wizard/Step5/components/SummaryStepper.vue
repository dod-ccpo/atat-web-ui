<template>
  <v-stepper
    :flat="true"
    class="summary-stepper width-100 bg-transparent"
    v-model="_stepNumber"
    vertical
    non-linear
  >
    <template v-for="(step, index) in stepperControl">
      <v-stepper-step
        editable
        :id="'summary_step_0' + (index + 1)"
        :step="index + 1"
        :key="'stepper_' + index"
        :error-icon="'  '"
        :edit-icon="'  '"
        :complete-icon="'  '"
      >
        <a
          tabindex="0"
          role="button"
          class="h2 mb-0 step-description black--text no-text-decoration"
          @keypress.enter="stepperClicked('summary_step_0' + (index + 1))"
          @keypress.space="stepperClicked('summary_step_0' + (index + 1))"
          :aria-label="'Expand ' + step.title + ' summary'"
        >
          {{ step.title }}
        </a>
        <v-divider :key="'divider_' + index"></v-divider>
      </v-stepper-step>
      <v-stepper-content
        :step="index + 1"
        :key="'step_' + index"
        :class="[index === 3 ? 'py-0' : 'pt-1']"
      >
        <portfolio-summary-card
          v-if="step.type === 'portfolio'"
          :portfolio="portfolio"
          editPlace="addportfolio"
        ></portfolio-summary-card>
        <funding-summary-card
          v-if="step.type === 'funding'"
          :task-orders="taskOrders"
        ></funding-summary-card>
        <applications-environments-summary-card
          v-if="step.type === 'applicationEnvironments'"
          :application-data="applications"
        ></applications-environments-summary-card>
        <team-member-summary-card
          v-if="step.type === 'teamMembers'"
          :application-data="applications"
          editPlace="addteammembers"
        ></team-member-summary-card>
      </v-stepper-content>
    </template>
  </v-stepper>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Prop } from "vue-property-decorator";
import PortfolioSummaryCard from "./PortfolioSummaryCard.vue";
import FundingSummaryCard from "@/views/wizard/Step5/components/FundingSummaryCard.vue";
import { SummaryStep, TaskOrderModel } from "types/Wizard";
import TeamMemberSummaryCard from "@/views/wizard/Step5/components/TeamMemberSummaryCard.vue";
import { ApplicationModel, Portfolio } from "../../../../../types/Portfolios";
import ApplicationsEnvironmentsSummaryCard from "@/views/wizard/Step5/components/ApplicationsEnvironmentsSummaryCard.vue";

@Component({
  components: {
    PortfolioSummaryCard,
    FundingSummaryCard,
    TeamMemberSummaryCard,
    ApplicationsEnvironmentsSummaryCard,
  },
})
export default class SummaryStepper extends Vue {
  @Prop({ default: () => null })
  private portfolio!: Portfolio;
  @Prop({ default: "TaskOrders" })
  private taskOrders!: TaskOrderModel[];
  @Prop({ default: "Applications" })
  private applications!: ApplicationModel[];
  @PropSync("stepNumber", { default: 1 })
  private _stepNumber!: number;
  private currentStepNumber = this._stepNumber;

  // keyboard navigation
  // enables user to tab to stepper label and press enter/space to click stepper
  public stepperClicked(stepperId: string): void {
    document.getElementById(stepperId)?.click();
  }
  public stepperControl: SummaryStep[] = [
    {
      step: 1,
      title: "Portfolio Details",
      type: "portfolio",
    },
    {
      step: 2,
      title: "Funding Details",
      type: "funding",
    },
    {
      step: 3,
      title: "Applications and Environments",
      type: "applicationEnvironments",
    },
    {
      step: 4,
      title: "Team Members",
      type: "teamMembers",
    },
  ];
}
</script>
