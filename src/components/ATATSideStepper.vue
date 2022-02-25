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
          :to="step.route"
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
                <span v-if="subStep.completed" class="completed-check">
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
@Component({})
export default class ATATSideStepper extends Vue {
  
  private setCurrentStep(stepNumber: string) {
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
  private percentComplete = 0;
  private stepperData: StepperStep[] = [
    {
      stepNumber: "01",
      completed: true,
      completePercentageWeight: 15,
      menuText: "Acquisition Package Details",
      route: "/",
      subSteps: [
        {
          menuText: "Project Overview",
          route: "/", // should be same as parent route
          completed: true,
          completePercentageWeight: 5,
          subSteps: [
            {
              route: "/" // should be same as parent route
            },
            {
              route: "stepone-1-2"
            }
          ]
        },
        {
          menuText: "Organization",
          route: "stepone-2",
          completed: true,
          completePercentageWeight: 5,
        },
        {
          menuText: "Contact Information",
          route: "stepone-3",
          completed: true,
          completePercentageWeight: 5,
        },
      ]
    },
    {
      stepNumber: "02",
      completed: false,
      completePercentageWeight: 10,
      menuText: "Existing Contract / Background",
      route: "/steptwo",
      subSteps: [
        {
          menuText: "Substep 1",
          route: "/steptwo", // should be same as parent route
          completed: true,
          completePercentageWeight: 1,
        },
        {
          menuText: "Substep 2",
          route: "steptwo-2",
          completed: true,
          completePercentageWeight: 3,
        },
        {
          menuText: "Substep 3",
          route: "steptwo-3",
          completed: false,
          completePercentageWeight: 5,
        },
        {
          menuText: "Substep 4",
          route: "steptwo-4",
          completed: false,
          completePercentageWeight: 1,
        },
      ]
    },
    {
      stepNumber: "03",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Order Type",
      route: "/order-type",
      subSteps: [
        {
          menuText: "Substep A",
          route: "/order-type",
          completed: false,
          completePercentageWeight: 3,
        },
        {
          menuText: "Substep B",
          route: "stepthree-B",
          completed: false,
          completePercentageWeight: 2,
        },
      ]
    },
    {
      stepNumber: "04",
      completed: false,
      completePercentageWeight: 7,
      menuText: "Exception to Fair Opportunity",
      route: "/exception-to-fair-opportunity",
    },
    {
      stepNumber: "05",
      completed: false,
      completePercentageWeight: 7,
      menuText: "Evaluation Criteria",
      route: "/evaluation-criteria",
    },
    {
      stepNumber: "06",
      completed: false,
      completePercentageWeight: 7,
      menuText: "Classification Requirements",
      route: "/classification-requirements",
    },
    {
      stepNumber: "07",
      completed: false,
      completePercentageWeight: 7,
      menuText: "Financial Details",
      route: "/financial-details",
    },
    {
      stepNumber: "08",
      completed: false,
      completePercentageWeight: 7,
      menuText: "Public Disclosure of Information",
      route: "/public-disclosure-of-information",
    },
    {
      stepNumber: "09",
      completed: false,
      completePercentageWeight: 7,
      menuText: "Statutory Compliance",
      route: "/statutory-compliance",
    },
    {
      stepNumber: "10",
      completed: false,
      completePercentageWeight: 7,
      menuText: "Supply Chain Risk Management",
      route: "/supply-chain-risk-management",
    },
    {
      stepNumber: "11",
      completed: false,
      completePercentageWeight: 7,
      menuText: "Government Furnished Equipment",
      route: "/government-furnished-equipment",
    },
    {
      stepNumber: "12",
      completed: false,
      completePercentageWeight: 7,
      menuText: "Section 508",
      route: "/section-508",
    },
    {
      stepNumber: "13",
      completed: false,
      completePercentageWeight: 7,
      menuText: "Review Required Forms",
      route: "/review-required-forms",
    },
  ]
}
</script>
