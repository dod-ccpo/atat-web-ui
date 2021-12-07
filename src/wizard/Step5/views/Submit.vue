<template>
  <div>
    <div class="content-max-width">
      <h1 tabindex="-1">Your portfolio is complete! Ready to submit?</h1>
      <p class="body-lg mb-0">
        Once you are ready to submit your portfolio, click the
        <strong>Provision Cloud Resources</strong> button. We will send the
        information you provided to
        <strong> {{ this.$store.getters["wizard/getPortfolio"].csp }} </strong>
        and begin the process of setting up your workspaces and team members.
      </p>
      <p class="body-lg mb-0 py-4">
        <strong>Not quite ready?</strong> Save this portfolio as a draft and
        return to make edits at any time.
      </p>
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
            details in ATAT may be different than your cloud console.
            <a
              role="button"
              tabindex="0"
              class="text-link"
              @click="openSideDrawer($event, 'Submit_LearnMoreButton')"
              @keydown.enter="openSideDrawer($event, 'Submit_LearnMoreButton')"
              @keydown.space="openSideDrawer($event, 'Submit_LearnMoreButton')"
              id="Submit_LearnMoreButton"
            >
              Learn More
            </a>
          </div>
        </div>
      </v-alert>
      <div class="d-flex justify-center">
        <v-icon color="success" class="icon-200">cloud_upload</v-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class Submit extends Vue {
  private openSideDrawer(event: Event, openerId: string): void {
    this.$store.dispatch("openSideDrawer", ["submit", openerId]);
  }
}
</script>

<style scoped></style>
