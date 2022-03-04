
<template>
  <v-flex>
    <div v-if="isCOR" id="CORHeader"></div>
    <div v-else id="ACORHeader"></div>
    <SearchBar />
    <ContactInfoForm :isCOR="isCOR" />
    <PersonCard :isCOR="isCOR" />
    <AccessRadioButtons />
  </v-flex>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import AccessRadioButtons from "AccessRadioButtons.vue";
import ContactInfoForm from "ContactInfoForms.vue";
import PersonCard from "PersonCard.vue";
import SearchBar from "SearchBar.vue";

@Component({
  components: {
    AccessRadioButtons,
    ContactInfoForm,
    PersonCard,
    SearchBar
  }
})
export default class COR_ACOR extends Vue {
  @Prop({default: true}) private isCOR!: boolean;
}
</script>

