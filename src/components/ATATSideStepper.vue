<template>
  <v-navigation-drawer
    app
    permanent
    class="global-side-nav-bar"
    width="320"
  >
    <v-list>
      <v-list-item 
        v-for="(step, index) in stepperData"
        :key="index"
        :class="{ 'active-step': step.stepNumber === activeStep}"
      >
        <router-link 
          :id="'Step'+ step.stepNumber"
          :to="step.route"
          :class="{'step-complete': step.completed}"
          class="step"
          @click.native="setCurrentStep(step.stepNumber)"
        >
          <span class="step-circle">{{ step.stepNumber }}</span>
          <span class="step-text">
            {{ step.menuText }}
          </span>
        </router-link>

        <v-expand-transition v-if="hasSubSteps(step)">
          <span v-show="activeStep === step.stepNumber">
            <router-link 
              v-for="(subStep, index) in step.subSteps"
              :key="'substep' + index"
              :id="'Substep' + index"
              :to="subStep.route"
              :class="{'step-complete': subStep.completed}"
              class="substep"
            >
              <span class="substep-circle"></span>
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

  // data
  private activeStep = "01";
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
        },
        {
          menuText: "Contact Information",
          route: "stepone-3",
          completed: true,
        },
      ]
    },
    {
      stepNumber: "02",
      completed: false,
      completePercentageWeight: 4,
      menuText: "Existing Contract / Background",
      route: "/steptwo",
      subSteps: [
        {
          menuText: "Substep 1",
          route: "/steptwo",
          completed: true,
        },
        {
          menuText: "Substep 2",
          route: "steptwo-2",
          completed: true,
        },
        {
          menuText: "Substep 3",
          route: "steptwo-3",
          completed: false,
        },
        {
          menuText: "Substep 4",
          route: "steptwo-4",
          completed: false,
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
        },
        {
          menuText: "Substep B",
          route: "stepthree-B",
          completed: false,
        },
      ]
    },
    {
      stepNumber: "04",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Exception to Fair Opportunity",
      route: "/exception-to-fair-opportunity",
    },
    {
      stepNumber: "05",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Evaluation Criteria",
      route: "/evaluation-criteria",
    },
    {
      stepNumber: "06",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Classification Requirements",
      route: "/classification-requirements",
    },
    {
      stepNumber: "07",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Financial Details",
      route: "/financial-details",
    },
    {
      stepNumber: "08",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Public Disclosure of Information",
      route: "/public-disclosure-of-information",
    },
    {
      stepNumber: "09",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Statutory Compliance",
      route: "/statutory-compliance",
    },
    {
      stepNumber: "10",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Supply Chain Risk Management",
      route: "/supply-chain-risk-management",
    },
    {
      stepNumber: "11",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Government Furnished Equipment",
      route: "/government-furnished-equipment",
    },
    {
      stepNumber: "12",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Section 508",
      route: "/section-508",
    },
    {
      stepNumber: "13",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Review Required Forms",
      route: "/review-required-forms",
    },
  ]
}
</script>
