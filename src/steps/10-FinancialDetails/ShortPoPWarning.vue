<template>
  <div class="mb-7">
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Based on your period of performance, this effort does not qualify for an incremental
            funding plan.
          </h1>

          <ATATAlert
            id="PoP<9Months"
            :showIcon="false"
            class="copy-max-width my-10"
            type="callout"
          >
            <template v-slot:content>
              <h2>Why can’t I request to incrementally fund my task order?</h2>
              <p class="mt-2">
                An incremental funding plan provides the contracting office with assurance that
                funds have been budgeted and will be available to fully fund all non-optional
                services on a projected schedule.
              </p>
              <p class="mt-2">
                To incrementally fund a task order, the period of performance must be at least 9
                months. Based on what you previously told us, this contracting effort requires a
                [X-month] base period.
              </p>
              <p class="mt-2 mb-0">
                If you would like to request incremental funding, please revisit the Contract
                Details section to
                <router-link
                  id="LinkToPoP"
                  :to="{name: routeNames.PeriodOfPerformance}"
                >
                  update your period of performance.
                </router-link>
              </p>
            </template>
          </ATATAlert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { routeNames } from "../../router/stepper";

import { Component } from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert
  }
})

export default class ShortPoPWarning extends Vue {
  private routeNames = routeNames;

}
</script>
