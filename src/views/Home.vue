<template>
  <div class="home-view">
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
          <v-btn
            @click="login()"
            elevation="2"
            large
            color="primary"
            class="text-capitalize"
            :ripple="false"
          >
            Sign in
          </v-btn>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class Home extends Vue {
  private login(): void {
    this.$store.dispatch("login");
    this.$router.push("/dashboard");
  }
}
</script>
