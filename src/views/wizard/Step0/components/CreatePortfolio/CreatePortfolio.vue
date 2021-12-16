<template>
  <div class="main-content-wrapper body-lg">
    <div class="content-max-width">
      <h1 tabindex="-1">
        Hi {{ user.given_name }}, let’s create your first portfolio!
      </h1>
      <p>
        To get started with provisioning your cloud resources, you will need to
        set up a portfolio. We will walk you through adding your contract
        information, as well as establishing the workspaces and team members
        that will develop your provisioned applications within the CSP console.
      </p>
      <p>
        You will need to have an approved task order to fund your project, prior
        to completing your portfolio submission. But don't worry, you can save a
        draft and come back to it at any time prior to provisioning. You can
        even invite other portfolio managers to help you out along the way!
      </p>
      <p>Let’s get started!</p>

      <atat-divider />

      <div :icon="false" class="bg-base-lightest body-lg border px-13 py-5">
        <v-btn
          id="btn-create-new-portfolio"
          class="primary"
          block
          :ripple="false"
          @click="onCreatePortfolio"
          role="link"
        >
          Create a New Portfolio
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATDivider from "@/components/ATATDivider.vue";

@Component({
  components: {
    "atat-divider": ATATDivider,
  },
})
export default class CreatePortfolio extends Vue {
  async onCreatePortfolio(): Promise<void> {
    await this.$store.dispatch("wizard/createPortfolioDraft");
    this.$router.push({ name: "addportfolio" });
  }

  private user = "";

  public mounted(): void {
    this.user = this.$store.getters.getUser;
  }
}
</script>
