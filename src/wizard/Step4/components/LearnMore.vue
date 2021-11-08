<template>
  <div id="learnMoreDrawer" class="modal__title--sticky">
    <v-card-title class="modal__title modal__title--border-bottom">
      <h2 class="modal__title__text mb-0" tabindex="-1" id="learnMoreHeading">
        <span v-if="learnMoreType === 'member-roles'">
          Understanding member roles
        </span>
        <span v-if="learnMoreType === 'root-admins'">
          About root administrators
        </span>
      </h2>

      <v-btn
        id="closeModalButton"
        @click="closeLearnMoreDrawer()"
        class="pa-0 mr-3 bg-transparent modal__slideout__button-close"
        min-width="25"
        aria-label="Close Learn More Panel"
      >
        <v-icon aria-hidden="true" size="25">arrow_back</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text
      id="modalContent"
      v-if="learnMoreType === 'member-roles'"
      class="body-lg"
    >
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

      <v-divider></v-divider>

      <h3 class="mt-5">Types of team member roles</h3>
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
          the ability to manage team members, assign roles and control workspace
          settings.
        </dd>
        <dt>Contributor</dt>
        <dd>
          Grants full access to manage resources within the workspace, but does
          not allow access to team management or workspace settings.
        </dd>
        <dt>Billing read-only</dt>
        <dd>
          Grants access to view costs and manage cost configurations (e.g.
          budgets, exports), but does not allow access to view or make any
          changes to cloud resources.
        </dd>
        <dt>No Access</dt>
        <dd>Team member cannot view any resources for the environment.</dd>
      </dl>

      <v-alert
        outlined
        color="cyan"
        type="info"
        class="text-left cyan info_lighter black-icon"
        border="left"
      >
        <div class="black--text body-lg">
          Team member roles do not grant access to your portfolio within ATAT.
          These roles only assign a level of permissions and access to
          workspaces within the cloud console.
        </div>
      </v-alert>

      <v-divider class="mb-5 mt-6"></v-divider>

      <strong>Additional roles and permissions</strong>
      <p>
        Each cloud provider offers additional controls to manage your
        application team’s permissions. Administrators can customize these
        permissions directly in the cloud console.
      </p>
    </v-card-text>

    <v-card-text
      id="modalContent"
      v-if="learnMoreType === 'root-admins'"
      class="body-lg"
    >
      <p>
        <strong>Root administrators</strong> have the highest level of access to
        your resources within the cloud console. This role is designed for
        people responsible for managing accounts, configuring workspace
        settings, as well as adding or removing applications and environments.
      </p>
      <p>
        Team members can only be added or removed as
        <strong>root administrators</strong> from your top-level portfolio
        workspace. These people will be automatically added to each of your
        application teams.
      </p>
      <p>
        You can assign a basic <strong>administrator</strong> role to members
        within an individual application team. This will grant full access to
        manage accounts and settings within the application, but does not
        provide access to add, edit or remove other applications within your
        portfolio.
      </p>

      <v-alert
        outlined
        color="cyan"
        type="info"
        class="text-left cyan info_lighter black-icon mt-6"
        border="left"
      >
        <div class="black--text body-lg">
          Root administrators are not granted access to your portfolio within
          ATAT. This role only assigns permissions to workspaces within the
          cloud console.
        </div>
      </v-alert>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class LearnMoreMemberRoles extends Vue {
  @Prop() private learnMoreType!: string;
  @Prop() private bus: any;

  public closeLearnMoreDrawer(): void {
    this.$emit("close-learn-more-drawer");
  }

  public created(): void {
    this.bus.$on("openLearnMore", () => {
      setTimeout(() => {
        // for 508 compliance, focus on heading when drawer opens
        document.getElementById("learnMoreHeading")?.focus();

        this.$nextTick(() => {
          const modalContent = document.getElementById(
            "manageMembersModal"
          ) as HTMLDivElement;
          if (modalContent) {
            const scrollEl = modalContent.closest(
              ".v-navigation-drawer__content"
            );
            if (scrollEl) {
              scrollEl.scrollTop = 0;
            }
          }
        });
      }, 100);
    });
  }
}
</script>
