
<template>
  <div>
    <div>
      <CSPCard
        :cloudServiceProvider="portfolioCSP"
      />
    </div>
    <div>
      <div class="d-flex justify-space-between mt-11 mb-6">
        <h2>CSP administrator log</h2>
        <v-btn
          depressed
          color="primary"
          @click="openCSPModal"
          @keydown.enter="openCSPModal"
          @keydown.space="openCSPModal"
        >
          <ATATSVGIcon
            class="mr-2"
            width="17"
            height="14"
            name="manageAccount"
            color="white"
          />
          Add a CSP Administrator
        </v-btn>
      </div>

      <div>
        <v-data-table
          :headers="tableHeaders"
          :items="tableData"
          :page.sync="page"
          hide-default-footer
          class="_administrator-log border1 border-base-lighter"
        >
          <!-- eslint-disable vue/valid-v-slot -->
          <template v-slot:body="props">
            <tbody name="expand" :is="transitionGroup">
            <template >
              <tr
                class="row-item"
                :class="{'bg-info-lighter': item.status === 'Processing'}"
                  v-for="item in props.items" :key="item.email"
              >
                <td>{{item.email}}</td>
                <td>
                  <div class="d-flex align-center">
                    <div
                      class="_icon-circle"
                      :class="statusImg[item.status].bgColor"
                    >
                      <ATATSVGIcon
                        :name="statusImg[item.status].name"
                        :width="statusImg[item.status].width"
                        :height="statusImg[item.status].height"
                        :color="statusImg[item.status].color"
                      />
                    </div>
                    <div class="d-flex flex-column font-weight-500">
                      {{item.status}}
                      <span
                        v-if="item.status === 'Failed'"
                        class="font-size-12 text-base"
                      >
                        CSP account already exist
                      </span>
                    </div>
                  </div>

                </td>
                <td>{{item.createdBy}}</td>
                <td>{{item.created}}</td>
              </tr>
            </template>
            </tbody>
          </template>
          <!-- eslint-disable vue/valid-v-slot -->
          <template v-slot:footer>
            <div class="_table-pagination">
              <span class="mr-11 font-weight-400 font-size-14">
              Showing {{startingNumber}}-{{endingNumber}} of {{tableData.length}}
            </span>
              <v-pagination
                v-model="page"
                :length="numberOfPages"
                circle
              ></v-pagination>
            </div>
          </template>
        </v-data-table>
      </div>
    </div>
    <ATATDialog
      id="AddCSPMember"
      title="Add a CSP Administrator"
      width="632"
      okText="Add administrator"
      :OKDisabled="okDisabled"
      :showDialog.sync="showCSPModal"
      @ok="addCSPMember"
      :modalSlideoutComponent="modalSlideoutComponent"
      modalSlideoutTitle="Learn more about CSP administrators"
      :modalDrawerIsOpen.sync="modalDrawerIsOpen"
    >
      <template #content>
        <p class="body">
          This individual will be granted full access to your cloud resources within the
          selected {{serviceProvider[portfolioCSP]}} portal, enabling them to manage user accounts
          and configure workspace settings.
          <a id="LearnMoreLink" role="button" @click="openLearnMoreDrawer">
            Learn more about CSP administrators
          </a>
        </p>
        <v-form ref="form" v-model="formIsValid" lazy-validation>
          <div class="mb-10">
            <ATATTextField
              id="AdministratorEmail"
              label="Administrator’s email address"
              helpText="Must use a .mil or .gov email address."
              width="416"
              :class="{'error--text':showErrorMessage}"
              :value.sync="adminEmail"
              @blur="validateEmail()"
            />
            <ATATErrorValidation
              id="EmailError"
              class="atat-text-field-error"
              :errorMessages="[invalidEmailMessage]"
              v-show="showErrorMessage"
            />
          </div>
          <div>
            <ATATTextField
              id="AdministratorDODID"
              label="Administrator’s DoD ID"
              :tooltipText="toolTipText"
              :value.sync="dodID"
              class="mb-15"
              width="416"
              :mask="['^[0-9]{10}$']"
              :isMaskRegex=true
              :rules="[
                $validators.required(
                `Please enter your administrator's 10-digit DOD ID`
                  ),
                 $validators.minLength(10,`The DOD ID must be 10 digits`)
               ]"
            />
          </div>
        </v-form>

      </template>
    </ATATDialog>
  </div>
</template>

<style >
   .expand-move,
  .expand-enter-active, .expand-leave-active {
     transition: all 1s ease;
}
.expand-enter, .expand-leave-to {
   opacity: 0;
    transform: translateY(-100%);
}
</style>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";
import CSPCard from "@/portfolio/components/CSPCard.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import format from "date-fns/format"
import ATATTextField from "@/components/ATATTextField.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AddAdminSlideOut from "@/portfolio/components/AddAdminSlideOut.vue";
@Component({
  components: {
    ATATDialog,
    ATATErrorValidation,
    ATATTextField,
    ATATSVGIcon,
    CSPCard,
  }
})
export default class CSPPortalAccess extends Vue {
  $refs!: {
    form: Vue & {
      resetValidation: () => void;
      reset: () => void;
    };
  };
  @Prop({ default: "" }) private portfolioCSP!: string;

  public page = 1;
  public today = new Date();
  public showCSPModal = false;
  /* eslint-disable-next-line */
  public emailRegex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"]+\.)+[^<>()[\]\\.,;:\s@\\"]{2,})$/i;
  public invalidEmailDomain = "Please use a .mil or .gov email address.";
  public invalidEmailMissingAtSymbol = "Please include an ‘@’ symbol in the email address";
  public invalidEmailFormat = "Please use a standard domain format, like “@domain.mil”.";
  public invalidEmailMessage = "";
  public showErrorMessage = false;
  public adminEmail = "";
  public dodID = "";
  public emailIsValid = false;
  public formIsValid = false;
  public transitionGroup = ""
  public modalSlideoutComponent = AddAdminSlideOut
  private modalDrawerIsOpen = false

  public tableHeaders: Record<string, string>[] = [
    { text: "Administrator email", value: "email" },
    { text: "Status", value: "status" },
    { text: "Added by", value: "createdBy" },
    { text: "Processed on", value: "created" },
  ];

  public serviceProvider = {
    Azure:"Azure",
    AWS:"AWS",
    Google:"Google Cloud",
    Oracle:"Oracle Cloud"
  }

  public tableData: {
    email:string,status:string,createdBy:string,created:string
  }[] = [];
  public emails = [
    "tyrone.brown@example.mil",
    "kim.bryant@example.mil",
    "burt.baxter@example.mil",
  ]
  public statuses = [
    "Provisioned",
    "Processing",
    "Failed",
  ]
  public createdBy = [
    "Maria Missionowner",
    "Sam Something",
    "Carl Contractor",
  ]

  public maxPerPage = 10;
  public numberOfPages = Math.ceil(this.emails.length/this.maxPerPage)
  @Watch("tableData")
  public tableDataUpdated(): void {
    this.numberOfPages = Math.ceil(this.tableData.length/this.maxPerPage)
  }

  get endingNumber(): number {
    const ending = this.page * this.maxPerPage
    if(ending > this.tableData.length){
      return this.tableData.length
    }
    return ending
  }
  get startingNumber():number {
    const starting = (this.page - 1) * this.maxPerPage + 1
    return starting
  }
  public createTableData(): void {
    for(let i = 0; i < this.emails.length; i++){
      const admin = {
        email:"",
        status:"",
        createdBy:"",
        created:""
      }
      let idx = i
      admin.email = this.emails[idx]
      admin.status = this.statuses[idx]
      admin.createdBy = this.createdBy[idx]
      admin.created = format(this.today,"MMM. dd, yyy hhmm")
      this.tableData.push(admin)
    }

  }
  get okDisabled(): boolean {
    if(this.emailIsValid && this.formIsValid && this.dodID){
      return false
    }
    return true
  }
  public openCSPModal(): void {
    this.showCSPModal = true;
  }

  public toolTipText = `
        This 10-digit number is printed on the back of your administrator's
        Common Access Card (CAC). You may also ask your administrator to log into
         <span class="text-decoration-underline">DoD ID Card Office Online</span>
         and locate it under "My Profile."
`

  public statusImg = {
    "Failed":{
      name: "failed",
      width: "16",
      height: "16",
      color: "error",
      bgColor:"bg-error-lighter"
    },
    "Provisioned":{
      name: "provisioned",
      width: "20",
      height: "13",
      color: "success-dark",
      bgColor:"bg-success-lighter"
    },
    "Processing":{
      name: "processing",
      width: "20",
      height: "13",
      color: "info-dark",
      bgColor:"bg-info-lighter"
    }
  };

  public addCSPMember():void {
    const member = {
      email:this.adminEmail,
      status: "Processing",
      createdBy:"Maria Missionowner",
      created:""
    }
    this.tableData.unshift(member)
    this.adminEmail = "";
    this.dodID = "";
    this.emailIsValid = false;
    this.$refs.form.reset();
    this.$refs.form.resetValidation();
  }

  public openLearnMoreDrawer(): void {
    this.modalDrawerIsOpen = true;
  }

  public async validateEmail(): Promise<boolean> {
    if(!this.adminEmail){
      return false
    }
    const email = this.adminEmail;
    const domain = email.slice(-3).toLowerCase();
    const isGovtDomain = domain === "mil" || domain === "gov";
    const missingAtSymbol = email.indexOf("@") === -1;
    const validEmail = this.emailRegex.test(email);

    const isValid = isGovtDomain && !missingAtSymbol && validEmail;
    this.$nextTick(() => {
      // single error messages
      if (!validEmail && missingAtSymbol && !isGovtDomain) {
        this.invalidEmailMessage = this.invalidEmailFormat;
        this.emailIsValid= false
        this.showErrorMessage = true
      } else if (!isGovtDomain) {
        this.invalidEmailMessage = this.invalidEmailDomain;
        this.showErrorMessage = true
        this.emailIsValid= false
      } else if (missingAtSymbol) {
        this.invalidEmailMessage = this.invalidEmailMissingAtSymbol;
        this.showErrorMessage = true
        this.emailIsValid= false
      } else {
        // clear validation message
        this.invalidEmailMessage = "";
        this.showErrorMessage = false
        this.emailIsValid= true
      }
    });
    return isValid;
  }
  
  public async loadOnEnter(): Promise<void> {
    await this.createTableData();
    this.transitionGroup = "transition-group";
  }
  public  mounted(): void {
    this.loadOnEnter();
  }
}
</script>

