<template>
  <v-container fluid>
    <v-row>
      <div id="inputWidthFaker" ref="inputWidthFaker"></div>
      <v-col class="pl-0" cols="12">
        <h2 class="h2">Let’s add team members to {{ currentApplication }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 ma-0" cols="10">
        <p class="body-lg text--base-darkest">
          Invite your application team members and assign their permissions
          below. These individuals will receive an invitation from
          <span class="font-weight-bold"> {{ csp }}</span> after your portfolio
          is provisioned. Select <span class="font-weight-bold">Next</span> to
          add team members to your other applications.
          <a class="text-decoration-underline"
            >Learn more about team member roles</a
          >
        </p>
      </v-col>
    </v-row>
    <v-row v-if="currentApplication">
      <v-col class="ps-0 ma-0">
        <v-row>
          <v-col cols="12" class="d-flex pl-0 pr-0">
            <v-col class="d-flex">
              <v-text-field
                class="search-bar"
                placeholder="Search for member name and email"
                dense
                outlined
                single-line
                hide-details
              />
              <v-btn class="input-search-bar" color="primary">
                <v-icon width="10px" class="mr-1">search</v-icon>
              </v-btn>
            </v-col>
            <v-col class="d-flex flex-row-reverse">
              <v-btn
                role="button"
                class="font-weight-bold d-flex align-center px-5"
                :ripple="false"
                color="primary"
                @keydown.native.enter="openDialog($event)"
                @click="openDialog($event)"
              >
                <div class="mr-1 mt-n2">
                  <v-icon class="icon-20" role="presentation"
                    >control_point</v-icon
                  >
                </div>
                <div class="body font-weight-bold">Invite Team Member</div>
              </v-btn>
            </v-col>
          </v-col>
        </v-row>
        <v-row v-if="!membersData">
          <v-col cols="12" class="pa-0 ma-0">
            <v-card rounded width="100%" height="10rem" class="ma-4 ml-3 body">
              <v-card-text class="text-center">
                <v-row class="d-flex justify-space-around pt-4">
                  <v-col>
                    <span class="body-lg text--base-dark">{{ message }}</span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="ma-0">
            <v-data-table
              class="review-table"
              :headers="headers"
              :items="membersData"
              hide-default-footer
            >
              <template v-slot:header.display_name="{ header }">
                <div class="label font-weight-bold text--base-dark">
                  {{ header.text }}
                </div>
              </template>
              <template v-slot:header.workplace_access="{ header }">
                <div class="label font-weight-bold text--base-dark">
                  {{ header.text }}
                </div>
              </template>
              <template class="hello" v-slot:item.display_name="{ item }">
                <div class="body font-weight-bold pt-6">
                  {{ item.display_name }}
                </div>
                <div class="body text--base-dark pb-6">
                  {{ item.email }}
                </div>
              </template>
              <template v-slot:item.workplace_access="{ item }">
                <div class="d-flex justify-space-between">
                  <div class="body text--base-dark pt-3">
                    {{ item.workplace_access }}
                  </div>

                  <v-menu
                    class="table-menu"
                    transition="slide-y-transition"
                    offset-y
                    nudge-left="190"
                    tabindex="2"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :disabled="isDisabled(item.workplace_access)"
                        class="table-row-menu-button pa-0"
                        tabindex="1"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon class="icon-18 width-auto">more_horiz</v-icon>
                      </v-btn>
                    </template>
                    <v-list class="table-row-menu pa-0">
                      <v-list-item
                        tabindex="1"
                        v-for="(item, i) in options"
                        :key="i"
                      >
                        <v-list-item-title class="body-lg py-2">{{
                          item
                        }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

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
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class TeamView extends Vue {
  @Prop({ default: [] }) private application!: string;
  private membersData: any = [];

  private csp =
    this.$store.state.portfolioSteps[0].model.csp ||
    "the selected Cloud Service Provider’s";

  private message = "You do not have any team members in this application yet.";

  private headers = [
    { text: "Name", value: "display_name", align: "start" },
    { text: "Workplace Access ", value: "workplace_access", sortable: false },
  ];
  private options = ["Edit Info", "Change Role", "Remove team member"];

  // private tranformData(application: any): void {
  //   for (let value of application) {
  //     let obj: any = {};
  //     obj.id = value.id;
  //     obj.display_name = value.name;
  //     obj.description = value.description;
  //     let numArr = value.environments.map((env: any) => env?.operators?.length);
  //     obj.operators = numArr.reduce((a: any, b: any) => a + b) || 0;
  //     this.membersData.push(obj);
  //   }
  // }

  private isDisabled(workplace_access: string): boolean {
    if (workplace_access === "Administrator") {
      return true;
    }
    return false;
  }
}
</script>
