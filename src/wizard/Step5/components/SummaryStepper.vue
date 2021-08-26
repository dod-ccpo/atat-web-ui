<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-stepper
          :flat="true"
          width="100%"
          class="summary-stepper"
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
            >
              <h3 class="h3">{{ step.title }}</h3>
              <v-divider :key="'divider_' + index"></v-divider>
            </v-stepper-step>
            <v-stepper-content :step="index + 1" :key="'step_' + index">
              <summary-card
                v-if="step.type === 'summaryCard'"
                :title="step.data.title"
                :description="step.data.description"
                :items="step.data.items"
              ></summary-card>
            </v-stepper-content>
          </template>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import SummaryCard from "./SummaryCard.vue";

interface SummaryStep {
  step: number;
  title: string;
  type?: string;
  data?: Record<string, unknown>;
}

@Component({
  components: {
    summaryCard: SummaryCard,
  },
})
export default class SummaryStepper extends Vue {
  @PropSync("stepNumber", { default: 1 }) private _stepNumber!: number;
  private currentStepNumber = this._stepNumber;
  public stepperControl: SummaryStep[] = [
    {
      step: 1,
      title: "Portfolio Details",
      type: "summaryCard",
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
    },
  ];
}
</script>

<style lang="scss" scoped>
// .summary-stepper {
//   .v-stepper__wrapper {
//     transition: none !important;
//   }

//   .v-stepper__step--editable:hover {
//     color: inherit;
//     border: inherit;
//     background: inherit;
//   }
// }
</style>
