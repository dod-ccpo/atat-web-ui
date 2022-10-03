<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          To accurately complete your price estimate, you need to revisit the
          Contract Details and Performance Requirements sections
        </h1>
        <ATATAlert
          type="callout"
          :showIcon="false"
          class="pa-6"
          calloutBackground="primary-lighter"
        >
          <template v-slot:content>
            <h2 class="mb-2">What do I need to do?</h2>
            <p class="mb-5">
              In this section, we’ll walk you through generating an Independent
              Government Cost Estimate (IGCE) for the cloud resources, services,
              and/or support packages needed for this project. In order to
              gather pricing estimates, we need to know about your unique
              requirements first.
            </p>
            <p class="mb-2">
              In order to start the Requirements Cost Estimate section, you need
              to:
            </p>
            <ul class="mb-2">
              <li class="mb-2">
                <a href="/#/period-of-performance/period-of-performance">
                  Complete your period of performance
                </a>
              </li>
              <li v-show="isPopIncomplete">
                <a href="/#/performance-requirements/">
                  Complete your performance requirements
                </a>
              </li>
            </ul>
          </template>
        </ATATAlert>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import ATATAlert from "@/components/ATATAlert.vue";
import Periods from "@/store/periods";
import DescriptionOfWork from "@/store/descriptionOfWork";

import { Component } from "vue-property-decorator";
@Component({
  components: {
    ATATAlert,
  },
})
export default class CannotProceed extends Vue {
  public isPopIncomplete = true;
  public isPerformanceReqsIncomplete = true;

  public async mounted(): Promise<void> {
    this.isPopIncomplete = 
      Periods.periods && Periods.periods.length>0 ? false : true;
    // DescriptionOfWork.LoadServiceOfferingGroups()
  }

}
</script>

