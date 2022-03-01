<template>
  <div class="mb-7">
    <v-container>
      <v-row>
        <v-col class="col-12">
          <h2>Tell us more about the scope of your project</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <ATATAlert type="info" :showIcon="false" class="content-max-width">
            <template v-slot:content>
              <h3>Surge Capabilities</h3>
              <p class="mt-2">
                The Government may require surge capabilities during the base or
                any option period, and surge modifications will be within the
                scope of the contract for the defined task areas in the
                description of work.
                <br/><br/>
                Surge capabilities over the life of the task
                order cannot exceed between 1-50% of the contractor’s total
                proposed price for the base and all option periods, excluding any
                six-month extension of services pursuant to Federal Acquisition
                Regulation (FAR) 52.217-8.
              </p>
            </template>
          </ATATAlert>
          <p>
            If surge capabilities are required, what percentage of the contractor’s total proposed price will not be exceeded?
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import ATATAlert from "../components/ATATAlert.vue";
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    ATATAlert,
  },
})
export default class StepOne extends Vue {}
</script>

