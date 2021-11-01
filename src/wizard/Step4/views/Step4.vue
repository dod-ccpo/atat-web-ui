<template>
  <v-container fluid>
    <div v-if="editType === 'noEdit'">
      <v-row>
        <div id="inputWidthFaker" ref="inputWidthFaker"></div>
        <v-col class="pl-0 content-max-width">
          <h1>Invite team members to your application</h1>
          <p class="body-lg text--base-darkest">
            In this section, you will be able to invite people from your
            application’s development team and assign permission levels, so
            they can contribute to your workspaces within the
            <span class="font-weight-bold">{{ csp }}</span> console.
          </p>
          <p class="body-lg text--base-darkest">
            In order to invite team members, you must set up at least one
            application within your portfolio. Please
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
      <expandable-link
        header="As the portfolio owner, will I have access to this application
          within the cloud console?"
        content="Portfolio owners are not automatically granted access to the
          cloud console. You will be able to track your team’s cloud
          spend and other funding details in ATAT. If you need to
          login to the cloud console, be sure to add yourself as a
          team member and assign permissions in this step."
      />
      <expandable-link
        header="Will my team members have access to this portfolio within ATAT?"
        content="No. These team members will only have access to the cloud
          provider’s console. After your portfolio is provisioned, you
          will have an opportunity to add people as portfolio managers
          and assign user roles for access within ATAT."
      />
      <expandable-link
        header="Can I add team members or modify permissions after my portfolio
          is provisioned?"
        content="<p>
            After provisioning, you will have the opportunity to invite
            new people to ensure your application team can access their
            cloud resources.
          </p>
          <p>
            However, you will not be able to change roles and
            permissions once the invitations are sent. People that you
            assign as
            <span class='font-weight-bold'>Administrators</span> are
            responsible for making modifications to team members and
            roles directly in the cloud console.
          </p>
          <p class='mb-0'>
            Please note that ATAT is not a system of record. We will
            keep a record of the team members that have been added to
            the portfolio through ATAT, but any changes made in the
            cloud console after provisioning will not be reflected
            within ATAT.
          </p>"
      />
      <expandable-link
        header="What can my team members expect?"
        content="<ul class='body-lg text--base-darkest'>
            <li>
              After your portfolio is provisioned, each team member will
              receive an invitation from the cloud service provider.
              People will only have access to environments in the cloud
              console that you granted them access to.
            </li>
            <li class='text-base-error'>
              Invitations expire after XX days. If this happens, you can
              resend the invitation within ATAT?
            </li>
          </ul>"
      />
    </section>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ManageMembers from "@/wizard/Step4/components/ManageMembers.vue";
import RootAdminView from "@/wizard/Step4/views/RootAdminView.vue";
import TeamView from "@/wizard/Step4/views/TeamView.vue";
import ExpandableLink from "../../components/ExpandableLink.vue";

@Component({
  components: {
    ExpandableLink,
    ManageMembers,
    RootAdminView,
    TeamView,
  },
})
export default class Step_4 extends Vue {
  private csp = this.$store.getters.getPortfolio.csp;
  private createdApplication = this.$store.state.applicationModels;
  private editType = this.$route.params.type || "noEdit";

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
