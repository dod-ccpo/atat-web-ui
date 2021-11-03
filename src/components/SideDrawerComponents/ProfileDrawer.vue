<template>
  <div>
    <div class="mx-6">
      <div class="h2 mb-0">{{ user.given_name }} {{ user.family_name }}</div>
      <div class="text--base-dark body-xl">
        <div>
          {{ user.service_branch }}&nbsp;&nbsp;•&nbsp;&nbsp;{{
            user.designation
          }}
          <br />
          DoD ID: {{ user.dod_id }}
        </div>
      </div>
    </div>

    <v-divider class="mt-6"></v-divider>
    <div
      class="
        px-6
        pb-16
        body-lg
        overflow-y-auto overflow-x-hidden
        text--base-darkest
      "
      :style="{ height: scrollableDivHeight + 'px !important' }"
    >
      <div class="pt-8 d-flex align-start">
        <v-icon class="icon-20">email</v-icon>
        <div class="pl-4">
          <span class="text--base-dark d-block">Email Address</span>
          <span class="d-block">{{ user.email }}</span>
        </div>
      </div>
      <div class="pt-8 pb-15 d-flex align-start">
        <v-icon class="icon-20">phone</v-icon>
        <div class="pl-4 text--base-darkest">
          <span class="text--base-dark d-block">Phone numbers</span>
          <div class="d-flex align-center mb-2">
            <span class="pr-6">{{ user.phone_number }}</span>
            <span>Office (Primary)</span>
          </div>
          <div class="d-flex align-center">
            <span class="pr-6">(123) 456-7890</span>
            <span>Mobile</span>
          </div>
        </div>
      </div>

      <div class="mx-n6 mb-6">
        <div>
          <v-alert
            outlined
            rounded
            class="text-left info_lighter black-icon pa-0"
          >
            <div class="px-6 py-4 d-flex align-start">
              <div class="text-center pt-1">
                <v-icon class="icon-20">info</v-icon>
              </div>
              <div class="black--text body-lg ml-4">
                To update the contact information associated with your CAC,
                please visit the
                <a href="https://idco.dmdc.osd.mil/idco/" target="_blank">
                  ID Card Office Online (IDCO)
                  <span class="external-link">website</span>
                </a>
                and select the <strong>My Profile</strong> option (DS Logon or
                CAC required). It can take up to 48 hours for your information
                to be updated within ATAT after you make changes.
              </div>
            </div>
          </v-alert>
        </div>
      </div>

      <expandable-link
        header="How will my contact information be used?"
        content="<p>We will send email notifications to let you know when your funding
            or period of performance is close to expiring. This will allow you
            to add additional task orders and keep your portfolios active.
          </p>
          <p>
            Our administrators may also use this information to contact you, in
            the event that there are issues with your cloud resources or
            funding.
          </p>"
      />

      <expandable-link
        header="Why can’t I update my profile in ATAT?"
        content="<p>ATAT uses Global Directory for CAC authentication. GD is an
            enterprise identity solution that provides a trusted single source
            of truth for digital authentication for every DoD employee.
          </p>
          <p>
            When you update your contact information on the
            <a href='https://idco.dmdc.osd.mil/idco/' target='_blank'>ID Card Office
            Online (IDCO) <span class='external-link'>website</span></a>, it is automatically updated anywhere you use
            your CAC, saving you the time and hassle of updating your information on multiple DoD
            websites."
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ExpandableLink from "@/components/ExpandableLink.vue";

@Component({
  components: {
    ExpandableLink,
  },
})
export default class Profile extends Vue {
  @Prop() private scrollableDivHeight!: number;
  private contactInfoTip = false;
  private updateProfileTip = false;
  private user = this.$store.getters.getUser;
}
</script>
