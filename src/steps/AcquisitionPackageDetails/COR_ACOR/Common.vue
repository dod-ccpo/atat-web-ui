
<template>
  <v-flex>
    <h1 v-show="isCOR" id="CORHeader">Let’s gather info about your Contracting Officer’s Representative (COR)</h1>
    <h1 v-show="isACOR" id="ACORHeader">Let’s gather info about your ACOR</h1>
    <div id="SearchBar" ></div>
    <ContactInfoForm :isACOR="isACOR" />
    <PersonCard :isACOR="isACOR" />
    <div id="AccessRadioButtons"></div>
  </v-flex>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import ContactInfoForm from "./ContactInfoForm.vue";
import PersonCard from "./PersonCard.vue";

@Component({
  components: {
    ContactInfoForm,
    PersonCard,
  }
})
export default class COR_ACOR extends Vue {
    @Prop({default: false}) private isACOR!: boolean;
    @Prop({default: false}) private isCOR!: boolean;
}
</script>

