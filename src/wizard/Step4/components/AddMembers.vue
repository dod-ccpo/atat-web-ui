<template>
  <v-card class="extra-padding">
    <div id="inputWidthFaker" ref="inputWidthFaker"></div>
    <v-card-title style="height: 52px">
      <div class="mb-2 h3">Add team members to Tracker Application</div>
    </v-card-title>
    <v-card-text class="body-lg text--base-darkest height-100 mt-2">
      <p>
        Team members can have different levels of access to your application and
        environments. Invite multiple people with the same permissions at once.
      </p>

      <div id="PillboxLabel" class="mt-10 bm-2 body-lg">
        <span :class="[invalidEmailCount > 0 ? 'font-weight-700' : '']">
          Email Addresses
        </span>
      </div>

      <div
        class="error--text mb-2"
        :class="{ 'd-flex': invalidEmailCount }"
        v-show="invalidEmailCount"
      >
        <div class="v-messages__message mr-2 d-inline-block">
          {{ invalidEmailCount }} error<span v-if="invalidEmailCount > 1"
            >s</span
          >.
        </div>

        <v-btn
          id="RemoveAllInvalidEntriesLink"
          class="link-button pa-0"
          @click="removeInvalidEmails"
          style="height: 26px"
        >
          Remove all emails with errors
        </v-btn>
      </div>
      <div
        id="PillboxWrapper"
        aria-labelledby="PillboxLabel"
        aria-describedby="PillboxInstructions"
        class="pa-2 pillbox-wrapper mb-0 firstFocus"
        tabindex="0"
        :class="[pillboxFocused ? 'focused' : '']"
        @click="addEmail"
        @focus="addEmail"
      >
        <v-text-field
          v-for="member in memberList"
          :key="member.id"
          class="pill"
          :class="{
            'invalid-entry': !member.isValid && member.isValid !== null,
          }"
          :data-member-id="member.id"
          v-model="member.email"
          append-icon="close"
          @click="emailEdit"
          @blur="emailBlurred"
          @click:append="removeEmail"
        />
      </div>
      <div class="dupe-entry-alert-wrapper">
        <v-alert
          v-if="duplicatedEmail"
          class="dupe-entry-alert"
          color="#1b1b1b"
          dark
          icon="error"
          dense
        >
          &ldquo;{{ duplicatedEmail }}&rdquo; has already been entered.
        </v-alert>
      </div>
      <div class="color-base mt-2" id="PillboxInstructions">
        Must use a .mil email address. Separate multiple emails with commas.
      </div>

      <v-alert
        v-show="invalidEmailCount"
        outlined
        rounded
        color="error"
        border="left"
        icon="error"
        class="text-left error_lighter black-icon mt-6"
      >
        <p class="black--text body-lg ma-0">
          <span v-if="invalidEmailCount === 1">
            The address &ldquo;{{ invalidEmail }}&rdquo; was not recognized.
          </span>
          <span v-if="invalidEmailCount > 1">
            Multiple addresses were not recognized.
          </span>
          Please make sure that all addresses are properly formatted and .mil
          addresses.
        </p>
      </v-alert>
    </v-card-text>
    <v-card-actions style="height: 73px">
      <v-spacer></v-spacer>
      <v-btn text class="link-button" @click="_close = false"> Cancel </v-btn>
      <v-btn
        color="primary"
        class="px-5"
        @click="saveToStore"
        :disabled="invalidEmailCount > 0 || validEmailCount === 0"
      >
        Add Team Members
        <span class="valid-entry-count ml-2" v-if="invalidEmail === 0">
          {{ validEmailCount }}
        </span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

@Component({})
export default class AddMember extends Vue {
  private pillboxFocused = false;

  private duplicatedEmail = "";
  private memberList: {
    id: number;
    email: string;
    display_name: "";
    access: "";
    isValid: boolean | null;
    isDuplicate: boolean;
  }[] = [];
  private validEmailList: string[] = [];

  @PropSync("close") _close!: boolean;

  get inputWidthFaker(): HTMLElement {
    return this.$refs.inputWidthFaker as HTMLElement;
  }

  get validEmailCount(): number {
    return this.memberList.filter((obj) => obj.isValid === true).length;
  }

  get validEmails(): string[] {
    return this.memberList.filter((obj) => obj.isValid).map((obj) => obj.email);
  }

  get invalidEmailCount(): number {
    return this.memberList.filter((obj) => obj.isValid === false).length;
  }

  get invalidEmail(): string {
    const invalidEmails = this.memberList.filter((obj) => {
      return obj.isValid === false;
    });
    return invalidEmails.length ? invalidEmails[0].email : "";
  }

  get duplicateEmailCount(): number {
    return this.memberList.filter((obj) => obj.isDuplicate === true).length;
  }

  public addEmail(e: Event, override: boolean | null): void {
    const targetElement = e.target;
    const targetId = targetElement ? (targetElement as HTMLDivElement).id : "";
    this.pillboxFocused = true;
    let len = this.memberList.length;
    if (
      (targetId === "PillboxWrapper" || override === true) &&
      (len === 0 || this.memberList[len - 1].email !== "")
    ) {
      const memberId = Date.now();
      this.memberList.push({
        id: memberId,
        email: "",
        display_name: "",
        access: "",
        isValid: null,
        isDuplicate: false,
      });
      this.$nextTick().then(() => {
        let newInput = document.querySelector(
          "[data-member-id='" + memberId + "']"
        ) as HTMLInputElement;
        newInput.style.width = "40px";
        newInput?.focus();
        this.addInputEventListeners(this, newInput);
      });
    }
  }

  public removeEmail(e: Event) {
    this.pillboxFocused = false;
    const thisButton = e.target as HTMLButtonElement;
    const closestElement = thisButton.closest(".v-input__slot") as HTMLElement;
    const input = closestElement.querySelector(
      "input[type=text]"
    ) as HTMLInputElement;
    const i = this.validEmailList.indexOf(input.value);
    if (i > -1) {
      this.validEmailList.splice(i, 1);
    }
    const memberId = Number(input.dataset.memberId);
    this.removeMemberFromList(memberId);
    this.setInputWidths();
  }

  public removeInvalidEmails() {
    this.memberList = this.memberList.filter((obj) => {
      return obj.isValid === true;
    });
  }

  public addInputEventListeners(vm: any, input: HTMLInputElement) {
    input.addEventListener("input", () => {
      this.inputWidthFaker.innerHTML = input.value;
      const w = this.inputWidthFaker.offsetWidth + "px";
      input.style.width = w;

      this.duplicatedEmail =
        this.validEmailList.indexOf(input.value) > -1 ? input.value : "";
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
        // for 508 compliance...
        // if shift-tabbing out of first pill input, and have invalid emails,
        // tab to the "Remove all emails with errors" link
        const memberId = Number(input.dataset.memberId);
        const memberListIndex = this.memberList
          .map(function (e) {
            return e.id;
          })
          .indexOf(memberId);
        if (
          memberListIndex === 0 &&
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
      pastedText = pastedText.replace(/['"\s]/g, "");
      pastedText = pastedText.replace(/;/g, ",");

      const pastedValuesArray: string[] = pastedText.split(",");
      let uniqueValues = [...new Set(pastedValuesArray)];
      const timeStamp = Date.now();
      uniqueValues.forEach((email, i) => {
        const validListIndex = vm.validEmailList.indexOf(email);
        const isValid = vm.validateEmail(email);
        if (email && isValid && validListIndex === -1) {
          vm.validEmailList.push(email);
          const memberId = timeStamp + i;
          vm.memberList.push({
            id: memberId,
            email: email,
            display_name: "",
            access: "",
            isValid: isValid,
            isDuplicate: false, // address this when comparing to existing members
          });
        }
      });
      input.blur();
    });
  }

  public emailEdit(e: Event) {
    e.preventDefault();
    e.cancelBubble = true;
    const input = e.currentTarget as HTMLInputElement;
    const i = this.validEmailList.indexOf(input.value);
    if (i > -1) {
      this.validEmailList.splice(i, 1);
    }
    this.pillboxFocused = true;
    this.addInputEventListeners(this, input);
  }

  public emailBlurred(e: Event) {
    e.preventDefault();
    e.cancelBubble = true;
    this.pillboxFocused = false;
    const input = e.target as HTMLInputElement;
    const memberId = Number(input.dataset.memberId);
    let emailAddressEntered = input.value;
    emailAddressEntered = emailAddressEntered.replace(/['"]/g, "");

    if (emailAddressEntered.length) {
      const memberListIndex = this.memberList
        .map(function (e) {
          return e.id;
        })
        .indexOf(memberId);
      const isValid = this.validateEmail(emailAddressEntered);
      this.memberList[memberListIndex].isValid = isValid;

      if (emailAddressEntered === this.duplicatedEmail) {
        this.memberList.splice(memberListIndex, 1);
        this.duplicatedEmail = "";
      } else {
        this.memberList[memberListIndex].email = emailAddressEntered;
        if (isValid) {
          this.validEmailList.push(emailAddressEntered);
        }
      }

      this.inputWidthFaker.innerHTML = emailAddressEntered;
      const w = this.inputWidthFaker.offsetWidth + "px";
      input.style.width = w;
    } else {
      this.removeMemberFromList(memberId);
      this.setInputWidths();
    }
  }

  public setInputWidths() {
    this.memberList.forEach((member) => {
      this.inputWidthFaker.innerHTML = member.email;
      const w = this.inputWidthFaker.offsetWidth + "px";
      const emailInput = document.querySelector(
        "[data-member-id='" + member.id + "']"
      ) as HTMLElement;
      emailInput.style.width = w;
    }, this);
  }

  public validateEmail(email: string) {
    const isMilAddress = email.slice(-3) === "mil";
    const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    return isMilAddress && emailRegex.test(email);
  }

  public removeMemberFromList(memberId: number) {
    this.memberList = this.memberList.filter(function (obj) {
      return obj.id !== memberId;
    });
  }

  public saveToStore() {
    console.log("save member data to store...");
  }
}
</script>
