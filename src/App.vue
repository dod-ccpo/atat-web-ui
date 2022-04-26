<template>
  <v-app  style="overflow: hidden;">
    <ATATSideStepper ref="sideStepper" :stepperData="stepperData" />

    <ATATSlideoutPanel v-if="hasSlideoutPanelComponent">
      <component :is="slideoutPanelComponent"></component>
    </ATATSlideoutPanel>
    <ATATToast />

    <ATATPageHead :headline="projectTitle" />
    <v-main id="app" >
      <div style="overflow: auto;">
        <router-view></router-view>
      </div>
      <ATATStepperNavigation
        @next="navigate('next')"
        @previous="navigate('previous')"
        @additionalButtonClick="additionalButtonClick"
        :additionalButtons="additionalButtons"
        :backButtonText="backButtonText"
        :noPrevious="noPrevious"
      />
      
      <ATATFooter />
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
  StepRouteResolver,
} from "@/store/steps/types";
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
export default class App extends Vue {
  $refs!: {
    sideStepper: ATATSideStepper;
  };

  public slideoutPanelComponent = SlideoutPanel.slideoutPanelComponent;

  public hasSlideoutPanelComponent = false;
  @Watch("slideoutPanelComponent")
  public onSlideoutPanelComponentChange(c: unknown): void {
    this.hasSlideoutPanelComponent = c !== undefined ? true : false;
  }

  private stepperData = buildStepperData();
  private additionalButtons: AdditionalButton[] = [];
  private noPrevious = false;
  private backButtonText = "Back";

  async mounted(): Promise<void> {
    //get first step and intitialize store to first step;
    const routeName = this.$route.name;
    const step = await Steps.findRoute(routeName || "");
    if (routeName && step) {
      const { stepName } = step;
      Steps.setCurrentStep(stepName);
      this.setNavButtons(step);
    }
    await AcquisitionPackage.initialize();

    this.slideoutPanelComponent = SlideoutPanel.slideoutPanelComponent;
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
      this.slideoutPanelComponent = SlideoutPanel.slideoutPanelComponent;
    }
  }

  async navigate(direction: string): Promise<void> {
   
    const nextStepName =
      direction === "next" ? await Steps.getNext() : await Steps.getPrevious();

    if (nextStepName) {
      const isRouteResolver =
        (nextStepName as StepRouteResolver).name !== undefined;
      if (isRouteResolver) {
        const routeResolver = nextStepName as StepRouteResolver;
        this.$router.push({
          name: "resolver",
          params: {
            resolver: routeResolver.name,
          },
        });
      } else {
        this.$router.push({ name: nextStepName as string });
      }
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
      this.$emit("AdditionalButtonClicked", button.emitText);
    }
    if (button.actionName) {
      const actionArgs = button.actionArgs || [];
      await actionHandler(button.actionName, actionArgs);
    }

    this.$router.push({ name: button.name });
  }
}
</script>
