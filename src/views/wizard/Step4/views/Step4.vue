<template>
  <v-container fluid>
    <div v-if="editType === 'noEdit'">
      <v-row>
        <div id="inputWidthFaker" ref="inputWidthFaker"></div>
        <v-col class="pl-0 content-max-width">
          <h1 tabindex="-1">Invite team members to your application</h1>
          <p class="body-lg text--base-darkest">
            In this section, you can invite people from your application’s
            development team and assign permission levels, so they can
            contribute to your workspaces within the
            <strong>{{ csp }}</strong> console.
          </p>
          <p class="body-lg text--base-darkest">
            To invite team members, set up at least one application within your
            portfolio. Please
            <a
              href="/wizard/addapplication"
              class="link-body-md font-weight-bold"
            >
              add an application
            </a>
            to continue.
          </p>
        </v-col>
      </v-row>
    </div>
    <RootAdminView v-if="editType === 'portfolio'" />
    <TeamView v-if="editType === 'application'" />
    <section
      v-if="editType !== 'noEdit'"
      class="mt-10"
      title="Application Member FAQs"
      role="region"
    >
      <expandable-link aria-id="TeamMemberFAQ1">
        <template v-slot:header>
          As the portfolio owner, will I have access to this workspace within
          the cloud console?
        </template>
        <template v-slot:content>
          Portfolio owners are not automatically granted access to the cloud
          console. You will be able to track your team’s cloud spend and other
          funding details in ATAT. If you need to login to the cloud console, be
          sure to add yourself as a team member and assign permissions in this
          step.
        </template>
      </expandable-link>

      <expandable-link aria-id="TeamMemberFAQ2">
        <template v-slot:header>
          Will my team members have access to this portfolio within ATAT?
        </template>
        <template v-slot:content>
          No. These team members will only have access to the cloud provider’s
          console. After your portfolio is provisioned, you will have an
          opportunity to add people as portfolio managers and assign user roles
          for access within ATAT.
        </template>
      </expandable-link>

      <expandable-link aria-id="TeamMemberFAQ3">
        <template v-slot:header>
          Can I add team members or modify permissions after my portfolio is
          provisioned?
        </template>
        <template v-slot:content>
          <p>
            After provisioning, you can invite new people to ensure your
            application team can access their cloud resources.
          </p>
          <p>
            However, you will not be able to change roles and permissions once
            the invitations are sent. <strong>Administrators</strong> are
            responsible for making modifications to team members and roles
            directly in the cloud console.
          </p>
          <p class="mb-0">
            Please note that ATAT is not a system of record. We will keep a
            record of the team members that have been added to the portfolio
            through ATAT, but any changes made in the cloud console after
            provisioning will not be reflected within ATAT.
          </p>
        </template>
      </expandable-link>

      <expandable-link aria-id="TeamMemberFAQ4">
        <template v-slot:header>What can my team members expect?</template>
        <template v-slot:content>
          After your portfolio is provisioned, each team member will receive an
          invitation from the CSP. Only the people with granted access will have
          access to environments in the cloud console.
        </template>
      </expandable-link>
    </section>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ManageMembers from "@/views/wizard/Step4/components/ManageMembers.vue";
import RootAdminView from "@/views/wizard/Step4/views/RootAdminView.vue";
import TeamView from "@/views/wizard/Step4/views/TeamView.vue";
import ExpandableLink from "@/components/ExpandableLink.vue";

Component.registerHooks(["beforeRouteLeave"]);
@Component({
  components: {
    ExpandableLink,
    ManageMembers,
    RootAdminView,
    TeamView,
  },
})
export default class Step_4 extends Vue {
  private csp = this.$store.getters["wizard/getPortfolio"].csp;
  private editType = this.$route.params.type || "noEdit";
  public hasChanges = this.$store.getters["wizard/membersModified"];
  public hasPortfolioHadMembersAdded =
    this.$store.getters["applications/portfolioHasHadMembersAdded"];

  public async beforeRouteLeave(
    to: unknown,
    from: unknown,
    next: (n: void) => void
  ): Promise<void> {
    if (this.hasChanges || this.hasPortfolioHadMembersAdded) {
      try {
        await this.$store.dispatch("wizard/saveStepData", 4);
        await this.$store.dispatch("wizard/setStepTouched", {
          stepNumber: 4,
          isTouched: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }

  // methods

  public openDialog(event: Event, action: string, memberEmail: string): void {
    let memberProps: {
      isRootAdmin: boolean;
      isEditSingle: boolean;
      memberEmail: string | null;
    } = {
      isRootAdmin: false,
      isEditSingle: false,
      memberEmail: null,
    };
    switch (action) {
      case "add root admins":
        memberProps = {
          isRootAdmin: true,
          isEditSingle: false,
          memberEmail: null,
        };
        break;
      case "edit root admin":
        memberProps = {
          isRootAdmin: true,
          isEditSingle: true,
          memberEmail: memberEmail,
        };
        break;
      case "add members":
        memberProps = {
          isRootAdmin: false,
          isEditSingle: false,
          memberEmail: null,
        };
        break;
      case "edit member":
        memberProps = {
          isRootAdmin: false,
          isEditSingle: true,
          memberEmail: memberEmail,
        };
        break;
      default:
        break;
    }

    this.$store.dispatch("openDialog", [
      "manageMembers",
      event.type === "keydown",
      "632px",
      "",
      memberProps,
    ]);
  }
}
</script>
