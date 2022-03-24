<template>
  <v-app>
    <ATATSideStepper ref="sideStepper" :stepperData="stepperData"/>
    <ATATPageHead :headline="projectTitle"/>
    <v-main id="app">
      <router-view></router-view>
      <ATATStepperNavigation @next="navigate('next')" @previous="navigate('previous')"/>
      <ATATFooter/>
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
import ATATPageHead from "./components/ATATPageHead.vue"
import {Component, Watch} from "vue-property-decorator";
import {buildStepperData} from "./router/stepper";

import AcquisitionPackage from "@/store/acquisitionPackage";


@Component({
  components: {
    ATATSideStepper,
    ATATStepperNavigation,
    ATATFooter,
    ATATPageHead
  }
})
export default class App extends Vue {
  $refs!: {
    sideStepper: ATATSideStepper;
  };

  private stepperData = buildStepperData();

  async mounted(): Promise<void> {
    //get first step and intitialize store to first step;
    const routeName = this.$route.name;
    const step = await Steps.findRoute(routeName || "");

    if (routeName && step) {
      const {stepName} = step;
      Steps.setCurrentStep(stepName);
    }
    await AcquisitionPackage.initialize();
  }

  @Watch("$route")
  async onRouteChanged(): Promise<void> {
    const routeName = this.$route.name;
    const step = await Steps.findRoute(routeName || "");

    if (routeName && step) {
      const {stepName, stepNumber} = step;
      Steps.setCurrentStep(stepName);
      this.$refs.sideStepper.setCurrentStep(stepNumber);
    }
  }

  async navigate(direction: string): Promise<void> {
    const nextStepName =
      direction === "next" ? await Steps.getNext() :
        await Steps.getPrevious();

    if (nextStepName) {
      this.$router.push({name: nextStepName});
    }
  }

  getCurrentStepMenuText(): string | undefined {
    let label = Steps.currentStep?.stepLabel;
    // temporarily transform the 'project overview' and 'project scope'
    // titles to 'demo package'
    let demoPackage = ["project overview", "project scope"];

    if (demoPackage.some((dp) => dp === (label && label.toLowerCase()))) {
      label = "Demo Package";
    }

    return label;
  }

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }
}
</script>
