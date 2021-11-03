<template>
  <v-container class="mt-10">
    <h1 class="text-center mb-10">
      Access the Account Tracking and<br />
      Automation Tool (ATAT)
    </h1>
    <v-row>
      <v-col class="d-flex justify-center py-2">
        <img
          alt="CCPO logo"
          src="../assets/CCPO-Logo.png"
          width="320"
          id="atat-main-child-img"
          class="mb-3"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center mb-9">
        <form @submit.prevent="login">
          <v-btn
            type="submit"
            large
            color="primary"
            :ripple="false"
            id="login_button"
          >
            Sign in with CAC
          </v-btn>
        </form>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center mt-9">
        <v-alert
          outlined
          color="cyan"
          type="info"
          class="text-left cyan info_lighter black-icon"
          border="left"
          width="600"
        >
          <div class="black--text h2">Certificate Selection</div>
          <div class="black--text body-lg">
            When you are prompted to select a certificate, please select an
            <br />
            Authentication (Identification) Certificate from the provided
            choices.
          </div>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Amplify, { Auth, Hub } from "aws-amplify";
@Component({})
export default class Home extends Vue {
  private async login() {
    let authenticatedUser = await Auth.federatedSignIn({
      customProvider: "IdP",
    });
  }

  private mounted(): void {
    Hub.listen("auth", async ({ payload: { event, data } }) => {
      let user: any;
      switch (event) {
        case "cognitoHostedUI":
          user = (await Auth.currentSession()).getIdToken().decodePayload();
          this.$store.dispatch("login", user);
          this.$router.push("/dashboard");
          break;
        case "cognitoHostedUI_failure":
          //this.setState({ authState: "signedOut", user: null, error: data });
          break;
        default:
          break;
      }
    });
  }
}
</script>
