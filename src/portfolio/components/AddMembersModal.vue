
<template>

  <ATATDialog
    :showDialog.sync="showModal"
    :title="'Invite people to “' + projectTitle + '”'"
    no-click-animation
    okText="Invite"
    width="632"
    :OKDisabled="invalidEmailCount > 0 || !validEmailList.length"
  >
    <template #content>
      <p class="body">
        Use “.mil” or “.gov” email addresses to ensure people can authenticate with 
        a CAC to access your portfolio. 
        <a
          id="LearnMoreLink" 
          role="button"
        >
          Learn more about portfolio roles
        </a>
      </p>
      <v-form class="d-flex" ref="form" v-model="formIsValid" lazy-validation>
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
              class="_pill"
              :class="{
                '_invalid-entry': !email.isValid && email.isValid !== null,
              }"
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
            v-show="invalidEmailCount"
          />

          <v-btn
            id="RemoveAllInvalidEntriesLink"
            class="link-button pa-0"
            @click="removeInvalidEmails"
            style="height: 26px"
            v-if="invalidEmailCount > 1"
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
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

import { SelectData } from "../../../types/Global";
import {PortfolioDataStore} from "@/store/portfolio/index";

import { generateUid } from "@/helpers";

@Component({
  components: {
    ATATDialog,
    ATATErrorValidation,
    ATATSelect,
    ATATTextArea,
  }
})
// asdf@mail.mil, bar@masasfda.mil, fsfds, asdf@mail.mil
export default class AddMembersModal extends Vue {
  // $refs!: {
  //   inputWidthFaker: HTMLElement,
  // }

  @Prop({ default: false }) public showModal?: boolean;
  public formIsValid = true;
  public validEmailList: string[] = [];
  public pillboxFocused = false;
  public duplicatedEmail = "";
  public emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  public invalidEmailMessage = "";
  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }

  public selectedRole = "Manager";
  public roles: SelectData[] = [
    { header: "Roles" },
    { text: "Manager", value: "Manager" },
    { text: "Viewer", value: "Viewer" },
  ];

  public enteredEmails: {
    key: string;
    email: string;
    isValid: boolean | null;
    isExisting: boolean | null;
  }[] = [];

  @Watch("showModal")
  public showModalChange(newVal: boolean): void {
    if (newVal && !this.inputWidthFaker) {
      this.$nextTick(() => {
        this.inputWidthFaker = document.getElementById("inputWidthFaker");
      });
    }
  }

  /*

  jacks@icloud.mil, bar@, lamprecht@optonline.gov, evans@verizon.gov
andrewik@icloud.mil
glenz@gmail.mil
  qmacro@comcast.gov
  subir@optonline.gov
  fmerges@live.mil
  isaacson@aol.mil
  jaarnial@icloud.mil
  noneme@mac.mil
  kempsonc@me.mil

  */

  // EJY use for validation - check entered emails against existing members list
  public existingMembers: Record<string, string>[] = [];

  // get existingMembers from store, then map emails only 
  public existingMemberEmails: string[] = [];

  public inputWidthFaker: HTMLElement | null = null;
  // get inputWidthFaker(): HTMLElement {
  //   // return this.$refs.inputWidthFaker as HTMLElement;
  //   return this.$refs.inputWidthFaker as HTMLElement;
  // }

  get invalidEmailCount(): number {
    return this.enteredEmails.filter((obj) => obj.isValid === false).length;
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

  public addInputEventListeners(vm: unknown, input: HTMLInputElement): void {
    input.addEventListener("input", () => {
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
      const keypressed: string = e.key;
      const actionKeys: string[] = [" ", ",", ";", "Enter"];
      if (actionKeys.indexOf(keypressed) > -1) {
        e.preventDefault();
        e.cancelBubble = true;
        input.blur();
        setTimeout(() => {
          this.addEmail(new CustomEvent(""), true);
        }, 0);
      } else {
        // EJY check this is necessary - errors used to be above entry area in old ATAT
        // for 508 compliance... 
        // if tabbing out of last pill input, and have invalid emails,
        // tab to the "Remove all emails with errors" link
        const emailKey = input.dataset.emailKey as string;
        const emailIndex = this.enteredEmails.findIndex(e => e.key === emailKey);
        if (
          emailIndex === 0 &&
          keypressed === "Tab" &&
          e.shiftKey &&
          this.invalidEmailCount
        ) {
          const tabToLink = document.getElementById(
            "RemoveAllInvalidEntriesLink"
          ) as HTMLButtonElement;
          e.preventDefault();
          e.cancelBubble = true;
          tabToLink.focus();
        }
      }
    });

    input.addEventListener("paste", function (e: ClipboardEvent) {
      e.preventDefault();
      const { clipboardData } = e;
      let pastedText = clipboardData ? clipboardData.getData("text/plain") : "";
      pastedText = pastedText.replace(/['\r\n]/g, ",");
      pastedText = pastedText.replace(/['"\s]/g, "");
      pastedText = pastedText.replace(/;/g, ",");
      debugger;

      const pastedValuesArray: string[] = pastedText.split(",");
      let uniqueValues = [...new Set(pastedValuesArray)];
      const thisVm: any = vm;
      uniqueValues.forEach((email) => {
        const isExistingEmail = thisVm.existingMemberEmails.indexOf(email.toLowerCase()) > -1;
        const notAlreadyEntered =
          thisVm.validEmailList.indexOf(email.toLowerCase()) === -1;
        const isValid = thisVm.validateEmail(email);
        if (email && isValid && notAlreadyEntered) {
          thisVm.validEmailList.push(email.toLowerCase());
          const emailKey = generateUid();
          thisVm.enteredEmails.push({
            key: emailKey,
            email: email,
            isValid: isValid,
            isExisting: isExistingEmail,
          });
        }
      });
      input.blur();
    });
  }

  public addEmail(e: Event, override: boolean | null): void {
    const targetElement = e.target;
    const targetId = targetElement ? (targetElement as HTMLDivElement).id : "";
    this.pillboxFocused = true;
    let len = this.enteredEmails.length;
    if (
      (targetId === "PillboxWrapper" || override === true) &&
      (len === 0 || this.enteredEmails[len - 1].email !== "")
    ) {
      const emailKey = generateUid();
      this.enteredEmails.push({
        key: emailKey,
        email: "",
        isValid: null,
        isExisting: false,
      });
      this.$nextTick().then(() => {
        let newInput = document.querySelector(
          "[data-email-key='" + emailKey + "']"
        ) as HTMLInputElement;
        newInput.style.width = "40px";
        newInput?.focus();
        this.addInputEventListeners(this, newInput);
      });
    }
  }

  public invalidEmailFormat = "Please make sure that the address is properly formatted";
  public invalidEmailDomain = "Please use an email that ends with “.mil” or “.gov.”";
  public invalidEmailMultiple = `Multiple addresses were not recognized. Please ensure 
    all emails are properly formatted, using “@domain.mil” or “@domain.gov.”`;
    
  public validateEmail(email: string, index?: number): boolean {
    const domain = email.slice(-3).toLowerCase();
    const isGovAddress = domain === "mil" || domain === "gov";
    const validEmail = this.emailRegex.test(email);

    const isValid = isGovAddress && this.emailRegex.test(email);
    debugger;
    if (index !== undefined && index >= 0) {
      this.enteredEmails[index].isValid = isValid;
      debugger;
      this.$nextTick(() => {
        if (this.invalidEmailCount === 1) {
          this.invalidEmailMessage = !validEmail ? this.invalidEmailFormat
            : !isGovAddress ? this.invalidEmailDomain : "";
        } else if (this.invalidEmailCount > 1) {
          this.invalidEmailMessage = this.invalidEmailMultiple;
        } else {
          this.invalidEmailMessage = "";
        }

      })
    }

    return isValid;
  }

  public emailBlurred(e: Event): void {
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
      }

      const emailIndex = this.enteredEmails.findIndex(e => e.key === emailKey);
      const isValid = this.validateEmail(emailAddressEntered, emailIndex);
      debugger;
      // this.enteredEmails[emailIndex].isValid = isValid;

      if (emailAddressEntered.toLowerCase() === this.duplicatedEmail) {
        this.enteredEmails.splice(emailIndex, 1);
        this.duplicatedEmail = "";
      } else {
        this.enteredEmails[emailIndex].email = emailAddressEntered;
        let isExistingEmail = this.existingMemberEmails.indexOf(
          emailAddressEntered.toLowerCase()
        ) > -1;
        if (!isExistingEmail && isValid) {
          this.validEmailList.push(emailAddressEntered.toLowerCase());
          this.enteredEmails[emailIndex].isExisting = false;
        } else if (isExistingEmail) {
          this.enteredEmails[emailIndex].isExisting = true;
        }
      }
      if (this.inputWidthFaker) {
        this.inputWidthFaker.innerHTML = emailAddressEntered;
        const w = this.inputWidthFaker.offsetWidth + "px";
        input.style.width = w;
      }
    } else {
      this.removeEmailFromList(emailKey);
      this.setInputWidths();
    }
  }

  public removeEmailFromList(emailKey: string): void {
    this.enteredEmails = this.enteredEmails.filter(obj => obj.key !== emailKey);
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
    this.setInputWidths();
  }

  public removeInvalidEmails(): void {
    this.enteredEmails = this.enteredEmails.filter(obj => obj.isValid === true);
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

  public async mounted(): Promise<void> {
    // window.addEventListener('load', () => {
    //   this.inputWidthFaker = document.getElementById("inputWidthFaker");
    //   debugger;
    // });
  }

}
</script>
