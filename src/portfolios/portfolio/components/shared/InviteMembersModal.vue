<template>
  <ATATDialog
      id="InviteMembersModal"
      :showDialog.sync="_showModal"
      :title="'Invite people to “' + projectTitle + '”'"
      no-click-animation
      okText="Invite"
      width="632"
      @ok="inviteMembers"
      @cancelClicked = "onCancel()"
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
          v-model="searchObj.value"
          clearable
          append-icon="search"
          @keyup="onUserSearchValueChange(searchObj.value);searchObj.noResults=false;
          searchObj.alreadyInvited=false"
          @click:clear="onUserSearchValueChange('');searchObj.alreadyInvited=false"
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

            <v-list v-if="searchObj.searchResults.length > 0">
              <v-list-item v-for="user of searchObj.searchResults" :key="user.sys_id"
                @click="onUserSelection(user)"
                class="pointer">
                <v-list-item-content>
                  <v-list-item-title
                      class="font-weight-bolder font-size-16"
                      v-text="user.firstName + ' ' + user.lastName">
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-size-14" v-text="user.email">
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-list class="py-1" v-if="searchObj.noResults && searchObj.value">
              <v-list-item class="font-weight-bolder font-size-16">
                No results for "{{searchObj.value}}"
              </v-list-item>
            </v-list>
          </v-card>
        </div>
      </div>

      <div id="portfolioPendingInviteList" class="_modal-full-width-list">
        <v-list>
          <v-list-item
              class="_search-results-list"
              v-for="(member, index) in userSelectedList" :key="member.sys_id">
            <v-list-item-content>
              <v-list-item-title
                  class="font-weight-bolder font-size-16"
                  v-text="member.firstName + ' ' + member.lastName">
              </v-list-item-title>
              <v-list-item-subtitle class="font-size-14" v-text="member.email">
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <ATATSelect
                  :id="'Role' + index"
                  class="_small _alt-style-clean _invite-members-modal align-self-end"
                  :items="memberMenuItems"
                  width="105"
                  :selectedValue.sync="member.role"
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
import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import AddMembersModalLearnMore from "./AddMembersModalLearnMore.vue"
import {
  Portfolio,
  SelectData,
  ToastObj,
  User
} from "../../../../../types/Global";
import PortfolioStore from "@/store/portfolio";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import _ from "lodash";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import UserManagement from "@/store/user/userManagement";
import portfolio from "@/store/portfolio";

@Component({
  components: {
    ATATSVGIcon,
    ATATAutoComplete,
    ATATDialog,
    ATATErrorValidation,
    ATATSelect,
    ATATTextArea,
    AddMembersModalLearnMore,
  }
})

export default class InviteMembersModal extends Vue {
  @PropSync("showModal") public _showModal?: boolean;
  public portfolioData: Portfolio | null = null;
  public projectTitle = "";
  public searchObj: {
    value: string;
    isLoading: boolean;
    searchResults: User[];
    noResults: boolean;
    alreadyInvited: boolean;
  } = {
    value: "",
    isLoading: false,
    searchResults: [],
    noResults: false,
    alreadyInvited: false
  };
  public isSearching = false;
  public memberMenuItems: SelectData[] = [
    { header: "Roles" },
    { text: "Manager", value: "Manager" },
    { text: "Viewer", value: "Viewer" },
    { divider: true },
    { text: "Remove", value: "Remove", isSelectable: false }
  ];
  public userSelectedList: User[] = [];
  public modalSlideoutComponent = AddMembersModalLearnMore;
  public membersInvitedToast: ToastObj = {
    type: "success",
    message: "",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };

  private modalDrawerIsOpen = false;

  public dropdownChanged(value: string, index: number): void {
    if (value === "Remove") {
      this.userSelectedList.splice(index, 1);
    }
  }

  public get OKDisabled(): boolean {
    return this.userSelectedList.length === 0;
  }

  /**
   * Starts searching 500 milliseconds after user changes the search value. Only
   * searches if there are at least 3 characters in the newValue
   */
  onUserSearchValueChange = _.debounce(async (newValue: string) => {
    if (newValue && newValue?.trim().length > 2 && !this.isSearching) {
      await UserManagement.doResetAbortController();
      this.isSearching = true;
      this.searchObj.searchResults = [];
      this.searchObj.isLoading = true;
      const response = await UserManagement.searchUserByNameAndEmail(newValue)
      this.searchObj.searchResults = response.map(userSearchDTO => {
        return {
          sys_id: userSearchDTO.sys_id,
          firstName: userSearchDTO.first_name,
          lastName: userSearchDTO.last_name,
          fullName: userSearchDTO.name,
          email: userSearchDTO.email,
          phoneNumber: userSearchDTO.phone,
          agency: userSearchDTO.company
        }
      })
      this.searchObj.noResults = this.searchObj.searchResults.length === 0;
      this.searchObj.isLoading = false;
      this.isSearching = false;
    } else {
      UserManagement.triggerAbort();
      this.searchObj.searchResults = [];
      this.searchObj.noResults = false;
      this.searchObj.alreadyInvited = false;         
      this.isSearching = false;
      this.onUserSearchValueChange(newValue);
    }
  }, 500)

  /**
   * Adds the selected user to the selected user list, if the selected user is not already in
   * the new selection list or the current member list.
   * Then clears the search string and makes a function call out to clear the search results
   */
  onUserSelection(newSelectedUser: User): void {
    if(newSelectedUser && !this.userSelectedList.find(selectedUser =>
      selectedUser.sys_id === newSelectedUser.sys_id) &&
        !this.portfolioData?.members?.find(currentMember =>
          currentMember.sys_id === newSelectedUser.sys_id)) {
      this.searchObj.alreadyInvited = false;
      newSelectedUser.role = "Viewer"; // defaults to viewer
      this.userSelectedList.push(newSelectedUser);
      this.userSelectedList.sort((a, b) => {
        if (a.fullName && b.fullName) {
          return a.fullName > b.fullName ? 1 : -1;
        } else {
          return 0;
        }
      })
      this.searchObj.value = "";
      this.searchObj.alreadyInvited = false;
      this.searchObj.searchResults = [];
      this.searchObj.noResults = false;
      this.searchObj.isLoading = false;
    } else {
      this.searchObj.alreadyInvited = true;
    }
  }

  /**
   * Resets the state of the modal and all the properties.
   */
  onCancel(): void {
    this.searchObj.value = "";
    this.searchObj.alreadyInvited = false;
    this.searchObj.searchResults = [];
    this.searchObj.noResults = false;
    this.searchObj.isLoading = false;
    UserManagement.triggerAbort();    
  }

  @Watch("_showModal")
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
    }
  }

  public openLearnMoreDrawer(): void {
    this.modalDrawerIsOpen = true;
  }
}
</script>