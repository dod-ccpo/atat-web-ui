<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 v-if="isPoPIncomplete && isPerformanceReqsIncomplete" class="page-header mb-3">
          To accurately complete your price estimate, you need to revisit the
          Contract Details and Performance Requirements sections
        </h1>
         <h1 v-else-if="isPerformanceReqsIncomplete" class="page-header mb-3">
          To accurately complete your cost estimate, you need to revisit the 
          Performance Requirements sections
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
            <p>
              In order to start the Requirements Cost Estimate section, you need
              to:
            <ul class="_atat-ul">
              <li v-show="isPoPIncomplete" class="my-2">
                <router-link 
                    id="CompletePOP"
                    :to="{ name: routeNames.PeriodOfPerformance }"
                  >
                  Complete your period of performance
                  </router-link>
              </li>
              <li v-show="isPerformanceReqsIncomplete">
                  <router-link 
                    id="CompletePeformanceReqs"
                    :to="{ name: routeNames.RequirementCategories }"
                  >
                  Complete your performance requirements
                  </router-link>
               
              </li>
            </ul>
             </p>
          </template>
        </ATATAlert>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import ATATAlert from "@/components/ATATAlert.vue";
import { isStepComplete, isSubStepComplete,  } from "@/store/summary";
import { routeNames } from "../../../router/stepper"

import { Component, Vue, toNative } from "vue-facing-decorator";
@Component({
  components: {
    ATATAlert,
  },
})
class CannotProceed extends Vue {
  public routeNames = routeNames;
  get isPoPIncomplete(): boolean {
    return !isSubStepComplete(3,1) 
  }

  get isPerformanceReqsIncomplete(): boolean {
    return !isStepComplete(5)
  }
}

export default toNative(CannotProceed)
</script>

