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
          class="w-100 py-10 border1 border-rounded border-base-lighter 
            text-center mb-10 mt-10 bg-base-off-white"
        >
          <h2 class="h3 mb-6 mt-2">You do not have any CSP administrators yet.</h2>
          <v-btn
            id="AddCSPAdmin"
            class="primary mx-auto mb-2"
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
          <v-data-table 
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="-1"
            class="elevation-0 _offering-instances _base-table-style mt-10"
            :hide-default-footer="true"
          >

            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.adminEmails="{ item }">
              <span v-html="item.adminEmails"></span>
            </template>
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.adminClassificationLevels="{ item }">
              <span v-html="item.adminClassificationLevels"></span>
            </template>
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.status="{ item }">
              <div class="d-flex align-center" style="margin-top: -6px;">
                <div class="_icon-circle bg-info-lighter">
                  <ATATSVGIcon
                    name="cloud"
                    width="21"
                    height="14"
                    color="info-dark"
                  />
                </div>
                <div>
                  {{ item.status }}
                </div>
              </div>
            </template>
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
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
            </template>
            
          </v-data-table>
          <v-btn
            id="AddAnotherAdmin"
            role="link" 
            class="secondary _normal _small-text mt-5"
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
          :showDialog.sync="openModal"
          :title="isEdit ? 'Edit administrator details' : 'Add a CSP administrator'"
          no-click-animation
          :okText="isEdit ? 'Update' : 'Add administrator'"
          width="632"
          :OKDisabled="ModalOKDisabled"
          @ok="AddCSPAdmin"
          :modalSlideoutComponent="modalSlideoutComponent"
          modalSlideoutTitle="Learn more about CSP administrators"
          :modalDrawerIsOpen.sync="modalDrawerIsOpen"
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
                :value.sync="adminDoDId"
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

              <div v-if="classificationLevels.length > 1">
                <ATATCheckboxGroup 
                  id="ClassificationSelection"
                  class="mt-10"
                  groupLabel="What classification level should this individual have access to?"
                  :value.sync="selectedClassificationLevels"
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
                  :value.sync="selectedImpactLevels"
                  :items="impactLevelOptions"
                  :card="true"
                  :inline="true"
                  cardWidth="180"
                  :noDescriptions="true"
                />
              </div>

              <ATATTextField
                id="UnclassifiedEmail"
                v-if="selectedClassificationLevels.includes('Unclassified')"
                :value.sync="unclassifiedEmail"
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
                :value.sync="scrtEmail"
                label="SIPRNet email address"
                :tooltipText="secretToolTip"
                class="_input-max-width mt-10"
                helpText="Must use a .smil or .sgov email address."
                :rules="[
                  $validators.required(
                    'Please enter your administrator’s email address.'
                  ),
                  $validators.isEmail('Please use a .smil or .sgov email address', true)
                ]"
              />

            </form>
          </template>
        </ATATDialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Mixins } from "vue-property-decorator";

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
  PortfolioAdmin,
  PortfolioProvisioning,
  SlideoutPanelContent
} from "../../../types/Global";
import PortfolioStore from "@/store/portfolio";
import _ from "lodash";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATAlert,
    ATATCheckboxGroup,
    ATATDialog,
    ATATSVGIcon,
    ATATTextField,
    CSPAdminLearnMore,
    CSPAdminLearnMoreText
  }
})

export default class AddCSPAdmin extends Mixins(SaveOnLeave) {
  public admins: PortfolioAdmin[] = [];
  public cspLong = "";
  public csp = "";
  public classificationLevels: string[] = [];
  public openModal = false;
  public modalSlideoutComponent = CSPAdminLearnMoreText;
  public modalDrawerIsOpen = false;

  public adminDoDId = "";
  public hasUnclassifiedAccess = "NO"; // YES/NO
  public unclassifiedEmail = "";
  public hasScrtAccess = "NO"; // YES/NO
  public scrtEmail = "";
  public hasTSAccess = "NO"; // YES/NO
  public tsEmail = "";

  public impactLevels:string[] = [];
  public impactLevelCompareArray:string[] = [];

  public scrtStr = ClassificationLevels.SCRT;
  public unclStr = ClassificationLevels.UNCL;
  public tsStr = ClassificationLevels.TSCRT;
  public missingEnv = "";

  public selectedClassificationLevels: string[] = [];
  public classificationLevelOptions: Checkbox[] = [];

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

  public get secretToolTip():string {
    return  `Use a Secure Internet Protocol Router Network (SIPRNet)
     email address. This is where the CSP will send instructions for
      accessing the <span class="font-weight-500">Secret</span> cloud console.`
  }

  public showMissingAdminAlert = false;
  public async setShowMissingAdminAlert(): Promise<void> {
    const missingUnclass = (this.admins.findIndex(a => a.hasUnclassifiedAccess === "YES")) === -1;
    const missingScrt = (this.admins.findIndex(a => a.hasScrtAccess === "YES")) === -1;
    const needsILs = this.hasImpactLevels;
    const missingILs = [...this.impactLevelCompareArray]
    if(this.admins.length > 0){
      if(needsILs){
        this.admins.forEach(admin=>{
          admin.impactLevels?.forEach(il =>{
            const idx = missingILs.findIndex(value => value === il)
            missingILs.splice(idx, 1)
          })
        })
      }
    }

    if (this.classificationLevels.length > 1
      && this.admins.length > 0
      && (missingUnclass || missingScrt || needsILs && missingILs.length > 0)
    ) {
      if(needsILs){
        const unclassifiedIL = missingILs.map(
          il => `Unclassified/${il.split('_')[1].toUpperCase()}`
        );
        if(missingScrt) unclassifiedIL.push("Secret")
        const newStr = unclassifiedIL.join(", ")
        this.missingEnv = newStr.replace(/,(?=[^,]+$)/, ' and');
        this.showMissingAdminAlert = true;
      }else{
        this.missingEnv = missingUnclass ? "unclassified" : "secret";
        this.showMissingAdminAlert = true;
      }
    } else {
      this.showMissingAdminAlert = false;
    }
  }

  public get scrtSelected(): boolean {
    return this.selectedClassificationLevels.includes(this.scrtStr);
  }

  public DoDIdRules = [
    this.$validators.allowedLengths(
      [10], 'The DoD ID must be 10 characters.'
    ),
    this.$validators.required("Please enter your administrator’s 10-digit DoD ID.")
  ]

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.CSPAdminForm as Vue & { validate: () => boolean };
  }

  public get ModalOKDisabled(): boolean {
    const idOK = this.adminDoDId.length === 10;
    const classificationSelected = this.selectedClassificationLevels.length > 0;
    let unclassEmailValid = true;
    if (this.selectedClassificationLevels.includes(this.unclStr)) {
      unclassEmailValid = /^\S[a-z-_.0-9]+@[a-z-_.0-9]+\.(?:gov|mil)$/i
        .test(this.unclassifiedEmail);
    }
    let scrtEmailValid = true;
    if (this.selectedClassificationLevels.includes(this.scrtStr)) {
      scrtEmailValid = /^\S[a-z-_.0-9]+@[a-z-_.0-9]+\.(?:sgov|smil)+\.(?:gov|mil)$/i
        .test(this.scrtEmail);
    }
    let ilsOK = true;
    if (this.impactLevels.length > 0) {
      const unclassChecked = this.selectedClassificationLevels.includes("Unclassified");
      ilsOK = !unclassChecked || unclassChecked && this.selectedImpactLevels.length > 0;
    }
    return !idOK || !classificationSelected || !unclassEmailValid || !scrtEmailValid || !ilsOK;
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
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public openLearnMoreDrawer(): void {
    this.modalDrawerIsOpen = true;
  }
  public openAddCSPModal(): void {
    this.openModal = true;
  }

  public async AddCSPAdmin(): Promise<void> {
    const hasUnclassifiedAccess
      = this.selectedClassificationLevels.includes(this.unclStr) ? "YES" : "NO";
    const hasScrtAccess = this.selectedClassificationLevels.includes(this.scrtStr) ? "YES" : "NO";
    const admin: PortfolioAdmin = {
      DoDId: this.adminDoDId,
      hasUnclassifiedAccess,
      hasScrtAccess,
      unclassifiedEmail: hasUnclassifiedAccess ? this.unclassifiedEmail : "",
      scrtEmail: hasScrtAccess ? this.scrtEmail : "",
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

    this.resetAdminData();
    this.buildTableData();
    this.selectedImpactLevels = []
    this.isEdit = false;
    this.editAdminIndex = -1;
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
      this.selectedImpactLevels = admin.impactLevels||[];

      if (this.hasUnclassifiedAccess === "YES")
        this.selectedClassificationLevels.push(this.unclStr);
      if (this.hasScrtAccess === "YES")
        this.selectedClassificationLevels.push(this.scrtStr);

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
    this.classificationLevels.forEach(level => {
      switch (level) {
      case "Unclassified":
        this.classificationLevelOptions.push(
          { id: this.unclStr, label: this.unclStr, value: this.unclStr }
        );
        break;
      case "Secret":
        this.classificationLevelOptions.push(
          { id: this.unclStr, label: this.unclStr, value: this.unclStr }
        );
      }
    })
  }

  public createILCheckbox(impactLevels:string[]): void {
    impactLevels.forEach(value => {
      const checkboxItem = {
        id: "",
        label: "",
        value: ""
      }
      const il = value.split('_')[1]
      checkboxItem.id = il.toUpperCase()
      checkboxItem.label = il.toUpperCase()
      checkboxItem.value = value
      this.impactLevelCompareArray.push(checkboxItem.value)
      this.impactLevelOptions.push(checkboxItem)
    })
  }

  public resetAdminData(): void {
    this.adminDoDId = "";
    this.hasUnclassifiedAccess = ""; // YES/NO
    this.unclassifiedEmail = "";
    this.hasScrtAccess = ""; // YES/NO
    this.scrtEmail = "";
    if (this.classificationLevels.length > 1) this.selectedClassificationLevels = [];
  }

  public get tableHeaders(): Record<string, string>[] {
    return [
      { text: "DoD ID", value: "DoDId" },
      { text: "Administrator email", value: "adminEmails" },
      { text: "Classification level", value: "adminClassificationLevels" },
      { text: "Status", value: "status", width: "200" },
      { text: "", value: "actions", width: "100" },
    ]
  }

  public buildTableData(): void {
    this.tableData = [];
    this.admins.forEach((admin, index) => {
      const classificationLevels = []
      let count = 1
      if (admin.hasUnclassifiedAccess === "YES"){
        if(this.hasImpactLevels && admin.impactLevels){
          count = admin.impactLevels.length - 1
          admin.impactLevels.forEach(il => {
            classificationLevels.push(this.unclStr + '/'+il.split("_")[1].toUpperCase());
          })
        }else{
          classificationLevels.push(this.unclStr);
        }
      }
      if (admin.hasScrtAccess === "YES") classificationLevels.push(this.scrtStr);
      const adminClassificationLevels = classificationLevels.join("<br />");
      const emails = [];
      const lineBreaks = count <= 0 ?"":"\n".repeat(count)
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
      const adminEmails = emails.join("<br />");
      const record: Record<string, string> = {
        index: index.toString(),
        DoDId: admin.DoDId as string,
        adminEmails,
        adminClassificationLevels,
        status: "In queue",
      }
      this.tableData.push(record);
    });

    this.setDisableContinue();
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
        switch(this.classificationLevels[0]) {
        case this.unclStr:
          this.hasUnclassifiedAccess = "YES";
          break;
        case this.scrtStr: 
          this.hasScrtAccess = "YES"
          break;
        case this.tsStr:
          this.hasTSAccess = "YES"
        }
      } else {
        // more than one classification level - create checkboxes
        this.createClassificationCheckboxes();
      }

      this.impactLevels = storeData.selectedILs || [];
      if (storeData.selectedILs && storeData.selectedILs.length > 1) {
        this.showUnclassifiedILs = true
        this.createILCheckbox(storeData.selectedILs)
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

</script>
