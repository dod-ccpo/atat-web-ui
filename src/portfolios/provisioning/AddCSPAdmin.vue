<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header">
          Now, let’s add administrators to manage your CSP portal
        </h1>
        <p class="page-intro">
          Before we can start provisioning, you need to add at least one Cloud 
          Service Provider (CSP) administrator. These individuals will be granted 
          full access to your cloud resources within the {{ cspLong }} portal, enabling 
          them to manage user accounts and configure workspace settings. 
          <a
            role="button"
            id="CSPAdminLearnMore"
            class="_text-link"
            tabindex="0"
            @click="openSlideoutPanel"
            @keydown.enter="openSlideoutPanel"
            @keydown.space="openSlideoutPanel">
            Learn more about administrators
          </a>         
        </p>

        <ATATAlert 
          id="MissingAdmin"
          v-if="showMissingAdminAlert"
          type="warning"
          class="mb-10"
        >
        <template v-slot:content>
          <p class="mb-0">
            <strong>Missing administrator for {{ missingEnv }} environment.</strong>
            Please add an administrator or edit details from an existing administrator
            to grant access to the unclassified environment within your CSP portal.
          </p>
        </template>
        </ATATAlert>

        <div 
          v-if="admins.length === 0"
          class="w-100 py-10 border1 _border-rounded border-base-lighter 
            text-center mb-10 mt-10 bg-base-off-white"
        >
          <h2 class="h3 mb-6 mt-2">You do not have any CSP administrators yet.</h2>
          <v-btn
            id="AddCSPAdmin"
            class="_primary mx-auto mb-2"
            @click="openAddCSPModal"
            @keydown.enter="openAddCSPModal"
            @keydown.space="openAddCSPModal"
          >
            <ATATSVGIcon 
              color="white"
              height="14"
              width="20"
              name="personAdd"
              class="mr-4"
            />
            Add a CSP Administrator
          </v-btn> 
        </div>
        <div v-else>
          <v-table 
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="-1"
            class="elevation-0 _offering-instances _base-table-style mt-10"
            :hide-default-footer="true"
          >
          <thead>
            <tr>
              <th 
              v-for="header in tableHeaders" 
              :key="header.title"
              :id="header.title"
              class="text-start sortable"
              >
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in tableData"
              :key="item.DoDId"
            >
            <td class="text-start">
              {{ item.DoDId }}
            </td>
            <!-- eslint-disable vue/valid-v-slot -->
            <td v-html="item.adminEmails" class="text-start">
            </td>
            <!-- eslint-disable vue/valid-v-slot -->
            <td  v-html="item.adminClassificationLevels" class="text-start">
            </td>
            <td class="text-start" >
              <div class="d-flex align-center">
                <div class="_icon-circle bg-info-lighter">
                    <ATATSVGIcon
                      name="cloud"
                      width="21"
                      height="14"
                      color="info-dark"
                    />
                  </div>
                {{ item.status }}
              </div>
            </td>
            <td class="text-start">
              <button
                :id="'EditButton_' + item.index"
                @click="editAdmin(item)"
                class="mr-2"
              >
                <ATATSVGIcon name="edit" height="19" width="19" />
              </button>

              <button
                :id="'DeleteButton_' + item.index"
                @click="deleteAdmin(item)"
                class="ml-2"
              >
                <ATATSVGIcon name="remove" height="18" width="14" />
              </button>
            </td>

          </tr>
          </tbody>
          </v-table>
          <v-btn
            id="AddAnotherAdmin"
            role="link" 
            class="_secondary _normal _small-text mt-5"
            :ripple="false"
            @click="openAddCSPModal()"
          >
            <ATATSVGIcon 
              color="primary" 
              height="17" 
              width="18" 
              name="control-point" 
              class="mr-2"
            />
            Add another CSP Administrator
          </v-btn>  
        </div>
      
        <ATATDialog 
          id="AddCSPAdminModal"
          :showDialog="openModal"
          @update:showDialog="openModal = $event"
          :title="isEdit ? 'Edit administrator details' : 'Add a CSP administrator'"
          no-click-animation
          :okText="isEdit ? 'Update' : 'Add administrator'"
          width="632"
          :OKDisabled="ModalOKDisabled"
          @ok="AddCSPAdmin"
          @cancelClicked="resetAdmin"
          :modalSlideoutComponent="modalSlideoutComponent"
          modalSlideoutTitle="Learn more about CSP administrators"
          :modalDrawerIsOpen="modalDrawerIsOpen"
          @update:modalDrawerIsOpen="modalDrawerIsOpen = $event"
        >
          <template #content>
            <p class="body">
              This individual will be granted full access to the CSP console to manage 
              user accounts and configure workspace settings. 
              <a id="LearnMoreLink" role="button" @click="openLearnMoreDrawer">
                Learn more
              </a>
            </p>

            <form ref="CSPAdminForm">
            
              <ATATTextField 
                id="AdminDoDId"
                :value="adminDoDId"
                @update:value="adminDoDId = $event"
                label="Administrator’s DoD ID"
                tooltipText="This 10-digit number is printed on the back of your 
                  administrator's Common Access Card (CAC). You may also ask your 
                  administrator to log into DoD ID Card Office Online and locate it 
                  under “My Profile.”"
                class="_input-max-width"
                :mask="['^([0-9]{10})$']"
                :isMaskRegex="true"
                :rules="DoDIdRules"
              />

                <ATATCheckboxGroup 
                  v-if="classificationLevels.length > 1" 
                  id="ClassificationSelection"
                  class="mt-10"
                  groupLabel="What classification level should this individual have access to?"
                  :value="selectedClassificationLevels"
                  @update:value="selectedClassificationLevels = $event"
                  :resetSelected="resetSelectedClassificationLevels"
                  @update:resetSelected="resetSelectedClassificationLevels = $event"
                  :items="classificationLevelOptions"
                  :card="true"
                  :inline="true"
                  cardWidth="180"
                  :noDescriptions="true"
                />
                <ATATCheckboxGroup
                  v-if="selectedClassificationLevels.includes('Unclassified')
                  && showUnclassifiedILs"
                  id="ImpactLevelSelection"
                  class="mt-10"
                  groupLabel="What impact level should this individual have access to?"
                  :value="selectedImpactLevels"
                  @update:value="selectedImpactLevels = $event"
                  :items="impactLevelOptions"
                  :card="true"
                  :inline="true"
                  cardWidth="180"
                  :noDescriptions="true"
                />

              <ATATTextField
                id="UnclassifiedEmail"
                v-if="unclassifiedSelected"
                :value="unclassifiedEmail"
                @update:value="unclassifiedEmail = $event"
                label="Unclassified email address"
                :tooltipText="unclassifiedTooltip"
                class="_input-max-width mt-10"
                helpText="Must use a .mil or .gov email address."
                :rules="[
                  $validators.required(
                    'Please enter your administrator’s email address.'
                  ),
                  $validators.isEmail('Please use a .mil or .gov email address')
                ]"
              />
              <ATATTextField
                id="ScrtEmail"
                v-if="scrtSelected"
                :value="scrtEmail"
                @update:value="scrtEmail = $event"
                label="SIPRNet email address"
                :tooltipText="secretToolTip"
                class="_input-max-width mt-10"
                helpText="Must use a .smil or .sgov email address."
                :rules="[
                  $validators.required(
                    'Please enter your administrator’s email address.'
                  ),
                  $validators.isEmail('Please use a .smil or .sgov email address', 'S')
                ]"
              />

              <ATATTextField
                id="TSEmail"
                v-if="tsSelected"
                :value="tsEmail"
                @update:value="tsEmail = $event"
                label="JWICS email address"
                :tooltipText="tsToolTip"
                class="_input-max-width mt-10"
                :helpText="tsEmailHelpText"
                @blur="checkTSEmail"
                :rules="[
                  $validators.required(
                    'Please enter your administrator’s email address.'
                  ),
                  $validators.isEmail('Please use a .mil or .gov email address', 'TS')
                ]"
              />
              <div v-if="showTSEmailWarning" class="d-flex _input-max-width mt-2">
                <div style="margin-top: 2px;">
                  <ATATSVGIcon name="warning" width="18" height="16" color="warning-dark2" />
                </div>
                <div class="body ml-2">
                  This doesn’t look like a valid email. Please ensure the address can 
                  be accessed from JWICS.
                </div>
              </div>

            </form>
          </template>
        </ATATDialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, toNative, Hook } from "vue-facing-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import CSPAdminLearnMore from "./AddCSPAdminLearnMore.vue";
import CSPAdminLearnMoreText from "./AddCSPAdminLearnMoreText.vue";

import SlideoutPanel from "@/store/slideoutPanel";
import {
  Checkbox,
  ClassificationLevels,
  DataTableHeader,
  PortfolioAdmin,
  PortfolioProvisioning,
  SlideoutPanelContent,
} from "../../../types/Global";
import PortfolioStore from "@/store/portfolio";
import _ from "lodash";
import { To, From, SaveOnLeaveRefs, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";

import { shallowRef } from "vue";

@Component({
  components: {
    ATATAlert,
    ATATCheckboxGroup,
    ATATDialog,
    ATATSVGIcon,
    ATATTextField,
    CSPAdminLearnMore: shallowRef(CSPAdminLearnMore),
    CSPAdminLearnMoreText: shallowRef(CSPAdminLearnMoreText)
  }
})

class AddCSPAdmin extends Vue {
  $refs!: SaveOnLeaveRefs
  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, form: this.$refs.form, nextTick: this.$nextTick,
    }).catch(() => false)
  }

  public admins: PortfolioAdmin[] = [];
  public cspLong = "";
  public csp = "";
  public classificationLevels: string[] = [];
  public openModal = false;
  public modalSlideoutComponent = shallowRef(CSPAdminLearnMoreText);
  public modalDrawerIsOpen = false;

  public adminDoDId = "";
  public hasUnclassifiedAccess = "NO"; // YES/NO
  public unclassifiedEmail = "";
  public hasScrtAccess = "NO"; // YES/NO
  public scrtEmail = "";
  public hasTSAccess = "NO"; // YES/NO
  public tsEmail = "";
  public showTSEmailWarning = false;

  public impactLevels:string[] = [];
  public impactLevelCompareArray:string[] = [];

  public scrtStr = ClassificationLevels.SCRT;
  public unclStr = ClassificationLevels.UNCL;
  public tsStr = ClassificationLevels.TSCRT;
  public missingEnv = "";

  public selectedClassificationLevels: string[] = [];
  public classificationLevelOptions: Checkbox[] = [];
  public resetSelectedClassificationLevels = false;

  public selectedImpactLevels: string[] = [];
  public impactLevelOptions: Checkbox[] = [];
  public hasImpactLevels = PortfolioStore.CSPHasImpactLevels;

  public tableData: Record<string, string>[] = [];
  public showUnclassifiedILs = false;
  public get unclassifiedTooltip():string{
    let txt = ""
    if(!this.hasImpactLevels){
      txt = `<span class="font-weight-500">Unclassified</span> cloud console.`
    }else{
      txt+=`<span class="font-weight-500">Unclassified</span>`
      if(this.impactLevels.length === 1){
        txt += `<span class="font-weight-500">/${this.selectedImpactLevels[0]}</span>
            cloud console.`
      }else{
        txt += " cloud console for any ILs selected above."
      }
    }
    return "Use a Non-classified Internet Protocol Router Network (NIPRNet)\n" +
      "email address. This is where the CSP will send instructions for accessing the " +
      txt
  }

  public get secretToolTip(): string {
    return  `Use a Secure Internet Protocol Router Network (SIPRNet)
     email address. This is where the CSP will send instructions for
      accessing the <span class="font-weight-500">Secret</span> cloud console.`
  }
  public get tsToolTip(): string {
    return `Use a Joint Worldwide Intelligence Communications System (JWICS) 
      email address. This is where the CSP will send instructions for accessing 
      the <span class="font-weight-500">Top Secret</span> cloud console.`
  }

  public get needsUAdmin(): boolean {
    return this.classificationLevels.includes(this.unclStr);
  }
  public get needsSAdmin(): boolean {
    return this.classificationLevels.includes(this.scrtStr);
  }
  public get needsTSAdmin(): boolean {
    return this.classificationLevels.includes(this.tsStr);
  }

  public showMissingAdminAlert = false;
  public async setShowMissingAdminAlert(): Promise<void> {
    const missingUnclass = 
      this.admins.findIndex(a => a.hasUnclassifiedAccess === "YES") === -1 && this.needsUAdmin;
    const missingScrt = 
      this.admins.findIndex(a => a.hasScrtAccess === "YES") === -1 && this.needsSAdmin;
    const missingTS = 
      this.admins.findIndex(a => a.hasTSAccess === "YES") === -1 && this.needsTSAdmin;
    const needsILs = this.hasImpactLevels;
    const missingILs = [...this.impactLevelCompareArray];

    if (this.admins.length > 0 && needsILs) {
      this.admins.forEach(admin => {
        admin.impactLevels?.forEach(il => {
          const idx = missingILs.findIndex(value => value === il);
          missingILs.splice(idx, 1);
        });
      });
    }

    if (this.classificationLevels.length > 1 && this.admins.length > 0
      && (missingUnclass || missingScrt || missingTS || needsILs && missingILs.length > 0)
    ) {
      let missingEnvs = [];
      if (needsILs && this.impactLevels.length > 1) {
        missingEnvs = missingILs.map(il => `Unclassified/${il.split('_')[1].toUpperCase()}`);
      } else if (missingUnclass) {
        if (missingUnclass) missingEnvs.push("Unclassified");
      }
      if (missingScrt) missingEnvs.push("Secret");
      if (missingTS) missingEnvs.push("Top Secret");
      const str = missingEnvs.join(", ");
      this.missingEnv = str.replace(/,(?=[^,]+$)/, ' and');
      this.showMissingAdminAlert = true;
    } else {
      this.showMissingAdminAlert = false;
    }
  }

  public get unclassifiedSelected(): boolean {  
    return this.selectedClassificationLevels.includes(this.unclStr);    
  }
  public get scrtSelected(): boolean {
    return this.selectedClassificationLevels.includes(this.scrtStr);
  }
  public get tsSelected(): boolean {
    return this.selectedClassificationLevels.includes(this.tsStr);
  }

  public DoDIdRules = [
    // this.$validators.allowedLengths(
    //   [10], 'The DoD ID must be 10 characters.'
    // ),
    // this.$validators.required("Please enter your administrator’s 10-digit DoD ID.")
  ]

  get Form(): typeof Vue & { validate: () => boolean } {
    return this.$refs.CSPAdminForm as typeof Vue & { validate: () => boolean };
  }

  public get tsEmailHelpText(): string {
    return this.showTSEmailWarning ? "" : "Must use a valid JWICS email, such as .ic.gov.";
  }

  public checkTSEmail(val: string): void {
    const tsValid = this.isValidGovOrMilEmail(val);
    this.showTSEmailWarning = tsValid && val.slice(-7) !== ".ic.gov";
  }

  public isValidGovOrMilEmail(val: string): boolean {
    const govOrMilEmail = /^\S[a-z-_.0-9]+@[a-z-_.0-9]+\.(?:gov|mil)$/i
    return govOrMilEmail.test(val);
  }

  public get ModalOKDisabled(): boolean {
    const idOK = this.adminDoDId.length === 10;
    const classificationSelected = this.selectedClassificationLevels.length > 0;
    let unclassEmailValid = true;
    if (this.selectedClassificationLevels.includes(this.unclStr)) {
      unclassEmailValid = this.isValidGovOrMilEmail(this.unclassifiedEmail);
    }
    let scrtEmailValid = true;
    if (this.selectedClassificationLevels.includes(this.scrtStr)) {
      scrtEmailValid = /^\S[a-z-_.0-9]+@[a-z-_.0-9]+\.(?:sgov|smil)+\.(?:gov|mil)$/i
        .test(this.scrtEmail);
    }
    let tsEmailValid = true;
    if (this.selectedClassificationLevels.includes(this.tsStr)) {
      // same as unclass - needs to end in .gov or .mil
      tsEmailValid = this.isValidGovOrMilEmail(this.tsEmail);
      // but also if does not end with ".ic.gov" show a warning - set in this.checkTSEmail()
    }

    let ilsOK = true;
    if (this.impactLevels.length > 1) {
      const unclassChecked = this.selectedClassificationLevels.includes("Unclassified");
      ilsOK = !unclassChecked || unclassChecked && this.selectedImpactLevels.length > 0;
    }
    return !idOK || !classificationSelected || !ilsOK
      || !unclassEmailValid || !scrtEmailValid || !tsEmailValid;
  };

  public async validate(): Promise<void> {
    this.$nextTick(() => {
      this.Form.validate();
    });
  }

  public get currentData(): PortfolioAdmin[] {
    return this.admins;
  }
  public savedData: PortfolioAdmin[] = [];

  public openSlideoutPanel(e: Event): void {
    if (e?.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public openLearnMoreDrawer(): void {
    this.modalDrawerIsOpen = true;
  }
  public openAddCSPModal(): void {
    this.resetSelectedClassificationLevels = true;
    this.openModal = true;
  }

  public async AddCSPAdmin(): Promise<void> {
    const hasUnclassifiedAccess
      = this.selectedClassificationLevels.includes(this.unclStr) ? "YES" : "NO";
    const hasScrtAccess = this.selectedClassificationLevels.includes(this.scrtStr) ? "YES" : "NO";
    const hasTSAccess = this.selectedClassificationLevels.includes(this.tsStr) ? "YES" : "NO";

    const admin: PortfolioAdmin = {
      DoDId: this.adminDoDId,
      hasUnclassifiedAccess,
      hasScrtAccess,
      hasTSAccess,
      unclassifiedEmail: hasUnclassifiedAccess ? this.unclassifiedEmail : "",
      scrtEmail: hasScrtAccess ? this.scrtEmail : "",
      tsEmail: hasTSAccess ? this.tsEmail : "",
      impactLevels:this.selectedImpactLevels
    };
    const adminIndex = this.admins.findIndex(obj => obj.DoDId === this.adminDoDId);
    if (this.isEdit && this.editAdminIndex > -1) {
      this.admins[this.editAdminIndex] = admin;
    } else {
      if (adminIndex > -1) {
        this.admins[adminIndex] = admin;
      } else {
        this.admins.push(admin);
      }
    }

    this.resetAdmin();
    this.buildTableData();
  }

  public resetAdmin(): void {
    this.resetAccess();
    this.resetAdminData();
    this.selectedImpactLevels = []
    this.isEdit = false;
    this.editAdminIndex = -1;
    this.showTSEmailWarning = false;
  }

  public async setDisableContinue(): Promise<void> {
    await this.setShowMissingAdminAlert();
    const disableContinue = this.admins.length === 0 || this.showMissingAdminAlert;
    await AcquisitionPackage.setDisableContinue(disableContinue);
  }

  public isEdit = false;
  public editAdminIndex = -1;

  public editAdmin(adminToEdit: Record<string, string>): void {
    this.isEdit = true;
    const admin = this.admins.find(obj => obj.DoDId === adminToEdit.DoDId);
    if (admin) {
      this.editAdminIndex = this.admins.findIndex(obj => obj.DoDId === adminToEdit.DoDId);
      this.adminDoDId = admin.DoDId as string;
      this.hasUnclassifiedAccess = admin.hasUnclassifiedAccess as string;
      this.unclassifiedEmail = admin.unclassifiedEmail as string;
      this.hasScrtAccess = admin.hasScrtAccess as string;
      this.scrtEmail = admin.scrtEmail as string;
      this.hasTSAccess = admin.hasTSAccess as string;
      this.tsEmail = admin.tsEmail as string;
      this.selectedImpactLevels = admin.impactLevels||[];

      if (this.hasUnclassifiedAccess === "YES")
        this.selectedClassificationLevels.push(this.unclStr);
      if (this.hasScrtAccess === "YES")
        this.selectedClassificationLevels.push(this.scrtStr);
      if (this.hasTSAccess === "YES") {
        this.selectedClassificationLevels.push(this.tsStr);
        this.checkTSEmail(this.tsEmail);
      } else {
        this.showTSEmailWarning = false;
      }
      this.openAddCSPModal();
    }
  }

  public async deleteAdmin(adminToDelete: Record<string, string>): Promise<void> {
    const index = this.admins.findIndex(obj => obj.DoDId === adminToDelete.DoDId);
    if (index > -1) {
      this.admins.splice(index, 1);
      this.buildTableData();
      this.isEdit = false;
      this.editAdminIndex = -1;
      this.resetAdminData();
    }
  }

  public createClassificationCheckboxes(): void {
    this.classificationLevels.forEach(cl => {     
      const id = cl.replace(" ", "_");
      this.classificationLevelOptions.push({ id, label: cl, value: cl });
    })
  }

  public createILCheckboxes(impactLevels:string[]): void {
    impactLevels.forEach(value => {
      const il = value.split('_')[1].toUpperCase();
      this.impactLevelCompareArray.push(value)
      this.impactLevelOptions.push({id: il, label: il, value});
    })
  }

  public resetAdminData(): void {
    this.adminDoDId = "";
    this.unclassifiedEmail = "";
    this.scrtEmail = "";
    this.tsEmail = "";
    if (this.classificationLevels.length > 1) this.selectedClassificationLevels = [];
    this.resetAccess();
  }

  public get tableHeaders(): DataTableHeader[] {
    return [
      { title: "DoD ID", value: "DoDId" },
      { title: "Administrator email", value: "adminEmails" },
      { title: "Classification level", value: "adminClassificationLevels" },
      { title: "Status", value: "status", width: "200" },
      { title: "", value: "actions", width: "100" },
    ]
  }

  public buildTableData(): void {
    this.tableData = [];
    this.admins.forEach((admin, index) => {
      // build classification level cell data
      const classificationLevels = []
      let count = 0
      if (admin.hasUnclassifiedAccess === "YES"){
        if(this.hasImpactLevels && admin.impactLevels && this.impactLevels.length > 1) {
          count = admin.impactLevels.length - 1
          admin.impactLevels.forEach(il => {
            classificationLevels.push(this.unclStr + '/'+il.split("_")[1].toUpperCase());
          })
        }else{
          classificationLevels.push(this.unclStr);
        }
      }
      if (admin.hasScrtAccess === "YES") classificationLevels.push(this.scrtStr);
      if (admin.hasTSAccess === "YES") classificationLevels.push(this.tsStr);
      const adminClassificationLevels = classificationLevels.join("<br />");

      // build email cell data
      const emails = [];
      const lineBreaks = count === 0 ? "" : "\n".repeat(count)
      if (admin.hasUnclassifiedAccess === "YES" && admin.unclassifiedEmail) {
        if(this.hasImpactLevels){
          emails.push(admin.unclassifiedEmail);
          if(count){
            for(let i = 0; i < count;i++){
              emails.push("\n")
            }
          }
        }else{
          emails.push(admin.unclassifiedEmail);
        }
      }
      if (admin.hasScrtAccess === "YES" && admin.scrtEmail) {
        emails.push(admin.scrtEmail);
      }
      if (admin.hasTSAccess === "YES" && admin.tsEmail) {
        emails.push(admin.tsEmail);
      }
      const adminEmails = emails.join("<br />");

      // assemble data table object
      const record: Record<string, string> = {
        index: index.toString(),
        DoDId: admin.DoDId as string,
        adminEmails,
        adminClassificationLevels,
        status: "In queue",
      }
      // add to table data
      this.tableData.push(record);
    });

    this.setDisableContinue();
  }

  public resetAccess(): void {
    this.hasUnclassifiedAccess = "NO";
    this.hasScrtAccess = "NO";
    this.hasTSAccess = "NO";

    if (this.classificationLevels.length === 1) {
      switch(this.classificationLevels[0]) {
      case this.unclStr:
        this.hasUnclassifiedAccess = "YES";
        break;
      case this.scrtStr: 
        this.hasScrtAccess = "YES";
        break;
      case this.tsStr:
        this.hasTSAccess = "YES";
      }
    }
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = PortfolioStore.portfolioProvisioningObj;

    if (storeData) {
      this.admins = _.cloneDeep(storeData.admins) || [];
      this.savedData = _.cloneDeep(this.admins);
      this.cspLong = storeData.cspLong as string;
      this.classificationLevels = storeData.classificationLevels || [];
      // if only one classification level available on the task order,
      // automatically set user to only have access to that classification level
      if (this.classificationLevels.length === 1) {
        this.selectedClassificationLevels.push(this.classificationLevels[0])
        this.resetAccess();
      } else {
        // more than one classification level - create checkboxes
        this.createClassificationCheckboxes();
      }

      this.impactLevels = storeData.selectedILs || [];
      if (storeData.selectedILs && storeData.selectedILs.length > 1) {
        this.showUnclassifiedILs = true
        this.createILCheckboxes(storeData.selectedILs)
      } else if (storeData.selectedILs && storeData.selectedILs.length === 1) {
        this.selectedImpactLevels.push(storeData.selectedILs[0]);
      }
      this.csp = storeData.csp || "";

      this.buildTableData();

    } 
    
    await AcquisitionPackage.setDisableContinue(this.admins.length === 0);
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: CSPAdminLearnMore,
      title: "Learn More",
    };

    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
  }

  public async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setDisableContinue(false);
    try {
      if (this.admins.length > 0) {
        const data: PortfolioProvisioning = {
          admins: this.admins,
        }
        await PortfolioStore.setPortfolioProvisioning(data);
      }
    } catch (error) {
      console.log(error)
    }

    return true;
  }



}
export default toNative(AddCSPAdmin)
</script>
