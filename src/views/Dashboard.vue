<template>
  <v-container class="dashboard-body body-lg">
    <v-row>
      <v-col cols="8">
        <div>
          <h1 class="my-10 h1 font-weight-bold">
            ATAT Cloud Services
          </h1>
          <h3 class="h3">
            Welcome to the Account Tracking and Automation Tool, Maria!
          </h3>
          <p>
            ATAT is your tool for provisioning new cloud resources across
            multiple vendors and classification levels. Within ATAT, you can
            create Portfolios to consolidate details about your project into a
            single location, including:
          </p>
          <div class="d-flex align-center mb-2 ml-3">
            <img src="../assets/dashboard/Step1.svg" width="25" class="mr-4" />
            <span class="stepper-text">Task Orders</span>
          </div>
          <div class="d-flex align-center mb-2 ml-3">
            <img src="../assets/dashboard/Step2.svg" width="25" class="mr-4" />
            <span class="stepper-text">Application and Environments</span>
          </div>
          <div class="d-flex align-center mb-6 ml-3">
            <img src="../assets/dashboard/Step3.svg" width="25" class="mr-4" />
            <span class="stepper-text">Team Members</span>
          </div>
          <p>
            Once your Portfolio is set up, you can submit this information to
            selected cloud service providers, provisioning your workspaces and
            teams, as well as establishing a funding stream between your
            organization and the cloud provider(s).
          </p>
          <p>
            Team members that develop your applications will then have access to
            their workspaces within the CSP console, and you will be able to
            track their cloud spend and contract period of performance directly
            within ATAT.
          </p>
          <hr />
          <div class="h3 font-weight-bold mt-10 mb-7">Getting Started</div>
          <p class="dashboard-content">
            First, you will need to verify your contact information that was
            imported from your Active Directory user profile. Our administrators
            may use this information to contact you, in the event that there is
            an issue with your cloud resources or funding.
          </p>
          <v-alert 
            :icon="false"
            type="warning"
            class="warning_lighter black--text body-lg">
            <h3 class="my-1">Maria Missionowner</h3>
            <v-row class="mb-2">
              <v-col cols="6">
                <div class="d-block">maria.missionowner-civ@mail.mil</div>
                <div class="d-block">(555) 555-5555</div>
              </v-col>
              <v-col cols="6">
                <div class="d-block">Service Branch: Army</div>
                <div class="d-block">Citizenship: United States</div>
              </v-col>
            </v-row>
          <v-btn
            color="primary"
            to="#"
          >
            Update Your Profile
          </v-btn>
          </v-alert>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="dashboard-image">
          <v-img
            :src="require('../assets/dashboard/dashboard-image.png')"
            contain
            height="500"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class Dashboard extends Vue {}
</script>
