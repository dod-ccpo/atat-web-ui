<template>

  <v-container fluid>
    <v-row>

    <v-dialog
      v-model="dialogOpen"
      persistent
      max-width="632px"
      height="750px"
    >
      <v-card>

        <v-card-title>
          Add Members
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
          <div
            id="EmailInputWrapper"
            aria-labelledby="EmailInputLabel"
            class="pa-2 email-wrapper"
            @click="addEmail"
          >
            <v-text-field
              v-for="email in emailList"
              :key="email.id"
              :id="'emailPill_' + email.id"
              :ref="'e_' + email.id"
              class="pill"
              :data-email-id="email.id"
              v-model="email.value"
              append-icon="close"
              @click="emailEdit"
              @blur="emailBlurred"
              @click:append="removeEmail"
            />
          </div>
          <span>
            Must use a .mil email address. Separate multiple emails with commas
          </span>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialogOpen = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialogOpen = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <div id="widthFaker" ref="widthFaker"></div>
<!--
      <v-col class="pl-0" cols="12">
        <div
          id="EmailInputWrapper"
          class="pa-2 email-wrapper"
          @click="addEmail"
        >
          <v-text-field
            v-for="email in emailList"
            :key="email.id"
            :id="'emailPill_' + email.id"
            :ref="'e_' + email.id"
            class="pill"
            :data-email-id="email.id"
            v-model="email.value"
            append-icon="close"
            @click="emailEdit"
            @blur="emailBlurred"
            @click:append="removeEmail"
          />
        </div>
      </v-col> -->

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

  private emailList: { value: string, id: number }[] = [
    { value: 'mail1@mail.mil', id: 1 },
    { value: 'mail222@mail222.mil', id: 2 },
    { value: 'me@my.mil', id: 3 },
    { value: 'this.is.a.very.long.email@address.mil', id: 4 },
  ];

  get widthFaker() {
    return this.$refs.widthFaker as HTMLElement;
  }

  public async mounted(): Promise<void> {
    this.$store.dispatch("saveStepModel", [{}, 4, true]);

    // set width of email inputs
    const self = this;
    await this.$nextTick(function () {
      self.emailList.forEach((email, index) => {
        self.widthFaker.innerHTML = email.value;
        const w = self.widthFaker.offsetWidth + "px";
        const emailInput = document.querySelector("[data-email-id='" + email.id + "']")  as HTMLElement;
        emailInput.style.width = w;
      });
    });

  }

  public addEmail(e: Event): void {
    let len = this.emailList.length;
    if (len === 0 || this.emailList[len - 1].value !== "") {
      const emailId = Date.now();
      this.emailList.push({value: "", id: emailId });
      const self = this;
      Vue.nextTick(function () {
        let newInput = document.querySelector("[data-email-id='" + emailId + "']")  as HTMLInputElement;
        newInput.style.width = "40px"
        newInput?.focus();
        newInput.addEventListener('input', () => {
          self.widthFaker.innerHTML = newInput.value;
          const w = self.widthFaker.offsetWidth + "px"
          newInput.style.width = w;
        });

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
    this.emailList.push.apply(this.emailList, emailAddresses);
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
    const thisButton = e.target as HTMLButtonElement;
    var closestElement = thisButton.closest('.v-input__slot') as HTMLElement;
    var thisInput = closestElement.querySelector('input[type=text]') as HTMLInputElement;
    const emailId = thisInput.dataset.emailId;
    // already have this in emailBlurred if value is empty
    // make this DRY!
    debugger;
    if (emailId) {
      const vTextFieldRef = "e_" + emailId;
      const vTextField = this.$refs[vTextFieldRef];

      const id: number  = parseInt(emailId);
      this.emailList = this.emailList.filter(function( obj ) {
        return obj.id !== id;
      });
      // need to reset input widths now...
      // make this DRY - also in mounted
      const self = this;
      this.emailList.forEach((email, index) => {
        self.widthFaker.innerHTML = email.value;
        const w = self.widthFaker.offsetWidth + "px";
        const emailInput = document.querySelector("[data-email-id='" + email.id + "']")  as HTMLElement;
        emailInput.style.width = w;
      });
    }

  }

  public emailEdit(e: Event) {
    e.preventDefault();
    e.cancelBubble = true;
    const input = e.currentTarget as HTMLInputElement;
    input.addEventListener('input', () => {
      this.widthFaker.innerHTML = input.value;
      const w = this.widthFaker.offsetWidth + "px"
      input.style.width = w;
    });
  }

  public emailBlurred(e: Event) {
    // debugger;
    const input = e.target as HTMLInputElement;

    if (!input.value.length) {
      const emailId = input.dataset.emailId;
      if (emailId) {
        const vTextFieldRef = "e_" + emailId;
        const vTextField = this.$refs[vTextFieldRef];

        const id: number  = parseInt(emailId);
        this.emailList = this.emailList.filter(function( obj ) {
          return obj.id !== id;
        });
        // need to reset input widths now...
        // make this DRY - also in mounted
        const self = this;
        this.emailList.forEach((email, index) => {
          self.widthFaker.innerHTML = email.value;
          const w = self.widthFaker.offsetWidth + "px";
          const emailInput = document.querySelector("[data-email-id='" + email.id + "']")  as HTMLElement;
          emailInput.style.width = w;
        });
      }
    } else {
      this.widthFaker.innerHTML = input.value;
      const w = this.widthFaker.offsetWidth + "px";
      input.style.width = w;
    }
  }

  public openModal() {
    this.dialogOpen = true;
    const self = this;
    Vue.nextTick(function () {
      self.emailList.forEach((email, index) => {
        self.widthFaker.innerHTML = email.value;
        const w = self.widthFaker.offsetWidth + "px";
        const emailInput = document.querySelector("[data-email-id='" + email.id + "']")  as HTMLElement;
        emailInput.style.width = w;
      });
    });
  }

}
</script>

<style lang="scss">

  .v-card__title {
    border-bottom: 1px solid #DFE1E2; // $base_lighter
  }

  .v-card__text {
    padding: 24px 40px !important;
  }

  div#widthFaker {
    display: inline-block;
    font-size: 16px;
    position: absolute;
    left: -10000px;
    top: -10000px;
  }

  .email-wrapper {
    border:2px solid #005EA2;
    height: 118px;
    margin-bottom: 20px;
    width: 100%;
    max-width:550px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .v-input__append-inner {
    // margin-top: 0 !important;
  }

  .pill.v-text-field {
    display: inline-block;
    height: 32px;
    border: 1px solid transparent;
    border-radius: 15px;
    background-color: #D9E8F6;
    padding: 0 4px 0 12px;
    line-height: 22px;
    margin: 3px;
    position: relative;
    z-index: 2;

    input {
      height: 32px;
      max-height: 32px;
      line-height: 32px;
      padding: 0;
    }

    &.v-input--is-focused {
      background-color: transparent;
      // background-color: rgb(231, 255, 192);
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
