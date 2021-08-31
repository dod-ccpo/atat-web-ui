<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-stepper
          :flat="true"
          class="summary-stepper width-100"
          v-model="_stepNumber"
          vertical
          non-linear
        >
          <template v-for="(step, index) in stepperControl">
            <v-stepper-step
              editable
              :id="'step_0' + (index + 1)"
              :step="index + 1"
              :key="'stepper_' + index"
              :error-icon="'  '"
              :edit-icon="'  '"
              :complete-icon="'  '"
              :ref="'step' + index + 1"
            >
              <a
                href="##"
                class="h3 step-description black--text no-text-decoration"
                @click="stepperClicked('step0' + (index + 1))"
              >
                {{ step.title }}
              </a>
              <v-divider :key="'divider_' + index"></v-divider>
            </v-stepper-step>
            <v-stepper-content :step="index + 1" :key="'step_' + index">
              <portfolio-summary-card
                v-if="step.type === 'portfolio'"
                :portfolio="portfolio"
              ></portfolio-summary-card>
              <team-member-summary-card
                :application="application"
                v-if="step.type === 'teamMembers'"
              />
            </v-stepper-content>
          </template>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Application, ApplicationMember, Portfolio } from "types/Portfolios";
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import PortfolioSummaryCard from "./PortfolioSummaryCard.vue";
import { SummaryStep } from "types/Wizard";
import TeamMemberSummaryCard from "./TeamMemberSummaryCard.vue";

// interface SummaryStep {
//   step: number;
//   title: string;
//   type?: string;
//   data?: Record<string, unknown>;
// }

@Component({
  components: {
    PortfolioSummaryCard,
    TeamMemberSummaryCard,
  },
})
export default class SummaryStepper extends Vue {
  @PropSync("stepNumber", { default: 1 }) private _stepNumber!: number;
  @Prop({ default: "Portfolio" })
  private portfolio!: Portfolio;
  private currentStepNumber = this._stepNumber;
  $refs!: {
    step01: Vue & { $el: HTMLElement };
    step02: Vue & { $el: HTMLElement };
    step03: Vue & { $el: HTMLElement };
    step04: Vue & { $el: HTMLElement };
  };

  // keyboard navigation
  // enables user to tab to stepper label and click stepper
  public stepperClicked(stepper: string): void {
    switch (stepper) {
      case "step01":
        this.$refs.step01.$el.click();
        break;
      case "step02":
        this.$refs.step02.$el.click();
        break;
      case "step03":
        this.$refs.step03.$el.click();
        break;
      case "step04":
        this.$refs.step04.$el.click();
        break;
    }
  }

  public stepperControl: SummaryStep[] = [
    {
      step: 1,
      title: "Portfolio Details",
      type: "portfolio",
      data: {
        title: "Defense Logistics Agency",
        description:
          "This portfolio will be used to build, test and manage the native applications for the defense logistics agency.",
        items: [
          {
            prefix: "Funded by",
            value: "Air Force, Marine Corps",
          },
          {
            prefix: "Deploy to",
            value: "CSP 1",
          },
        ],
      },
    },
    {
      step: 2,
      title: "Funding Details",
    },
    {
      step: 3,
      title: "Applications and Environments",
    },
    {
      step: 4,
      title: "Team Members",
      type: "teamMembers",
    },
  ];

  get application(): Application | undefined {
    return this.portfolio.applications[0];
  }
}
</script>
