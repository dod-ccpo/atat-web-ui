<template>
  <v-container fluid class="dashboard-body body-lg wizard-step-1-view">
    <br />
    <v-row>
      <v-col cols="6">
        <h2 class="h2 step-1-subtitle">
          Hi {{ user.given_name }}, let's create your first portfolio!
        </h2>
      </v-col>
    </v-row>
    <br />
    <v-row>
      <v-col cols="6">
        <p class="p step-1">
          To get started with provisioning your cloud resources, you will need
          to set up a Portfolio. We will walk you through adding your contract
          information, as well as establishing the workspaces and team members
          that will develop your provisioned applications within the CSP
          console.
          <br />
          <br />
          You will need to have an approved Task Order to fund your project,
          prior to completing your Portfolio submission. But don't worry, you
          can save a draft and come back to it at any time prior to
          provisioning. You can even invite other Portfolio Managers to help you
          out along the way!
          <br />
          <br />
          Let's get started!
          <br />
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <hr class="hr step-1-divider border-base-lighter" />
      </v-col>
    </v-row>
    <br />
    <v-row>
      <v-col cols="6">
        <div :icon="false" class="bg-base-lightest body-lg border px-13 py-5">
          <v-btn
            id="btn-create-new-portfolio"
            class="primary"
            block
            :ripple="false"
            @click="onCreatePortfolio"
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
export default class CreatePortfolio extends Vue {
  async onCreatePortfolio(): Promise<void> {
    await this.$store.dispatch("createPortfolioDraft");
    this.$router.push({ name: "addportfolio" });
  }

  private user = "";

  public mounted(): void {
    this.user = this.$store.getters.getUser;
  }
}
</script>
