<template>
  <div>
    <p>
      Roles determine what people can see and do within the cloud provider’s
      console. Administrative roles are for the designated people responsible
      for managing accounts and configuring workspace settings.
      Non-administrative roles let people work within the cloud resources or
      access key features.
    </p>
    <p>
      Assigning a single role will grant the same level of access to all
      environments within the application. You may also choose to assign
      different roles for each environment, based on your organization’s needs.
    </p>
    <v-divider class="my-5"></v-divider>
    <h3 class="mt-4 mb-1">Types of team member roles</h3>
    <p>Below is a list of the roles available for your team members:</p>
    <dl class="dl-bullets">
      <dt>Root administrator</dt>
      <dd>
        Grants full access to manage all of your applications, including the
        ability to manage team members, control workspace configurations, and
        add/edit/remove applications. This role can only be added to the
        top-level portfolio workspace.
      </dd>
      <dt>Administrator</dt>
      <dd>
        Grants full access to manage resources within the workspace, including
        the ability to manage team members, assign roles, and control workspace
        settings.
      </dd>
      <dt>Contributor</dt>
      <dd>
        Grants full access to manage resources within the workspace, but does
        not allow access to team management or workspace settings.
      </dd>
      <dt>Billing read-only</dt>
      <dd>
        Grants access to view and manage cost configurations (e.g. budgets,
        exports), but does not allow access to view or make any changes to cloud
        resources.
      </dd>
      <dt>No Access</dt>
      <dd>Team members cannot view any resources for the environment.</dd>
    </dl>

    <v-alert
      role="presentation"
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
    <h3 class="mb-1">Additional roles and permissions</h3>
    <p class="pb-10">
      Each cloud provider offers additional controls to manage your application
      team’s permissions. Administrators can customize these permissions
      directly in the cloud console.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class AboutMemberRoleContent extends Vue {}
</script>
