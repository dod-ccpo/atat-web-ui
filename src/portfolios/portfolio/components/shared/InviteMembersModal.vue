<template>
  <ATATDialog
      id="InviteMembersModal"
      :showDialog.sync="_showModal"
      :title="'Invite people to “' + projectTitle + '”'"
      no-click-animation
      okText="Invite"
      width="632"
      @ok="inviteMembers"
      :modalSlideoutComponent="modalSlideoutComponent"
      modalSlideoutTitle="Learn more about portfolio roles"
      :modalDrawerIsOpen.sync="modalDrawerIsOpen">
    <template #content>
      <p class="body">
        Use “.mil” or “.gov” email addresses to ensure people can authenticate with
        a CAC to access your portfolio.
        <a id="LearnMoreLink" role="button" @click="openLearnMoreDrawer">
          Learn more about portfolio roles
        </a>
      </p>
      <div class="max-width-640">
        <ATATAutoComplete
            id="SearchContact"
            :class="haveSelectedContact ? 'mb-10' : 'mb-8'"
            :label-sr-only="true"
            :label="''"
            titleKey="fullName"
            subtitleKey="email"
            :items="userSearchList"
            :searchFields="['fullName', 'email']"
            :selectedItem.sync="selectedContact"
            placeholder="Search by name or email address"
            icon="search"
            :noResultsText="''"
            :rules="getRules"
            @autocompleteInputUpdate="searchUsers"
        />
      </div>
    </template>
  </ATATDialog>

</template>
<script lang="ts">
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
import Toast from "@/store/toast";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";

@Component({
  components: {
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
  public userSearchList: User[] = [];
  public userSelectedList: User[] = [];
  public modalSlideoutComponent = AddMembersModalLearnMore;
  public membersInvitedToast: ToastObj = {
    type: "success",
    message: "",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };
  public selectedRole = "Manager";
  public roles: SelectData[] = [
    { header: "Roles" },
    { text: "Manager", value: "Manager" },
    { text: "Viewer", value: "Viewer" },
  ];
  private modalDrawerIsOpen = false;

  public async searchUsers(): Promise<void> {
    console.log("Searching for users...");
  }

  @Watch("_showModal")
  public async showModalChange(newVal: boolean): Promise<void> {
    if (newVal) {
      this.userSearchList = [
        {
          // eslint-disable-next-line camelcase
          sys_id: "1",
          firstName: "Test0",
          lastName: "Adamson",
          email: "test.adamson-civ@mail.mil",
          phoneNumber: "333-333-3333",
          agency: "HQ1234 - Corresponding Organization Name"
        },
        {
          // eslint-disable-next-line camelcase
          sys_id: "2",
          firstName: "Test1",
          lastName: "Contractingofficerep",
          email: "test.contractingofficerrep-civ@mail.mil",
          phoneNumber: "555-555-5555",
          agency: "HQ1234 - Corresponding Organization Name",

        },
        {
          // eslint-disable-next-line camelcase
          sys_id: "3",
          firstName: "Test2",
          lastName: "Wentzel",
          email: "test.wentz@acusage.net",
          phoneNumber: "444-444-4444",
          agency: "HQ567 - Other Organization Name"
        }
      ];
      this.userSelectedList = [];
      this.portfolioData = await PortfolioStore.getPortfolioData();
      this.projectTitle = this.portfolioData.title || "New Acquisition";
      await this.setExistingMembers();
      if (!this.inputWidthFaker) {
        this.$nextTick(() => {
          this.inputWidthFaker = document.getElementById("inputWidthFaker");
        });
      }
    } else {
      PortfolioStore.setShowInviteMembersModal(false);
    }
  }

  // use for validation - check entered emails against existing members list
  public existingMembers: User[] = [];
  // get existingMembers from store, then map emails only
  public existingMemberEmails: string[] = [];

  // inputWidthFaker is used to dynamically adjust the width of the input
  // based on the characters entered - the "hidden" (abs pos off-screen) div
  // gets the characters entered into the input, then the div's width is given
  // to the input -- see event listener on input
  public inputWidthFaker: HTMLElement | null = null;

  public async setExistingMembers(): Promise<void> {
    if (this.portfolioData && this.portfolioData.members) {
      this.existingMemberEmails = [];
      this.existingMembers = this.portfolioData.members;
      this.existingMembers.forEach((member) => {
        if (member.email) {
          this.existingMemberEmails.push(member.email);
        }
      });
    }
  }

  public async inviteMembers(): Promise<void> {
    const invitedCount = this.userSelectedList.length;
    const toastMsg = invitedCount > 1
      ? invitedCount + " members added"
      : invitedCount + " member added";
    this.membersInvitedToast.message = toastMsg;
    Toast.setToast(this.membersInvitedToast);
    // TODO: update the below line after refactoring the store-saveMembers
    // await PortfolioStore.saveMembers(this.userSelectedList);
    this.$emit("members-invited")
  }

  public openLearnMoreDrawer(): void {
    this.modalDrawerIsOpen = true;
  }
}
</script>
