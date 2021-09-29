<template>
  <v-container>
    <div class="text-center mb-10 h1 font-weight-bold">
      Access the ATAT Cloud
    </div>
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
          color="cyan"
          type="info"
          class="text-left cyan info_lighter black-icon"
          border="left"
          width="600"
        >
          <div class="black--text h3">Certificate Selection</div>
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
    sessionStorage.setItem(
      "authenticatedUser",
      JSON.stringify(authenticatedUser)
    );

    //todo something should be returned that says
    // user has been if validated
    // if (isUserisValidated){
    // if (authenticatedUser) {
    this.$store.dispatch("login");
    this.$router.push("/dashboard");
    // }
    //}
    // else {
    // handle invalidUser
    //}
  }

  private mounted(): void {
    // Hub.listen("auth", async ({ payload: { event, data } }) => {
    //   debugger;
    //   // const user: any;
    //   // switch (event) {
    //   //   case "cognitoHostedUI":
    //   //     user = await this.getUser();
    //   //     // workaround for FF bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1422334
    //   //     // eslint-disable-next-line
    //   //     // noinspection SillyAssignmentJS
    //   //     window.location.hash = window.location.hash;
    //   //     this.setState({ authState: "signedIn", user: user });
    //   //     break;
    //   //   case "cognitoHostedUI_failure":
    //   //     this.setState({ authState: "signedOut", user: null, error: data });
    //   //     break;
    //   //   default:
    //   //     break;
    //   // }
    // });
  }
}
</script>
