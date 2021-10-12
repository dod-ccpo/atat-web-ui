<template>
  <v-card class="extra-padding">
    <v-form ref="form" v-model="valid" lazy-validation>
      <div id="inputWidthFaker" ref="inputWidthFaker"></div>
      <v-card-title>
        <h3 class="mb-2 h3">
          <span v-if="!isEditSingle">
            Add
            <span v-if="isRootAdmin">root administrators</span>
            <span v-else>team members</span>
            to
            {{ currentApplication.name }}
          </span>
          <span v-if="isEditSingle">
            Update
            {{ memberToEdit.length ? memberToEdit[0].display_name : "Member" }}’s
            information
          </span>
        </h3>
      </v-card-title>
      <v-card-text class="body-lg text--base-darkest mt-2">

        <!--#################################################-->
        <!-- EDIT SINGLE MEMBER NAME AND EMAIL -->
        <!--#################################################-->

        <div v-show="isEditSingle">
          <p>
            After your portfolio is provisioned, the email address will be sent to
            {{ selectedCSP ? selectedCSP : "your selected CSP" }} and
            {{
              memberToEdit.length ? memberToEdit[0].display_name : "the member"
            }}
            receive an invitation to access the cloud console.
          </p>

          <!-- :value="memberToEdit.length ? memberToEdit[0].display_name : ''" -->
          <atat-text-field
            v-model="memberToEdit[0].display_name"
            label="Display Name"
            :helpText="displayNameHelpText"
            :rules="rules.display_name"
          />

          <!-- :value="memberToEdit.length ? memberToEdit[0].email : ''" -->
          <atat-text-field
            v-model="memberToEdit[0].email"
            label="Email Address"
            :rules="rules.email"
            aria-describedby="EmailInputInstructions"
            class="mt-6"
          />
          <div class="color-base mt-2" id="EmailInputInstructions">
            Must use a .mil email address.
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
            <a href="#">Learn more about root administrators</a>
          </p>
          <p v-else>
            Team members can have different levels of access to your application
            and environments. Invite multiple people with the same permissions at
            once.
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
              <span v-show="invalidEmailCount === 1">
                The address &ldquo;{{ invalidEmail }}&rdquo; was not recognized.
              </span>
              <span v-show="invalidEmailCount > 1">
                Multiple addresses were not recognized.
              </span>
              Please make sure that all addresses are properly formatted and .mil
              addresses.
            </p>
          </v-alert>
        </div>

        <!--#################################################-->
        <!-- MEMBER ACCESS ADD/EDIT -->
        <!--#################################################-->

        <div v-if="!isRootAdmin">
          <v-divider class="my-8 width-40"></v-divider>

          <h3>
            <span v-if="isEditSingle">
              Change
              {{
                memberToEdit.length ? memberToEdit[0].display_name : "Member"
              }}’s Role
            </span>
            <span v-if="!isEditSingle">Team Member Roles</span>
          </h3>
          <p>
            Choose what type of role people will have in
            <span v-if="isEditSingle">{{ currentApplication.name }}.</span>
            <span v-else>your application.</span>
            <br />
            <v-btn class="link-button pa-0 height-auto">
              Learn more about roles
            </v-btn>
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
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text class="link-button" @click="closeModal"> Cancel </v-btn>
        <v-btn
          color="primary"
          class="px-5"
          @click="saveToStore"
          :disabled="!valid"
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
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import {
  ApplicationModel,
  OperatorModel,
  EnvironmentModel,
} from "types/Portfolios";
import { generateUid } from "@/helpers";
// import { ValidatableForm } from "types/Wizard";

@Component({})
// export default class ManageMember extends Vue implements ValidatableForm {
export default class ManageMember extends Vue {
  /*
██████   █████  ████████  █████
██   ██ ██   ██    ██    ██   ██
██   ██ ███████    ██    ███████
██   ██ ██   ██    ██    ██   ██
██████  ██   ██    ██    ██   ██
*/
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

  private assignDifferentRolesForEnvs = false;
  private roleForAllEnvs = this.rolesList[0].role_value;
  private environments_roles: {
    env_id: string;
    env_name: string;
    role_value: string;
  }[] = [];
  private displayNameHelpText = `This could be your team member's
  full name or a nickname. It will be used to refer to this individual
  within ATAT.`;
  private emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
  private valid = true;

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

  get isRootAdmin(): boolean | null {
    if (
      this.dialogProps &&
      Object.prototype.hasOwnProperty.call(this.dialogProps, "isRootAdmin")
    ) {
      return this.dialogProps.isRootAdmin;
    }
    return null;
  }

  get isEditSingle(): boolean | null {
    if (
      this.dialogProps &&
      Object.prototype.hasOwnProperty.call(this.dialogProps, "isEditSingle")
    ) {
      return this.dialogProps.isEditSingle;
    }
    return null;
  }

  get memberToEdit(): OperatorModel {
    if (
      this.isEditSingle &&
      this.dialogProps &&
      Object.prototype.hasOwnProperty.call(this.dialogProps, "memberEmail")
    ) {
      let member = this.getMemberToEdit(this.dialogProps.memberEmail);
      if (member) {
        return member;
      }
    }
    return {
      display_name: "",
      email: "",
      id: "",
      access: "",
    };
  }

  // get Form(): Vue & { validate: () => boolean } {
  //   return this.$refs.form as Vue & { validate: () => boolean };
  // }

  // get submitDisabled(): Promise<boolean> {
  //   if (!this.isEditSingle) {
  //     return this.isAddMembersValid();
  //   } else {
  //     // need to validate editing a single member
  //     return this.validateForm();
  //   }
  // }

  get buttonText(): string {
    return this.isEditSingle ? "Update" : "Add Team Members";
  }

  get selectedCSP(): string {
    return this.$store.getters.getSelectedCSP;
  }

  get currentApplication(): ApplicationModel {
    return this.$store.getters.getCurrentApplication;
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
    if (newVal === true) {
      this.setEnvironmentRoleDropdowns(this.roleForAllEnvs);
    } else {
      this.roleForAllEnvs = this.rolesList[0].role_value;
    }
  }

  @Watch("roleForAllEnvs")
  protected setAllEnvsRoles(newVal: string): void {
    this.setEnvironmentRoleDropdowns(newVal);
  }

  /*
███    ███ ███████ ████████ ██   ██  ██████  ██████  ███████
████  ████ ██         ██    ██   ██ ██    ██ ██   ██ ██
██ ████ ██ █████      ██    ███████ ██    ██ ██   ██ ███████
██  ██  ██ ██         ██    ██   ██ ██    ██ ██   ██      ██
██      ██ ███████    ██    ██   ██  ██████  ██████  ███████
*/

  public async mounted(): Promise<void> {
    this.setEnvironmentRoleDropdowns(this.roleForAllEnvs);
  }

  public async isAddMembersValid(): Promise<boolean> {
    return this.invalidEmailCount > 0 || this.validEmailCount === 0;
  }

  // public async validateForm(): Promise<boolean> {
  //   let validated = false;
  //   await this.$nextTick(() => {
  //     const formToValidate = this.Form;
  //     validated = formToValidate.validate();
  //   });
  //   return validated;
  // }

  public getMemberToEdit(memberEmail: string): OperatorModel | null {
    debugger;
    const rootAdmins: OperatorModel[] =
      this.$store.getters.getPortfolioOperators;
    let foundMember: OperatorModel[] | any;
    if (this.isRootAdmin) {
      foundMember = rootAdmins.filter((obj) => obj.email === memberEmail);
      if (foundMember) {
        return foundMember;
      }
      return null;
    }
    // check for user in application operators
    const app: ApplicationModel | null = this.currentApplication;
    if (app) {
      const appOperators: OperatorModel[] | null = app ? app.operators : null;
      if (appOperators && appOperators.length) {
        foundMember = appOperators.filter((obj) => obj.email === memberEmail);
        debugger;
        if (foundMember.length) {
          // since is application level, set access for all environments
          this.assignDifferentRolesForEnvs = false;
          this.roleForAllEnvs = foundMember[0].access;
          return foundMember;
        }
      }

      // check for member in environment operators
      this.assignDifferentRolesForEnvs = true;
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
          debugger;

          return foundMember;
        }
      }
    }
    return null;
  }

  private setEnvironmentRoleDropdowns(role: string) {
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
        const isExistingEmail =
          thisVm.existingMemberEmails.indexOf(email.toLowerCase()) > -1;
        const notAlreadyEntered =
          thisVm.validEmailList.indexOf(email.toLowerCase()) === -1;
        const isValid = thisVm.validateEmail(email);
        if (email && isValid && notAlreadyEntered) {
          thisVm.validEmailList.push(email.toLowerCase());
          const memberId = generateUid();
          thisVm.memberList.push({
            id: memberId,
            email: email,
            display_name: "",
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
        const isExistingEmail =
          this.existingMemberEmails.indexOf(emailAddressEntered.toLowerCase()) >
          -1;
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

    // EJY remove console log after functional testing complete
    console.log("Name parsed from email: ", names.join(" "));

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

      if (this.assignDifferentRolesForEnvs) {
        this.environments_roles.forEach((env) => {
          if (env.role_value !== "no_access") {
            operators = this.setOperators(env.role_value);
            const thisEnv: EnvironmentModel = {
              id: env.env_id,
              name: env.env_name,
              operators: operators,
            };
            environments.push(thisEnv);
          }
        }, this);
        this.$store.dispatch("updateEnvironmentOperators", [
          curApp.id,
          environments,
        ]);
      } else {
        if (this.isRootAdmin) {
          operators = this.setOperators("portfolio_administrator");
          this.$store.dispatch("updateRootAdministrators", operators);
        } else {
          operators = this.setOperators(this.roleForAllEnvs);
          this.$store.dispatch("updateApplicationOperators", [
            curApp.id,
            operators,
          ]);
        }
      }

      this.$emit("membersAdded", this.validEmailCount);

    } else if (this.isEditSingle) {
      // TODO UPDATE EXISTING MEMBER INFO
    }

    this.closeModal();
  }

  public closeModal(): void {
    this.memberList = [];
    this.validEmailList = [];
    this.assignDifferentRolesForEnvs = false;
    document.getElementsByClassName("v-dialog--active")[0].scrollTop = 0;
    this._close = false;
  }
}
</script>
