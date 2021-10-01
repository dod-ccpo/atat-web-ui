<template>
  <div style="display: grid">
    <div class="">
      <v-row>
        <v-col cols="12" class="ml-4 pb-0 h3 font-weight-bold"
          >{{ user.given_name }} {{ user.family_name }}</v-col
        >
        <v-col cols="12 " class="body-lg ml-4 py-0">
          <span class="body-xl text--base-dark">
            {{ user.service_branch }} • {{ user.designation }}</span
          >
        </v-col>
        <v-col cols="12 body ml-4 pt-1 mb-5">
          <span class="body-lg text--base-dark">
            DoD ID: {{ user.dod_id }}</span
          >
        </v-col>
      </v-row>
    </div>
    <v-divider></v-divider>
    <v-container :class="[showScrollbar, 'pa-0']">
      <v-row class="pt-8 ma-0">
        <v-col cols="12" class="pl-6 pb-0 d-flex">
          <v-icon class="icon-16 my-1">email</v-icon>
          <p class="pl-5 mb-0">
            <span class="body-lg text--base-dark">Email Address</span>
          </p>
        </v-col>
        <v-col class="pl-15 py-0"
          ><p class="body-lg">
            {{ user.email }}
          </p></v-col
        >
      </v-row>
      <v-row class="pt-0 ma-0">
        <v-col cols="12" class="pl-6 pb-0 d-flex">
          <v-icon class="icon-16 my-1">phone</v-icon>
          <p class="pl-5 mb-0">
            <span class="body-lg text--base-dark">Phone numbers</span>
          </p>
        </v-col>
        <v-col cols="6" class="pl-15 py-0 pr-0 text--base-darkest"
          ><p class="body-lg pa-0 ma-0">
            {{ user.phone_number }}
          </p></v-col
        ><v-col cols="6" class="py-0 my-0 pl-0 text--base-darkest"
          ><p class="body-lg py-0 my-0 ml-0">Office (Primary)</p></v-col
        >
        <v-col cols="6" class="pt-1 pr-0 pl-15 text--base-darkest"
          ><p class="body-lg">(123)-456-7890</p></v-col
        ><v-col cols="6" class="pt-1 pl-0 body-lg">Mobile</v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-alert
            outlined
            rounded
            class="text-left info_lighter black-icon mt-3"
          >
            <div
              class="d-flex align-start"
              :style="'width:' + drawerWidth + 'px; !important;'"
            >
              <div class="text-center pt-1 width-10">
                <v-icon class="icon-20">info</v-icon>
              </div>
              <div class="black--text body-lg ml-2 width-75">
                To update the contact information associated with your CAC,
                please visit the
                <a
                  class="ma-0 pa-0 text-decoration-none"
                  href="https://idco.dmdc.osd.mil/idco/"
                  target="_blank"
                  tabindex="3"
                >
                  <span class="link-body-md font-weight-400"
                    >ID Card Office Online (IDCO)</span
                  >
                  <v-icon small class="mt-n2 ml-1 icon-22 text-decoration-none"
                    >launch</v-icon
                  >
                </a>
                website and select the <strong>My Profile</strong> option (DS
                Logon or CAC required). It can take up to 48 hours for your
                information to be updated within ATAT after you make changes.
              </div>
            </div>
          </v-alert>
        </v-col>
      </v-row>
      <v-row class="ma-0">
        <v-col class="ml-6 pl-0" cols="10">
          <v-btn
            @click="contactInfoTip = !contactInfoTip"
            text
            x-small
            :ripple="false"
            class="pl-0 primary--text"
            tabindex="3"
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
              <v-row align="center" class="mb-1">
                <p class="body-lg mt-3 text--base-darkest mb-0">
                  We will send email notifications to let you know when your
                  funding or period of performance is close to expiring. This
                  will allow you to add additional task orders and keep your
                  portfolios active.
                </p>
                <p class="body-lg mt-2 text--base-darkest mb-0">
                  Our administrators may also use this information to contact
                  you, in the event that there are issues with your cloud
                  resources or funding.
                </p>
              </v-row>
            </v-card-text>
          </div>
        </v-col>
      </v-row>
      <v-row class="ma-0 mb-3">
        <v-col class="ml-6 pl-0" cols="10">
          <v-btn
            @click="updateProfileTip = !updateProfileTip"
            text
            x-small
            :ripple="false"
            class="pl-0 primary--text"
            tabindex="3"
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
              <v-row class="mb-1">
                <p class="body-lg mt-3 text--base-darkest mb-0">
                  ATAT uses Global Directory for CAC authentication. GD is an
                  enterprise identity solution that provides a trusted single
                  source of truth for digital authentication for every DoD
                  employee.
                </p>
                <p class="body-lg mt-2 text--base-darkest mb-0">
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
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class Profile extends Vue {
  @Prop({ default: "400" }) private drawerWidth!: string;

  private contactInfoTip = false;
  private updateProfileTip = false;

  private user = this.$store.getters.getUser;
  get showScrollbar(): string {
    const show =
      window.innerHeight < 850 || this.updateProfileTip || this.contactInfoTip;
    return show ? "expandedSidebarDiv" : "";
  }

  //method
  private hide(): Promise<boolean> {
    return this.$store.dispatch("closeSideDrawer");
  }
}
</script>

<style scoped>
.expandedSidebarDiv {
  overflow-y: auto !important;
  height: calc(100% - 200px) !important;
  overflow-x: hidden !important;
}
</style>
