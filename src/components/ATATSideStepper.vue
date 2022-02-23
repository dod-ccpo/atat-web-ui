<template>
  <v-navigation-drawer
    app
    permanent
    class="global-side-nav-bar"
    width="350"
  >
    <v-list>
      <v-list-item 
        v-for="(step, index) in stepperData"
        :key="index"
      >
        <router-link 
          :id="'Step'+ step.stepNumber"
          :to="step.route"
          :class="{'step-complete': step.completed}"
        >
          <span class="step-circle">{{ step.stepNumber }}</span>
          <span class="step-text">
            {{ step.menuText }}
          </span>
        </router-link>
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
  
  // data
  private stepperData: StepperStep[] = [
    {
      stepNumber: "01",
      completed: true,
      completePercentageWeight: 15,
      menuText: "Acquisition Package Details",
      route: "/",
      subSteps: [
        {
          menuText: "Project Overview ",
          route: "stepone-1-1",
          completed: true,
          // subSteps: [
          //   {
          //     route: "stepone-1-1"
          //   },
          //   {
          //     route: "stepone-1-2"
          //   }
          // ]
        },
        {
          menuText: "Organization",
          route: "stepone-2",
          completed: false,
        },
        {
          menuText: "Contact Information",
          route: "stepone-3",
          completed: false,
        },
      ]
    },
    {
      stepNumber: "02",
      completed: false,
      completePercentageWeight: 4,
      menuText: "Existing Contract / Background",
      route: "/steptwo",
    },
    {
      stepNumber: "03",
      completed: false,
      completePercentageWeight: 5,
      menuText: "Order Type",
      route: "/order-type",
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
