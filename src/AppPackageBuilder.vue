<template>
  <div  style="overflow: hidden;">
    <ATATSideStepper ref="sideStepper" :stepperData="stepperData" />

    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>

    <ATATToast />

    <ATATPageHead :headline="projectTitle" />

    <v-main>
      <div id="app-content" class="d-flex flex-column">
        <div  class="mb-auto">
          <router-view></router-view>
        </div>

        <ATATStepperNavigation
          @next="navigate('next')"
          @previous="navigate('previous')"
          @additionalButtonClick="additionalButtonClick"
          :additionalButtons="additionalButtons"
          :backButtonText="backButtonText"
          :continueButtonText="continueButtonText"
          :noPrevious="noPrevious"
          class="mb-8"
        />

        <ATATFooter/>

      </div>
    </v-main>
  </div>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATFooter from "./components/ATATFooter.vue";
import ATATPageHead from "./components/ATATPageHead.vue";
import ATATSideStepper from "./components/ATATSideStepper.vue";
import ATATSlideoutPanel from "./components/ATATSlideoutPanel.vue";
import ATATStepperNavigation from "./components/ATATStepperNavigation.vue";
import ATATToast from "./components/ATATToast.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import SlideoutPanel from "@/store/slideoutPanel/index";
import Steps from "@/store/steps";

import {
  AdditionalButton,
  StepInfo,
  StepPathResolver,
  StepRouteResolver,
} from "@/store/steps/types";

import {
  isRouteResolver,
  isPathResolver
} from "@/store/steps/helpers";

import { buildStepperData } from "./router/stepper";
import actionHandler from "./action-handlers/index";

@Component({
  components: {
    ATATFooter,
    ATATPageHead,
    ATATSideStepper,
    ATATSlideoutPanel,
    ATATStepperNavigation,
    ATATToast,
  },
})

export default class AppPackageBuilder extends Vue {
  $refs!: {
    sideStepper: ATATSideStepper;
  };

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent || undefined;
  };

  private stepperData = buildStepperData();
  private additionalButtons: AdditionalButton[] = [];
  private noPrevious = false;
  private backButtonText = "Back";
  private continueButtonText = "Continue";

  async mounted(): Promise<void> {
    //get first step and intitialize store to first step;
    const routeName = this.$route.name;
    const step = await Steps.findRoute(routeName || "");
    if (routeName && step) {
      const { stepName } = step;
      Steps.setCurrentStep(stepName);
      this.setNavButtons(step);
    }
  }

  @Watch("$route")
  async onRouteChanged(): Promise<void> {
    const routeName = this.$route.name;
    const step = await Steps.findRoute(routeName || "");

    if (routeName && step) {
      const { stepName, stepNumber } = step;
      Steps.setCurrentStep(stepName);
      this.setNavButtons(step);
      this.$refs.sideStepper.setCurrentStep(stepNumber);

      SlideoutPanel.closeSlideoutPanel();
    }
  }

  async navigate(direction: string): Promise<void> {
    const nextStepName = direction === "next" 
      ? await Steps.getNext() 
      : await Steps.getPrevious();

    if (nextStepName) {
      if (isRouteResolver(nextStepName)) {
        const routeResolver = nextStepName as StepRouteResolver;
        this.$router.push({
          name: "routeResolver",
          params: {
            resolver: routeResolver.name,
            direction
          },
        });

        return ;
      }

      if (isPathResolver(nextStepName)) {
        const pathResolver = nextStepName as StepPathResolver;
        this.$router.push({
          name: "pathResolver",
          params: {
            resolver: pathResolver.name,
            direction
          },
        });

        return ;
      }
    
      this.$router.push({ name: nextStepName as string });
    }
  }

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }

  private setNavButtons(step: StepInfo): void {
    this.noPrevious = false;
    this.backButtonText = step.backButtonText || "Back";
    this.continueButtonText = step.continueButtonText || "Continue";
    if (step.additionalButtons) {
      this.additionalButtons = step?.additionalButtons;
    }
  }

  private async additionalButtonClick(button: AdditionalButton) {
    if (button.emitText) {
      this.$emit("AdditionalButtonClicked", button.emitText);
    }

    if (button.actionName) {
      const actionArgs = button.actionArgs || [];
      await actionHandler(button.actionName, actionArgs);
    }

    if (button.name) {
      this.$router.push({ name: button.name });
    }
  }
}
</script>
