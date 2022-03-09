<template>
    <div class="max-width-640 pt-0">
      <ATATAutoComplete
        id="SearchContact"
        :class="selectedContact ? 'mb-10' : 'mb-8'"
        :label-sr-only="true"
        label="Search for your COR"
        titleKey="FullName"
        subtitleKey="Email"
        :items="contactList"
        :searchFields="['FullName', 'Email']"
        :selectedItem.sync="selectedContact"
        placeholder="Search by name or email"
        icon="search"
        noResultsText="Manually enter my COR’s contact information"
        @noAutoCompleteResultsAction="noAutoCompleteResultsAction"
      />
      <expandable-link 
        v-if="!selectedContact" 
        aria-id="CORs_Contact"
      >
        <template v-slot:header>
          Manually enter your <span v-if="isACOR">A</span>COR’s contact information
        </template>
        <template v-slot:content>
          form fields
        </template>
      </expandable-link>

      <PersonCard 
        v-if="selectedContact" 
        :isACOR="isACOR"
        :selectedContact.sync="selectedContact"
      />
 
    </div>
<!--    <ContactInfoForm :isACOR="isACOR"/>-->
<!--    <div id="AccessRadioButtons"></div>-->
</template>
<script lang="ts">
import Vue from "vue";

import {Component, Prop} from "vue-property-decorator";
import ContactInfoForm from "./ContactInfoForm.vue";
import PersonCard from "./PersonCard.vue";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ExpandableLink from "@/components/ATATExpandableLink.vue";

@Component({
  components: {
    ContactInfoForm,
    PersonCard,
    ATATAutoComplete,
    ExpandableLink,
  }
})
export default class COR_ACOR extends Vue {
  @Prop({default: false}) private isACOR!: boolean;

  private manualEnterContactInfo = false;
  private selectedContact = "";

  private contactList = [
    {
      Id: 1,
      FullName: "Carl Contractingofficerep",
      Email: "carl.contractingofficerrep.civ@mail.mil  ",
      Phone: "555-555-5555",
      OrgName: "HQ1234 - Corresponding Organization Name"
    },
    {
      Id: 1,
      FullName: "Selia Wentzel",
      Email: "sel.wentz@acusage.net",
      Phone: "555-555-5555",
      OrgName: "HQ1234 - Corresponding Organization Name"
    },
  ];
  private noAutoCompleteResultsAction(): void {
    this.manualEnterContactInfo = true;
  }


}
</script>

