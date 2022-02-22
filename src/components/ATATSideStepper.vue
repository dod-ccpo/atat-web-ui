<template>
  <v-navigation-drawer
    app
    permanent
    class="global-side-nav-bar"
    width="350"
  >
    <v-list>
      <v-list-item>
        <router-link id="Step1" to="/">
          <span class="step-circle">01</span>
          <span class="step-text">
            Acquisition Package Details Long Name that Wraps
          </span>
        </router-link>
      </v-list-item>
      <v-list-item>
          <router-link id="Step2" to="/steptwo">
            <span class="step-circle">02</span>
            <span class="step-text">
              Existing Contract / Background
            </span>
          </router-link>
      </v-list-item>
      <v-list-item>
          <router-link id="Step3" to="/stepthree">
            <span class="step-circle">03</span>
            <span class="step-text">
              Order Type
            </span>
          </router-link>
      </v-list-item>
      <v-list-item>
          <router-link id="Step4" class="step-complete" to="/stepfour">
            <span class="step-circle">04</span>
            <span class="step-text">
              Exception to Fair Opportunity
            </span>
          </router-link>
      </v-list-item>

      <v-list-item>
          <router-link id="Step5" class="step-complete" to="/stepfive">
            <span class="step-circle">05</span>
            <span class="step-text">
              Evaluation Criteria
            </span>
          </router-link>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class ATATSideStepper extends Vue {
  
  // data
  private sideStepperData = [
    {
      stepNumber: 1,
      completed: false,
      completePercentageWeight: 15,
      menuText: "Acquisition Package Details",
      route: "/stepone",
      subSteps: [
        {
          menuText: "Project Overview",
          route: "stepone-1-1",
          subSteps: [
            {
              route: "stepone-1-1"
            },
            {
              route: "stepone-1-2"
            }
          ]
        },
        {
          menuText: "Organization",
          route: "stepone-2",
          subSteps: []
        },
        {
          menuText: "Contact Information",
          route: "stepone-3",
          subSteps: []
        },
      ]
    },
    {
      stepNumber: 2,
      completed: false,
      completePercentageWeight: 4,
      menuText: "Existing Contract / Background",
      route: "/steptwo",
      subSteps: [],
    },
    {
      stepNumber: 3,
      completed: false,
      completePercentageWeight: 5,
      menuText: "Order Type",
      route: "/stepthree",
      subSteps: [],
    }
  ]

}
</script>
