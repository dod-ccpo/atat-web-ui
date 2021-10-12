<template>
  <div class="atat-info-side-drawer">
    <v-divider></v-divider>
    <div
      class="body-lg mx-6 text--base-darkest"
      :style="{
        height: scrollableDivHeight + 'px !important',
        maxheight: scrollableDivHeight + 'px !important',
        minheight: scrollableDivHeight + 'px !important',
      }"
    >
      <div class="h3 mb-5 mt-4 text--base-darkest"  tabindex="3">
        Understanding member roles within your cloud console
      </div>
      <span>
        Roles determine what people can see and do within the cloud provider’s
        console. There are administrative roles that are designed for people
        responsible for managing accounts and configuring workspace settings.
        Non-administrative roles let people work within the cloud resources or
        access key features.
        <br /><br />
        Assigning a single role will grant the same level of access to all
        environments within the application. You may also choose to assign
        different roles for each environment, based on your organization’s
        needs.
      </span>
      <v-divider class="my-5"></v-divider>
      <div class="h4 mt-4 text--base-darkest mb-1">
        Types of team member roles
      </div>
      <span>
        Below is a list of the roles available for your team members:
        <ul class="body-lg">
          <li>
            <span class="font-weight-bold d-block mt-5"
              >Root administrator</span
            >
            Grants full access to manage all of your applications, including the
            ability to manage team members, control workspace configurations,
            and add/edit/remove applications. This role can only be added to the
            top-level portfolio workspace.
          </li>
          <li>
            <span class="font-weight-bold d-block mt-5">Administrator</span>
            Grants full access to manage resources within the workspace,
            including the ability to manage team members, assign roles and
            control workspace settings.
          </li>
          <li>
            <span class="font-weight-bold d-block mt-5">Contributor</span>
            Grants full access to manage resources within the workspace, but
            does not allow access to team management or workspace settings..
          </li>
          <li>
            <span class="font-weight-bold d-block mt-5">Billing read-only</span>
            Grants access to view costs and manage cost configurations (e.g.
            budgets, exports), but does not allow access to view or make any
            changes to cloud resources.
          </li>
          <li>
            <span class="font-weight-bold d-block mt-5">No Access</span>
            Team member cannot view any resources for the environment.
          </li>
        </ul>
      </span>
      <v-alert
        color="cyan"
        outlined
        rounded
        border="left"
        class="text-left info_lighter black-icon py-5 px-6 ma-0 mt-5"
      >
        <div class="d-flex align-start">
          <div class="text-center">
            <v-icon class="icon-20">info</v-icon>
          </div>
          <div class="black--text body-lg ml-4">
            Team member roles do not grant access to a portfolio within ATAT.
            These roles assign a level of permissions and access to workspaces
            within the cloud console.
          </div>
        </div>
      </v-alert>
      <v-divider class="my-5"></v-divider>
      <div class="h4 text--base-darkest mb-1">
        Additional Roles and Permissions
      </div>
      <span class="pb-10">
        Each cloud provider offers additional controls to manage your
        application team’s permissions. Administrators can customize these
        permissions directly in the cloud console.
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, PropSync } from "vue-property-decorator";
@Component({})
export default class TeamMemberRolesDrawer extends Vue {
  @Prop({ default: "400" }) private drawerWidth!: string;
  @Prop({ default: "400" }) private drawerHeight!: string;
  @Prop() private scrollableDivHeight!: number;
}
</script>
