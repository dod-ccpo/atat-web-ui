<template>
  <v-app>
    <ATATSideStepper />
    <v-main id="app">
      <router-view></router-view>
      <ATATStepperNavigation />
      <ATATFooter />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import Vue from "vue";
import {stepsStore} from "@/store/steps";

import ATATSideStepper from "./components/ATATSideStepper.vue";
import ATATStepperNavigation from "./components/ATATStepperNavigation.vue";
import ATATFooter from "./components/ATATFooter.vue";
import { Component } from "vue-property-decorator";
import { StepInfo } from "./store/steps/types";

@Component({
  components: {
    ATATSideStepper,
    ATATStepperNavigation,
    ATATFooter,
  },
})
export default class App extends Vue {

  mounted(): void {
    const firstStep = this.$store.state.steps.steps as StepInfo;
    stepsStore.setCurrentStep({
      stepNumber: firstStep.stepNumber,
      stepName: firstStep.stepName
    });

  }
}
</script>
