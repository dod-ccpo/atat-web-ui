<template>
  <ATATDialog
      id="InviteUsersModal"
      :showDialog.sync="_showInviteModal"
      title="Invite people to contribute to your acquisition"
      no-click-animation
      okText="Invite"
      width="632"
      @ok="inviteUsers"
      @cancelClicked="onCancel()"
      modalClass="_invite-modal"
      :OKDisabled="OKDisabled"
    >
    <template #content>
      <p class="body">
        Use “.mil” or “.gov” email addresses to ensure people can authenticate with
        a CAC to access your package.
      </p>
      <div class="_search-wrap">
        <v-text-field
          ref="inviteUser"
          id="SearchUser"
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
                User already invited
              </v-list-item>
            </v-list>

            <v-list v-if="showSearchResults">
              <v-list-item v-for="user in searchObj.searchResults" :key="user.sys_id"
                @click="onUserSelection(user)"
                class="pointer"
              >
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bolder font-size-16">
                    {{ user.firstName }} {{ user.lastName}}
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-size-14">
                    {{ user.email }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-list class="py-1" v-if="searchObj.noResults && searchString">
              <v-list-item class="font-weight-bolder font-size-16">
                No results for "{{searchString}}"
              </v-list-item>
              <hr class="my-0" />
              <v-list-item>
                <a href="https://community.hacc.mil/s/contact" target="_blank" class="body">
                  Contact customer <span class="_external-link">support</span>
                </a>
              </v-list-item>
            </v-list>
          </v-card>
        </div>
      </div>

      <div id="PendingInviteList" class="_modal-full-width-list">
        <v-list>
          <v-list-item
            v-for="(user, index) in userSelectedList" :key="user.sys_id"
            class="_search-results-list"
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-bolder font-size-16">
                {{ user.firstName }} {{ user.lastName }}
              </v-list-item-title>
              <v-list-item-subtitle class="font-size-14">
                {{ user.email }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                :id="'RemoveSelectedUser' + index"
                class="_icon-only"
                @click="removeSelectedUser(index)"
                @keydown.enter="removeSelectedUser(index)"
                @keydown.space="removeSelectedUser(index)"
              >
                <ATATSVGIcon
                  name="Close"
                  color="base"
                  :width="12"
                  :height="12"
                />
              </v-btn>

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
import {
  User
} from "../../../types/Global";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import _ from "lodash";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import UserManagement from "@/store/user/userManagement";
import AcquisitionPackage from "@/store/acquisitionPackage";

export interface SearchObj {
  isLoading: boolean;
  searchResults: User[];
  noResults: boolean;
  alreadyInvited: boolean;
}

@Component({
  components: {
    ATATSVGIcon,
    ATATAutoComplete,
    ATATDialog,
    ATATErrorValidation,
    ATATSelect,
    ATATTextArea,
  }
})

export default class ContributorInviteModal extends Vue {
  @PropSync("showInviteModal") public _showInviteModal?: boolean;

  public searchString = "";
  public searchObj: SearchObj = {
    isLoading: false,
    searchResults: [],
    noResults: false,
    alreadyInvited: false
  };

  public isSearching = false;

  public userSelectedList: User[] = [];
  public get alreadyInvitedUsers(): User[] {
    return AcquisitionPackage.getPackageContributors;
  };

  public get OKDisabled(): boolean {
    return this.userSelectedList.length === 0;
  }

  public get showSearchResults(): boolean {
    return this.searchObj.searchResults.length > 0;
  }

  public clearSearch(): void {
    this.searchString = "";
    this.searchObj.alreadyInvited = false;
  }

  @Watch("searchString")
  public searchStringChanged(newVal: string, oldVal: string): void {
    if (newVal !== oldVal && newVal.trim().length > 2) {
      this.searchObj.noResults = false;
      this.searchObj.alreadyInvited = false
      this.onUserSearchValueChange(newVal);
    }
  }

  /**
   * Starts searching 500 milliseconds after user changes the search value. Only
   * searches if there are at least 3 characters in the newValue
   */
  public onUserSearchValueChange = _.debounce(async (newValue: string) => {
    if (!this.isSearching) {
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
          agency: userSearchDTO.department?.display_value
        }
      });
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

  public removeSelectedUser(index: number): void {
    this.userSelectedList.splice(index, 1);
  }

  /**
   * Adds the selected user to the selected user list, if the selected user is not already in
   * the new selection list or the current user list.
   * Then clears the search string and makes a function call out to clear the search results
   */
  public onUserSelection(newSelectedUser: User): void {
    const alreadySelected = this.userSelectedList.find(u => u.sys_id === newSelectedUser.sys_id)
    const alreadyInvited = this.alreadyInvitedUsers.find(u => u.sys_id === newSelectedUser.sys_id);
    if (newSelectedUser && !alreadySelected && !alreadyInvited) {
      this.searchObj.alreadyInvited = false;
      this.userSelectedList.push(newSelectedUser);
      this.userSelectedList.sort((a, b) => {
        if (a.fullName && b.fullName) {
          return a.fullName > b.fullName ? 1 : -1;
        } else {
          return 0;
        }
      })
      this.searchString = "";
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
  public onCancel(): void {
    this.searchString = "";
    this.searchObj.alreadyInvited = false;
    this.searchObj.searchResults = [];
    this.searchObj.noResults = false;
    this.searchObj.isLoading = false;
    UserManagement.triggerAbort();    
  }

  @Watch("_showInviteModal")
  public async showInviteModalChange(newVal: boolean): Promise<void> {
    if (newVal) {
      this.userSelectedList = [];
    } else {
      AcquisitionPackage.setShowInviteContributorsModal(false);
    }
  }

  public async inviteUsers(): Promise<void> {
    const invitesSysIds = this.userSelectedList.map(usr => usr.sys_id).join(",");
    await AcquisitionPackage.inviteContributors(invitesSysIds);
  }

}
</script>
