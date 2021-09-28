<template>
  <!-- <v-slide-x-reverse-transition> -->
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
        provider, in order to keep your cloud resources funded and operational
        in the future.
      </p>
      <p>
        However, any updates made to existing task orders, applications,
        environments and team member permissions within ATAT will not be
        reflected within your cloud service provider console. And vice versa,
        any changes that your team members make within the CSP console will not
        be synced with ATAT.
      </p>
    </div>
  </div>
  <!-- </v-slide-x-reverse-transition> -->
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class ATATSubmitDrawer extends Vue {}
</script>
