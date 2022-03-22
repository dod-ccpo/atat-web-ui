
<template>
  <div>
    <div class="max-width-640 border1 border-base-lighter border-rounded-more pa-8 mb-5">
      <span class="font-size-20 mb-5 d-block">{{ selectedContact.FullName }}</span>
      <span class="ml-3 mb-5 d-block">
        <v-icon class="mr-2 text-base-light">mail</v-icon> 
        {{ selectedContact.Email }}
      </span>
      <span class="ml-3 mb-5 d-block">
        <v-icon class="mr-2 text-base-light">phone</v-icon> 
        {{ selectedContact.Phone }}<br />
      </span>
      <span class="ml-3 mb-10 d-block">
        <v-icon class="mr-2 text-base-light">pentagon</v-icon> 
        {{ selectedContact.OrgName }}<br />
      </span>
      <p class="mb-10 text-base">
        To make any changes to your {{ corOrAcor }}’s contact information, please send a 
        request to our User Engagement Team.
      </p>

      <a role="button" class="text-link" id="RequestContactChange" @click="showDialog = true">
        Request changes to {{ corOrAcor }}’s contact information
      </a>
    </div>
    <v-icon class="text-primary mr-1" @click="removeCorInfo">delete</v-icon>
    <a 
      class="text-link" 
      role="button" 
      tabindex="0"
      id="RemoveSelectedContactInfo"
      @click="removeCorInfo"
    >Remove {{ corOrAcor }} info
    </a>
    <ATATDialog
      :showDialog.sync="showDialog"
      :title="'Request change to ' + corOrAcor + '\'s contact information'"
      no-click-animation
      okText="Send Request"
      width="632px"
      disabled="true"
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

import ATATDialog from "@/components/ATATDialog.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATDialog,
    ATATTextArea
  }
})

export default class PersonCard extends Vue {
  
  // props
  
  @Prop({ default: false }) private isACOR!: boolean;
  @PropSync("selectedContact") private _selectedContact!: unknown;
  @PropSync("showContactForm") private _showContactForm!: unknown;

  // data

  private showDialog = false

  // computed

  get corOrAcor(): string {
    return this.isACOR ? "ACOR" : "COR";
  }

  // methods
  
  private removeCorInfo(): void {
    this._selectedContact = null;
    this._showContactForm = false;
  }


}
</script>
