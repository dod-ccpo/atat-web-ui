<template>
  <div class="home-view">
    <v-container>
      <v-row align="center">
        <v-col>
          <h1 class="home-header-title text-center">Access the ATAT Cloud</h1>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="home-shield-cont text-center py-2" align="center">
          <v-img
            lazy-src="../assets/CCPO-Logo.png"
            src="../assets/CCPO-Logo.png"
            max-height="258"
            max-width="250"
            id="atat-main-child-img"
          ></v-img>
        </v-col>
      </v-row>
      <br /><br />
      <v-row align="center">
        <v-col class="home-btn-cont text-center">
          <v-btn
            to="/dashboard"
            elevation="2"
            x-large
            color="primary"
            class="font-weight-bold text-capitalize"
          >
            Sign in
          </v-btn>
        </v-col>
      </v-row>
      <br /><br /><br /><br />
      <v-row align="center">
        <v-col class="home-info-alert text-center" md="8" offset-md="2">
          <v-alert
            outlined
            color="black"
            type="info"
            class="text-left atat-v-alert-info cyan lighten-5"
            border="left cyan"
          >
            <h2 class="atat-v-alert-info__title">Certificate Selection</h2>
            <p class="atat-v-alert-info__msg">
              When you are prompted to select a certificate, please select an
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
