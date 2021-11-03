<template>
  <v-container class="main-content-wrapper body-lg content-max-width">
    <h1 class="text-center mb-10">Access the ATAT Cloud</h1>
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
            class="text-capitalize"
            :ripple="false"
            id="login_button"
          >
            Sign in
          </v-btn>
        </form>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center mt-9">
        <v-alert
          outlined
          rounded
          color="cyan"
          type="info"
          border="left"
          :icon="false"
          class="text-left info_lighter black-icon align-center"
        >
          <div>
            <v-row>
              <v-col cols="1" class="text-center px-0">
                <v-icon
                  class="ml-6 pr-6 pt-1 icon-24 text--base-darkest"
                  aria-hidden="true"
                >
                  info
                </v-icon>
              </v-col>
              <v-col cols="11" class="pl-0 body-lg black--text">
                <div class="black--text h2 mb-2">Certificate Selection</div>
                <p class="ma-0">
                  When you are prompted to select a certificate, please select
                  an
                </p>
                <p class="ma-0">
                  Authentication (Identification) Certificate from the provided
                  choices.
                </p>
              </v-col>
            </v-row>
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
