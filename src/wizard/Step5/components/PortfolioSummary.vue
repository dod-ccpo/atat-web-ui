<template>
  <v-container fluid class="my-9">
    <v-row>
      <v-col cols="12">
        <h2 class="h2">Let’s wrap up your Portfolio</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <p class="">
          In this last step, we will review the information that you provided to
          make sure everything is complete and accurate. Once you have verified
          your Portfolio details, we will be able to provision your cloud
          resources.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <summary-stepper></summary-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import SummaryStepper from "./SummaryStepper.vue";

@Component({
  components: {
    SummaryStepper,
  },
})
export default class PortfolioSummary extends Vue {}
</script>
