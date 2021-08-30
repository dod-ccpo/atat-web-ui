<template>
  <v-container fluid class="width-80 ml-0 mb-10">
    <v-row>
      <v-col col="12">
        <div class="h2">Your portfolio is complete! Ready to submit?</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12" class="pb-0">
        <p class="body-lg">
          You can save this portfolio as a draft and return to make edits at any
          time. Once you are ready to submit your portfolio, click the
          <strong>Provision Cloud Resources</strong> button. We will send the
          information you provided to
          <strong> &lt;selected CSP&gt; </strong> and begin the process of
          setting up your workspaces and team members.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-start">
        <v-alert
          :icon="false"
          outlined
          color="cyan"
          type="info"
          class="text-left cyan info_lighter black-icon"
          border="left"
        >
          <div class="d-flex align-start">
            <v-icon class="ml-5 mr-4 icon-24">error</v-icon>
            <div class="black--text body-lg">
              ATAT is not a system of record. After provisioning, your portfolio
              details in ATAT may be different than your cloud console. Learn
              More
            </div>
          </div>
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <v-icon color="success" class="icon-200">cloud_upload</v-icon>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class Submit extends Vue {}
</script>

<style scoped></style>
