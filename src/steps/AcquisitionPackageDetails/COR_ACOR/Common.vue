<template>
  <v-container>
    <v-row>
      <v-col class="col-sm-8 pl-0 pt-10">
        <ATATAutoComplete
          id="TO_COR"
          :label-sr-only="false"
          titleKey="FullName"
          subtitleKey="Email"
          :searchFields="['FullName', 'Email']"
          :selectedItem.sync="selectedContact"
          placeholder="Search by name or email"
          icon="search"
          noResultsText="Manually enter my contact’s information"
          @noAutoCompleteResultsAction="noAutoCompleteResultsAction"
        />
        <expandable-link class="pt-8" aria-id="CORs_Contact">
          <template v-if="isCOR" v-slot:header>
            Manually enter your COR’s contact information
          </template>
          <template v-slot:content>
           form fields
          </template>
        </expandable-link>
      </v-col>
    </v-row>
<!--    <ContactInfoForm :isACOR="isACOR"/>-->
<!--    <PersonCard :isACOR="isACOR"/>-->
<!--    <div id="AccessRadioButtons"></div>-->
  </v-container>
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
  @Prop({default: false}) private isCOR!: boolean;


}
</script>

