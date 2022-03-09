<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header" id="CORHeader">
          Let’s gather info about your Contracting Officer’s Representative (COR)
        </h1>
        <p class="body pb-0 mb-0 copy-max-width">
          Your COR is an important part of your acquisition
          approval process. We will fill out your COR’s contact information on any necessary forms
          and will send your COR an email when documents are ready to be signed. Search for your COR
          below or manually enter their contact information. For more guidance about CORs, visit
          <a href="https://www.ditco.disa.mil/hq/cor/index.asp" target="_blank">
            https://www.ditco.disa.mil/hq/cor/index.asp
            <span class="external-link">
              website
            </span>
          </a>
          .
        </p>
        <common :isCOR=true :isACOR=false />
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


}
</script>
