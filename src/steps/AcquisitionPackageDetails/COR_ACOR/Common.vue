<template>
    <div class="pt-0">
      <intro :isACOR="isACOR" />

      <div class="max-width-640">
        <ATATAutoComplete
          id="SearchContact"
          :class="selectedContact ? 'mb-10' : 'mb-8'"
          :label-sr-only="true"
          :label="'Search for your ' + corOrAcor()"
          titleKey="FullName"
          subtitleKey="Email"
          :items="contactList"
          :searchFields="['FullName', 'Email']"
          :selectedItem.sync="selectedContact"
          placeholder="Search by name or email"
          icon="search"
          :noResultsText="'Manually enter my ' + corOrAcor() + '’s contact information'"
          @noAutoCompleteResultsAction="noAutoCompleteResultsAction"
        />

        <PersonCard 
          v-if="selectedContact" 
          :isACOR="isACOR"
          :selectedContact.sync="selectedContact"
        />
      </div>

      <a 
        id="ContactFormToggle"
        v-show="!selectedContact"
        role="button" 
        class="expandable-content-opener"
        :class="showContactForm ? 'open' : 'closed'"
        tabindex="0"
        @click="toggleContactForm"
      >
        Manually enter your {{ corOrAcor() }}’s contact information
      </a>

      <ContactInfoForm :isACOR="isACOR" v-show="showContactForm && !selectedContact"/>
      
      <section id="AccessRadioButtons" v-show="selectedContact || showContactForm">
        <hr />
        <ATATRadioGroup
          legend="Does this individual need access to help you create this acquisition package in ATAT?"
          id="AccessToEdit"
          :items="accessToEditOptions"
          :value.sync="selectedAccessToEdit"
        />
      </section>

    </div>
</template>
<script lang="ts">
import Vue from "vue";

import {Component, Prop} from "vue-property-decorator";

import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ContactInfoForm from "./ContactInfoForm.vue";
import Intro from "./Intro.vue";
import PersonCard from "./PersonCard.vue";

import { RadioButton } from "../../../../types/Global";

@Component({
  components: {
    ATATAutoComplete,
    ATATRadioGroup,
    ContactInfoForm,
    Intro,
    PersonCard,
  }
})

export default class COR_ACOR extends Vue {
  @Prop({default: false}) private isACOR!: boolean;

  private corOrAcor(): string {
    return this.isACOR ? "ACOR" : "COR";
  }

  private showContactForm = false;
  private toggleContactForm(): void {
    this.showContactForm = !this.showContactForm;
  }

  private selectedAccessToEdit = "";
  private accessToEditOptions: RadioButton[] = [
    {
      id: "AccessToEdit_Yes",
      label: "Yes. I would like to invite this individual to edit my acquisition.",
      value: "yes",
    },
    {
      id: "AccessToEdit_No",
      label: "No",
      value: "no",
    },
  ];

  private selectedContact = null;
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
      Phone: "444-444-4444",
      OrgName: "HQ567 - Other Organization Name"
    },
  ];

  private noAutoCompleteResultsAction(): void {
    this.showContactForm = true;
  }

}
</script>

