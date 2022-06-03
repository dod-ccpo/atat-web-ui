<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Your Performance Requirements
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            We need some more details for this section. You can add info now, or come back to make
            edits at any time. When you are ready to wrap up this section, we will move on to
            government furnished equipment.
          </p>
          <ATATAlert
            id="CategoryPageAlert"
            v-show="showAlert === true"
            type="warning"
            class="copy-max-width mb-10"
          >
            <template v-slot:content>
              <div v-if="isClassificationDataMissing && isPeriodsDataMissing">
                <h3>Your period of performance and classification requirements are missing.</h3>
                <p class="mt-2 mb-0" id="AlertInfo">
                  You can continue to add cloud resources and support packages, but we won’t be
                  able to gather details about your unique requirements until we have this missing
                  info. We recommend
                  <router-link
                    id="Step5Link"
                    :to="{name: routeNames.PeriodOfPerformance}"
                  >revisiting the Contract Details section
                  </router-link>
                  before proceeding.
                </p>
              </div>
            </template>
          </ATATAlert>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { routeNames } from "../../../router/stepper"
import { Component } from "vue-property-decorator";
import Periods from "@/store/periods";
import classificationRequirements from "@/store/classificationRequirements";
import ATATAlert from "@/components/ATATAlert.vue";
import { SlideoutPanelContent } from "../../../../types/Global";
import PerfReqLearnMore from "@/steps/05-PerformanceRequirements/DOW/PerfReqLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel";

@Component({
  components: {
    ATATAlert,
  }
})
export default class Summary extends Vue {
  private isPeriodsDataMissing = false
  private isClassificationDataMissing = false
  private showAlert = false
  private routeNames = routeNames

  public async loadOnEnter(): Promise<void> {
    const periods = await Periods.loadPeriods();
    const classifications = await classificationRequirements.getSelectedClassificationLevels()
    if (periods && periods.length <= 0 && classifications && classifications.length <= 0) {
      this.showAlert = true
      this.isPeriodsDataMissing = true
      this.isClassificationDataMissing = true
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>

