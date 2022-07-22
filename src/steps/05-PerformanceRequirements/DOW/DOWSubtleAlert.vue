<template>
  <p id="SubtleAlertMessage" class="mt-2 mb-10">
    <strong>Your {{ whatsMissing }} missing,</strong> so we {{ modalVerb }} be able 
    to gather all details for your unique requirements at this time. To streamline this 
    process, we recommend
    <router-link
      id="Step4Link"
      :to="{name: route}"
    >revisiting the Contract Details section</router-link>
    before proceeding.
  </p>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";

import Vue from "vue";
import { routeNames } from "../../../router/stepper"

@Component({})

export default class DOWSubtleAlert extends Vue {
  @Prop({default: false}) private isPeriodsDataMissing!: boolean;
  @Prop({default: false}) private isClassificationDataMissing!: boolean;

  private routeNames = routeNames;

  public get isPoPAndClassificationMissing(): boolean {
    return this.isClassificationDataMissing && this.isPeriodsDataMissing;
  };

  public get isOnlyPoPyMissing(): boolean {
    return !this.isClassificationDataMissing && this.isPeriodsDataMissing;
  };

  public get isOnlyClassificationMissing(): boolean {
    return this.isClassificationDataMissing && !this.isPeriodsDataMissing;
  };

  public get whatsMissing(): string {
    return this.isPoPAndClassificationMissing 
      ? "period of performance and classification requirements are"
      : this.isClassificationDataMissing
        ? "classification requirements are"
        : "period of performance is";
  };

  public get modalVerb(): string {
    return this.isOnlyPoPyMissing ? "may not" : "won’t"
  };

  public get route(): string {
    return this.isOnlyClassificationMissing
      ? this.routeNames.ClassificationRequirements
      : this.routeNames.PeriodOfPerformance;
  };

}

</script>
