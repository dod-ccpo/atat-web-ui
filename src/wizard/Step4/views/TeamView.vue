<template>
  <v-container fluid>
    <v-row>
      <div id="inputWidthFaker" ref="inputWidthFaker"></div>
      <v-col class="pl-0" cols="12">
        <h2 class="h2">
          Let’s add team members to {{ currentApplication.name }}
        </h2>
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
                v-model="search"
                class="search-bar"
                placeholder="Search for member name and email"
                dense
                outlined
                single-line
                hide-details
                clearable
                @click:clear="searchTable('')"
                @keydown.native.enter="searchTable(search)"
                @blur="searchTable(search)"
              />
              <v-btn
                class="input-search-bar"
                color="primary"
                @click="searchTable(search)"
              >
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
        <v-row v-if="membersData.length === 0">
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
        <v-row v-if="membersData.length > 0">
          <v-col cols="12" class="ma-0">
            <v-data-table
              class="review-table"
              :headers="headers"
              :items="isFiltered ? filteredData : membersData"
              hide-default-footer
              dense
              :sort-by="['name']"
            >
              <template v-slot:header.display_name="{ header }">
                <div
                  class="label font-weight-bold text--base-dark mr-5"
                  tabindex="3"
                >
                  {{ header.text }}
                </div>
              </template>
              <template v-slot:header.workspace_roles="{ header }">
                <div class="label font-weight-bold text--base-dark">
                  {{ header.text }}
                </div>
              </template>
              <template v-slot:item.display_name="{ item }">
                <div class="pt-6 pb-6">
                  <div class="body font-weight-bold">
                    {{ item.display_name }}
                  </div>
                  <div class="body text--base-dark">
                    {{ item.email }}
                  </div>
                </div>
              </template>
              <template v-slot:item.workspace_roles="{ item }">
                <div class="d-flex justify-space-between pb-6 pt-6">
                  <div class="d-flex flex-column body text--base-dark">
                    <div v-for="value in item.workspace_roles" :key="value">
                      {{ value }}
                    </div>
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
                        :disabled="isDisabled(item.workspace_roles)"
                        class="table-row-menu-button"
                        tabindex="1"
                        v-bind="attrs"
                        v-on="on"
                        @click="setMember(item)"
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
                        <v-list-item-title
                          @click="tableOptionClick(item)"
                          class="body-lg py-2"
                          >{{ item }}</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <atat-modal-delete
      v-show="hasDialog"
      :showDialogWhenClicked.sync="showDialogWhenClicked"
      :title="dialogTitle"
      :message="dialogMessage"
      :cancelText="cancelText"
      persistent
      no-click-animation
      :okText="okText"
      :width="dialogWidth + 'px'"
      v-on:delete="onDelete"
    />
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Emit } from "vue-property-decorator";
import { ApplicationModel } from "../../../../types/Portfolios";

@Component({})
export default class TeamView extends Vue {
  private membersData: any = [];
  private filteredData: any = [];
  private isFiltered = false;
  private search = "";
  private csp =
    this.$store.state.portfolioSteps[0].model.csp ||
    "the selected Cloud Service Provider’s";

  private message = "You do not have any team members in this application yet.";

  private headers = [
    { text: "Name", value: "display_name", align: "start" },
    { text: "Workplace Access ", value: "workspace_roles", sortable: false },
  ];
  private options = ["Edit Info", "Change Role", "Remove team member"];
  private applicationMembers: {
    id: string;
    display_name: string;
    email: string;
    workspace_roles: string;
  }[] = [];
  private setMemberTableData() {
    if (this.$store.state.portfolioOperators) {
      const rootAdmins = this.$store.state.portfolioOperators;
      rootAdmins.forEach((op: any) => {
        const opObj = {
          id: op.id,
          display_name: op.display_name || op.first_name + " " + op.last_name,
          email: op.email,
          workspace_roles: "Root administrator",
        };
        this.applicationMembers.push(opObj);
      });
    }
    if (this.currentApplication.operators) {
      const applicationOperators = this.currentApplication.operators;
      applicationOperators.forEach((op: any) => {
        const opObj = {
          id: op.id,
          display_name: op.display_name || op.first_name + " " + op.last_name,
          email: op.email,
          workspace_roles: this.roleTranslation(op.access), // get nice name, not enum
        };
        this.applicationMembers.push(opObj);
      });
    }
    if (this.currentApplication.environments) {
      const applicationEnvironments = this.currentApplication.environments;
      applicationEnvironments.forEach((env: any) => {
        const envOperators = env.operators;
        envOperators.forEach((op: any) => {
          const i = this.applicationMembers.findIndex(
            (o) => o.email === op.email
          );
          const workspace_roles =
            i > -1
              ? env.name +
                ": " +
                this.roleTranslation(op.access) +
                "  " +
                this.applicationMembers[i].workspace_roles
              : env.name + ": " + this.roleTranslation(op.access);
          if (i > -1) {
            this.applicationMembers[i].workspace_roles = workspace_roles;
          } else {
            const opObj = {
              id: op.id,
              display_name:
                op.display_name || op.first_name + " " + op.last_name,
              email: op.email,
              workspace_roles: workspace_roles,
            };
            this.applicationMembers.push(opObj);
          }
        });
      });
    }
  }

  private tranformData(): void {
    for (let value of this.applicationMembers) {
      let workspaceArr = value.workspace_roles.split("  ");
      const opObj = {
        id: value.id,
        display_name: value.display_name,
        email: value.email,
        workspace_roles: workspaceArr,
      };
      this.membersData.push(opObj);
    }
  }

  private isDisabled(workplace_access: string): boolean {
    if (workplace_access.includes("Root administrator")) {
      return true;
    }
    return false;
  }

  private searchTable(value: string) {
    if (!value) {
      this.isFiltered = false;
    } else {
      this.isFiltered = true;
      this.filteredData = this.membersData.filter((data: any) => {
        return (
          data.display_name.toLowerCase().includes(value.toLowerCase()) ||
          data.email.toLowerCase().includes(value.toLowerCase())
        );
      });
    }
  }

  private roleTranslation(role: string): string {
    switch (role) {
      case "portfolio_administrator":
        return "Root administrator";
      case "administrator":
        return "Administrator";
      case "contributor":
        return "Contributer";
      case "read_only":
        return "Billing read-only";
      default:
        return "Unauthorized";
    }
  }

  public openDialog(event: Event): void {
    this.$store.dispatch("openDialog", [
      "addMembers",
      event.type === "keydown",
      "632px",
      "90",
    ]);
  }
  //Dialog stuff
  private okText = "Remove Team Member";
  private cardWidth = "40";
  private cancelText = "Cancel";
  private hasDialog = true;
  private dialogWidth = "450";
  @Emit("delete")
  private onDelete(): void {
    this.deleteMemberFromApplication();
  }
  private dialogMessage = "";
  private dialogTitle = "";
  private showDialogWhenClicked = false;
  private member: any;

  private tableOptionClick(item: any): void {
    if (item === "Remove team member") {
      this.dialogTitle = `Remove ${this.member.display_name}`;
      this.dialogMessage = `${this.member.display_name} will be removed from your ${this.currentApplication.name} team.  Any roles and permissions you assigned will not be saved.`;
    }
    this.showDialogWhenClicked = true;
  }

  private setMember(item: any) {
    this.member = item;
  }

  private deleteMemberFromApplication() {
    if (this.currentApplication.operators) {
      const applicationOperators = this.currentApplication.operators;
      let memberindx = applicationOperators.findIndex(
        (item) => item.email === this.member.email
      );
      if (memberindx > -1) {
        applicationOperators.splice(memberindx, 1);
      }
    }
    if (this.currentApplication.environments) {
      const applicationEnvironments = this.currentApplication.environments;
      applicationEnvironments.forEach((env: any) => {
        const envOperators = env.operators;
        let memberindx = envOperators.findIndex(
          (item: any) => item.email === this.member.email
        );
        if (memberindx > -1) {
          envOperators.splice(memberindx, 1);
        }
      });
    }
    const itemToRemoveFromMembersData = this.membersData.findIndex(
      (m: any) => m.email === this.member.email
    );
    this.membersData.splice(itemToRemoveFromMembersData, 1);

    //in case the user is removing from filtered data
    if (this.filteredData.length > 0) {
      const itemToRemoveFromFilteredData = this.filteredData.findIndex(
        (m: any) => m.email === this.member.email
      );
      this.filteredData.splice(itemToRemoveFromFilteredData, 1);
    }
  }

  get currentApplication(): ApplicationModel {
    return this.$store.getters.getCurrentApplication;
  }

  public async mounted(): Promise<void> {
    this.setMemberTableData();
    this.tranformData();
  }
}
</script>
