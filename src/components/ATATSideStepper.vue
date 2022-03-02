<template>
  <v-navigation-drawer
    app
    permanent
    class="global-side-nav-bar"
    width="320"
  >
    <div class="_stepper-progress-bar">
      <strong class="text-primary pl-1">{{ percentComplete }}%</strong>&nbsp; 
      <span class="text-base">COMPLETE</span>
      <v-progress-linear 
        :value="percentComplete"
        height="12"
        rounded
        color="#544496"
      ></v-progress-linear>
    </div>

    <v-list>
      <v-list-item 
        v-for="(step, stepIndex) in stepperData"
        :key="stepIndex"
        :class="{ 'active-step': step.stepNumber === activeStep}"
      >
        <router-link 
          :id="'Step_' + getIdText(step.menuText)"
          :to="{ name: `${step.name}`}"
          :class="{'step-complete': step.completed}"
          class="step"
          @click.native="setCurrentStep(step.stepNumber)"
        >
          <span class="step-circle">
            {{ step.stepNumber }}
            <span v-if="step.completed" class="completed-check">
              <span class="d-sr-only">Completed</span>
              <v-icon>check_circle</v-icon>
            </span>
          </span>
          <span class="step-text">
            {{ step.menuText }}
          </span>
        </router-link>

        <v-expand-transition v-if="hasSubSteps(step)">
          <span v-show="activeStep === step.stepNumber">
            <router-link 
              v-for="(subStep, subStepIndex) in step.subSteps"
              :key="'step' + step.stepNumber + '_substep' + subStepIndex"
              :id="'SubStep_' + getIdText(subStep.menuText)"
              :to="subStep.route"
              :class="{'step-complete': subStep.completed}"
              class="substep"
            >
              <span class="substep-circle">
                <span 
                  v-if="subStep.completed" 
                  class="completed-check"
                  :data-substep-complete-percentage="subStep.completePercentageWeight"
                >
                  <span class="d-sr-only">Completed</span>
                  <v-icon>check_circle</v-icon>
                </span>
              </span>
              <span class="step-text">
                {{ subStep.menuText }}
              </span>
            </router-link>
          </span>
        </v-expand-transition>

      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { StepperStep } from "../../types/Global";
import {buildStepperData} from "../router/stepper";

@Component({})
export default class ATATSideStepper extends Vue {
  
  public setCurrentStep(stepNumber: string): void {
    this.activeStep = stepNumber;
  }

  private hasSubSteps(step: StepperStep) {
    return (Object.prototype.hasOwnProperty.call(step, "subSteps") && step.subSteps?.length)
  }

  private getIdText(string: string) {
    return string.replace(/[^A-Z0-9]/ig, "");
  }
  private calculatePercentComplete() {
    this.stepperData.forEach((step) => {
      if (step.completed && step.completePercentageWeight) {
        this.percentComplete += step.completePercentageWeight;
      } else if (this.hasSubSteps(step)) {
        step.subSteps?.forEach((subStep) => {
          if (subStep.completed && subStep.completePercentageWeight) {
            this.percentComplete += subStep.completePercentageWeight;
          }
        });
      }
    });
    this.percentComplete = Math.round(this.percentComplete);
  }

  private mounted(): void {
    this.calculatePercentComplete();
  }

  // data
  private activeStep = "01";
  private stepperData: StepperStep[] = buildStepperData();
  private percentComplete = 0;
 
}
</script>
