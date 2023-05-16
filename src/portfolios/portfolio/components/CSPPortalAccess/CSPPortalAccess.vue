
<template>
  <div>
    <div :class="{'mt-10': needsExtraTopMargin}">
      <CSPCard
        :cloudServiceProvider="portfolioCSP"
        :envClassificationLevel="envClassificationLevel"
        :envStatus="envStatus"
      />
    </div>

    <ATATAlert 
      id="EnvironmentAlert"
      :type="alertContent.type"
      :showIcon="false"
      class="mt-6"
      v-if="showAlert"
    >
      <template v-slot:content>
        <div class="d-flex align-center">
          <div class="mr-5">
            <div class="_icon-circle _large"
              :style="`background-color: ${alertContent.iconBgColor}`"
            >
              <ATATSVGIcon 
                :name="alertContent.iconName"
                :width="alertContent.iconWidth"
                :height="alertContent.iconHeight"
                :color="alertContent.iconColor"
              />
            </div>
          </div>
          <div>
            <h3>{{ alertContent.heading }}</h3>
            <p class="mb-0" v-html="alertContent.message"></p>
          </div>

        </div>
      </template>
    </ATATAlert>

    <div>
      <div class="_table-topper mt-10">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="h3 font-weight-500" id="TableHeader">CSP Administrators</h2>
            <p class="mb-0 font-size-14 text-base-darker">
              Grant access to your environment by provisioning 
              {{serviceProvider[portfolioCSP]}} 
              administrator accounts. 
              <a role="button" id="LearnMoreLink"
                tabindex="0"
                @click="openSlideoutPanel"
                @keydown.enter="openSlideoutPanel"
                @keydown.space="openSlideoutPanel"
              >
                Learn more
              </a>
            </p>
          </div>
          <v-btn
            id="AddCSPAdmin"
            color="primary"
            @click="openCSPModal"
            @keydown.enter="openCSPModal"
            @keydown.space="openCSPModal"
            v-if="showAddCSPAdminButton"
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
      </div>

      <div>
        <v-data-table
          :headers="tableHeaders"
          :items="tableData"
          :page.sync="page"
          hide-default-footer
          sort-by="provisionedDate"
          sort-desc
          class="_csp-admin-log border1 border-base-lighter _border-top-square"
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
          This individual will be granted full access to the {{serviceProvider[portfolioCSP]}} 
          portal to manage user accounts and configure workspace settings. 
          <a id="LearnMoreLink" role="button" @click="openLearnMoreDrawer">
            Learn more
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
/*eslint prefer-const: 1 */
import Vue from "vue";

import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import CSPCard from "@/portfolios/portfolio/components/shared/CSPCard.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AddAdminSlideOut from "@/portfolios/portfolio/components/shared/AddAdminSlideOut.vue";
import {Environment, Operator, SlideoutPanelContent} from "../../../../../types/Global";
import Portfolio from "@/store/portfolio";
import {EnvironmentDTO, OperatorDTO} from "@/api/models";
import { differenceInCalendarDays, formatISO, formatISO9075, startOfTomorrow } from "date-fns";
import { createDateStr } from "../../../../helpers"
import _ from "lodash";
import PortfolioStore from "@/store/portfolio";
import { Statuses } from "@/store/acquisitionPackage";
import AccessingCSPLearnMore from "../shared/AccessingCSPLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel";


@Component({
  components: {
    ATATAlert,
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
  @PropSync("environmentIndex") public _environmentIndex!: number;

  public environments: Environment[] = [];
  public selectedEnvironment = Portfolio.blankEnvironment;

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
  public showEnvTabs = false;

  public tableHeaders: Record<string, string>[] = [
    { text: "Administrator email", value: "email" },
    { text: "Status", value: "status" },
    { text: "Added by", value: "addedBy" },
    { text: "Processed on", value: "provisionedDate" },
  ];

  public serviceProvider: Record<string, string> = {
    AZURE: "Microsoft Azure",
    AWS: "Amazon Web Services",
    GCP: "Google Cloud",
    ORACLE: "Oracle Cloud"
  }

  public tableData: Operator[] = [];

  public maxPerPage = 10;
  public numberOfPages = Math.ceil(this.tableData.length/this.maxPerPage);

  @Watch("environmentIndex")
  public envIndexChanged(newVal: number): void {
    const envSysId = this.environments[newVal].sys_id;
    if (envSysId) Portfolio.setCurrentEnvSysId(envSysId);
  }

  public get needsExtraTopMargin(): boolean {
    return this.environments.length > 1;
  }

  public get envSysId(): string {
    return Portfolio.currentPortfolioEnvSysId;
  }
  @Watch("envSysId")
  public async envSysIdChanged(newVal: string): Promise<void> {
    const envIndex = this.environments.findIndex(obj => obj.sys_id === newVal);
    this._environmentIndex = envIndex;
    this.selectedEnvironment = this.environments[envIndex];
    if (this.showAlert) {
      this.buildAlertContent();
    }
    if (!this.selectedEnvironment.csp_admins) {
      await Portfolio.loadAllOperatorsOfPortfolioEnvironment(this.selectedEnvironment);
    }
    this.tableData = this.selectedEnvironment.csp_admins as Operator[];
  }

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

  // EJY DOUBLE-CHECK IF THIS IS NEEDED?
  // public createTableData(): void {
  //   for (let i = 0; i < this.emails.length; i++) {
  //     const admin = {
  //       email:"",
  //       status:"",
  //       createdBy:"",
  //       created:""
  //     };
  //     //eslint-disable-next-line prefer-const
  //     let idx = i;
  //     admin.email = this.emails[idx];
  //     admin.status = this.statuses[idx];
  //     admin.createdBy = this.createdBy[idx];
  //     admin.created = admin.status !== "Processing" 
  // ? format(this.today,"MMM. dd, yyy hhmm") : "";
  //     this.tableData.push(admin);
  //   }
  // }

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
      width: "17",
      height: "13",
      color: "info-dark",
      bgColor:"bg-info-lighter"
    }
  };


  public get showAlert(): boolean {
    // show alert if any status other than provisioned
    if (this.selectedEnvironment.environmentStatus !== Statuses.Provisioned.value) {
      return true;
    }
    // for provisioned portfolios, show success alert for 2 weeks
    const provisionedDate = new Date(this.selectedEnvironment.provisioned_date);
    const now = new Date();
    return differenceInCalendarDays(now, provisionedDate) <= 14;
  }

  public classificationLevels: Record<string, string> = {
    U: "Unclassified",
    S: "Secret",
    TS: "Top Secret",
  }  
  public get envClassificationLevel(): string {
    return this.classificationLevels[this.selectedEnvironment.classification_level as string];
  } 

  public get envStatus(): string {
    return this.selectedEnvironment.environmentStatus as string;
  }

  public alertContent: {
    heading: string;
    message: string;
    type: string;
    iconName: string;
    iconWidth: string;
    iconHeight: string;
    iconColor: string;
    iconBgColor: string;
  } = {
    heading: "",
    message: "",
    type: "",
    iconName: "",
    iconWidth: "",
    iconHeight: "",
    iconColor: "",
    iconBgColor: "",
  };

  public buildAlertContent(): void {
    const csp = this.serviceProvider[this.selectedEnvironment.csp_display as string];

    if (this.selectedEnvironment.environmentStatus === Statuses.Processing.value) {
      
      this.alertContent.heading = "Provisioning in progress";
      this.alertContent.message = `Upon completion, administrators will have access to your 
        ${this.envClassificationLevel.toLowerCase()} environment within the ${ csp } portal.`;
      this.alertContent.type = "info"
      this.alertContent.iconName = "processing"
      this.alertContent.iconWidth = "33"
      this.alertContent.iconHeight = "26"
      this.alertContent.iconColor = "info-dark"
      this.alertContent.iconBgColor = "#009DDD1A"

    } else if (this.selectedEnvironment.environmentStatus === Statuses.ProvisioningIssue.value) {
    
      this.alertContent.heading = "Provisioning issue";    
      // eslint-disable-next-line max-len
      const url = "https://community.hacc.mil/s/contact?RequestTopic=Account%20Tracking%20and%20Automation%20Tool%20%28ATAT%29&RoleType=Customer"; 
      this.alertContent.message = `We are investigating an issue that occurred while 
        provisioning your ${this.envClassificationLevel.toLowerCase()} environment. If you 
        have any questions, <a href="${url}" target="_blank" class="_external-link">please 
          contact customer support.</a>`;
      this.alertContent.type = "warning"
      this.alertContent.iconName = "warningAmber"
      this.alertContent.iconWidth = "37"
      this.alertContent.iconHeight = "32"
      this.alertContent.iconColor = "warning-dark2"
      this.alertContent.iconBgColor = "#e9a5141A"
    
    } else if (this.selectedEnvironment.environmentStatus === Statuses.Provisioned.value) {

      this.alertContent.heading = "Provisioning complete";
      this.alertContent.message = `Your ${this.envClassificationLevel.toLowerCase()} environment 
        is now available for use. CSP administrator(s) will receive an email from ${ csp } 
        with instructions for logging into the cloud portal.`
      this.alertContent.type = "success"
      this.alertContent.iconName = "provisioned"
      this.alertContent.iconWidth = "34"
      this.alertContent.iconHeight = "26"
      this.alertContent.iconColor = "success-dark"
      this.alertContent.iconBgColor = "#62bd591A"
    }
  }

  public get showAddCSPAdminButton(): boolean {
    return this.selectedEnvironment.environmentStatus === Statuses.Provisioned.value;
  }

  public addCSPMember():void {
    const existingOperator = this.selectedEnvironment.csp_admins
      ?.find(cspAdmin => cspAdmin.email === this.adminEmail);
    if (!existingOperator) {
      this.adminAlreadyExists = false;
      const operator: Operator = {
        email:this.adminEmail,
        dodId: this.dodID
      };
      Portfolio.addCSPOperator({
        environment: this.selectedEnvironment,
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

  public async openSlideoutPanel(e: Event): Promise<void> {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      const slideoutPanelContent: SlideoutPanelContent = {
        component: AccessingCSPLearnMore,
        title: "Learn More",
      }
      await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);

      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }


  public async loadOnEnter(): Promise<void> {
    this.isLoading = true;  
    this.environments = Portfolio.currentPortfolio.environments || [];
    this.showEnvTabs = this.environments.length > 1;

    if (Portfolio.currentPortfolio.environments) {
      const selectedEnvSysId = Portfolio.currentPortfolioEnvSysId;
      const envIndex = this.environments.findIndex(obj => obj.sys_id === selectedEnvSysId);
      const idx = envIndex > -1 ? envIndex : 0;
      this.selectedEnvironment = Portfolio.currentPortfolio.environments[idx] as Environment;
      if (this.showAlert) {
        this.buildAlertContent();
      }

    }
    if (!this.selectedEnvironment.csp_admins) {
      await Portfolio.loadAllOperatorsOfPortfolioEnvironment(this.selectedEnvironment);
    }
    this.tableData = this.selectedEnvironment.csp_admins as Operator[];
    this.isLoading = false;
    this.transitionGroup = "transition-group";
  }
  public  mounted(): void {
    this.loadOnEnter();
  }
}
</script>

