<template>
  <v-container fluid>
    <v-row>
      <div id="inputWidthFaker" ref="inputWidthFaker"></div>
      <v-dialog v-model="dialogOpen" persistent max-width="632px">
        <v-card>
          <v-card-title>
            <h2 class="mb-2">Add team members to Tracker Application</h2>
          </v-card-title>
          <v-card-text class="body-lg text--base-darkest">
            <p>
              Team members can have different levels of access to your
              application and environments. Invite multiple people with the same
              permissions at once.
            </p>

            <strong id="EmailInputLabel">Email Addresses</strong>
            <div class="error--text" v-if="invalidEmailCount">
              <div class="v-messages__message mr-2 d-inline-block">
                {{ invalidEmailCount }} error<span v-if="invalidEmailCount > 1"
                  >s</span
                >
              </div>
              <a tabindex="0" @click="removeInvalidEmails"
                >Remove all emails with errors</a
              >
            </div>
            <div
              id="EmailInputWrapper"
              aria-labelledby="EmailInputLabel"
              class="pa-2 email-wrapper mb-0"
              :class="[emailInputFocused ? 'focused' : '']"
              @click="addEmail"
            >
              <v-text-field
                v-for="member in memberList"
                :key="member.id"
                class="pill"
                :class="{
                  'email-invalid': !member.isValid && member.isValid !== null,
                }"
                :data-member-id="member.id"
                v-model="member.email"
                append-icon="close"
                @click="emailEdit"
                @blur="emailBlurred"
                @click:append="removeEmail"
              />
            </div>
            <div class="dupe-email-alert-wrapper">
              <v-alert
                v-if="duplicatedEmail"
                class="dupe-email-alert"
                color="#1b1b1b"
                dark
                icon="error"
                dense
              >
                &ldquo;{{ duplicatedEmail }}&rdquo; has already been entered.
              </v-alert>
            </div>
            <span class="color-base">
              Must use a .mil email address. Separate multiple emails with
              commas.
            </span>

            <v-alert
              v-show="invalidEmailCount"
              outlined
              rounded
              color="error"
              border="left"
              icon="error"
              class="text-left error_lighter black-icon mt-3"
            >
              <p class="black--text body-lg">
                <span v-if="invalidEmailCount === 1">
                  The address &ldquo;{{ invalidEmail }}&rdquo; was not
                  recognized.
                </span>
                <span v-if="invalidEmailCount > 1">
                  Multiple addresses were not recognized.
                </span>
                Please make sure that all addresses are properly formatted and
                .mil addresses.
              </p>
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text class="link-button" @click="dialogOpen = false">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              class="px-5"
              @click="dialogOpen = false"
              :disabled="invalidEmailCount > 0 || validEmailCount === 0"
            >
              Add Team Members
              <span class="valid-email-count ml-2" v-if="validEmailCount">
                {{ validEmailCount }}
              </span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-col class="pl-0" cols="12">
        <h2 v-if="!createdApplication" class="h2">
          Invite team members to your application
        </h2>
        <h2 v-else class="h2">
          Let’s add team members to {{ createdApplication }}
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 ma-0" cols="9">
        <span v-if="!createdApplication">
          <p class="body-lg text--base-darkest">
            In this section, you will be able to invite people from your
            application’s development team and assign permission levels, so they
            can contribute to your workspaces within the
            <span class="font-weight-bold">{{ csp }}</span> console.
          </p>
          <p class="body-lg text--base-darkest">
            In order to invite team members, you must set up at least one
            application within your portfolio. Please
            <a
              href="/wizard/addapplication"
              class="link-body-md font-weight-bold"
            >
              add an application
            </a>
            to continue.
          </p>
        </span>
        <p v-else class="body-lg text--base-darkest">
          Invite your application team members and assign their permissions
          below. These individuals will receive an invitation from
          <span class="font-weight-bold"> {{ csp }}</span> after your portfolio
          is provisioned. Select <span class="font-weight-bold">Next</span> to
          add team members to your other applications.
          <a class="text-decoration-underline"
            >Learn more about team member roles</a
          >
        </p>
      </v-col>
    </v-row>
    <v-row v-if="createdApplication">
      <v-col class="ps-0 ma-0">
        <v-row>
          <v-col cols="9" class="d-flex pl-0">
            <v-col class="d-flex">
              <v-text-field
                class="search-bar"
                placeholder="Search for member name and email"
                dense
                outlined
                single-line
                hide-details
              />
              <v-btn class="input-search-bar" color="primary">
                <v-icon width="10px" class="mr-1">search</v-icon>
              </v-btn>
            </v-col>
            <v-col class="d-flex flex-row-reverse">
              <v-btn
                role="button"
                class="font-weight-bold align-center"
                :ripple="false"
                color="primary"
                @keydown.native.enter="openModal($event)"
                @click="openModal($event)"
              >
                <v-icon class="mr-2" role="presentation">control_point</v-icon>
                Invite Team Member
              </v-btn>
            </v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="9" class="pa-0 ma-0">
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
          <v-col cols="9">
            <v-btn
              @click="showPortfolioOwnerText = !showPortfolioOwnerText"
              text
              x-small
              :ripple="false"
              class="pl-0 primary--text"
            >
              <span class="link-body-md">
                As the portfolio owner, will I have access to this application
                within the cloud console?
              </span>
              <v-icon>
                {{ showPortfolioOwnerText ? "expand_less" : "expand_more" }}
              </v-icon>
            </v-btn>
            <div v-show="showPortfolioOwnerText">
              <v-card-text class="h6 pb-0 ps-3">
                <v-row>
                  <p class="body-lg text--base-darkest">
                    Portfolio owners are not automatically granted access to the
                    cloud console. You will be able to track your team’s cloud
                    spend and other funding details in ATAT. If you need to
                    login to the cloud console, be sure to add yourself as a
                    team member and assign permissions in this step.
                  </p>
                </v-row>
              </v-card-text>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="9">
            <v-btn
              @click="teamPortfolioAccessText = !teamPortfolioAccessText"
              text
              x-small
              :ripple="false"
              class="pl-0 primary--text"
            >
              <span class="link-body-md">
                Will my team members have access to this portfolio within ATAT?
              </span>
              <v-icon>
                {{ teamPortfolioAccessText ? "expand_less" : "expand_more" }}
              </v-icon>
            </v-btn>
            <div v-show="teamPortfolioAccessText">
              <v-card-text class="h6 pb-0 ps-3">
                <v-row>
                  <p class="body-lg text--base-darkest">
                    No. These team members will only have access to the cloud
                    provider’s console. After your portfolio is provisioned, you
                    will have an opportunity to add people as portfolio managers
                    and assign user roles for access within ATAT.
                  </p>
                </v-row>
              </v-card-text>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="9">
            <v-btn
              @click="teamPermissionsText = !teamPermissionsText"
              text
              x-small
              :ripple="false"
              class="pl-0 primary--text"
            >
              <span class="link-body-md">
                Can I add team members or modify permissions after my portfolio
                is provisioned?
              </span>
              <v-icon>
                {{ teamPermissionsText ? "expand_less" : "expand_more" }}
              </v-icon>
            </v-btn>
            <div v-show="teamPermissionsText">
              <v-card-text class="h6 pb-0 ps-3">
                <v-row>
                  <p class="body-lg text--base-darkest">
                    After provisioning, you will have the opportunity to invite
                    new people to ensure your application team can access their
                    cloud resources.
                  </p>
                  <p class="body-lg text--base-darkest">
                    However, you will not be able to change roles and
                    permissions once the invitations are sent. People that you
                    assign as
                    <span class="font-weight-bold">Administrators</span> are
                    responsible for making modifications to team members and
                    roles directly in the cloud console.
                  </p>
                  <p class="body-lg text--base-darkest">
                    Please note that ATAT is not a system of record. We will
                    keep a record of the team members that have been added to
                    the portfolio through ATAT, but any changes made in the
                    cloud console after provisioning will not be reflected
                    within ATAT.
                  </p>
                </v-row>
              </v-card-text>
            </div>
          </v-col>
        </v-row>
        <v-row class="mb-16">
          <v-col cols="9">
            <v-btn
              @click="teamExpectationText = !teamExpectationText"
              text
              x-small
              :ripple="false"
              class="pl-0 primary--text"
            >
              <span class="link-body-md">
                What can my team members expect?
              </span>
              <v-icon>
                {{ teamExpectationText ? "expand_less" : "expand_more" }}
              </v-icon>
            </v-btn>
            <div v-show="teamExpectationText">
              <v-card-text class="h6 pb-0 mb-12">
                <v-row>
                  <ul class="body-lg text--base-darkest">
                    <li>
                      After your portfolio is provisioned, each team member will
                      receive an invitation from the cloud service provider.
                      People will only have access to environments in the cloud
                      console that you granted them access to.
                    </li>
                    <li class="text-base-error">
                      Invitations expire after XX days. If this happens, you can
                      resend the invitation within ATAT?
                    </li>
                  </ul>
                </v-row>
              </v-card-text>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class Step_4 extends Vue {
  private dialogOpen = false;
  private emailInputFocused = false;
  private csp =
    this.$store.state.portfolioSteps[0].model.csp ||
    "the selected Cloud Service Provider’s";
  private createdApplication = this.$store.state.portfolioSteps[2].model.name;
  private message = "You do not have any team members in this application yet.";
  private showPortfolioOwnerText = false;
  private teamPortfolioAccessText = false;
  private teamPermissionsText = false;
  private teamExpectationText = false;
  private handleClick(): void {
    console.log("clicked");
  }

  private search = ""; //sync search

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

  get inputWidthFaker() {
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

  public async mounted(): Promise<void> {
    this.$store.dispatch("saveStepModel", [{}, 4, true]);
  }

  public addEmail(e: Event, override: boolean | null): void {
    const targetElement = e.target;
    const targetId = targetElement ? (targetElement as HTMLDivElement).id : "";
    debugger;
    this.emailInputFocused = true;
    let len = this.memberList.length;
    if (
      (targetId === "EmailInputWrapper" || override === true) &&
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
      this.$forceUpdate();
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
    this.emailInputFocused = false;
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
            isDuplicate: false, // address this
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
    this.emailInputFocused = true;
    this.addInputEventListeners(this, input);
  }

  public emailBlurred(e: Event) {
    e.preventDefault();
    e.cancelBubble = true;
    this.emailInputFocused = false;
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

  public openModal(event: Event): void {
    this.$store.dispatch("openModal", ["default", event.type === "keydown"]);
    this.setInputWidths();
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
}
</script>

<style lang="scss">
.v-btn.primary.theme--light span.valid-email-count {
  background-color: white;
  color: #005ea2; // $primary
  border-radius: 20px;
  padding: 0 7px;
  &:hover,
  &:focus,
  &:active {
    background-color: white !important;
  }
}
.v-card__title {
  padding: 24px 40px 0 !important;
  h2 {
    font-size: 24px;
  }
}

.v-card__text {
  padding: 0 40px 24px !important;
}

.v-card__actions {
  background-color: #f0f0f0; // $base_lightest
  padding: 16px 24px !important;
}

.v-alert .v-alert__icon.v-icon {
  font-size: 20px;
  top: 0;
}

div#inputWidthFaker {
  display: inline-block;
  font-size: 16px;
  position: absolute;
  left: -10000px;
  top: -10000px;
}

.email-wrapper {
  border: 1px solid #565c65; // $base_dark
  height: 118px;
  margin-bottom: 5px;
  width: 100%;
  max-width: 550px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  &.focused {
    border-color: #005ea2; // $primary
    outline: 2px solid #005ea2; // $primary
  }
}

.dupe-email-alert-wrapper {
  position: relative;
  .dupe-email-alert {
    position: absolute;
    top: -26px;
    left: 1px;
    right: 2px;
    padding: 0;
    border-bottom-right-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    font-size: 14px !important;
    z-index: 10;
  }
}

.pill.v-text-field {
  display: inline-block;
  height: 32px;
  border: 1px solid #d9e8f6;
  border-radius: 15px;
  background-color: #d9e8f6;
  padding: 0 4px 0 12px;
  line-height: 22px;
  margin: 3px;
  position: relative;
  z-index: 2;
  border: 1px solid transparent;
  &.email-invalid:not(.v-input--is-focused) {
    background-color: #f8dfe2;
    border-color: #e21c3d;
    padding-left: 30px;
    &:before {
      font-family: "Material Icons";
      content: "error";
      -webkit-font-feature-settings: "liga";
      color: #e21c3d;
      position: absolute;
      top: 4px;
      left: 6px;
      font-size: 20px;
    }
  }

  input {
    height: 32px;
    max-height: 32px;
    line-height: 32px;
    padding: 0;
  }

  &.v-input--is-focused {
    background-color: transparent;
    .v-input__append-inner {
      opacity: 0;
    }
  }
  .v-input__slot {
    &:before,
    &:after {
      display: none;
    }
  }
}
</style>
