
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
        To make any changes to your COR’s contact information, please send a 
        request to our User Engagement Team.
      </p>

      <a role="button" class="text-link" id="RequestContactChange">
        Request changes to COR’s contact information
      </a>
    </div>
    <v-icon class="text-primary mr-1" @click="removeCorInfo">delete</v-icon>
    <a class="text-link" role="button" @click="removeCorInfo">Remove COR info</a>
  </div>  
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, PropSync } from "vue-property-decorator";
@Component({})
export default class PersonCard extends Vue {
  @Prop({default: true}) private isACOR!: boolean;
  @PropSync("selectedContact") private _selectedContact!: unknown;
  
  private removeCorInfo(): void {
    this._selectedContact = null;
  }
}
</script>

