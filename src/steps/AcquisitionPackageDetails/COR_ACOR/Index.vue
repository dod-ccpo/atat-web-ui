
<template>
  <v-flex>
    <div v-if="isCOR" id="CORHeader"></div>
    <div v-else id="ACORHeader"></div>
    <div id="SearchBar" ></div>
    <ContactInfoForm :isACOR="isACOR" />
    <PersonCard :isACOR="isACOR" />
    <div id="AccessRadioButtons"></div>

  </v-flex>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ContactInfoForm from "ContactInfoForms.vue";
import PersonCard from "PersonCard.vue";

@Component({
  components: {
    ContactInfoForm,
    PersonCard,
  }
})
export default class COR_ACOR extends Vue {
  private isACOR = false;
}
</script>

