<template>
  <div class="atat-info-side-drawer">
    <v-divider></v-divider>
    <h2 class="mx-6 mb-5 mt-4 text--base-darkest">
      Can I update my portfolio after it is provisioned?
    </h2>
    <div class="body-lg mx-6 text--base-darkest">
      <p>Yes. However, ATAT is not a system of record.</p>
      <p>
        After provisioning, you will be able to add new task orders and team
        members. This information will be submitted to your CSP, in order to
        keep your cloud resources funded and operational in the future.
      </p>
      <p>
        However, any updates made to existing task orders, applications,
        environments, and team member permissions within ATAT will not be
        reflected within your cloud service provider console. And vice versa,
        any changes that your team members make within the CSP console will not
        be synced with ATAT.
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class SubmitDrawer extends Vue {
  @Prop({ default: "400" }) private drawerWidth!: string;
  @Prop({ default: "400" }) private drawerHeight!: string;
}
</script>
