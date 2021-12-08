<template>
  <div class="body-lg">
    <div id="inputWidthFaker" ref="inputWidthFaker"></div>
    <div class="content-max-width">
      <h1 tabindex="-1">
        {{
          noAppOrEnvOperatorsOnLoad
            ? "Let’s add team members to " + currentApplication.name
            : "Let’s update your " + currentApplication.name + " team"
        }}
      </h1>
      <p>
        <span v-if="noAppOrEnvOperatorsOnLoad">
          Invite your application team members and assign their permissions
          below. These individuals will receive an invitation from
          {{ csp }} after your portfolio is provisioned. Select
          <strong>Next</strong> to add team members to your other applications.
        </span>
        <span v-else>
          The following people will be granted access to your application within
          the {{ csp }} console after your portfolio is provisioned. You can
          <strong>invite</strong> additional team members or
          <strong>modify</strong> permissions below.

          <span v-if="isReturnToReview">
            When you are done, select
            <strong>Return to Review and Submit</strong>
            to finalize your portfolio.
          </span>
          <span v-else>
            When you are done, select
            <strong>Next</strong> to view all of your workspace teams.
          </span>
        </span>

        <a
          class="text-link"
          role="button"
          tabindex="0"
          @click="openSideDrawer($event, 'TeamMembers_LearnMoreButton')"
          @keydown.enter="openSideDrawer($event, 'TeamMembers_LearnMoreButton')"
          @keydown.space="openSideDrawer($event, 'TeamMembers_LearnMoreButton')"
          id="TeamMembers_LearnMoreButton"
        >
          Learn more about team member roles
        </a>
      </p>

      <v-alert
        v-if="stepIsErrored && !appHasAdmins"
        outlined
        rounded
        color="warning"
        icon="warning"
        class="
          text-left
          warning_lighter
          black-icon
          mt-3
          mb-8
          border-thick
          pr-14
        "
        border="left"
      >
        <div class="black--text body-lg">
          <p class="mb-0">
            {{ missingAdminMessage }}
            You can also add a root administrator to your “{{ portfolioName }}”
            workspace to manage all applications and environments.
          </p>
        </div>
      </v-alert>
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
          aria-label="Search"
        />
        <v-btn
          class="input-search-bar"
          color="primary"
          @click="searchTable(search)"
          aria-label="Search Members"
        >
          <v-icon>search</v-icon>
        </v-btn>
      </v-col>
      <v-col class="d-flex flex-row-reverse">
        <v-btn
          id="inviteTeamMemberButton"
          class="font-weight-bold d-flex align-center px-5"
          :ripple="false"
          color="primary"
          @keydown.native.enter="openDialog($event, 'inviteTeamMemberButton')"
          @click="openDialog($event, 'inviteTeamMemberButton')"
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
    <v-row v-if="membersData && membersData.length === 0">
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
    <v-row v-if="membersData && membersData.length > 0">
      <v-col cols="12" class="ma-0">
        <v-data-table
          class="review-table review-table--shadowed"
          :headers="headers"
          :items="isFiltered ? filteredData : membersData"
          hide-default-footer
          dense
          :sort-by="['name']"
          :items-per-page="-1"
        >
          <template v-slot:item.display_name="{ item }">
            <strong>{{ item.display_name }}</strong>
            <br />
            {{ item.email }}
          </template>
          <template v-slot:item.workspace_roles="{ item }">
            <div class="d-flex justify-space-between">
              <div>
                <span
                  v-for="value in item.workspace_roles"
                  :key="value"
                  class="d-block"
                >
                  {{ value }}
                </span>
              </div>

              <v-menu
                transition="slide-y-transition"
                offset-y
                nudge-left="192"
                nudge-top="1"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :id="moreButtonId(item)"
                    :disabled="isDisabled(item.workspace_roles)"
                    class="meatball-menu-button pa-0"
                    v-bind="attrs"
                    v-on="on"
                    @click="setMember(item)"
                    aria-label="Edit or remove team member"
                  >
                    <v-icon aria-hidden="true" class="width-auto">
                      more_horiz
                    </v-icon>
                  </v-btn>
                </template>
                <v-list class="meatball-menu pa-0">
                  <v-list-item
                    v-for="(menuOptionText, i) in options"
                    :key="i"
                    @click="
                      tableOptionClick(
                        menuOptionText,
                        $event,
                        moreButtonId(item)
                      )
                    "
                  >
                    <v-list-item-title class="body-lg py-2">
                      {{ menuOptionText }}
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
      :focus-on-cancel="returnFocusElementIdRemoveMemberCancel"
      :focus-on-ok="returnFocusElementIdRemoveMemberOk"
    />
  </div>
</template>
<script lang="ts">
import { Component, Emit, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ApplicationData from "@/mixins/ApplicationModuleData";
import { validateHasAdminOperators } from "@/validation/application";
import { EnvironmentModel } from "types/Portfolios";

@Component({})
export default class TeamView extends mixins(ApplicationData) {
  private membersData: any = [];
  private filteredData: any = [];
  private isFiltered = false;
  private search = "";
  private stepIsErrored = this.$store.getters["wizard/isStepErrored"](4);
  private csp =
    this.$store.getters["wizard/getPortfolio"].csp || "your selected CSP";
  private appHasAdmins = true;
  private isTouched = false;
  private environmentsWithoutAdmins: string[] = [];
  private environmentCount = 0;
  private noAppOrEnvOperatorsOnLoad = true;
  private isReturnToReview = this.$store.getters["wizard/isReturnToReview"];

  public get portfolioName(): string {
    return this.$store.getters["wizard/getPortfolioName"]();
  }

  private get missingAdminMessage(): string {
    if (
      this.environmentsWithoutAdmins.length &&
      this.environmentsWithoutAdmins.length < this.environmentCount
    ) {
      let envList = this.environmentsWithoutAdmins.join(", ");
      envList = envList.replace(/,([^,]*)$/, " and" + "$1");

      let envMessage = "Your " + envList + " environment";
      envMessage += this.environmentsWithoutAdmins.length > 1 ? "s" : "";
      envMessage += ` must have an administrator to manage resources within the cloud console.
        Please add an administrator to each environment, or to the entire application.`;
      return envMessage;
    }
    return "Please add an administrator to manage this application within the cloud console.";
  }

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
    this.applicationMembers = [];
    [this.appHasAdmins, this.isTouched] = validateHasAdminOperators(
      this.operators,
      [this.currentApplication]
    );
    if (this.operators) {
      const rootAdmins = this.operators || [];
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

    this.environmentsWithoutAdmins = [];
    this.currentApplication.environments.forEach((env: EnvironmentModel) => {
      this.environmentsWithoutAdmins.push(env.name);
    });
    this.environmentCount = this.environmentsWithoutAdmins.length;

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
        const environmentWithoutAdminsIndex =
          this.environmentsWithoutAdmins.indexOf(env.name);
        const envOperators = env.operators;
        if (envOperators && envOperators.length > 0) {
          envOperators.forEach((op: any) => {
            const i = this.applicationMembers.findIndex(
              (o) => o.email === op.email
            );
            if (op.access !== "no_access") {
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

              if (
                op.access === "administrator" &&
                environmentWithoutAdminsIndex > -1
              ) {
                this.environmentsWithoutAdmins.splice(
                  environmentWithoutAdminsIndex,
                  1
                );
              }
            }
          });
        }
      });
    }
  }

  private tranformData(): void {
    this.membersData = [];
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
        return "Contributor";
      case "read_only":
        return "Billing read-only";
      default:
        return "Unauthorized";
    }
  }

  public openDialog(event: Event, returnFocusId: string): void {
    let memberProps: {
      isRootAdmin: boolean;
      isEditSingle: boolean;
      memberEmail: string | null;
      focusOnOk: string;
      focusOnCancel: string;
    } = {
      isRootAdmin: false,
      isEditSingle: false,
      memberEmail: "",
      focusOnOk: returnFocusId,
      focusOnCancel: returnFocusId,
    };
    const currentTarget = event.currentTarget as HTMLElement;
    if (
      currentTarget &&
      currentTarget.innerText.toLowerCase() === "edit info and roles"
    ) {
      memberProps.isEditSingle = true;
      memberProps.memberEmail = this.member.email;
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
  private returnFocusElementIdRemoveMemberCancel = "";
  private returnFocusElementIdRemoveMemberOk = "inviteTeamMemberButton";

  private tableOptionClick(
    menuOptionText: any,
    event: Event,
    btnId: string
  ): void {
    if (menuOptionText.toLowerCase() === "remove team member") {
      this.dialogTitle = `Remove ${this.member.display_name}`;
      this.dialogMessage = `${this.member.display_name} will be removed
        from your ${this.currentApplication.name} team. This individual
        will no longer have access to the application in the cloud console.`;
      this.returnFocusElementIdRemoveMemberCancel = btnId;
      this.showDialogWhenClicked = true;
    } else if (menuOptionText.toLowerCase() === "edit info and roles") {
      this.openDialog(event, btnId);
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

    this.setMemberTableData();
    this.$store.dispatch("wizard/updateMembersModified", true);
  }

  private openSideDrawer(event: Event, openerId: string): void {
    this.$store.dispatch("openSideDrawer", ["teammemberroles", openerId]);
  }

  public async mounted(): Promise<void> {
    this.setMemberTableData();
    this.tranformData();

    this.noAppOrEnvOperatorsOnLoad = !this.$store.getters[
      "applications/appOrEnvHasOperators"
    ]([this.currentApplication]);
  }

  private moreButtonId(item: any): string {
    if (item && item.email) {
      return (
        "moreButton_" + item.email.toLowerCase().replace(/[^a-zA-Z0-9]/gi, "_")
      );
    }
    return "";
  }
}
</script>
