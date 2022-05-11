
<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">Upload your MIPR</h1>
        <ATATFileUpload
          :validFileFormats="['xlsx', 'xls', 'pdf']"
          id="FundingPlan"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATFileUpload from "../../components/ATATFileUpload.vue";

@Component({
  components: {
    ATATFileUpload,
  },
})
export default class FundingPlan extends Vue {}
</script>

