<template>
  <v-app>
    <ATATSideStepper ref="sideStepper" />
    <v-main id="app">
      <router-view></router-view>
      <ATATStepperNavigation @next="navigate('next')" @previous="navigate('previous')" />
      <ATATFooter />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import Vue from "vue";
import Steps from "@/store/steps";

import ATATSideStepper from "./components/ATATSideStepper.vue";
import ATATStepperNavigation from "./components/ATATStepperNavigation.vue";
import ATATFooter from "./components/ATATFooter.vue";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    ATATSideStepper,
    ATATStepperNavigation,
    ATATFooter,
  },
})
export default class App extends Vue {

   $refs!: {
    sideStepper: ATATSideStepper;
  };

  async mounted(): Promise<void> {
    //get first step and intitialize store to first step;
    const routeName = this.$route.name;
    const step = await Steps.findRoute(routeName || "");

    if (routeName && step) {
      const { stepName} = step;
      Steps.setCurrentStep(stepName);
    }
  }

  async navigate(direction: string): Promise<void> {
    const navStep =
      direction === "next" ? Steps.currentStep?.next : Steps.currentStep?.prev;

    const step = await Steps.findRoute(navStep || '');

    if (step) {
      const {stepNumber, stepName} = step;
      this.$router.push({ name: navStep}).then(
        () => {
          Steps.setCurrentStep(stepName)
          this.$refs.sideStepper.setCurrentStep(stepNumber)
        },
        (reason) => {
          console.log(reason);
        }
      );
    }
  }
}
</script>
