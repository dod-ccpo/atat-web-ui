<template>
  <ATATAlert
    id="CategoryPageAlert"
    class="mb-10"
    type="warning"
  >
    <template v-slot:content>
      <div v-if="isPeriodsDataMissing || isClassificationDataMissing">
        <h3 class="h3">Your
          <span v-if="isOnlyPoPyMissing">
            period of performance is
          </span>
          <span v-else-if="isOnlyClassificationMissing">
            classification requirements are
          </span>
          <span v-else-if="isPoPAndClassificationMissing">
            period of performance and classification requirements are
          </span>
          missing.
        </h3>
        <p id="AlertInfo" class="mt-2 mb-0">
          <span v-if="!summaryPage">
            You can continue to add cloud resources and support packages, but we won't be
            able to gather details about your unique requirements until we have this missing
            info. We recommend
          <span v-if="isOnlyPoPyMissing">
            updating your PoP in the
          </span>
          <span v-else-if="isOnlyClassificationMissing">
            updating your classification requirements in the
          </span>
          <router-link
            id="Step5Link"
            :to="{name: route}"
          >{{ linkText }} Contract Details section</router-link>
          before proceeding.
          </span>
          <span v-if="summaryPage">
            We cannot gather some details about your unique requirements at this time.
            In order to finalize your performance requirements, you need to tell us about your
          <span v-if="isOnlyPoPyMissing">
            PoP in the
          </span>
          <span v-else-if="isOnlyClassificationMissing">
            classification requirements in the
          </span>
          <span v-else-if="isPoPAndClassificationMissing">
            PoP and classification requirements in the
          </span>
          <router-link
            id="Step5Link"
            :to="{name: route}"
          >Contract Details section</router-link>
          first.
            </span>
        </p>
      </div>
    </template>
  </ATATAlert>
</template>

<script lang="ts">
import ATATAlert from "@/components/ATATAlert.vue";
import { Component, Prop } from "vue-property-decorator";

import Vue from "vue";
import { routeNames } from "../../../router/stepper"

@Component({
  components: {
    ATATAlert,
  }
})

export default class DOWAlert extends Vue {
  @Prop({default: false}) private isPeriodsDataMissing?: boolean;
  @Prop({default: false}) private isClassificationDataMissing?: boolean;
  @Prop({default: false}) private summaryPage?: boolean;


  private routeNames = routeNames

  public get isPoPAndClassificationMissing(): boolean {
    if (this.isClassificationDataMissing && this.isPeriodsDataMissing) {
      return this.isClassificationDataMissing && this.isPeriodsDataMissing;
    };
    return false
  };

  public get isOnlyPoPyMissing(): boolean {
    if (!this.isClassificationDataMissing && this.isPeriodsDataMissing) {
      return !this.isClassificationDataMissing && this.isPeriodsDataMissing;
    };
    return false
  };

  public get isOnlyClassificationMissing(): boolean {
    if (this.isClassificationDataMissing && !this.isPeriodsDataMissing) {
      return this.isClassificationDataMissing && !this.isPeriodsDataMissing;
    };
    return false
  };

  public get route(): string {
    return this.isOnlyClassificationMissing
      ? this.routeNames.ClassificationRequirements
      : this.routeNames.PeriodOfPerformance;
  };

  public get linkText(): string {
    return this.isPoPAndClassificationMissing
      ? "revisiting the"
      : "";
  };
};
</script>

