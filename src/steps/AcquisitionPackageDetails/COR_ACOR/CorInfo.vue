<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header" id="CORHeader">
          Let’s gather info about your Contracting Officer’s Representative (COR)
        </h1>
        <p class="page-intro">
          Your COR is an important part of your acquisition
          approval process. We will fill out your COR’s contact information on any necessary forms
          and will send your COR an email when documents are ready to be signed. Search for your COR
          below or manually enter their contact information. For more guidance about CORs, visit
          <a href="https://www.ditco.disa.mil/hq/cor/index.asp" class="external-link" target="_blank">
            https://www.ditco.disa.mil/hq/cor/index.asp.
          </a>
        </p>
        <common :isCOR="true" />
      </v-col>
    </v-row>
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
  private isCOR = true;

}
</script>
