<template>
  <ATATDialog
    id="AddMembersModal"
    :showDialog.sync="_showModal"
    :title="'Invite people to “' + projectTitle + '”'"
    no-click-animation
    okText="Invite"
    width="632"
    :OKDisabled="invalidEmailCount > 0 || !validEmailList.length"
    @ok="inviteMembers"
    :modalSlideoutComponent="modalSlideoutComponent"
    modalSlideoutTitle="Learn more about portfolio roles"
    :modalDrawerIsOpen.sync="modalDrawerIsOpen"
  >
    <template #content>
      <p class="body">
        Use “.mil” or “.gov” email addresses to ensure people can authenticate with 
        a CAC to access your portfolio. 
        <a id="LearnMoreLink" role="button" @click="openLearnMoreDrawer">
          Learn more about portfolio roles
        </a>
      </p>
      <v-form class="d-flex mb-8 pb-8" ref="form" v-model="formIsValid" lazy-validation>
        <div id="inputWidthFaker" ref="inputWidthFaker"></div>

        <div style="flex-grow: 1;" class="mr-5">

          <div id="PillboxLabel" class="mb-2 body">
            Email Addresses
          </div>

          <div
            id="PillboxWrapper"
            class="pa-2 _pillbox-wrapper"
            :class="{ '_focused' : pillboxFocused }"
            tabindex="0"
            aria-labelledby="PillboxLabel"
            @click="addEmail"
            @focus="addEmail"
          >

            <v-text-field
              v-for="email in enteredEmails"
              :key="email.key"
              :ref="'key-' + email.key"
              class="_pill"
              :class="{ '_invalid-entry': isEmailInvalid(email) }"
              :data-email-key="email.key"
              v-model="email.email"
              append-icon="close"
              :aria-label="'Email address ' + email.email"
              @click="emailEdit"
              @blur="emailBlurred"
              @click:append="removeEmail"
            />
          </div>

          <ATATErrorValidation
            id="EmailError"
            class="atat-text-field-error"
            :errorMessages="[invalidEmailMessage]"
            v-show="showErrorMessage"
          />

          <v-btn
            id="RemoveAllInvalidEntriesLink"
            class="link-button mt-3 ml-5"
            @click="removeInvalidEmails"
            style="height: 26px"
            v-if="showRemoveAllErrors"
          >
            Remove all emails with errors
          </v-btn>
        </div>

        <div>
          <ATATSelect
            id="Role"
            class="mt-8 _small _alt-style _invite-members-modal"
            :items="roles"
            width="105"
            :selectedValue.sync="selectedRole"
            iconType="chevron"
          />
        </div>

      </v-form>
    </template>
  </ATATDialog>

</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";

import { Component, PropSync, Watch } from "vue-property-decorator";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import AddMembersModalLearnMore from "./AddMembersModalLearnMore.vue"

import {
  EmailEntry,
  Portfolio,
  SelectData,
  ToastObj,
  User
} from "../../../../../types/Global";
import PortfolioStore from "@/store/portfolio";

import Toast from "@/store/toast";

import { generateRandomKey } from "@/helpers";

@Component({
  components: {
    ATATDialog,
    ATATErrorValidation,
    ATATSelect,
    ATATTextArea,
    AddMembersModalLearnMore,
  }
})

export default class AddMembersModal extends Vue {
  @PropSync("showModal") public _showModal?: boolean;
  public portfolioData: Portfolio | null = null;
  public projectTitle = "";
  public enteredEmails: EmailEntry[] = [];
  public formIsValid = true;
  public validEmailList: string[] = [];
  public pillboxFocused = false;
  public duplicatedEmail = "";
  /* eslint-disable-next-line */
  public emailRegex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"]+\.)+[^<>()[\]\\.,;:\s@\\"]{2,})$/i;
  public modalSlideoutComponent = AddMembersModalLearnMore;
  public invalidEmailMessage = "";

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

  public emailDeletedKey: string | undefined;
  private modalDrawerIsOpen = false;

  @Watch("_showModal")
  public async showModalChange(newVal: boolean): Promise<void> {
    if (newVal) {
      this.validEmailList = [];
      this.enteredEmails = [];
      this.portfolioData = await PortfolioStore.getPortfolioData();
      this.projectTitle = this.portfolioData.title || "New Acquisition";
      await this.setExistingMembers();

      if (!this.inputWidthFaker) {
        this.$nextTick(() => {
          this.inputWidthFaker = document.getElementById("inputWidthFaker");
        });
      }
    } else {
      PortfolioStore.setShowAddMembersModal(false);
    }
  }

  // use for validation - check entered emails against existing members list
  public existingMembers: User[] = [];
  // get existingMembers from store, then map emails only
  public existingMemberEmails: string[] = [];
  // array of existing member emails entered for error message
  public get existingMemberEmailsEntered(): string[] {
    const existingEntries = this.enteredEmails.filter(obj => obj.isExisting === true);
    const existingMemberEmails = existingEntries.map(obj => obj.email)
    return existingMemberEmails;
  };

  // inputWidthFaker is used to dynamically adjust the width of the input
  // based on the characters entered - the "hidden" (abs pos off-screen) div
  // gets the characters entered into the input, then the div's width is given
  // to the input -- see event listener on input
  public inputWidthFaker: HTMLElement | null = null;

  get invalidEmailCount(): number {
    return this.enteredEmails.filter((obj) => obj.isValid === false).length;
  }

  get existingEmailCount(): number {
    return this.enteredEmails.filter((obj) => obj.isExisting === true).length;
  }

  public emailEdit(e: Event): void {
    e.preventDefault();
    e.cancelBubble = true;
    const input = e.currentTarget as HTMLInputElement;
    const i = this.validEmailList.indexOf(input.value.toLowerCase());
    if (i > -1) {
      this.validEmailList.splice(i, 1);
    }
    this.pillboxFocused = true;
    this.addInputEventListeners(this, input);
  }

  public addInputEventListeners(vm: any, input: HTMLInputElement): void {
    input.addEventListener("paste", function (e: ClipboardEvent) {
      e.preventDefault();
      const { clipboardData } = e;
      let pastedText = clipboardData ? clipboardData.getData("text/plain") : "";
      // remove single and double quotes
      pastedText = pastedText.replace(/['"]/g, "");
      // replace line breaks, spaces, semicolons with commas for splitting entries to array
      pastedText = pastedText.replace(/[;\s\r\n]/g, ",");

      const pastedValuesArray: string[] = pastedText.split(",");
      // ...new Set - automatically removes all duplicates
      const uniqueValues = [...new Set(pastedValuesArray)];
      uniqueValues.forEach(async (email) => {
        const isExistingEmail = vm.existingMemberEmails.indexOf(email.toLowerCase()) > -1;
        const notAlreadyEntered =
          vm.validEmailList.indexOf(email.toLowerCase()) === -1;
        const isValid = await vm.validateEmail(email);

        if (email && isValid && notAlreadyEntered) {
          vm.validEmailList.push(email.toLowerCase());
          const emailKey = generateRandomKey();
          vm.enteredEmails.push({
            key: emailKey,
            email: email,
            isValid: isValid,
            isExisting: isExistingEmail,
          });
        }
      });
      input.blur();
    });

    input.addEventListener("input", () => {
      // inputWidthFaker dynamically adjusts width of the input based on chars entered
      if (this.inputWidthFaker) {
        this.inputWidthFaker.innerHTML = input.value;
        const w = this.inputWidthFaker.offsetWidth + "px";
        input.style.width = w;
      }

      this.duplicatedEmail =
        this.validEmailList.indexOf(input.value.toLowerCase()) > -1
          ? input.value.toLowerCase()
          : "";
    });

    input.addEventListener("keydown", (e) => {
      // actionKeys cause input to end for current email being entered,
      // creating a new input to type another email address
      const keypressed: string = e.key;
      const actionKeys: string[] = [" ", ",", ";", "Enter"];
      if (actionKeys.indexOf(keypressed) > -1) {
        e.preventDefault();
        e.cancelBubble = true;
        input.blur();
        setTimeout(() => {
          this.addEmail(new CustomEvent(""), true);
        }, 0);
      }
    });
  }

  public addEmail(e: Event, override: boolean | null): void {
    const targetElement = e.target;
    const targetId = targetElement ? (targetElement as HTMLDivElement).id : "";
    this.pillboxFocused = true;
    //eslint-disable-next-line prefer-const
    let len = this.enteredEmails.length;
    if (
      (targetId === "PillboxWrapper" || override === true) &&
      (len === 0 || this.enteredEmails[len - 1].email !== "")
    ) {
      const emailKey = generateRandomKey();

      this.enteredEmails.push({
        key: emailKey,
        email: "",
        isValid: null,
        isExisting: false,
      });

      this.$nextTick().then(() => {
        //eslint-disable-next-line prefer-const
        let newInput = document.querySelector(
          "[data-email-key='" + emailKey + "']"
        ) as HTMLInputElement;

        if (newInput) {
          newInput.style.width = "40px";
          newInput.focus();
          this.addInputEventListeners(this, newInput);
        }
      });
    }
  }

  public get showErrorMessage(): boolean {
    return this.invalidEmailCount > 0 || this.existingMemberEmailsEntered.length > 0
  }

  public get showRemoveAllErrors(): boolean {
    return this.invalidEmailCount > 1 || this.existingMemberEmailsEntered.length > 1
      || (this.existingMemberEmailsEntered.length === 1 && this.invalidEmailCount === 1);
  }

  public isEmailInvalid(email: EmailEntry): boolean {
    return email.isValid === false || email.isExisting === true;
  }

  /*
  Validation rules:
  Invite button should be disabled until a valid email is entered.

  1. Multiple errors --> [# of errors] addresses were not recognized. Please ensure all emails
     are properly formatted, using “@domain.mil” or “@domain.gov.”
  2. Missing @ and .mil/.gov --> Please use a standard domain format, like “@domain.mil.”
  3. Email not ending in “.mil” or “.gov” --> Please use an email that ends with “.mil” or “.gov.”
  4. Email ends in “.mil” or “.gov”, but is missing @ symbol --> Please include an ‘@’ symbol in
     the email address.
  5. Existing Members --> “[Email address]” is already a portfolio member.
  */
  public formatMsg = `Please ensure all emails are properly formatted,
    using “@domain.mil” or “@domain.gov”.`;
  public get invalidEmailMultiple(): string {
    return this.invalidEmailCount + " addresses were not recognized." + this.formatMsg;
  }
  public invalidEmailDomain = "Please use an email that ends with “.mil” or “.gov”.";
  public invalidEmailMissingAtSymbol = "Please include an ‘@’ symbol in the email address";
  public invalidEmailFormat = "Please use a standard domain format, like “@domain.mil”.";
  public invalidEmailGeneric = `Multiple addresses were not recognized or are existing members. `
    + this.formatMsg;

  public async validateEmail(email: string, index?: number): Promise<boolean> {
    const domain = email.slice(-3).toLowerCase();
    const isGovtDomain = domain === "mil" || domain === "gov";
    const missingAtSymbol = email.indexOf("@") === -1;
    const validEmail = this.emailRegex.test(email);

    const isValid = isGovtDomain && !missingAtSymbol && validEmail;
    if (index !== undefined && index >= 0) {
      this.enteredEmails[index].isValid = isValid;
      this.$nextTick(() => {

        const multipleErrors = this.invalidEmailCount > 1
          || (this.existingEmailCount >= 1 && this.invalidEmailCount === 1);
        if (multipleErrors) {
          // multiple errors message
          this.invalidEmailMessage = this.invalidEmailMultiple;
        } else if (this.invalidEmailCount === 1) {
          // single error messages
          if (!validEmail && missingAtSymbol && !isGovtDomain) {
            this.invalidEmailMessage = this.invalidEmailFormat;
          } else if (!isGovtDomain) {
            this.invalidEmailMessage = this.invalidEmailDomain;
          } else if (missingAtSymbol) {
            this.invalidEmailMessage = this.invalidEmailMissingAtSymbol;
          }
        } else {
          // clear validation message
          this.invalidEmailMessage = "";
        }
      });
    }

    return isValid;
  }

  public async emailBlurred(e: Event): Promise<void> {
    e.preventDefault();
    e.cancelBubble = true;
    this.pillboxFocused = false;
    const input = e.target as HTMLInputElement;
    const emailKey = input.dataset.emailKey as string;
    let emailAddressEntered = input.value;
    emailAddressEntered = emailAddressEntered.replace(/['"]/g, "");

    if (emailAddressEntered.length) {
      const removeButton =
        input.parentElement?.nextElementSibling?.getElementsByTagName(
          "button"
        )[0];

      if (removeButton) {
        removeButton.setAttribute(
          "aria-label",
          "Remove email address " + emailAddressEntered
        );
        removeButton.setAttribute(
          "id",
          "RemoveEmail" + emailKey
        );
      }

      const emailIndex = this.enteredEmails.findIndex(e => e.key === emailKey);
      const isValid = await this.validateEmail(emailAddressEntered, emailIndex);
      if (emailAddressEntered.toLowerCase() === this.duplicatedEmail) {
        this.enteredEmails.splice(emailIndex, 1);
        this.duplicatedEmail = "";
      } else {
        this.enteredEmails[emailIndex].email = emailAddressEntered;
        //eslint-disable-next-line prefer-const
        let isExistingEmail = this.existingMemberEmails.indexOf(
          emailAddressEntered.toLowerCase()
        ) > -1;
        if (!isExistingEmail && isValid) {
          this.validEmailList.push(emailAddressEntered.toLowerCase());
          this.enteredEmails[emailIndex].isExisting = false;
        } else if (isExistingEmail) {
          this.enteredEmails[emailIndex].isExisting = true;
          if (this.invalidEmailCount > 0) {
            this.invalidEmailMessage = this.invalidEmailGeneric;
          } else {
            this.invalidEmailMessage = this.existingMemberEmailsEntered.length > 1
              ? "Multiple email addresses are already portfolio members."
              : emailAddressEntered + " is already a portfolio member.";
          }
        }
      }

      if (this.inputWidthFaker) {
        this.inputWidthFaker.innerHTML = emailAddressEntered;
        const w = this.inputWidthFaker.offsetWidth + "px";
        input.style.width = w;
      }
    } else {
      this.removeEmailFromList(emailKey);
    }
  }

  public removeEmailFromList(emailKey: string): void {
    this.enteredEmails = this.enteredEmails.filter(obj => obj.key !== emailKey);
    this.$nextTick(() => {
      this.enteredEmails.forEach((obj, i) => {
        this.validateEmail(obj.email, i);
      })
      this.setInputWidths();
    });
  }

  public removeEmail(e: Event): void {
    this.pillboxFocused = false;
    const thisButton = e.target as HTMLButtonElement;
    const closestElement = thisButton.closest(".v-input__slot") as HTMLElement;
    const input = closestElement.querySelector(
      "input[type=text]"
    ) as HTMLInputElement;
    const i = this.validEmailList.indexOf(input.value.toLowerCase());
    if (i > -1) {
      this.validEmailList.splice(i, 1);
    }
    const emailKey = input.dataset.emailKey as string;
    this.removeEmailFromList(emailKey);
  }

  public removeInvalidEmails(): void {
    this.enteredEmails = this.enteredEmails.filter(
      obj => obj.isValid === true && obj.isExisting === false
    );
  }

  public setInputWidths(): void {
    this.enteredEmails.forEach((obj) => {
      if (this.inputWidthFaker) {
        this.inputWidthFaker.innerHTML = obj.email;
        const w = this.inputWidthFaker.offsetWidth + "px";
        const emailInput = document.querySelector(
          "[data-email-key='" + obj.key + "']"
        ) as HTMLElement;
        emailInput.style.width = w;
      }
    }, this);
  }

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
    const invitedCount = this.validEmailList.length;
    const toastMsg = invitedCount > 1
      ? invitedCount + " members added"
      : invitedCount + " member added";
    this.membersInvitedToast.message = toastMsg;
    Toast.setToast(this.membersInvitedToast);
    const newMembers = {
      emails: this.validEmailList,
      role: this.selectedRole,
    }

    await PortfolioStore.saveMembers(newMembers);
    this.$emit("members-invited")
  }

  public openLearnMoreDrawer(): void {
    this.modalDrawerIsOpen = true;
  }


}

</script>
