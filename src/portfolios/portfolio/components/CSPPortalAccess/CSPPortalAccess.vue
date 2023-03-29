
<template>
  <div>
    <div>
      <CSPCard
        :cloudServiceProvider="portfolioCSP"
      />
    </div>
    <div>
      <div class="d-flex justify-space-between mt-11 mb-6">
        <h1 class="h2 font-weight-500" id="TableHeader">CSP administrator log</h1>
        <v-btn
          id="AddCSPAdmin"
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
          sort-by="provisionedDate"
          sort-desc
          class="_csp-admin-log border1 border-base-lighter"
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
                    </div>
                  </div>

                </td>
                <td>{{item.addedBy}}</td>
                <td>
                  {{formatDate(item)}}
                </td>
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
      eager
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
        <v-form ref="modalForm" v-model="formIsValid" lazy-validation>
          <div class="mb-10">
            <ATATTextField
              id="AdministratorEmail"
              label="Administrator’s email address"
              helpText="Must use a .mil or .gov email address."
              width="416"
              :class="{'error--text':showEmailErrorMessage}"
              :value.sync="adminEmail"
              @blur="validateEmail()"
            />
            <ATATErrorValidation
              id="EmailError"
              class="atat-text-field-error"
              :errorMessages="[invalidEmailMessage]"
              v-show="showEmailErrorMessage"
            />
          </div>
          <div>
            <ATATTextField
              id="AdministratorDODID"
              ref="DoDIDInput"
              label="Administrator’s DoD ID"
              :tooltipText="toolTipText"
              :value.sync="dodID"
              class="mb-15"
              width="416"
              :mask="['^[0-9]{10}$']"
              :isMaskRegex="true"
              :rules="[
                $validators.required('Please enter your administrator’s 10-digit DOD ID'),
                 $validators.minLength(10, 'The DOD ID must be 10 digits')
               ]"
            />
          </div>
        </v-form>

      </template>
    </ATATDialog>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";
import CSPCard from "@/portfolios/portfolio/components/shared/CSPCard.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AddAdminSlideOut from "@/portfolios/portfolio/components/shared/AddAdminSlideOut.vue";
import {Operator} from "../../../../../types/Global";
import Portfolio from "@/store/portfolio";
import {EnvironmentDTO, OperatorDTO} from "@/api/models";
import { formatISO, formatISO9075, startOfTomorrow } from "date-fns";
import { createDateStr } from "../../../../helpers"
import _ from "lodash";


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
    modalForm: Vue & {
      resetValidation: () => void;
      reset: () => void;
    };
    DoDIDInput: Vue & {
      resetValidation: () => void;
      setErrorMessage: () => void;
    }
  };

  @Prop({ default: "" }) private portfolioCSP!: string;
  // TODO: defaults to the first environment (during loadOnEnter) from current portfolio until
  //  portfolio env tabs based display gets implemented and environment gets passed as a property
  public environment!: EnvironmentDTO;

  public page = 1;
  public today = new Date();
  public showCSPModal = false;
  /* eslint-disable-next-line */
  public emailRegex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"]+\.)+[^<>()[\]\\.,;:\s@\\"]{2,})$/i;
  public invalidEmailDomain = "Please use a .mil or .gov email address.";
  public invalidEmailMissingAtSymbol = "Please include an ‘@’ symbol in the email address";
  public invalidEmailFormat = "Please use a standard domain format, like “@domain.mil”.";
  public invalidEmailMessage = "";
  public showEmailErrorMessage = false;
  public adminEmail = "";
  public dodID = "";
  public emailIsValid = false;
  public formIsValid = false;
  public transitionGroup = ""
  public modalSlideoutComponent = AddAdminSlideOut
  private modalDrawerIsOpen = false
  private adminAlreadyExists = false;
  private isLoading = false;
  public tomorrow = startOfTomorrow();

  public tableHeaders: Record<string, string>[] = [
    { text: "Administrator email", value: "email" },
    { text: "Status", value: "status" },
    { text: "Added by", value: "addedBy" },
    { text: "Processed on", value: "provisionedDate" },
  ];

  public serviceProvider = {
    Azure:"Azure",
    AWS:"AWS",
    Google:"Google Cloud",
    Oracle:"Oracle Cloud"
  }

  public tableData: Operator[] = [];

  public maxPerPage = 10;
  public numberOfPages = Math.ceil(this.tableData.length/this.maxPerPage);

  @Watch("tableData")
  public tableDataUpdated(): void {
    this.numberOfPages = Math.ceil(this.tableData.length/this.maxPerPage);
  }

  get endingNumber(): number {
    const ending = this.page * this.maxPerPage;
    if (ending > this.tableData.length) {
      return this.tableData.length;
    }
    return ending;
  }
  get startingNumber():number {
    const starting = (this.page - 1) * this.maxPerPage + 1;
    return starting;
  }

  get okDisabled(): boolean {
    if (this.emailIsValid && this.formIsValid && this.dodID) {
      return false;
    }
    return true;
  }

  public openCSPModal(): void {
    this.adminEmail = "";
    this.dodID = "";
    this.invalidEmailMessage = "";
    this.showEmailErrorMessage = false;
    this.showCSPModal = true;
    this.$refs.modalForm.reset();
    this.$refs.modalForm.resetValidation();

    this.$refs.DoDIDInput.resetValidation();
    this.$refs.DoDIDInput.setErrorMessage();
  }

  public toolTipText = `This 10-digit number is printed on the back of your administrator's
    Common Access Card (CAC). You may also ask your administrator to log into
    <span class="text-decoration-underline">DoD ID Card Office Online</span>
    and locate it under “My Profile.”`;

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
    const existingOperator = this.environment.csp_admins
      ?.find(cspAdmin => cspAdmin.email === this.adminEmail);
    if (!existingOperator) {
      this.adminAlreadyExists = false;
      const operator: Operator = {
        email:this.adminEmail,
        dodId: this.dodID
      };
      Portfolio.addCSPOperator({
        environment: this.environment,
        operator: operator
      })
      this.adminEmail = "";
      this.dodID = "";
      this.emailIsValid = false;
      this.$refs.modalForm.reset();
    } else {
      this.adminAlreadyExists = true;
    }
  }

  public openLearnMoreDrawer(): void {
    this.modalDrawerIsOpen = true;
  }

  public async validateEmail(): Promise<boolean> {
    const email = this.adminEmail;
    if (!email) {
      this.invalidEmailMessage = "Please enter your administrator’s email address."
      this.emailIsValid = false;
      this.showEmailErrorMessage = true;
      return false;
    }

    const domain = email.slice(-3).toLowerCase();
    const isGovtDomain = domain === "mil" || domain === "gov";
    const missingAtSymbol = email.indexOf("@") === -1;
    const validEmail = this.emailRegex.test(email);

    const isValid = isGovtDomain && !missingAtSymbol && validEmail;
    this.$nextTick(() => {
      this.emailIsValid = true;
      this.invalidEmailMessage = "";
      if (!isGovtDomain || missingAtSymbol || !validEmail) {
        this.emailIsValid = false;
      }
      if (!validEmail && missingAtSymbol && !isGovtDomain) {
        this.invalidEmailMessage = this.invalidEmailFormat;
      } else if (!isGovtDomain) {
        this.invalidEmailMessage = this.invalidEmailDomain;
      } else if (missingAtSymbol) {
        this.invalidEmailMessage = this.invalidEmailMissingAtSymbol;
      }
      this.showEmailErrorMessage = !this.emailIsValid;

    });
    return isValid;
  }
  
  public formatDate(item: Operator): string {
    return item.status !== "Processing" 
      ? createDateStr(item.provisionedDate as string, true, true)
      : "";
  }

  public async loadOnEnter(): Promise<void> {
    this.isLoading = true; // TODO: this can be used to show the spinner
    // TODO: remove below 3 lines after environment tabs based display is implemented
    this.environment = Portfolio.currentPortfolio.environments ?
      Portfolio.currentPortfolio.environments[0] :
        {sys_id: "7aafda19073121106417fa4d7c1ed04a"} as EnvironmentDTO;
    await Portfolio.loadAllOperatorsOfPortfolioEnvironment(this.environment);
    this.tableData = _.cloneDeep(this.environment.csp_admins) as Operator[];
    // this.tableData.forEach(row => {
    //   debugger;
    //   if (row.provisioned === "false" && row.provisionedDate === "") {
    //     row.provisionedDate = ;
    //   }
    // })
    
    // debugger;

    this.isLoading = false;
    this.transitionGroup = "transition-group";
  }
  public  mounted(): void {
    this.loadOnEnter();
  }
}
</script>

