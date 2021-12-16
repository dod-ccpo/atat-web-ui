<template>
  <v-card id="manageMembersModal" class="extra-padding overflow-x-hidden">
    <v-navigation-drawer
      v-model="learnMoreDrawerIsOpen"
      absolute
      temporary
      right
      width="100%"
    >
      <learn-more
        :learn-more-type="learnMoreType"
        @close-learn-more-drawer="closeLearnMoreDrawer"
        :bus="bus"
      ></learn-more>
    </v-navigation-drawer>

    <v-card-title>
      <h2 id="modalHeading" class="mb-0 firstFocus" tabindex="-1">
        <span v-if="!isEditSingle">
          Add
          {{ isRootAdmin ? "root administrators" : "team members" }}
          to
          {{ isRootAdmin ? portfolioName : currentApplicationName }}
        </span>
        <span v-if="isEditSingle">
          Update
          {{ memberToEditNameOriginal ? memberToEditNameOriginal : "Member" }}’s
          information
        </span>
      </h2>
    </v-card-title>
    <v-card-text class="body-lg text--base-darkest mt-2">
      <v-form ref="form" v-model="valid" lazy-validation>
        <div id="inputWidthFaker" ref="inputWidthFaker"></div>

        <!--#################################################-->
        <!-- EDIT SINGLE MEMBER NAME AND EMAIL -->
        <!--#################################################-->

        <div v-show="isEditSingle">
          <p>
            After your portfolio is provisioned, the email address will be sent
            to
            {{ selectedCSP ? selectedCSP : "your selected CSP" }} and
            {{
              memberToEditNameOriginal ? memberToEditNameOriginal : "the member"
            }}
            will receive an invitation to access the cloud console.
          </p>

          <atat-text-field
            id="editDisplayName"
            :value.sync="memberToEditName"
            label="Display Name"
            :helpText="displayNameHelpText"
            :rules="rules.display_name"
          />

          <atat-text-field
            id="editEmail"
            :value.sync="memberToEditEmail"
            label="Email Address"
            :rules="rules.email"
            aria-describedby="EmailInputInstructions"
            class="mt-6"
          />
          <div class="color-base mt-2" id="EmailInputInstructions">
            Must use a .mil email address
          </div>
        </div>

        <!--#################################################-->
        <!-- ADD MULTIPLE EMAILS -->
        <!--#################################################-->

        <div v-if="!isEditSingle">
          <p v-if="isRootAdmin">
            Team members added to this workspace will be granted the top-level
            <strong>root administrator</strong> role within your cloud console.
            These people will have full access to all of your applications.
            <a
              role="button"
              tabindex="0"
              class="text-link"
              @keydown.enter="openLearnMoreDrawer('root-admins')"
              @click="openLearnMoreDrawer('root-admins')"
            >
              Learn more about root administrators
            </a>
          </p>
          <p v-else>
            Team members can have different levels of application access. Invite
            people with the same permissions below.
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
            class="pa-2 pillbox-wrapper mb-0"
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
              :aria-label="'Email address ' + member.email"
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
              <span v-show="invalidEmailCount === 1">
                The address &ldquo;{{ invalidEmail }}&rdquo; was not recognized.
              </span>
              <span v-show="invalidEmailCount > 1">
                Multiple addresses were not recognized.
              </span>
              Please make sure that all addresses are properly formatted and
              .mil addresses.
            </p>
          </v-alert>
        </div>

        <!--#################################################-->
        <!-- MEMBER ACCESS ADD/EDIT -->
        <!--#################################################-->

        <div v-if="!isRootAdmin">
          <v-divider class="my-8 width-40"></v-divider>

          <h2>
            <span v-if="isEditSingle"> Change Role </span>
            <span v-if="!isEditSingle">Team Member Roles</span>
          </h2>
          <p>
            Choose the role
            {{ isEditSingle ? "this individual" : "people" }} will have in
            {{ currentApplicationName }}.
            <br v-if="isEditSingle" />
            <a
              role="button"
              tabindex="0"
              class="text-link d-inline-block"
              :class="{ 'ml-1': !isEditSingle }"
              @keydown.enter="openLearnMoreDrawer('member-roles')"
              @click="openLearnMoreDrawer('member-roles')"
            >
              Learn more about roles
            </a>
          </p>

          <v-checkbox
            v-model="assignDifferentRolesForEnvs"
            label="I want to assign different levels of access to each environment."
            class="border-base-lighter border-b-1"
            style="border-bottom-style: solid"
          ></v-checkbox>

          <div v-show="!assignDifferentRolesForEnvs">
            <v-radio-group v-model="roleForAllEnvs">
              <v-radio
                v-for="role in rolesForAllEnvsList"
                :key="role.role_name"
                :label="role.role_name"
                :value="role.role_value"
              ></v-radio>
            </v-radio-group>
          </div>

          <v-container v-show="assignDifferentRolesForEnvs">
            <v-row
              v-for="(env, index) in environments_roles"
              :key="env.env_id"
              class="d-flex border-base-lighter border-b-1 py-1"
              style="border-bottom-style: solid"
            >
              <v-col class="d-flex align-center">
                <strong class="font-size-19">
                  {{ env.env_name }}
                </strong>
              </v-col>
              <v-col>
                <v-select
                  class="no-details"
                  v-model="environments_roles[index].role_value"
                  :items="rolesList"
                  item-text="role_name"
                  item-value="role_value"
                  dense
                  filled
                  :ripple="false"
                />
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text class="link-button" @click="closeModal"> Cancel </v-btn>
      <v-btn
        color="primary"
        class="px-5"
        @click="saveToStore"
        :disabled="submitDisabled"
      >
        {{ buttonText }}
        <span
          class="valid-entry-count ml-2"
          v-if="!isEditSingle && validEmailCount > 0"
        >
          {{ validEmailCount }}
        </span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ApplicationData from "@/mixins/ApplicationModuleData";
import {
  ApplicationModel,
  OperatorModel,
  EnvironmentModel,
} from "types/Portfolios";

import { generateUid } from "@/helpers";
import LearnMore from "@/views/wizard/Step4/components/LearnMore.vue";

@Component({
  components: {
    "learn-more": LearnMore,
  },
})
export default class ManageMember extends mixins(ApplicationData) {
  /*
██████   █████  ████████  █████
██   ██ ██   ██    ██    ██   ██
██   ██ ███████    ██    ███████
██   ██ ██   ██    ██    ██   ██
██████  ██   ██    ██    ██   ██
*/
  private learnMoreDrawerIsOpen = false;
  private bus = new Vue();
  private learnMoreType = "";
  private pillboxFocused = false;
  private duplicatedEmail = "";
  private memberList: {
    id: string;
    email: string;
    display_name: string;
    access: string;
    isValid: boolean | null;
    isExisting: boolean;
  }[] = [];
  private validEmailList: string[] = [];

  private rolesList: {
    role_name: string;
    role_value: string;
    avl_for_all_envs: boolean;
  }[] = [
    {
      role_name: "Administrator",
      role_value: "administrator",
      avl_for_all_envs: true,
    },
    {
      role_name: "Contributor",
      role_value: "contributor",
      avl_for_all_envs: true,
    },
    {
      role_name: "Billing read-only",
      role_value: "read_only",
      avl_for_all_envs: true,
    },
    {
      role_name: "No access",
      role_value: "no_access",
      avl_for_all_envs: false,
    },
  ];

  private assignDifferentRolesForEnvs = true;
  private roleForAllEnvs = this.rolesList[0].role_value;
  private environments_roles: {
    env_id: string;
    env_name: string;
    role_value: string;
  }[] = [];
  private displayNameHelpText = `This could be your team member’s
    full name or a nickname. It will be used to refer to this
    individual within ATAT.`;
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private valid = true;
  private memberToEditName = "";
  private memberToEditEmail = "";
  private memberToEditNameOriginal = "";
  private memberToEditEmailOriginal = "";

  private memberToEditLoaded = false;
  private isRootAdmin = false;
  private isEditSingle = false;

  /*
██████  ██████   ██████  ██████  ███████
██   ██ ██   ██ ██    ██ ██   ██ ██
██████  ██████  ██    ██ ██████  ███████
██      ██   ██ ██    ██ ██           ██
██      ██   ██  ██████  ██      ███████
*/
  @PropSync("close") _close!: boolean;
  @Prop() private dialogProps!: any;

  /*
 ██████  ██████  ███    ███ ██████  ██    ██ ████████ ███████ ██████
██      ██    ██ ████  ████ ██   ██ ██    ██    ██    ██      ██   ██
██      ██    ██ ██ ████ ██ ██████  ██    ██    ██    █████   ██   ██
██      ██    ██ ██  ██  ██ ██      ██    ██    ██    ██      ██   ██
 ██████  ██████  ██      ██ ██       ██████     ██    ███████ ██████
*/

  get rules(): any {
    return {
      display_name: [
        (v: string) =>
          v.length < 100 || "Display name cannot exceed 100 characters",
        (v: string) => v.length !== 0 || "Please enter your team member’s name",
      ],
      email: [
        (v: string) =>
          v.length !== 0 || "Please enter your team member’s email address",
        (v: string) =>
          v.indexOf("@") > -1 ||
          "Please include an ‘@’ symbol in the email address",
        (v: string) =>
          v.slice(-3).toLowerCase() === "mil" ||
          "Please use a standard domain format, like ‘@yourdomain.mil’",
        (v: string) =>
          this.emailRegex.test(v) ||
          "Please make sure that the address is properly formatted",
      ],
    };
  }

  get addMembersFormInvalid(): boolean {
    if (!this.isEditSingle) {
      return this.invalidEmailCount > 0 || this.validEmailCount === 0;
    } else {
      return false;
    }
  }

  get submitDisabled(): boolean {
    if (this.isEditSingle) {
      return !this.valid;
    } else {
      return this.invalidEmailCount > 0 || this.validEmailCount === 0;
    }
  }

  get buttonText(): string {
    return this.isEditSingle
      ? "Update"
      : this.isRootAdmin
      ? "Add Root Administrators"
      : "Add Team Members";
  }

  get selectedCSP(): string {
    return this.$store.getters["wizard/getPortfolio"].csp;
  }

  get currentApplicationName(): string {
    if (!this.isRootAdmin && this.currentApplication) {
      return this.currentApplication.name;
    }
    return "current application";
  }

  get portfolioName(): string {
    return this.$store.getters["wizard/getPortfolioName"]();
  }
  get rolesForAllEnvsList(): unknown {
    return this.rolesList.filter((obj) => obj.avl_for_all_envs === true);
  }

  get existingMemberEmails(): string[] {
    let existingEmails: string[] = [];
    const app: ApplicationModel = this.currentApplication;

    if (
      Object.prototype.hasOwnProperty.call(app, "operators") &&
      app.operators.length
    ) {
      app.operators.forEach((op) => {
        existingEmails.push(op.email.toLowerCase());
      });
    }
    app.environments.forEach((env: EnvironmentModel) => {
      if (
        Object.prototype.hasOwnProperty.call(env, "operators") &&
        env.operators.length
      ) {
        env.operators.forEach((op) => {
          existingEmails.push(op.email.toLowerCase());
        });
      }
    });
    return existingEmails;
  }

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

  get existingEmailEntryCount(): number {
    return this.memberList.filter((obj) => obj.isExisting === true).length;
  }

  get existingEmailEntries(): string {
    const existingEmailList = this.memberList
      .filter((obj) => obj.isExisting)
      .map((obj) => obj.email);
    return existingEmailList.join(", ");
  }

  /*
██     ██  █████  ████████  ██████ ██   ██ ███████ ██████  ███████
██     ██ ██   ██    ██    ██      ██   ██ ██      ██   ██ ██
██  █  ██ ███████    ██    ██      ███████ █████   ██████  ███████
██ ███ ██ ██   ██    ██    ██      ██   ██ ██      ██   ██      ██
 ███ ███  ██   ██    ██     ██████ ██   ██ ███████ ██   ██ ███████
*/
  @Watch("assignDifferentRolesForEnvs")
  protected setEnvRoles(newVal: boolean): void {
    // if (newVal === false) {
    //   this.roleForAllEnvs = this.rolesList[0].role_value;
    //   this.initEnvRoleDropdowns(this.roleForAllEnvs);
    // }
    if (!this.memberToEditLoaded && !this.isRootAdmin) {
      if (newVal === true) {
        this.initEnvRoleDropdowns(this.roleForAllEnvs);
      } else {
        this.roleForAllEnvs = this.rolesList[0].role_value;
      }
    }
  }

  @Watch("roleForAllEnvs")
  protected setAllEnvsRoles(newVal: string): void {
    if (this.memberToEditLoaded && !this.isRootAdmin) {
      this.initEnvRoleDropdowns(newVal);
    }
  }

  @Watch("dialogProps")
  protected setProps(newVal: unknown): void {
    this.initMemberModal(newVal);
  }

  /*
███    ███ ███████ ████████ ██   ██  ██████  ██████  ███████
████  ████ ██         ██    ██   ██ ██    ██ ██   ██ ██
██ ████ ██ █████      ██    ███████ ██    ██ ██   ██ ███████
██  ██  ██ ██         ██    ██   ██ ██    ██ ██   ██      ██
██      ██ ███████    ██    ██   ██  ██████  ██████  ███████
*/

  public async mounted(): Promise<void> {
    // this.initEnvRoleDropdowns(this.roleForAllEnvs);
    this.initMemberModal(this.dialogProps);
  }

  public initMemberModal(props: any): void {
    if (props && Object.prototype.hasOwnProperty.call(props, "isRootAdmin")) {
      this.isRootAdmin = props.isRootAdmin;
    }
    if (props && Object.prototype.hasOwnProperty.call(props, "isEditSingle")) {
      this.isEditSingle = props.isEditSingle;
    }
    if (!this.isRootAdmin) {
      this.assignDifferentRolesForEnvs = true;
      if (this.rolesList && this.rolesList.length) {
        this.roleForAllEnvs = this.rolesList[0].role_value;
        this.initEnvRoleDropdowns(this.roleForAllEnvs);
      }
    }

    if (this.isEditSingle) {
      // editing a single member
      if (props && Object.prototype.hasOwnProperty.call(props, "memberEmail")) {
        this.memberToEditLoaded = false;
        this.setTheMemberToEdit(props.memberEmail);
      }
    } else if (!this.isRootAdmin) {
      this.assignDifferentRolesForEnvs = false;
      this.roleForAllEnvs = this.rolesList[0].role_value;
    } else if (this.isRootAdmin) {
      this.assignDifferentRolesForEnvs = false;
    }
  }

  private setTheMemberToEdit(memberEmail: string): void {
    let foundMember: OperatorModel[] = [];
    if (this.isRootAdmin) {
      const rootAdmins: OperatorModel[] = this.operators;

      foundMember = rootAdmins.filter((obj) => obj.email === memberEmail);
      if (foundMember) {
        // EJY - TODO - DRY this
        this.memberToEditName = foundMember[0].display_name;
        this.memberToEditNameOriginal = foundMember[0].display_name;
        this.memberToEditEmail = foundMember[0].email;
        this.memberToEditEmailOriginal = foundMember[0].email;
      }
      return;
    } else {
      const app: ApplicationModel | null = this.currentApplication;
      if (app) {
        const appOperators: OperatorModel[] | null = app ? app.operators : null;
        if (appOperators && appOperators.length) {
          foundMember = appOperators.filter((obj) => obj.email === memberEmail);
          if (foundMember.length) {
            // since is application level, set access for all environments
            this.memberToEditLoaded = true;
            this.assignDifferentRolesForEnvs = false;
            // EJY here
            this.roleForAllEnvs = foundMember[0].access;
            this.memberToEditName = foundMember[0].display_name;
            this.memberToEditNameOriginal = foundMember[0].display_name;
            this.memberToEditEmail = foundMember[0].email;
            this.memberToEditEmailOriginal = foundMember[0].email;
            return;
          }
        }

        // check for member in environment operators
        const envs: EnvironmentModel[] | null = app.environments;
        if (envs) {
          let foundEnvOp: any[] = [];
          envs.forEach((env) => {
            const envOperators: any[] | null = env.operators;
            if (envOperators && envOperators.length) {
              foundEnvOp = Object.assign(
                [],
                envOperators.filter((op) => op.email === memberEmail)
              );
              if (foundEnvOp.length) {
                foundEnvOp[0].env_id = env.id;
                foundEnvOp[0].env_name = env.name;
                foundMember.push(foundEnvOp[0]);
              }
            }
          });
          if (foundMember.length) {
            this.memberToEditName = foundMember[0].display_name;
            this.memberToEditNameOriginal = foundMember[0].display_name;
            this.memberToEditEmail = foundMember[0].email;
            this.memberToEditEmailOriginal = foundMember[0].email;
            this.environments_roles.forEach((env: any) => {
              let foundMemberInEnv = foundMember.filter(
                (member: any) => member.env_id === env.env_id
              );
              if (foundMemberInEnv.length) {
                env.role_value = foundMemberInEnv[0].access;
              } else {
                env.role_value = "no_access";
              }
            });
          }
        }
      }
    }
    this.memberToEditLoaded = true;
  }

  private initEnvRoleDropdowns(role: string) {
    if (!this.isRootAdmin) {
      const curApp: ApplicationModel = this.currentApplication;
      this.environments_roles = [];
      curApp.environments.forEach((env: EnvironmentModel) => {
        this.environments_roles.push({
          env_id: env.id,
          env_name: env.name,
          role_value: role,
        });
      });
    }
  }

  public addMembersFormIsValid(): boolean {
    return this.invalidEmailCount > 0 || this.validEmailCount === 0;
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
      const memberId = generateUid();
      this.memberList.push({
        id: memberId,
        email: "",
        display_name: "",
        access: "",
        isValid: null,
        isExisting: false,
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
    const memberId = input.dataset.memberId as string;
    this.removeMemberFromList(memberId);
    this.setInputWidths();
  }

  public removeInvalidEmails(): void {
    this.memberList = this.memberList.filter((obj) => {
      return obj.isValid === true;
    });
  }

  public addInputEventListeners(vm: unknown, input: HTMLInputElement): void {
    input.addEventListener("input", () => {
      this.inputWidthFaker.innerHTML = input.value;
      const w = this.inputWidthFaker.offsetWidth + "px";
      input.style.width = w;

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
        // for 508 compliance...
        // if shift-tabbing out of first pill input, and have invalid emails,
        // tab to the "Remove all emails with errors" link
        const memberId = input.dataset.memberId as string;
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
      const thisVm: any = vm;
      uniqueValues.forEach((email) => {
        // EJY TODO - deeper existing validation on root admin emails
        const isExistingEmail = thisVm.isRootAdmin
          ? false
          : thisVm.existingMemberEmails.indexOf(email.toLowerCase()) > -1;
        // EJY end TODO
        const notAlreadyEntered =
          thisVm.validEmailList.indexOf(email.toLowerCase()) === -1;
        const isValid = thisVm.validateEmail(email);
        if (email && isValid && notAlreadyEntered) {
          const displayName: string = thisVm.parseNameFromEmail(email);
          thisVm.validEmailList.push(email.toLowerCase());
          const memberId = generateUid();
          thisVm.memberList.push({
            id: memberId,
            email: email,
            display_name: displayName,
            access: "",
            isValid: isValid,
            isExisting: isExistingEmail,
          });
        }
      });
      input.blur();
    });
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

  public emailBlurred(e: Event): void {
    e.preventDefault();
    e.cancelBubble = true;
    this.pillboxFocused = false;
    const input = e.target as HTMLInputElement;
    const memberId = input.dataset.memberId as string;
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

      const memberListIndex = this.memberList
        .map(function (e) {
          return e.id;
        })
        .indexOf(memberId);
      const isValid = this.validateEmail(emailAddressEntered);
      this.memberList[memberListIndex].isValid = isValid;

      if (emailAddressEntered.toLowerCase() === this.duplicatedEmail) {
        this.memberList.splice(memberListIndex, 1);
        this.duplicatedEmail = "";
      } else {
        this.memberList[memberListIndex].email = emailAddressEntered;
        // EJY TODO - deeper existing validation on root admin emails
        let isExistingEmail = this.isRootAdmin
          ? false
          : this.existingMemberEmails.indexOf(
              emailAddressEntered.toLowerCase()
            ) > -1;
        // EJY end TODO
        if (!isExistingEmail && isValid) {
          this.validEmailList.push(emailAddressEntered.toLowerCase());
          const displayName: string =
            this.parseNameFromEmail(emailAddressEntered);
          this.memberList[memberListIndex].display_name = displayName;
          this.memberList[memberListIndex].isExisting = false;
        } else if (isExistingEmail) {
          this.memberList[memberListIndex].isExisting = true;
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

  public parseNameFromEmail(email: string): string {
    // get everthing before the @ symbol
    let name = email.split("@")[0];
    // remove identifier suffix
    name = name.replace(/.civ|-civ|.mil|-mil|.ctr|-ctr|_adm/gi, "");
    // split on . _ and -
    let names = name.split(/[._\\-]+/);
    // capitalize and remove all non-alpha characters
    for (let i = 0; i < names.length; i++) {
      names[i] = (names[i].charAt(0).toUpperCase() + names[i].slice(1)).replace(
        /[^A-Za-z]+/g,
        ""
      );
    }
    // remove middle initial
    if (names.length > 1 && names[1].length === 1) {
      names.splice(1, 1);
    }
    return names.join(" ");
  }

  public setInputWidths(): void {
    this.memberList.forEach((member) => {
      this.inputWidthFaker.innerHTML = member.email;
      const w = this.inputWidthFaker.offsetWidth + "px";
      const emailInput = document.querySelector(
        "[data-member-id='" + member.id + "']"
      ) as HTMLElement;
      emailInput.style.width = w;
    }, this);
  }

  public validateEmail(email: string): boolean {
    const isMilAddress = email.slice(-3).toLowerCase() === "mil";
    return isMilAddress && this.emailRegex.test(email);
  }

  public removeMemberFromList(memberId: string): void {
    this.memberList = this.memberList.filter(function (obj) {
      return obj.id !== memberId;
    });
  }

  public setOperators(role: string): OperatorModel[] {
    let operators: OperatorModel[] = [];
    this.memberList.forEach((member) => {
      let operator: OperatorModel = {
        id: member.id,
        display_name: member.display_name,
        email: member.email,
        access: role,
      };
      operators.push(operator);
    });
    return operators;
  }

  public saveToStore(): void {
    if (!this.isEditSingle) {
      let operators: OperatorModel[] = [];
      let environments: EnvironmentModel[] = [];
      const curApp: ApplicationModel = this.currentApplication;
      if (this.assignDifferentRolesForEnvs && !this.isRootAdmin) {
        this.environments_roles.forEach((env) => {
          const roleIsValid = this.rolesList.some(
            (el) => el.role_value === env.role_value
          );
          if (env.role_value !== "no_access" && roleIsValid) {
            operators = this.setOperators(env.role_value);
            const thisEnv: EnvironmentModel = {
              id: env.env_id,
              name: env.env_name,
              operators: operators,
            };
            environments.push(thisEnv);
          }
        }, this);

        this.updateEnvironmentOperators({
          appId: curApp.id,
          environments: environments,
        });
      } else {
        if (this.isRootAdmin) {
          operators = this.setOperators("portfolio_administrator");
          this.updateRootAdministrators(operators);
        } else {
          operators = this.setOperators(this.roleForAllEnvs);

          this.updateApplicationOperators({
            appId: curApp.id,
            operators: operators,
          });
        }
      }

      this.$emit("membersAdded", this.validEmailCount);
    } else if (this.isEditSingle) {
      if (this.isRootAdmin) {
        // update portfolioOperators name and email
        const rootAdmins: OperatorModel[] = this.operators;
        const opIndex = rootAdmins
          .map((e) => e.email)
          .indexOf(this.memberToEditEmailOriginal);

        this.updateRootAdminInfo({
          index: opIndex,
          display_name: this.memberToEditName,
          email: this.memberToEditEmail,
        });
      } else {
        const appId = this.currentApplication.id;
        if (!this.assignDifferentRolesForEnvs) {
          // application-level operator
          this.$store.dispatch("applications/updateApplicationOperatorInfo", {
            applicationId: appId,
            access: this.roleForAllEnvs,
            display_name: this.memberToEditName,
            email: this.memberToEditEmail,
            originalEmail: this.memberToEditEmailOriginal,
          });
        } else {
          // env-level operators
          this.$store.dispatch("applications/updateEnvironmentOperatorInfo", {
            applicationId: appId,
            display_name: this.memberToEditName,
            email: this.memberToEditEmail,
            originalEmail: this.memberToEditEmailOriginal,
            updatedEnvs: this.environments_roles,
          });
        }
      }
    }

    this.$store.dispatch("wizard/updateMembersModified", true);

    this.closeModal();
  }

  public closeModal(): void {
    this.memberList = [];
    this.validEmailList = [];
    this.assignDifferentRolesForEnvs = false;
    document.getElementsByClassName("v-dialog--active")[0].scrollTop = 0;
    this._close = false;
    this.$emit("modalCancel");
  }

  public openLearnMoreDrawer(type: string): void {
    this.learnMoreDrawerIsOpen = true;
    this.learnMoreType = type;
    this.bus.$emit("openLearnMore");
  }

  public closeLearnMoreDrawer(): void {
    this.learnMoreDrawerIsOpen = false;
  }
}
</script>
