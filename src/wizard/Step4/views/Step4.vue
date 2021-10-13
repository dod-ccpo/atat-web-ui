<template>
  <v-container fluid>
    <div v-if="editType === 'noEdit'">
      <v-row>
        <div id="inputWidthFaker" ref="inputWidthFaker"></div>
        <v-col class="pl-0" cols="12">
          <h2 class="h2">Invite team members to your application</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pa-0 ma-0" cols="10">
          <span>
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
          </span>
        </v-col>
      </v-row>
    </div>
    <RootAdminView v-if="editType === 'portfolio'" />
    <TeamView v-if="editType === 'application'" />
    <v-row v-if="editType !== 'noEdit'">
      <v-col>
        <v-row class="pt-7">
          <v-col cols="9" class="py-0">
            <v-btn
              @click="showPortfolioOwnerText = !showPortfolioOwnerText"
              text
              x-small
              :ripple="false"
              class="pl-0 primary--text"
            >
              <span class="link-body-md">
                As the portfolio owner, will I have access to this application
                within the cloud console?
              </span>
              <v-icon>
                {{ showPortfolioOwnerText ? "expand_less" : "expand_more" }}
              </v-icon>
            </v-btn>
            <div v-show="showPortfolioOwnerText">
              <v-card-text class="h6 pb-0 ps-3">
                <v-row>
                  <p class="body-lg text--base-darkest">
                    Portfolio owners are not automatically granted access to the
                    cloud console. You will be able to track your team’s cloud
                    spend and other funding details in ATAT. If you need to
                    login to the cloud console, be sure to add yourself as a
                    team member and assign permissions in this step.
                  </p>
                </v-row>
              </v-card-text>
            </div>
          </v-col>
        </v-row>
        <v-row class="pt-5">
          <v-col cols="9" class="py-0">
            <v-btn
              @click="teamPortfolioAccessText = !teamPortfolioAccessText"
              text
              x-small
              :ripple="false"
              class="pl-0 primary--text"
            >
              <span class="link-body-md">
                Will my team members have access to this portfolio within ATAT?
              </span>
              <v-icon>
                {{ teamPortfolioAccessText ? "expand_less" : "expand_more" }}
              </v-icon>
            </v-btn>
            <div v-show="teamPortfolioAccessText">
              <v-card-text class="h6 pb-0 ps-3">
                <v-row>
                  <p class="body-lg text--base-darkest">
                    No. These team members will only have access to the cloud
                    provider’s console. After your portfolio is provisioned, you
                    will have an opportunity to add people as portfolio managers
                    and assign user roles for access within ATAT.
                  </p>
                </v-row>
              </v-card-text>
            </div>
          </v-col>
        </v-row>
        <v-row class="pt-5">
          <v-col cols="9" class="py-0">
            <v-btn
              @click="teamPermissionsText = !teamPermissionsText"
              text
              x-small
              :ripple="false"
              class="pl-0 primary--text"
            >
              <span class="link-body-md">
                Can I add team members or modify permissions after my portfolio
                is provisioned?
              </span>
              <v-icon>
                {{ teamPermissionsText ? "expand_less" : "expand_more" }}
              </v-icon>
            </v-btn>
            <div v-show="teamPermissionsText">
              <v-card-text class="h6 pb-0 ps-3">
                <v-row>
                  <p class="body-lg text--base-darkest">
                    After provisioning, you will have the opportunity to invite
                    new people to ensure your application team can access their
                    cloud resources.
                  </p>
                  <p class="body-lg text--base-darkest">
                    However, you will not be able to change roles and
                    permissions once the invitations are sent. People that you
                    assign as
                    <span class="font-weight-bold">Administrators</span> are
                    responsible for making modifications to team members and
                    roles directly in the cloud console.
                  </p>
                  <p class="body-lg text--base-darkest">
                    Please note that ATAT is not a system of record. We will
                    keep a record of the team members that have been added to
                    the portfolio through ATAT, but any changes made in the
                    cloud console after provisioning will not be reflected
                    within ATAT.
                  </p>
                </v-row>
              </v-card-text>
            </div>
          </v-col>
        </v-row>
        <v-row class="mb-16 pt-5">
          <v-col cols="9" class="py-0">
            <v-btn
              @click="teamExpectationText = !teamExpectationText"
              text
              x-small
              :ripple="false"
              class="pl-0 primary--text"
            >
              <span class="link-body-md">
                What can my team members expect?
              </span>
              <v-icon>
                {{ teamExpectationText ? "expand_less" : "expand_more" }}
              </v-icon>
            </v-btn>
            <div v-show="teamExpectationText">
              <v-card-text class="h6 pb-0 mb-12">
                <v-row>
                  <ul class="body-lg text--base-darkest">
                    <li>
                      After your portfolio is provisioned, each team member will
                      receive an invitation from the cloud service provider.
                      People will only have access to environments in the cloud
                      console that you granted them access to.
                    </li>
                    <li class="text-base-error">
                      Invitations expire after XX days. If this happens, you can
                      resend the invitation within ATAT?
                    </li>
                  </ul>
                </v-row>
              </v-card-text>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import AddMembers from "@/wizard/Step4/components/AddMembers.vue";
import { ApplicationModel } from "types/Portfolios";
import dashBoardPage from "tests/e2e/page_objects/dashBoard";
import RootAdminView from "@/wizard/Step4/views/RootAdminView.vue";
import TeamView from "@/wizard/Step4/views/TeamView.vue";

Component.registerHooks(["beforeRouteLeave"]);
@Component({
  components: {
    AddMembers,
    RootAdminView,
    TeamView,
  },
})
export default class Step_4 extends Vue {
  private incomingModel!: ApplicationModel;
  private csp =
    this.$store.state.portfolioSteps[0].model.csp ||
    "the selected Cloud Service Provider’s";
  private createdApplication = this.$store.state.applicationModels;
  private editType = this.$route.params.type || "noEdit";
  private showPortfolioOwnerText = false;
  private teamPortfolioAccessText = false;
  private teamPermissionsText = false;
  private teamExpectationText = false;
  // methods

  private openSideDrawer(event: Event): void {
    this.$store.dispatch("openSideDrawer", [
      "teammemberroles",
      event.type === "keydown",
    ]);
  }

  public openDialog(event: Event): void {
    this.$store.dispatch("openDialog", [
      "addMembers",
      event.type === "keydown",
      "632px",
      "90",
    ]);
  }

  public async mounted(): Promise<void> {
    this.incomingModel = JSON.parse(
      JSON.stringify(this.$store.getters.getCurrentApplication)
    ) as ApplicationModel;
    // EJY need to rethink validating this step. Saving to store with each modal "Add Team Members" button click
    // this.$store.dispatch("saveStepModel", [{}, 4, true]);
  }

  private hasChanges(): boolean {
    let theSame = true;
    const serializedIncoming = JSON.stringify(this.incomingModel);
    const serialiedOutgoing = JSON.stringify(
      this.$store.getters.getCurrentApplication
    );
    theSame = serializedIncoming === serialiedOutgoing;

    return !theSame;
  }

  public async beforeRouteLeave(
    to: unknown,
    from: unknown,
    next: (n: void) => void
  ): Promise<void> {
    if (this.hasChanges()) {
      await this.$store.dispatch("saveStepData", 3);
    }

    next();
    // temp until actually saving data to store
    this.$store.dispatch("saveStepModel", [{}, 4, true]);
  }
}
</script>
