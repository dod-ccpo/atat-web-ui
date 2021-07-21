<template>
  <v-container class="dashboard-body body-lg wizard-step-1-view">
    <v-row>
      <v-col cols="6" offset="2">
        <h1 class="h1 step-1-title my-5font-weight-bold">
          ATAT Cloud Services
        </h1>
      </v-col>
    </v-row>

    <br />
    <v-row>
      <v-col cols="6" offset="2">
        <h2 class="h2 step-1-subtitle">Create a Portfolio</h2>
      </v-col>
    </v-row>
    <br />
    <v-row>
      <v-col cols="6" offset="2">
        <p class="p step-1">
          To get started with provisioning your cloud resources, you will need
          to set up a Portfolio. We will walk you through adding your contract
          information, as well as establishing the workspaces and team members
          that will develop your provisioned applications within the CSP
          console.
          <br />
          <br />
          You will need to have an approved Task Order to fund your project,
          prior to completing your Portfolio submission. But don’t worry, you
          can save a draft and come back to it at any time prior to
          provisioning. You can even invite other Portfolio Managers to help you
          out along the way!
          <br />
          <br />
          Let’s get started!
          <br />
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2" offset="2">
        <hr class="hr text-base-lightest" />
      </v-col>
    </v-row>
    <br />
    <v-row>
      <v-col cols="6" offset="2">
        <div :icon="false" class="bg-base-lightest body-lg border px-13 py-5">
          <v-btn
            class="primary"
            id="create-portfolio-btn"
            block
            :ripple="false"
            to="/wizard/step-2"
          >
            Create a New Portfolio
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class Step_1 extends Vue {}
</script>

<style></style>
