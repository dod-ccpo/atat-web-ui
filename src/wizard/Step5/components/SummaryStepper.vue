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
            <v-stepper-content :step="index + 1" :key="'stepper_' + index">
              content here
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
import {
  ATATSummaryCardItem,
  ATATSummaryCards,
} from "types/Wizard";

interface SummaryStep {
  step: number;
  title: string;
}

@Component({})
export default class SummaryStepper extends Vue {
  @PropSync("stepNumber", { default: 1 }) private _stepNumber!: number;
  private currentStepNumber = this._stepNumber;
  public stepperControl: SummaryStep[] = [
    {
      step: 1,
      title: "Portfolio Details",
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
