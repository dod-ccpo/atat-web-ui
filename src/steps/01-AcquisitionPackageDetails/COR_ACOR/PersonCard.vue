<template>
  <div :id="id">
    <div 
      class="max-width-640 border1 border-base-lighter border-rounded-more pa-8"
      :class="[
        { '_square-bottom _no-border-bottom mb-0' : isSameContact }, 
        {'mb-5' : !isSameContact }
      ]"
    >
      <span class="font-size-20 mb-5 d-block" :id="id + '_Name'">
        {{ selectedContact.firstName }} {{ selectedContact.lastName }}
      </span>
      <span class="ml-3 mb-5 d-block" :id="id + '_Email'">
        <v-icon class="mr-2 text-base-light">mail</v-icon> 
        {{ selectedContact.email }}
      </span>
      <span class="ml-3 mb-5 d-block" :id="id + '_Phone'">
        <v-icon class="mr-2 text-base-light">phone</v-icon> 
        {{ selectedContact.phone }}<br />
      </span>
      <span 
        class="ml-3 d-block" 
        :class="{ 'mb-10' : !isSameContact }"
        :id="id + '_OrgName'"
      >
        <v-icon class="mr-2 text-base-light">pentagon</v-icon> 
        {{ selectedContact.orgName }}<br />
      </span>

      <p 
        class="mb-0 text-base" 
        :id="id + '_Message'" 
        v-show="!isSameContact"
      >
        To update your {{ corOrAcor }}’s contact information, please    
        <a role="button" class="_text-link" id="RequestContactChange" @click="showDialog = true">
          submit a request to our User Engagement Team.
        </a>  
      </p>

    </div>

    <ATATAlert
      id="CorAcorSameErrorAlert"
      type="error"
      class="max-width-640 mb-5 _attach-to-bottom-of-card"
      v-show="isSameContact"
    >
      <template v-slot:content>
        <p class="mb-0">
          This individual is set as your {{ isACOR ? 'primary COR' : 'ACOR' }}. 
          Please select a different {{ isACOR ? 'ACOR' : 'primary COR' }}, or
          <router-link 
            :id="'LinkTo' + (isACOR ? 'COR' : 'ACOR')"
            :to="{ name: isACOR 
              ? routeNames.CorInformation
              : routeNames.AlternateCor
            }"
          >
            change your {{ isACOR ? 'COR' : 'ACOR' }}.
          </router-link>
        </p>
      </template>
    </ATATAlert>

    <v-icon class="text-primary mr-1" @click="removeCorInfo">delete</v-icon>
    <a 
      class="_text-link" 
      role="button" 
      tabindex="0"
      id="RemoveSelectedContactInfo"
      @click="removeCorInfo"
    >Remove {{ corOrAcor }}
    </a>
    <ATATDialog
      id="ChangeContactInfoModal"
      :showDialog.sync="showDialog"
      :title="'Request change to ' + corOrAcor + '’s contact information'"
      no-click-animation
      okText="Send Request"
      width="632"
      :OKDisabled="true"
    >
      <template #content>
        <p class="body">
          Please let us know what information needs to be updated for this {{ corOrAcor }}.
        </p>
        <ATATTextArea
          id="InformationChange"
          rows="7"
          class="pb-16"
        />
      </template>
    </ATATDialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import { CorAcorSelectData } from "../../../../types/Global";
import { routeNames } from "../../../router/stepper";

@Component({
  components: {
    ATATAlert,
    ATATDialog,
    ATATTextArea
  }
})

export default class PersonCard extends Vue {
  
  // props
  
  @Prop({ default: false }) private isACOR!: boolean;
  @Prop({ default: "PersonCard" }) private id!: boolean;
  @PropSync("selectedContact") private _selectedContact!: CorAcorSelectData;
  @PropSync("showContactForm") private _showContactForm!: unknown;

  // data

  private showDialog = false
  private routeNames = routeNames;
  // computed

  private get corOrAcor(): string {
    return this.isACOR ? "ACOR" : "COR";
  }

  private get otherRepEmail(): string {
    if (this.isACOR && AcquisitionPackage.corInfo) {
      return AcquisitionPackage.corInfo.email;
    } else if (!this.isACOR && AcquisitionPackage.acorInfo) {
      return AcquisitionPackage.acorInfo.email;
    }
    return "";
  }

  private get isSameContact(): boolean {
    return this.otherRepEmail === this._selectedContact.email;
  }

  // methods
  
  private removeCorInfo(): void {
    this._selectedContact = {
      id: "",
      firstName: "",
      lastName: "",
      fullName: "",
      email: "",
      phone: "",
      orgName: "",
    };

    this._showContactForm = false;
  }


}
</script>
