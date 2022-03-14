<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header">
          Let’s gather info about your ACOR
        </h1>
        <p class="page-intro">
          Your ACOR’s information will be used to fill out any forms in your 
          acquisition package. We will send this individual an email if their 
          signature is required on any documents. Search for your ACOR below or 
          manually enter their contact information. For more guidance about 
          CORs, visit 
          <a href="https://www.ditco.disa.mil/hq/cor/index.asp" class="text-link" target="_blank">
            https://www.ditco.disa.mil/hq/cor/index.asp<span class="external-link">.</span>
          </a>
        </p>

        <common :isACOR="true" />

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import Common from "./Common.vue";

@Component({
  components: {
    Common,
  }
})

export default class CorInfo extends Vue {}

</script>
