<template>
  <v-navigation-drawer
    v-if="this.$store.state.sideDrawer === true"
    width=" 400"
    app
    clipped
    mini-variant-width="20"
    :mini-variant.sync="profile"
    permanent
    right
  >
    <div class="d-flex flex-row">
      <v-subheader v-if="!profile" class="font-weight-bold text-h6"
        >YOUR PROFILE</v-subheader
      >
      <div class="ml-auto d-flex align-center">
        <v-btn
          class="text--primary h6 pa-0 ma-0 ml-1"
          tabindex="3"
          plain
          x-small
          @click.stop="hide"
          :ripple="false"
        >
          <v-icon small>close</v-icon>
        </v-btn>
      </div>
    </div>
    <template>
      <v-row>
        <v-col cols="12" class="ml-4 pb-0 h3 font-weight-bold"
          >{{ user.given_name }} {{ user.family_name }}</v-col
        >
        <v-col cols="12 " class="body-lg ml-4 py-0">
          <span class="body-lg text--base-dark">
            {{ user.service_branch }} • {{ user.designation }}</span
          >
        </v-col>
        <v-col cols="12 body ml-4 pt-1 mb-5">
          <span class="body-lg text--base-dark">
            DoD ID: {{ user.dod_id }}</span
          >
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row class="pt-8">
        <v-col cols="12" class="ml-4 pb-0 body d-flex">
          <v-icon>email</v-icon>
          <p class="ml-2 mb-0">
            <span class="body-lg text--base-dark">Email Address</span>
          </p>
        </v-col>
        <v-col class="py-0"
          ><p class="ml-12 body link-body-sm">
            {{ user.email }}
          </p></v-col
        >
      </v-row>
      <v-row class="pt-0 d-flex">
        <v-col cols="12" class="ml-4 pb-0 body d-flex">
          <v-icon>phone</v-icon>
          <p class="ml-2 mb-0 profile-drawer-text">
            <span class="body-lg text--base-dark">Phone numbers</span>
          </p>
        </v-col>
        <v-col cols="6" class="py-0 pr-0"
          ><p class="ml-12 body pa-0 ma-0">
            {{ user.phone_number }}
          </p></v-col
        ><v-col cols="6" class="py-0 my-0 pl-0"
          ><p class="body py-0 my-0 ml-0">Office (Primary)</p></v-col
        >
        <v-col cols="6" class="pt-1 pr-0"
          ><p class="ml-12 body">(123)-456-7890</p></v-col
        ><v-col cols="6" class="pt-1 pl-0"><p class="body">Mobile</p></v-col>
      </v-row>
      <v-row>
        <v-alert
          outlined
          rounded
          type="info"
          class="text-left info_lighter black-icon mt-3"
          border="left"
        >
          <div class="black--text body-lg ml-2">
            To update the contact information associated with your CAC, please
            visit the
            <a
              href="https://idco.dmdc.osd.mil/idco/"
              class="link-body-md"
              tabindex="0"
              >ID Card Office Online (IDCO)</a
            ><v-icon color="#005EA2" small>launch</v-icon> website and select
            the <strong>My Profile</strong> option (DS Logon or CAC required).
            It can take up to 48 hours for your information to be updated within
            ATAT after you make changes.
          </div>
        </v-alert>
      </v-row>
      <v-row>
        <v-col class="ml-4" cols="10">
          <v-btn
            @click="contactInfoTip = !contactInfoTip"
            text
            x-small
            :ripple="false"
            class="pl-0 primary--text"
          >
            <span class="link-body-md">
              How will my contact information be used?
            </span>
            <v-icon>
              {{ contactInfoTip ? "expand_less" : "expand_more" }}
            </v-icon>
          </v-btn>
          <div v-show="contactInfoTip">
            <v-card-text class="h6 pb-0">
              <v-row align="center" class="mb-10">
                <p class="body-lg mt-3 text--base-darkest">
                  We will send email notifications to let you know when your
                  funding or period of performance is close to expiring. This
                  will allow you to add additional task orders and keep your
                  portfolios active.
                  <br />
                  <br />
                  Our administrators may also use this information to contact
                  you, in the event that there are issues with your cloud
                  resources or funding.
                </p>
              </v-row>
            </v-card-text>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="ml-4" cols="10">
          <v-btn
            @click="updateProfileTip = !updateProfileTip"
            text
            x-small
            :ripple="false"
            class="pl-0 primary--text"
          >
            <span class="link-body-md">
              Why can’t I update my profile in ATAT?
            </span>
            <v-icon>
              {{ updateProfileTip ? "expand_less" : "expand_more" }}
            </v-icon>
          </v-btn>
          <div v-show="updateProfileTip">
            <v-card-text class="h6 pb-0">
              <v-row>
                <p class="body-lg mt-3 text--base-darkest">
                  ATAT uses Global Directory for CAC authentication. GD is an
                  enterprise identity solution that provides a trusted single
                  source of truth for digital authentication for every DoD
                  employee.
                  <br />
                  <br />
                  When you update your contact information on the
                  <a href="https://idco.dmdc.osd.mil/idco/" class="link-body-md"
                    >ID Card Office Online (IDCO) website</a
                  >, it is automatically updated anywhere you use your CAC,
                  saving you the time and hassle of updating your information on
                  multiple DoD websites.
                </p>
              </v-row>
            </v-card-text>
          </div>
        </v-col>
      </v-row>
    </template>
  </v-navigation-drawer>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
@Component({})
export default class SideDrawer extends Vue {
  private profile = false;
  private contactInfoTip = false;
  private updateProfileTip = false;

  private user = this.$store.getters.getUser;

  //method
  private hide(): Promise<boolean> {
    return this.$store.dispatch("closeSideDrawer");
  }
  mounted(): void {
    console.log(this.$store.getters.getSideDrawer);
    // this.show = this.$store.getters.getSideDrawer;
  }
}
</script>
