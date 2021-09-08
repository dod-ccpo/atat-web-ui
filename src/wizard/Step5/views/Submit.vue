<template>
  <v-container fluid class="width-80 ml-0 mb-10">
    <v-slide-x-reverse-transition>
      <div v-if="drawer" class="atat-info-side-drawer">
        <div class="d-flex justify-space-between align-center px-6 my-4">
          <div class="body text-uppercase font-weight-bold text--base-dark">
            Learn more
          </div>
          <div>
            <v-btn text plain small @click="drawer = !drawer">
              <v-icon>close</v-icon>
            </v-btn>
          </div>
        </div>
        <v-divider></v-divider>
        <div class="h3 mx-6 mb-5 my-4 text--base-darkest">
          Can I update my portfolio after it is provisioned?
        </div>
        <div class="body-lg mx-6 text--base-darkest">
          <p>Yes. However, ATAT is not a system of record.</p>
          <p>
            After provisioning, you will be able to add new task orders and team
            members. This information will be submitted to your cloud service
            provider, in order to keep your cloud resources funded and
            operational in the future.
          </p>
          <p>
            However, any updates made to existing task orders, applications,
            environments and team member permissions within ATAT will not be
            reflected within your cloud service provider console. And vice
            versa, any changes that your team members make within the CSP
            console will not be synced with ATAT.
          </p>
        </div>
      </div>
    </v-slide-x-reverse-transition>
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
          <strong> {{ this.$store.state.selectedCSP }} </strong> and begin the
          process of setting up your workspaces and team members.
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
              details in ATAT may be different than your cloud console.
              <v-btn
                class="primary--text py-0 px-2 mt-n2"
                text
                small
                :ripple="false"
                @click="drawer = !drawer"
              >
                <span class="link-body-md">Learn More</span>
              </v-btn>
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
export default class Submit extends Vue {
  public drawer = false;
}
</script>

<style scoped></style>
