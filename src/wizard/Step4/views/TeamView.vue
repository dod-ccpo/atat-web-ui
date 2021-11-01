<template>
  <div class="body-lg">
    <div id="inputWidthFaker" ref="inputWidthFaker"></div>
    <div class="content-max-width">
      <h1>Let’s add team members to {{ currentApplication.name }}</h1>
      <p>
        Invite your application team members and assign their permissions
        below. These individuals will receive an invitation from
        <span class="font-weight-bold"> {{ csp }}</span> after your portfolio
        is provisioned. Select <span class="font-weight-bold">Next</span> to
        add team members to your other applications.
        <a
          role="button"
          tabindex="0"
          @click="openSideDrawer($event)"
          @keydown.enter="openSideDrawer($event)"
        >
          <span class="link-body-md">Learn more about team member roles</span>
        </a>
      </p>
    </div>

    <v-row v-if="currentApplication">
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
          <v-icon>search</v-icon>
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
          <div class="mr-1 mt-n1">
            <v-icon class="icon-20" aira-hidden="true" role="presentation">
              control_point
            </v-icon>
          </div>
          <div class="body font-weight-bold">Invite Team Members</div>
        </v-btn>
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
          :items-per-page="-1"
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
                tabindex="0"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :disabled="isDisabled(item.workspace_roles)"
                    class="table-row-menu-button pa-0"
                    tabindex="0"
                    v-bind="attrs"
                    v-on="on"
                    @click="setMember(item)"
                    aria-label="Edit or remove team member"
                  >
                    <v-icon aria-hidden="true" class="icon-18 width-auto">
                      more_horiz
                    </v-icon>
                  </v-btn>
                </template>
                <v-list class="table-row-menu pa-0">
                  <v-list-item
                    tabindex="0"
                    v-for="(item, i) in options"
                    :key="i"
                    @click="tableOptionClick(item, $event)"
                  >
                    <v-list-item-title class="body-lg py-2">
                      {{ item }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-data-table>
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
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Emit, Watch } from "vue-property-decorator";
import { ApplicationModel } from "../../../../types/Portfolios";

@Component({})
export default class TeamView extends Vue {
  private membersData: any = [];
  private filteredData: any = [];
  private isFiltered = false;
  private search = "";
  private csp = this.$store.getters.getPortfolio.csp;

  private message = "You do not have any team members in this application yet.";

  private headers = [
    { text: "Name", value: "display_name", align: "start" },
    { text: "Workplace Access ", value: "workspace_roles", sortable: false },
  ];
  private options = ["Edit info and roles", "Remove team member"];
  private applicationMembers: {
    id: string;
    display_name: string;
    email: string;
    workspace_roles: string;
  }[] = [];
  private setMemberTableData() {
    if (this.$store.state.portfolioOperators) {
      const rootAdmins = this.$store.state.portfolioOperators || [];
      if (rootAdmins && rootAdmins.length) {
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
    }
    if (this.currentApplication.operators) {
      const applicationOperators = this.currentApplication.operators || [];
      if (applicationOperators && applicationOperators.length) {
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
    }
    if (this.currentApplication.environments) {
      const applicationEnvironments = this.currentApplication.environments;
      applicationEnvironments.forEach((env: any) => {
        const envOperators = env.operators;
        if (envOperators && envOperators.length > 0) {
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
        }
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
    let memberProps: {
      isRootAdmin: boolean;
      isEditSingle: boolean;
      memberEmail: string | null;
    } = {
      isRootAdmin: false,
      isEditSingle: false,
      memberEmail: "",
    };
    const currentTarget = event.currentTarget as HTMLElement;
    if (
      currentTarget &&
      currentTarget.innerText.toLowerCase() === "edit info and roles"
    ) {
      memberProps = {
        isRootAdmin: false,
        isEditSingle: true,
        memberEmail: this.member.email,
      };
    }

    this.$store.dispatch("openDialog", [
      "manageMembers",
      event.type === "keydown",
      "632px",
      "",
      memberProps,
    ]);
  }
  @Watch("$store.state.dialog.isDisplayed")
  setFocus(newVal: boolean): void {
    if (!newVal) {
      this.applicationMembers = [];
      this.membersData = [];
      this.setMemberTableData();
      this.tranformData();
    }
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

  private tableOptionClick(item: any, event: Event): void {
    if (item.toLowerCase() === "remove team member") {
      this.dialogTitle = `Remove ${this.member.display_name}`;
      this.dialogMessage = `${this.member.display_name} will be removed from your ${this.currentApplication.name} team.  Any roles and permissions you assigned will not be saved.`;
      this.showDialogWhenClicked = true;
    } else if (item.toLowerCase() === "edit info and roles") {
      this.openDialog(event);
    }
  }

  private setMember(item: any) {
    this.member = item;
  }

  private deleteMemberFromApplication() {
    if (this.currentApplication.operators) {
      const applicationOperators = this.currentApplication.operators || [];
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
        const envOperators = env.operators || [];
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

  private openSideDrawer(event: Event): void {
    this.$store.dispatch("openSideDrawer", [
      "teammemberroles",
      event.type === "keydown",
    ]);
  }

  public async mounted(): Promise<void> {
    this.setMemberTableData();
    this.tranformData();
  }
}
</script>
