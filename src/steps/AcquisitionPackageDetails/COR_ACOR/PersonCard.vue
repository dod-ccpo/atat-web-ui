
<template>
  <div class="max-width-640 border1 border-base-lighter border-rounded-more pa-8">
    <span class="font-size-20 mb-5 d-block">{{ selectedContact.FullName }}</span>
    <span class="ml-3 mb-5 d-block">
      <v-icon class="mr-2 text-base-light">mail</v-icon> 
      {{ selectedContact.Email }}
    </span>
    <span class="ml-3 mb-5 d-block">
      <v-icon class="mr-2 text-base-light">phone</v-icon> 
      {{ selectedContact.Phone }}<br />
    </span>
    <span class="ml-3 mb-5 d-block">
      <v-icon class="mr-2 text-base-light">pentagon_outline</v-icon> 
      {{ selectedContact.OrgName }}<br />
    </span>
    <p class="mb-10">
      To make any changes to your COR’s contact information, please send a 
      request to our User Engagement Team.
    </p>

    <a role="button" id="RequestContactChange">
      Request changes to COR’s contact information
    </a>


  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class PersonCard extends Vue {
  @Prop({default: true}) private isACOR!: boolean;
  @Prop() private selectedContact!: unknown;
  
}
</script>

