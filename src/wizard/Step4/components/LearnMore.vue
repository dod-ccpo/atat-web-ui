<template>
  <div id="learnMoreDrawer" class="modal__title--sticky">
    <v-card-title class="modal__title modal__title--border-bottom">
      <h2 class="modal__title__text mb-8" tabindex="-1" id="learnMoreHeading">
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
        class="pa-0 mr-3 mb-8 bg-transparent modal__slideout__button-close"
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
      <about-member-role-content />
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
        settings, and adding or removing applications and environments.
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
        provide access to add, edit, or remove other applications within your
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
import AboutMemberRoleContent from "@/components/SideDrawerComponents/AboutMemberRoleContent.vue";

@Component({
  components: {
    "about-member-role-content": AboutMemberRoleContent,
  },
})
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
