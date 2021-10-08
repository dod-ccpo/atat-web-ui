<template>
  <div class="atat-info-side-drawer">
    <v-divider></v-divider>
    <div :class="'body-lg mx-6 text--base-darkest'">
      <div class="h3 mx-6 mb-5 mt-4 text--base-darkest">
        Understanding member roles within your cloud console
      </div>

      <p>Yes. However, ATAT is not a system of record.</p>
      <p>
        Roles determine what people can see and do within the cloud provider’s
        console. There are administrative roles that are designed for people
        responsible for managing accounts and configuring workspace settings.
        Non-administrative roles let people work within the cloud resources or
        access key features.
      </p>
      <p>
        Assigning a single role will grant the same level of access to all
        environments within the application. You may also choose to assign
        different roles for each environment, based on your organization’s
        needs.
      </p>
      <hr />
      <!-- <div class="h4 mx-6 mb-5 mt-4 text--base-darkest">
        Types of team member roles
      </div>
      <ul class="body-lg">
        <li>
          <span class="font-weight-bold">Root administrator</span>
          Grants full access to manage all of your applications, including the
          ability to manage team members, control workspace configurations, and
          add/edit/remove applications. This role can only be added to the
          top-level portfolio workspace.
        </li>
        <li>
          <span class="font-weight-bold">Administrator</span>
          Grants full access to manage resources within the workspace, including
          the ability to manage team members, assign roles and control workspace
          settings.
        </li>
        <li>
          <span class="font-weight-bold">Contributor</span>
          Grants full access to manage resources within the workspace, but does
          not allow access to team management or workspace settings.
        </li>
        <li>
          <span class="font-weight-bold">Billing read-only</span>
          Grants access to view costs and manage cost configurations (e.g.
          budgets, exports), but does not allow access to view or make any
          changes to cloud resources.
        </li>
        <li>
          <span class="font-weight-bold">No Access</span>
          Team member cannot view any resources for the environment.
        </li>
      </ul> -->
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
  @PropSync("showScrollbar", {
    default: "Error Message from parent component validation",
  })
  _showScrollbar!: boolean;

  private isScollbarDisplayed(): boolean {
    this._showScrollbar = true;
    return true;
  }
}
</script>
