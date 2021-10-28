<template>
  <v-container fluid class="dashboard-body body-lg wizard-step-1-view pl-14">
    <br />
    <v-row>
      <v-col cols="8">
        <h2 class="h2 step-1-subtitle">
          Hi {{ user.given_name }}, let's create your first portfolio!
        </h2>
      </v-col>
    </v-row>
    <br />
    <v-row>
      <v-col cols="7" class="pa-0">
        <p class="p step-1 pb-6 mb-0">
          To get started with provisioning your cloud resources, you will need
          to set up a portfolio. We will walk you through adding your contract
          information, as well as establishing the workspaces and team members
          that will develop your provisioned applications within the CSP
          console.
        </p>
        <p class="p step-1 pb-6 mb-0">
          You will need to have an approved task order to fund your project,
          prior to completing your portfolio submission. But don't worry, you
          can save a draft and come back to it at any time prior to
          provisioning. You can even invite other portfolio Managers to help you
          out along the way!
        </p>
        <p class="p step-1 pb-3">Let's get started!</p>
      </v-col>
    </v-row>
    <div class="py-10">
      <v-row>
        <v-col cols="3">
          <v-divider></v-divider>
        </v-col>
      </v-row>
    </div>
    <v-row class="ma-0">
      <v-col cols="8" class="pl-0">
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
