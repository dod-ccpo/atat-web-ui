<template>
  <v-container>
    <v-row>
      <v-col cols="7">
        <v-row>
          <v-col>
            <h2 class="mt-4 h2 font-weight-bold">
              First, let’s verify your profile information
            </h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p class="mb-3 body-lg">
              We imported your basic personal and contact information from your
              CAC profile. This information will be used to notify you if there
              are any issues with your funding or cloud resources.
            </p>
            <p class="body-lg">
              Please review and verify that the following details are accurate.
              When you are done, click <strong>Continue</strong> and we will get
              started with your portfolios.
            </p>
            <div>
              <div class="d-flex align-center mb-2">
                <v-alert
                  outlined
                  rounded
                  color="cyan"
                  type="info"
                  border="left"
                  class="text-left info_lighter black-icon mt-3"
                >
                  <div class="d-flex">
                    <div class="black--text body-lg ml-2">
                      To update the contact information associated with your
                      CAC, please visit the
                      <a
                        class="ma-0 pa-0 text-decoration-none"
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
                    </div>
                  </div>
                </v-alert>
              </div>
              <v-card rounded class="mb-5">
                <v-card-title class="body-lg font-weight-bold"
                  >Basic Information</v-card-title
                >
                <v-card-text>
                  <v-row>
                    <v-col>
                      <p class="body">Name</p>
                    </v-col>
                    <v-col>
                      <p class="body text--primary">
                        {{ user.given_name }} {{ user.family_name }}
                      </p>
                    </v-col>
                  </v-row>
                  <v-divider class="mb-4"></v-divider>
                  <v-row>
                    <v-col>
                      <p class="body">Title</p>
                    </v-col>
                    <v-col>
                      <p class="body text--primary">
                        {{ user.title }}
                      </p>
                    </v-col>
                  </v-row>
                  <v-divider class="mb-4"></v-divider>
                  <v-row>
                    <v-col>
                      <p class="body">DoD ID</p>
                    </v-col>
                    <v-col>
                      <p class="body text--primary">
                        {{ user.dod_id }}
                      </p>
                    </v-col>
                  </v-row>
                  <v-divider class="mb-4"></v-divider>
                  <v-row>
                    <v-col>
                      <p class="body">Service Branch or Agency</p>
                    </v-col>
                    <v-col>
                      <p class="body text--primary">
                        {{ user.service_branch }}
                      </p>
                    </v-col>
                  </v-row>
                  <v-divider class="mb-4"></v-divider>
                  <v-row>
                    <v-col>
                      <p class="body">Persona Type</p>
                    </v-col>
                    <v-col>
                      <p class="body text--primary">
                        {{ user.designation }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card rounded>
                <v-card-title class="body-lg font-weight-bold"
                  >Contact Information</v-card-title
                >
                <v-card-text>
                  <v-row>
                    <v-col>
                      <p class="body">Email Address</p>
                    </v-col>
                    <v-col>
                      <p class="body link-body-sm text-decoration-underline">
                        {{ user.email }}
                      </p>
                    </v-col>
                  </v-row>
                  <v-divider class="mb-4"></v-divider>
                  <v-row>
                    <v-col>
                      <p class="body">Phone numbers</p>
                    </v-col>
                    <v-col class="d-flex flex-column">
                      <p class="body text--primary justify-space-between">
                        {{ user.phone_number }}
                        <span class="ml-4">Office (Primary)</span>
                      </p>
                      <div class="body text--primary justify-space-between">
                        (123) 456-7890
                        <span class="ml-4">Mobile</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-row>
                <v-col cols="12" class="d-flex mt-8 mb-16">
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
            </div>
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
    this.$router.push("/portfolios");
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
