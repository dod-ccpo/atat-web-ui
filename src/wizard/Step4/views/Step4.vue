<template>

  <v-container fluid>
    <v-row>

    <v-dialog
      v-model="dialogOpen"
      persistent
      max-width="632px"
    >
      <v-card>

        <v-card-title>
        </v-card-title>

        <v-card-text
          class="body-lg text--base-darkest"
        >

          <h2 class="mb-2">Add team members to Tracker Application</h2>
          <p>
            Team members can have different levels of access to your application
            and environments. Invite multiple people with the same permissions at once.
          </p>
          <span id="EmailInputLabel">Email Addresses</span>
          <div class="error-text" v-if="invalidEmails.length">
            <span class="v-messages__message">
              {{ invalidEmails.length }} error<span v-if="invalidEmails.length > 1">s</span>
            </span>
            <a @click="removeInvalidEmails">Remove all emails with errors</a>
          </div>
          <div
            id="EmailInputWrapper"
            aria-labelledby="EmailInputLabel"
            class="pa-2 email-wrapper"
            :class="[ emailInputFocused ? 'focused' : '']"
            @click="addEmail"
          >
            <v-text-field
              v-for="member in memberList"
              :key="member.id"
              :id="'emailPill_' + member.id"
              :ref="'e_' + member.id"
              class="pill"
              :data-member-id="member.id"
              v-model="member.email"
              append-icon="close"
              @click="emailEdit"
              @blur="emailBlurred"
              @click:append="removeEmail"
            />
          </div>
          <span class="color-base">
            Must use a .mil email address. Separate multiple emails with commas.
          </span>

          <v-alert
            v-show="invalidEmails.length"
            outlined
            rounded
            color="error"
            border="left"
            icon="error"
            class="text-left error_lighter black-icon mt-3"
          >
            <p class="black--text body-lg">
              <span v-if="invalidEmails.length === 1">
                The address &ldquo;{{ invalidEmails[0].value }}&rdquo; was not recognized.
              </span>
              <span v-if="invalidEmails.length > 1">
                Multiple addresses were not recognized.
              </span>
              Please make sure that all addresses are properly formatted.
            </p>
          </v-alert>

      </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            class="link-button"
            @click="dialogOpen = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            class="px-5"
            @click="dialogOpen = false"
            :disabled="invalidEmails.length || validEmails.length === 0"
          >
            Add Team Members
            <span
              class="valid-email-count ml-2" 
              v-if="validEmails.length"
            >
              {{ validEmails.length }}
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <div id="widthFaker" ref="widthFaker"></div>

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
                @click="openModal"
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

  private select = [];
  private chips = [];
  private search = ""; //sync search

  private memberList: { id: number, email: string, display_name: "", access: ""  }[] = [
    // { id: 1, value: 'mail1@mail.mil', display_name: "", access: "" },
    // { id: 2, value: 'mail222@mail222.mil', display_name: "", access: "" },
    // { id: 3, value: 'me@my.mil', display_name: "", access: "" },
    // { id: 4, value: 'this.is.a.very.long.email@address.mil', display_name: "", access: "" },
  ];

  private invalidEmails:  {id: number, value: string }[] = [];
  private validEmails:  {id: number, value: string }[] = [];
  private hasValidEmail = false;

  get widthFaker() {
    return this.$refs.widthFaker as HTMLElement;
  }

  public async mounted(): Promise<void> {
    this.$store.dispatch("saveStepModel", [{}, 4, true]);

    // window.addEventListener("click", (e: Event) => {
    //   debugger;
    //   if (e.target && e.target.id !== "EmailInputWrapper") {
    //     this.emailInputFocused = false;
    //   }
    // });
    // window.addEventListener("focus", (e: Event) => {
    //   debugger;
    //   if (e.target && e.target.id.indexOf("emailPill") > -1) {
    //     this.emailInputFocused = true;
    //   }
    // });
    
    // set width of email inputs
    const self = this;
    await this.$nextTick(function () {
      self.memberList.forEach((member, index) => {
        self.widthFaker.innerHTML = member.email;
        const w = self.widthFaker.offsetWidth + "px";
        const emailInput = document.querySelector("[data-member-id='" + member.id + "']")  as HTMLElement;
        emailInput.style.width = w;
      });
    });

  }

  public addEmail(e: Event): void {
    debugger;
    this.emailInputFocused = true;
    let len = this.memberList.length;
    if (len === 0 || this.memberList[len - 1].email !== "") {
      const memberId = Date.now();
      this.memberList.push({id: memberId, email: "", display_name: "", access: "" });
      const self = this;
      Vue.nextTick(function () {
        let newInput = document.querySelector("[data-member-id='" + memberId + "']")  as HTMLInputElement;
        newInput.style.width = "40px"
        newInput?.focus();
        self.addInputEventListeners(self, newInput);

        // newInput.addEventListener('input', () => {
        //   self.widthFaker.innerHTML = newInput.value;
        //   const w = self.widthFaker.offsetWidth + "px"
        //   newInput.style.width = w;
        // });

        // newInput.addEventListener('keydown', (e) => {
        //   const keypressed:string = e.key;
        //   const actionKeys:string[] = [
        //     " ",
        //     ",",
        //     ";",
        //     "Enter",
        //     "Tab",
        //   ];
        //   if (actionKeys.indexOf(keypressed) > -1) {
        //     e.preventDefault();
        //     e.cancelBubble = true;
        //     newInput.blur();
        //     setTimeout(() => {
        //       self.addEmail();
        //     }, 0);
        //   }
        // });


      });
    }
  }

  public doPaste(e: Event): void {
    // see below for plain text pasting
    // https://stackoverflow.com/questions/12027137/javascript-trick-for-paste-as-plain-text-in-execcommand

    e.stopPropagation();
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("Text");
    let emailAddresses = pastedData.split(", ");
    this.memberList.push.apply(this.memberList, emailAddresses);
    //debugger;
  }

  public onInput(e: Event): void {
    console.log(e.target.innerText);
  }

    public meowInput(e1: any) {
      console.log(this.search);
      if (this.search && this.search.split(",").length > 1) {
        this.chips = this.chips.concat(
          this.search.split(",").filter((term) => !this.chips.includes(term))
        );
        this.search = "";
      }
    };
    public remove(item: any) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    };

  public removeEmail(e: Event) {
    this.emailInputFocused = false;
    const thisButton = e.target as HTMLButtonElement;
    var closestElement = thisButton.closest('.v-input__slot') as HTMLElement;
    var thisInput = closestElement.querySelector('input[type=text]') as HTMLInputElement;
    const memberId = Number(thisInput.dataset.memberId);
    // already have this in emailBlurred if value is empty
    // make this DRY!
    
    debugger;
    const vTextFieldRef = "e_" + memberId;
    const vTextField = this.$refs[vTextFieldRef];

    this.memberList = this.memberList.filter(function( obj ) {
      return obj.id !== memberId;
    });

    // make DRY - copied from emailBlurred()
    const invalidIndex = this.invalidEmails.map(function(e) { return e.id; }).indexOf(memberId);
    const validIndex = this.validEmails.map(function(e) { return e.id; }).indexOf(memberId);
    if (invalidIndex > -1) {
      this.invalidEmails.splice(invalidIndex, 1);
    }
    if (validIndex > -1) {
      this.validEmails.splice(invalidIndex, 1);
    }

    // need to reset input widths now...
    // make this DRY - also in mounted
    const self = this;
    this.memberList.forEach((member, index) => {
      self.widthFaker.innerHTML = member.email;
      const w = self.widthFaker.offsetWidth + "px";
      const emailInput = document.querySelector("[data-member-id='" + member.id + "']")  as HTMLElement;
      emailInput.style.width = w;
    });

  }

  public addInputEventListeners(selfie:any, input: HTMLInputElement) {
    input.addEventListener('input', () => {
      this.widthFaker.innerHTML = input.value;
      const w = this.widthFaker.offsetWidth + "px"
      input.style.width = w;
    });

    input.addEventListener('keydown', (e) => {
      const keypressed:string = e.key;
      const actionKeys:string[] = [" ", ",", ";", "Enter", "Tab",];
      if (actionKeys.indexOf(keypressed) > -1) {
        e.preventDefault();
        e.cancelBubble = true;
        input.blur();
        setTimeout(() => {
          this.addEmail(new CustomEvent(""));
        }, 0);
      }
    });
    

    // add listener for paste
    input.addEventListener("paste", function(e: Event) {
      // cancel paste
      e.preventDefault();

      // get text representation of clipboard
      let pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
      // pastedText = pastedText.replace(/\s/g, "");
      pastedText = pastedText.replace(/['"\s]/g, "");
      pastedText = pastedText.replace(/;/g, ",");
      
      const pastedValuesArray:string[] = pastedText.split(",");
      const self = this;
      pastedValuesArray.forEach((email, i) => {
        const memberId = Date.now() + i;
        selfie.memberList.push({id: memberId, email: email, display_name: "", access: "" });
      });
      input.blur();
    
    });





  }

  public emailEdit(e: Event) {
    //debugger;
    e.preventDefault();
    e.cancelBubble = true;
    this.emailInputFocused = true;
    const input = e.currentTarget as HTMLInputElement;
    this.addInputEventListeners(input);

    // input.addEventListener('input', (e) => {
    //   debugger;
    //   this.widthFaker.innerHTML = input.value;
    //   const w = this.widthFaker.offsetWidth + "px"
    //   input.style.width = w;
    // });

  }

  public emailBlurred(e: Event) {
    //debugger;
    e.preventDefault();
    e.cancelBubble = true;
    this.emailInputFocused = false;
    const input = e.target as HTMLInputElement;
    const memberId:number = Number(input.dataset.memberId);
    const invalidIndex = this.invalidEmails.map(function(e) { return e.id; }).indexOf(memberId);
    const validIndex = this.validEmails.map(function(e) { return e.id; }).indexOf(memberId);
    let emailAddressEntered = input.value;

    if (!emailAddressEntered.length) {
      const vTextFieldRef = "e_" + memberId;
      const vTextField = this.$refs[vTextFieldRef];

      this.memberList = this.memberList.filter(function( obj ) {
        return obj.id !== memberId;
      });
      // need to reset input widths now...
      // make this DRY - also in mounted
      const self = this;
      this.memberList.forEach(member => {
        self.widthFaker.innerHTML = member.email;
        const w = self.widthFaker.offsetWidth + "px";
        const emailInput = document.querySelector("[data-member-id='" + member.id + "']")  as HTMLElement;
        emailInput.style.width = w;
      });
    } else {
      // todo: remove any wrapping double or single quotes
      emailAddressEntered = emailAddressEntered.replace(/['"]/g, "");
      const memberListIndex = this.memberList.map(function(e) { return e.id; }).indexOf(memberId);
      this.memberList[memberListIndex].email = emailAddressEntered;
      debugger;
      // validate the email address
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var inputVuetifyWrapper = input.closest('.pill') as HTMLElement;
      if (emailRegex.test(emailAddressEntered)) {

      // todo: verify only entered once.

        inputVuetifyWrapper.classList.remove("email-invalid");
        console.log("email is VALID");
        if (validIndex === -1) {
          this.validEmails.push({ id: memberId, value: emailAddressEntered})
        }
        if (invalidIndex > -1) {
          this.invalidEmails.splice(invalidIndex, 1);
        }

      } else {
        // invalid email
        inputVuetifyWrapper.classList.add("email-invalid");
        if (invalidIndex === -1) {
          this.invalidEmails.push({ id: memberId, value: emailAddressEntered });
        }
        if (validIndex > -1) {
          this.validEmails.splice(validIndex, 1);
        }
      }

      debugger;
      this.widthFaker.innerHTML = emailAddressEntered;
      const w = this.widthFaker.offsetWidth + "px";
      input.style.width = w;
    }
  }

  public openModal() {
    this.dialogOpen = true;
    const self = this;
    Vue.nextTick(function () {
      self.memberList.forEach((member, index) => {
        self.widthFaker.innerHTML = member.email;
        const w = self.widthFaker.offsetWidth + "px";
        const emailInput = document.querySelector("[data-member-id='" + member.id + "']")  as HTMLElement;
        emailInput.style.width = w;
      });
    });
  }

}
</script>

<style lang="scss">
  .v-btn.primary.theme--light span.valid-email-count {
    background-color: white;
    color: #005EA2; // $primary
    border-radius: 20px;
    padding: 0 7px;
    &:hover, &:focus, &:active {
      background-color: white !important;
    }
  }
  .v-card__title {
    border-bottom: 1px solid #DFE1E2; // $base_lighter
  }

  .v-card__text {
    padding: 24px 40px !important;
  }

  .v-card__actions {
    background-color: #f0f0f0; // $base_lightest
    padding: 16px 24px !important;
  }

  .v-alert .v-alert__icon.v-icon {
    font-size: 20px;
    top: 0;
  }

  div#widthFaker {
    display: inline-block;
    font-size: 16px;
    position: absolute;
    left: -10000px;
    top: -10000px;
  }

  .email-wrapper {
    border:1px solid #565C65; // $base_dark
    height: 118px;
    margin-bottom: 5px;
    width: 100%;
    max-width:550px;
    overflow-y: auto;
    overflow-x: hidden;
    &.focused {
      border-color: #005EA2; // $primary
      outline: 2px solid #005ea2; // $primary
    }
  }

  .v-input__append-inner {
    // margin-top: 0 !important;
  }

  .pill.v-text-field {
    display: inline-block;
    height: 32px;
    border: 1px solid #D9E8F6;
    border-radius: 15px;
    background-color: #D9E8F6;
    padding: 0 4px 0 12px;
    line-height: 22px;
    margin: 3px;
    position: relative;
    z-index: 2;
    border: 1px solid transparent;
    &.email-invalid {
      background-color: #F8DFE2;
      border-color: #e21c3d;
      padding-left: 30px;
      &:before {
        font-family: 'Material Icons';
        content: "error";
        -webkit-font-feature-settings: 'liga';
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
      // background-color: transparent;
      background-color: rgb(231, 255, 192);
      .v-input__append-inner {
        // display: none !important;
        opacity: 0;
      }
    }
    .v-input__slot {
      &:before, &:after {
        display: none;
      }
    }

  }

</style>
