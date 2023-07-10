<template>
  <ATATDialog
      id="InviteMembersModal"
      :showDialog.sync="_showInviteModal"
      :title="'Invite people to “' + projectTitle + '”'"
      no-click-animation
      okText="Invite"
      width="632"
      @ok="inviteMembers"
      @cancelClicked="onCancel()"
      :modalSlideoutComponent="modalSlideoutComponent"
      modalSlideoutTitle="Learn more about portfolio roles"
      :modalDrawerIsOpen.sync="modalDrawerIsOpen"
      modalClass="_invite-modal"
      :OKDisabled="OKDisabled"
    >
    <template #content>
      <p class="body">
        Use “.mil” or “.gov” email addresses to ensure people can authenticate with
        a CAC to access your portfolio.
        <a id="LearnMoreLink" role="button" @click="openLearnMoreDrawer">
          Learn more about portfolio roles
        </a>
      </p>
      <div class="_search-wrap">
        <v-text-field
          ref="inviteMember"
          id="SearchMember"
          v-model="searchString"
          clearable
          append-icon="search"
          @click:clear="clearSearch()"
          outlined
          dense
          :height="40"
          placeholder="Search by name or email address"
          autocomplete="off"
        />

        <v-progress-circular v-show="searchObj.isLoading"
          indeterminate
          color="#544496"
          size="24"
          width="3"
          class="mr-2"
        />

        <div class="_search-result-dropdown">
          <v-card elevation="0" max-height="200">
            <v-list class="py-1" v-if="searchObj.alreadyInvited">
              <v-list-item class="font-weight-bolder font-size-16 bg-warning-lighter">
                Member already invited
              </v-list-item>
            </v-list>

            <v-list v-if="showSearchResults">
              <v-list-item v-for="user of searchObj.searchResults" :key="user.sys_id"
                @click="onUserSelection(user)"
                class="pointer">
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bolder font-size-16">
                    {{ user.firstName }} {{ user.lastName}}{{ user.title}} {{ user.agency}}
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-size-14">
                    {{ user.email }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-list class="py-1" v-if="showNoResults">
              <v-list-item class="font-weight-bolder font-size-16">
                No results for "{{searchObj.value}}"
              </v-list-item>
              <v-list-item>
                <a href="https://community.hacc.mil/s/contact" target="_blank" class="body">
                  Contact customer <span class="_external-link">support</span>
                </a>
              </v-list-item>
            </v-list>
          </v-card>
        </div>
      </div>

      <div id="portfolioPendingInviteList" class="_modal-full-width-list">
        <v-list>
          <v-list-item
              class="_search-results-list"
              v-for="(user, index) in userSelectedList" :key="user.sys_id">
            <v-list-item-content>
              <v-list-item-title class="font-weight-bolder font-size-16">
                {{ user.firstName }} {{ user.lastName}}{{ user.title}}  {{ user.agency}}
              </v-list-item-title>
              <v-list-item-subtitle class="font-size-14">
                {{ user.email }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <ATATSelect
                :id="'Role' + index"
                class="_small _alt-style-clean _invite-members-modal align-self-end"
                :items="memberMenuItems"
                width="105"
                :selectedValue.sync="user.role"
                @onChange="(value)=>dropdownChanged(value, index)"
                iconType="chevron"
              />
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </div>
    </template>
  </ATATDialog>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, PropSync, Watch } from "vue-property-decorator";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import AddMembersModalLearnMore from "./AddMembersModalLearnMore.vue"
import { Portfolio, SelectData, User } from "../../../../../types/Global";
import PortfolioStore from "@/store/portfolio";

import _ from "lodash";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import UserManagement from "@/store/user/userManagement";
import portfolio from "@/store/portfolio";

import UserSearch from "@/mixins/userSearch";

@Component({
  components: {
    ATATSVGIcon,
    ATATDialog,
    ATATErrorValidation,
    ATATSelect,
    AddMembersModalLearnMore,
  }
})

export default class InviteMembersModal extends UserSearch {
  @PropSync("showModal") public _showInviteModal?: boolean;
  public portfolioData: Portfolio | null = null;
  public projectTitle = "";

  public memberMenuItems: SelectData[] = [
    { header: "Roles" },
    { text: "Manager", value: "Manager" },
    { text: "Viewer", value: "Viewer" },
    { divider: true },
    { text: "Remove", value: "Remove", isSelectable: false }
  ];

  public modalSlideoutComponent = AddMembersModalLearnMore;
  private modalDrawerIsOpen = false;

  public dropdownChanged(value: string, index: number): void {
    if (value === "Remove") {
      this.userSelectedList.splice(index, 1);
    }
  }

  /**
   * Adds the selected user to the selected user list, if the selected user is not already in
   * the new selection list or the current member list.
   * Then clears the search string and makes a function call out to clear the search results
   */
  public async onUserSelection(newSelectedUser: User): Promise<void> {
    const isAlreadyListed = await UserManagement.isAlreadyListed(
      {
        sysId: newSelectedUser.sys_id as string, 
        users1: this.userSelectedList, 
        users2: this.portfolioData?.members || []
      }
    );

    if (newSelectedUser && !isAlreadyListed) {
      newSelectedUser.role = "Viewer"; // defaults to viewer
      this.userSelectedList.push(newSelectedUser);
      this.userSelectedList = await UserManagement.sortUsersByFullName(this.userSelectedList);
      this.searchString = "";
      this.searchObj = await UserManagement.resetSearchObj();
    } else {
      this.searchObj.alreadyInvited = true;
      this.searchObj.searchResults = this.searchObj.searchResults.filter(
        s => s.sys_id === newSelectedUser.sys_id
      );
    }
  }

  @Watch("_showInviteModal")
  public async showModalChange(newVal: boolean): Promise<void> {
    if (newVal) {
      this.userSelectedList = [];
      this.portfolioData = await PortfolioStore.getPortfolioData();
      this.projectTitle = this.portfolioData.title || "New Acquisition";
    } else {
      PortfolioStore.setShowAddMembersModal(false);
    }
  }

  /**
   * Makes a store call to invite the new members if the user had marked at least
   * one new member to a specific role instead of 'remove'
   */
  public async inviteMembers(): Promise<void> {
    const userSelectedNotRemovedList = this.userSelectedList.filter(selectedUser =>
      (selectedUser.role === "Manager") || (selectedUser.role === "Viewer"))
    if (userSelectedNotRemovedList.length > 0) {
      await portfolio.inviteMembers(userSelectedNotRemovedList);
      this.$emit("membersInvited");
    }
  }

  public openLearnMoreDrawer(): void {
    this.modalDrawerIsOpen = true;
  }
}
</script>
