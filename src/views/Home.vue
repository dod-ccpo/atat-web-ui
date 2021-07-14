<template>
  <div class="home-view">
    <v-container>
      <h3 class="text-center mb-10 text-h3 font-weight-bold">
        Access the ATAT Cloud
      </h3>
      <v-row>
        <v-col class="d-flex justify-center py-2" align="center">
          <v-img
            lazy-src="../assets/CCPO-Logo.png"
            src="../assets/CCPO-Logo.png"
            max-height="258"
            max-width="250"
            id="atat-main-child-img"
            class="mb-3"
          ></v-img>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center mb-9">
          <v-btn
            to="/dashboard"
            large
            color="primary"
            class="text-capitalize"
            :ripple="false"
          >
            Sign in
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center mt-9">
          <v-alert
            outlined
            color="cyan"
            type="info"
            class="text-left cyan info_lighter black-icon"
            border="left"
            width="600"
          >
            <h2 class="black--text">Certificate Selection</h2>
            <p class="black--text">
              When you are prompted to select a certificate, please select an
              <br />
              Authentication (Identification) Certificate from the provided
              choices.
            </p>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class Home extends Vue {}
</script>
