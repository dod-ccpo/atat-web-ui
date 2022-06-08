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
        </div>
        <div class="container-max-width">
          <DOWAlert
            v-show="showAlert"
            :isPeriodsDataMissing="isPeriodsDataMissing"
            :isClassificationDataMissing="isClassificationDataMissing"
            summaryPage=true
          />
        </div>
        <div class="copy-max-width" v-for="(item) in this.DOWObject"
              :key="item.serviceOfferingGroupId">
          <div class=" d-flex justify-space-between">
            <div>
              <h5>
                {{item.serviceOfferingGroupId}}
              </h5>
              <p class="mb-0" v-for="(service) in item.serviceOfferings" :key="service.name">
                {{service.name}}
              </p>
            </div>
            <div class="d-flex">
              <div class="d-flex align-start mt-1">
                <v-icon
                  class="icon-20 text-warning-dark2 pr-2"
                >warning</v-icon>
                <p class="mb-0 pr-4">Missing info</p>
              </div>
              <v-btn
              class="primary">
                Review
              </v-btn>
            </div>
          </div>
          <hr />
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
import DOWAlert from "@/steps/05-PerformanceRequirements/DOW/DOWAlert.vue";
import { DescriptionOfWorkStore } from "@/store/descriptionOfWork";


@Component({
  components: {
    ATATAlert,
    DOWAlert,

  }
})
export default class Summary extends Vue {
  private isPeriodsDataMissing = false
  private isClassificationDataMissing = false
  private showAlert = false
  private routeNames = routeNames
  private DOWObject = []

  public async loadOnEnter(): Promise<void> {
    const periods = await Periods.loadPeriods();
    const classifications = await classificationRequirements.getSelectedClassificationLevels()
    if (periods && periods.length <= 0) {
      this.showAlert = true
      this.isPeriodsDataMissing = true
    };
    if (classifications && classifications.length <= 0) {
      this.showAlert = true
      this.isClassificationDataMissing = true
    };
    this.DOWObject = DescriptionOfWorkStore.state.DOWObject
  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  };
}
</script>

