<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Your Procurement History
          </h1>
          <div class="copy-max-width">
            <p class="mb-8">
              If you have more past contracts for this effort, add them below. 
              You can also edit or delete any information from the contracts that you have 
              already entered. When you’re done, click “Continue” and we will move on to your 
              current environment details.
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component } from "vue-property-decorator";
import Vue from "vue";

@Component({})
export default class ProcurementHistorySummary extends Vue {

  public currentContractExists = "";
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    console.log('delete me')
  }

  

}
</script>
