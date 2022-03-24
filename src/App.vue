<template>
  <v-app>
    <ATATSideStepper ref="sideStepper" :stepperData="stepperData"/>
    <ATATPageHead :headline="projectTitle"/>
    <v-main id="app">
      <router-view></router-view>

      <ATATStepperNavigation 
        @next="navigate('next')" 
        @previous="navigate('previous')"
        @additionalButtonClick="additionalButtonClick"
        :additionalButtons="additionalButtons"
        :backButtonText="backButtonText"
        :noPrevious="noPrevious"
      />

      <ATATFooter/>
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATFooter from "./components/ATATFooter.vue";
import ATATPageHead from "./components/ATATPageHead.vue"
import ATATSideStepper from "./components/ATATSideStepper.vue";
import ATATStepperNavigation from "./components/ATATStepperNavigation.vue";
import Steps from "@/store/steps";

import { buildStepperData } from "./router/stepper";
import actionHandler from "./action-handlers/index"

import AcquisitionPackage from "@/store/acquisitionPackage";
import { AdditionalButton, StepInfo } from "@/store/steps/types";

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
  private additionalButtons: AdditionalButton[] = [];
  private noPrevious = false;
  private backButtonText = "Back";

  async mounted(): Promise<void> {
    //get first step and intitialize store to first step;
    const routeName = this.$route.name;
    const step = await Steps.findRoute(routeName || "");
    if (routeName && step) {
      const {stepName} = step;
      Steps.setCurrentStep(stepName);
      this.setNavButtons(step);
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
      this.setNavButtons(step);
      this.$refs.sideStepper.setCurrentStep(stepNumber);
    }
  }

  async navigate(direction: string): Promise<void> {
    const nextStepName =
      direction === "next" 
        ? await Steps.getNext() 
        : await Steps.getPrevious();

    if (nextStepName) {
      this.$router.push({name: nextStepName});
    }
  }

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }

  private setNavButtons(step: StepInfo): void {
    this.noPrevious = !step.prev;
    this.backButtonText = step.backButtonText || "Back";
    if (step.additionalButtons) {
      this.additionalButtons = step?.additionalButtons;
    }
  }

  private async additionalButtonClick(button: AdditionalButton) {
    if (button.emitText) {
      this.$emit('AdditionalButtonClicked', button.emitText);
    }
    if (button.actionName) {
      const actionArgs = button.actionArgs || [];
      const stepStore = button.stepStore || "";
      await actionHandler(button.actionName, actionArgs, stepStore);
    }

    this.$router.push({name: button.name})
  }


}
</script>
