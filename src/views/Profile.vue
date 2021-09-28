<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <v-row>
          <v-col class="pb-4">
            <h2 class="mt-7 h2 font-weight-bold">
              First, let’s verify your profile information
            </h2>
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col>
            <p class="mb-4 body-lg">
              We imported your basic personal and contact information from your
              CAC profile. This information will be used to notify you if there
              are any issues with your funding or cloud resources.
            </p>
            <p class="body-lg mb-0">
              Please review and verify that the following details are accurate.
              When you are done, click <strong>Continue</strong> and we will get
              started with your portfolios.
            </p>

            <v-alert
              outlined
              rounded
              color="cyan"
              type="info"
              border="left"
              :icon="false"
              class="text-left info_lighter black-icon align-center my-10 pl-0"
            >
              <div>
                <v-row>
                  <v-col cols="1" class="text-center px-0">
                    <v-icon class="ml-6 icon-24 text--base-darkest"
                      >info</v-icon
                    >
                  </v-col>
                  <v-col cols="11" class="pl-0 body-lg black--text">
                    To update the contact information associated with your CAC,
                    please visit the
                    <a
                      class="ma-0 pa-1 text-decoration-none"
                      href="https://idco.dmdc.osd.mil/idco/"
                      target="_blank"
                      rel="noopener"
                      tabindex="0"
                    >
                      <span class="link-body-md font-weight-400"
                        >ID Card Office Online (IDCO)</span
                      >
                      <v-icon
                        small
                        class="mt-n2 ml-1 icon-22 text-decoration-none"
                        >launch</v-icon
                      >
                    </a>
                    website and select the <strong>My Profile</strong> option
                    (DS Logon or CAC required). It can take up to 48 hours for
                    your information to be updated within ATAT after you make
                    changes.
                  </v-col>
                </v-row>
              </div>
            </v-alert>

            <v-card rounded class="mb-6 border-base-lighter border-1" outlined>
              <v-card-title class="h3 pl-8 pt-8 font-weight-bold"
                >Basic Information</v-card-title
              >
              <v-card-text
                class="
                  body-lg
                  pl-8
                  pb-3
                  text--base-darkest
                  remove-y-margin-from-p remove-y-padding-from-cols
                "
              >
                <v-row class="mb-5 mt-2">
                  <v-col cols="4">
                    <p class="text--base-dark">Name</p>
                  </v-col>
                  <v-col>
                    <p>{{ user.given_name }} {{ user.family_name }}</p>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="my-5">
                  <v-col cols="4">
                    <p class="text--base-dark">Title</p>
                  </v-col>
                  <v-col>
                    <p>
                      {{ user.title }}
                    </p>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="my-5">
                  <v-col cols="4">
                    <p class="text--base-dark">DoD ID</p>
                  </v-col>
                  <v-col>
                    <p>
                      {{ user.dod_id }}
                    </p>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="my-5">
                  <v-col cols="4">
                    <p class="text--base-dark">Service Branch or Agency</p>
                  </v-col>
                  <v-col>
                    <p>
                      {{ user.service_branch }}
                    </p>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="my-5">
                  <v-col cols="4">
                    <p class="text--base-dark">Persona Type</p>
                  </v-col>
                  <v-col>
                    <p>
                      {{ user.designation }}
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card rounded class="mb-6 border-base-lighter border-1" outlined>
              <v-card-title class="h3 pl-8 pt-8 font-weight-bold"
                >Contact Information</v-card-title
              >
              <v-card-text
                class="
                  body-lg
                  pl-8
                  pb-3
                  text--base-darkest
                  remove-y-margin-from-p remove-y-padding-from-cols
                "
              >
                <v-row class="my-5 mt-2">
                  <v-col cols="4">
                    <p class="text--base-dark">Email Address</p>
                  </v-col>
                  <v-col>
                    <p>
                      {{ user.email }}
                    </p>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="my-5">
                  <v-col cols="4">
                    <p class="text--base-dark">Phone Numbers</p>
                  </v-col>
                  <v-col class="d-flex flex-column">
                    <div class="justify-space-between mb-2">
                      <span>{{ user.phone_number }}</span>
                      <span class="ml-4">Office (Primary)</span>
                    </div>
                    <div class="justify-space-between">
                      <span>(123) 456-7890</span>
                      <span class="ml-4">Mobile</span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-row class="ma-0">
              <v-col cols="12" class="d-flex ma-0 pt-10 px-0">
                <v-btn
                  @click="handleBack"
                  color="primary"
                  outlined
                  :ripple="false"
                  >Back</v-btn
                >
                <v-btn
                  @click="handleContinue"
                  color="primary"
                  :ripple="false"
                  class="ml-auto"
                  >Continue</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class Profile extends Vue {
  private user = "";

  public handleContinue(): void {
    this.$router.push("/createPortfolio");
    console.log("Continue clicked");
  }
  public handleBack(): void {
    this.$router.push("/dashboard");
    console.log("back clicked");
  }
  public mounted(): void {
    this.user = this.$store.getters.getUser;
  }
}
</script>

<style scoped>
.remove-y-padding-from-cols .col {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.remove-y-margin-from-p p {
  margin-top: 0px !important;
  margin-bottom: 0px !important;
}
</style>
>
