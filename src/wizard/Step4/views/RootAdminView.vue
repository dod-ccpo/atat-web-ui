<template>
  <div class="body-lg">
    <div id="inputWidthFaker" ref="inputWidthFaker"></div>
    <div class="content-max-width">
      <h1 tabindex="-1">
        Let’s add root administrators to {{ portfolioName }}
      </h1>
      <p>
        Invite your root administrators below to grant them full access to all
        of your applications. These individuals will receive an invitation from
        {{ csp }} after your portfolio is provisioned. Select
        <span class="font-weight-bold">Next</span> to add team members to your
        other applications.
        <a
          role="button"
          tabindex="0"
          @click="openSideDrawer($event)"
          @keydown.enter="openSideDrawer($event)"
        >
          Learn more about team member roles
        </a>
      </p>
    </div>
    <v-row>
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
          aria-label="Search Root Administrators"
        >
          <v-icon aria-hidden="true">search</v-icon>
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
            <v-icon aria-hidden="true" class="icon-20" role="presentation">
              control_point
            </v-icon>
          </div>
          <div class="body font-weight-bold">Invite Team Member</div>
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="rootMembersCount < 1">
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
          v-if="rootMembersCount >= 1"
          class="review-table"
          :headers="headers"
          :items="isFiltered ? filteredData : rootMembers"
          hide-default-footer
        >
          <template v-slot:header.display_name="{ header }">
            <div class="label font-weight-bold text--base-dark">
              {{ header.text }}
            </div>
          </template>
          <template v-slot:header.access="{ header }">
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
          <template v-slot:item.access="{ item }">
            <div class="d-flex justify-space-between">
              <div class="body text--base-dark pt-3">
                {{ roleTranslation(item.access) }}
              </div>

              <v-menu
                class="table-menu"
                transition="slide-y-transition"
                offset-y
                nudge-left="190"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :id="moreButtonId(item)"
                    class="table-row-menu-button pa-0"
                    v-bind="attrs"
                    v-on="on"
                    @click="setMember(item)"
                    :aria-label="'Edit or remove ' + item.display_name"
                  >
                    <v-icon aria-hidden="true" class="icon-18 width-auto">
                      more_horiz
                    </v-icon>
                  </v-btn>
                </template>
                <v-list class="table-row-menu pa-0">
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
import Vue from "vue";
import { Component, Emit, Watch } from "vue-property-decorator";

@Component({})
export default class RootAdminView extends Vue {
  private filteredData: any = [];
  private isFiltered = false;
  private search = "";
  private currentPortfolio = this.$store.getters.getPortfolio;
  private csp = this.currentPortfolio.csp;

  private rootMembers: any = this.$store.getters.getPortfolioOperators;
  private member: any;

  private setMember(item: any) {
    this.member = item;
  }

  private message = "You do not have any team members in this workspace yet.";
  private headers = [
    { text: "Name", value: "display_name", align: "start" },
    { text: "Workplace Access ", value: "access", sortable: false },
  ];
  private options = ["Edit info", "Remove root administrator"];

  get portfolioName(): string {
    return this.$store.getters.getPortfolioName();
  }

  get rootMembersCount(): number {
    return this.rootMembers.length;
  }

  private searchTable(value: string) {
    if (!value) {
      this.isFiltered = false;
    } else {
      this.isFiltered = true;
      this.filteredData = this.rootMembers.filter((data: any) => {
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
      isRootAdmin: true,
      isEditSingle: false,
      memberEmail: null,
      focusOnOk: returnFocusId,
      focusOnCancel: returnFocusId,
    };

    const currentTarget = event.currentTarget as HTMLElement;
    if (currentTarget && currentTarget.innerText === "Edit info") {
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

  //Dialog stuff
  private okText = "Remove Root Administrator";
  private cardWidth = "40";
  private cancelText = "Cancel";
  private hasDialog = true;
  private dialogWidth = "450";
  @Emit("delete")
  private onDelete(): void {
    this.deleteRootMember();
  }
  private dialogMessage = "";
  private dialogTitle = "";
  private showDialogWhenClicked = false;
  private returnFocusElementIdRemoveMemberCancel = "";
  private returnFocusElementIdRemoveMemberOk = "inviteTeamMemberButton";

  private tableOptionClick(
    menuOptionText: any,
    event: Event,
    btnId: string
  ): void {
    if (menuOptionText.toLowerCase() === "remove root administrator") {
      this.dialogTitle = `Remove ${this.member.display_name}`;
      this.dialogMessage = `${this.member.display_name} will be removed as a root administrator of ${this.portfolioName}. This individual will no longer have access to any of your applications in the cloud console.`;
      this.returnFocusElementIdRemoveMemberCancel = btnId;
      this.showDialogWhenClicked = true;
    } else if (menuOptionText.toLowerCase() === "edit info") {
      // EJY if editing a member, return focus to the ... menu for the member
      // pass as second param to openDialog()
      this.openDialog(event, btnId);
    }
  }

  private openSideDrawer(event: Event): void {
    this.$store.dispatch("openSideDrawer", [
      "teammemberroles",
      event.type === "keydown",
    ]);
  }

  private deleteRootMember() {
    if (this.rootMembers) {
      const operators = this.rootMembers;
      let memberindx = operators.findIndex(
        (item: any) => item.email === this.member.email
      );
      if (memberindx > -1) {
        operators.splice(memberindx, 1);
      }
    }
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
