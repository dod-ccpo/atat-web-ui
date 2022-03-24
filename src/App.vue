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
import Steps from "@/store/steps";

import ATATSideStepper from "./components/ATATSideStepper.vue";
import ATATStepperNavigation from "./components/ATATStepperNavigation.vue";
import ATATFooter from "./components/ATATFooter.vue";
import ATATPageHead from "./components/ATATPageHead.vue"
import {Component, Watch} from "vue-property-decorator";
import {buildStepperData} from "./router/stepper";
import actionHandler from "./action-handlers/index"
import { AdditionalButton, StepInfo } from "@/store/steps/types";

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

  private additionalButtons: AdditionalButton[] = [];

  private stepperData = buildStepperData();

  async mounted(): Promise<void> {
    //get first step and intitialize store to first step;
    const routeName = this.$route.name;
    const step = await Steps.findRoute(routeName || "");
    if (routeName && step) {
      const {stepName} = step;
      Steps.setCurrentStep(stepName);
      // this.additionalButtons = Steps.getAdditionalButtons(step)
      this.getAdditionalButtons(step);
    }
  }

  @Watch("$route")
  async onRouteChanged(): Promise<void> {
    const routeName = this.$route.name;
    const step = await Steps.findRoute(routeName || "");

    if (routeName && step) {
      const {stepName, stepNumber} = step;
      Steps.setCurrentStep(stepName);
      this.getAdditionalButtons(step);
      this.$refs.sideStepper.setCurrentStep(stepNumber);
    }
  }

  private async additionalButtonClick(button: AdditionalButton) {
    console.log(button);
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

  private getAdditionalButtons(step: StepInfo): void {
    if (step?.additionalButtons) {
      this.additionalButtons = step?.additionalButtons;
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
}
</script>
