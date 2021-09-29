<template>
  <v-container fluid>
    <v-row>
      <v-col class="pa-0 ma-0" cols="12">
        <h2 v-if="!createdApplication" class="h2">
          Invite team members to your application
        </h2>
        <h2 v-else class="h2">
          Let's add team members to {{ createdApplication }}
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 ma-0" cols="9">
        <p v-if="!createdApplication">
          In this section, you will be able to invite people from your
          application’s development team and assign permission levels, so they
          can contribute to your workspaces within the
          <span class="font-weight-bold"> {{ csp }}</span> console.
          <br />
          <br />
          In order to invite team members, you must set up at least one
          application within your portfolio. Please
          <a href="/wizard/addapplication" class="link-body-md font-weight-bold"
            >add an application
          </a>
          to continue.
        </p>
        <p v-else>
          In this section, we will invite people from your application’s
          development team and assign their permissions within the cloud
          console. These individuals will receive an invitation from
          <span class="font-weight-bold"> {{ csp }}</span> after your portfolio
          is provisioned. When you are done, select
          <span class="font-weight-bold">Next: Review and Submit</span> to
          finalize your portfolio.
          <a class="text-decoration-underline"
            >Learn more about team member roles</a
          >
        </p>
      </v-col>
    </v-row>
    <v-row v-if="createdApplication">
      <v-col class="pa-0 ma-0">
        <v-row>
          <v-col cols="9" class="d-flex pl-0">
            <v-col class="d-flex">
              <v-text-field
                class="search-bar"
                placeholder="Search for member name and email"
                dense
                outlined
                height="5"
                single-line
                hide-details
              >
              </v-text-field>
              <v-btn height="40" class="input-search-bar" color="primary"
                ><v-icon>search</v-icon></v-btn
              >
            </v-col>
            <v-col class="d-flex flex-row-reverse">
              <v-btn
                role="button"
                class="font-weight-bold align-center"
                :ripple="false"
                color="primary"
              >
                <v-icon class="mr-2 ml-1" role="presentation"
                  >control_point</v-icon
                >Invite Team Member
              </v-btn>
            </v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="9" class="pa-0 ma-0">
            <v-card width="100rem" class="v-card ma-4 ml-3 body">
              <v-card-text class="text-center">
                <span class="body-lg text--base-dark">{{ message }}</span>
              </v-card-text>
            </v-card></v-col
          >
        </v-row>

        <v-row>
          <v-col cols="10">
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
        <v-row>
          <v-col cols="10">
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
        <v-row>
          <v-col cols="10">
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
                    cloud resources.<br /><br />
                    However, you will not be able to change roles and
                    permissions once the invitations are sent. People that you
                    assign as
                    <span class="font-weight-bold">Administrators </span> are
                    responsible for making modifications to team members and
                    roles directly in the cloud console.<br /><br />
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
        <v-row>
          <v-col cols="10">
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
              <v-card-text class="h6 pb-0">
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

@Component({})
export default class Step_4 extends Vue {
  private csp =
    this.$store.state.portfolioSteps[0].model.csp ||
    "selected Cloud Service Provider's";
  private createdApplication = this.$store.state.portfolioSteps[2].model.name;
  private teamMembers = "";
  private message = "You do not have any team members in this application yet";
  private showPortfolioOwnerText = false;
  private teamPortfolioAccessText = false;
  private teamPermissionsText = false;
  private teamExpectationText = false;
  private handleClick(): void {
    console.log("clicked");
  }

  public mounted(): void {
    console.log(this.csp);
    this.$store.dispatch("saveStepModel", [{}, 4, true]);
  }
}
</script>

<style scoped></style>
