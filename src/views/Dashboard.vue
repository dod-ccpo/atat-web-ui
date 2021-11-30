<template>
  <v-container class="dashboard-body body-lg mt-10">
    <v-row>
      <v-col cols="6" offset-lg="1">
        <h1 tabindex="-1" class="mb-8">
          Welcome to the Account Tracking and Automation Tool (ATAT),
          {{ userName }}
        </h1>
        <div>
          <p>
            ATAT is your tool for provisioning new cloud resources across
            multiple vendors and classification levels. Within ATAT, create
            portfolios to consolidate details about your project into a single
            location, including:
          </p>
          <div class="d-flex align-center mb-2 ml-6">
            <img
              src="../assets/dashboard/Step1.svg"
              width="25"
              class="mr-4"
              alt="Step 1"
            />
            <span class="stepper-text">Task orders</span>
          </div>
          <div class="d-flex align-center mb-2 ml-6">
            <img
              src="../assets/dashboard/Step2.svg"
              width="25"
              class="mr-4"
              alt="Step 2"
            />
            <span class="stepper-text">Application and environments</span>
          </div>
          <div class="d-flex align-center mb-6 ml-6">
            <img
              src="../assets/dashboard/Step3.svg"
              width="25"
              class="mr-4"
              alt="Step 3"
            />
            <span class="stepper-text">Team members</span>
          </div>
          <p>
            Once your portfolio is set up, information is submitted to the
            selected Cloud Service Providers (CSPs) to provision your workspaces
            and teams, and establish a funding stream between your organization
            and the CSPs.
          </p>
          <p>
            Team members that develop your applications will have access to
            their workspaces within the CSP console, and you can track their
            cloud spend and contract period of performance directly within ATAT.
          </p>
        </div>
      </v-col>
      <v-col cols="2">
        <div>
          <img
            class="mt-9"
            src="../assets/dashboard/dashboard-image.png"
            alt="Applications & Environments, Task Orders, Team Members"
          />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col offset-lg="1">
        <v-btn
          @click="handleClick"
          color="primary"
          :ripple="false"
          class="ml-auto"
          role="link"
        >
          Get Started
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class Dashboard extends Vue {
  public handleClick(): void {
    this.$router.push("/profile");
  }

  get userName(): string {
    return (
      this.$store.state.user.given_name +
      " " +
      this.$store.state.user.family_name
    );
  }
}
</script>
