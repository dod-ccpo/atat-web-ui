<template>
  <v-container fluid class="container-max-width">
    <h1 id="CORHeader">Let’s gather info about your Contracting Officer’s Representative (COR)</h1>
    <p class="body pt-3 pb-0 mb-0">Your COR is an important part of your acquisition approval process. We will fill out your COR’s
      contact
      information on any necessary forms and will send your COR an email when documents are ready to be signed. Search
      for your COR below or manually enter their contact information. For more guidance about CORs, visit
      https://www.ditco.disa.mil/hq/cor/index.asp.</p>
    <common :isCOR=true :isACOR=false />
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import {Component} from "vue-property-decorator";
import Common from "./Common.vue";

@Component({
  components: {
    Common,
  }
})
export default class CorInfo extends Vue {


}
</script>
