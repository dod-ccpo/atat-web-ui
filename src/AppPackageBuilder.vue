<template>
  <div  style="overflow: hidden;">
    <ATATSideStepper v-if="!hideSideNavigation && !hideNavigation"
      ref="sideStepper" :stepperData="stepperData" />

    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>

    <ATATToast />

    <ATATPageHead />

    <v-main>
      <div id="app-content" class="d-flex flex-column">
        <div  class="mb-auto">
          <router-view></router-view>
        </div>

        <ATATStepperNavigation
          v-if="!hideNavigation"
          @next="navigate('next')"
          @previous="navigate('previous')"
          @additionalButtonClick="additionalButtonClick"
          @takeAltContinueAction="takeAltContinueAction"
          :additionalButtons="additionalButtons"
          :backButtonText="backButtonText"
          :continueButtonText="continueButtonText"
          :altContinueAction="altContinueAction"
          :hideContinueButton="hideContinueButton"
          :disableContinue="disableContinueButton"
          :noPrevious="noPrevious"
          class="mb-8"
          :class="[currentRouteName === routeNames.DAPPSChecklist? 'mx-auto':'']"
        />

        <ATATFooter
          :class="[currentRouteName === routeNames.DAPPSChecklist? 'mx-auto':'']"
        />

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

import { buildStepperData, routeNames, stepperRoutes } from "./router/stepper";
import actionHandler from "./action-handlers/index";
import AppSections from "./store/appSections";
import AcquisitionPackage from "@/store/acquisitionPackage";
import DescriptionOfWork from "./store/descriptionOfWork";
import { Route } from "vue-router";
import steps from "@/store/steps";

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

  public routeNames: Record<string, string> = {};

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent || undefined;
  };

  private stepperData = buildStepperData();
  private additionalButtons: AdditionalButton[] = [];
  private noPrevious = false;
  private backButtonText = "Back";
  private continueButtonText = "Continue";
  private altContinueAction = "";
  private altBackDestination = "";
  private hideContinueButton = false;
  private disableContinueButton = false;
  private hideNavigation = false;
  private hideSideNavigation = false;
  private firstTimeVisit = false

  async mounted(): Promise<void> {
    await Steps.setSteps(stepperRoutes);
    this.hideNavigation = AcquisitionPackage.hideNavigation;
    this.hideSideNavigation = AcquisitionPackage.hideSideNavigation;
    this.routeNames = routeNames;
    this.firstTimeVisit = AcquisitionPackage.firstTimeVisit
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
  async onRouteChanged(newVal: Route, oldVal: Route): Promise<void> {
    if (oldVal.name !== "routeResolver") {
      await Steps.setPrevStepName(oldVal.name as string);
    }

    const routeName = this.$route.name;
    const step = await Steps.findRoute(routeName || "");
    if (routeName && step) {
      const { stepName, stepNumber } = step;
      Steps.setCurrentStep(stepName);
      this.setNavButtons(step);
      if(!AcquisitionPackage.hideSideNavigation && !AcquisitionPackage.hideNavigation){
        this.$refs.sideStepper.setCurrentStep(stepNumber);
      }
      SlideoutPanel.closeSlideoutPanel();
    }
  }

  async navigate(direction: string): Promise<void> {
    const nextStepName = direction === "next" 
      ? await Steps.getNext() 
      : await Steps.getPrevious();
    if (nextStepName) {
      if(nextStepName === 'DAPPSChecklist'){
        if(AcquisitionPackage.firstTimeVisit){
          await this.$router.push({name: nextStepName as string, params: {direction}});
          return
        }else {
          const activeSection = steps.altBackDestination === "Home"? AppSections.sectionTitles.Home
            :AppSections.sectionTitles.Packages
          await Steps.setAltBackDestination("");
          await this.$router.push({name: "home", params: {direction}})
          AppSections.changeActiveSection(activeSection);
          return
        }
      }
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

      Steps.setAltBackDestination("");   
      this.$router.push({ name: nextStepName as string, params: { direction } });

    } else if (direction === "previous" && this.altBackDestination) { 
      if (this.$route.name === this.routeNames.DAPPSChecklist && this.firstTimeVisit
      || this.$route.name === this.routeNames.ContractingShop && !this.firstTimeVisit) {
        await Steps.setAltBackDestination("");
        switch (this.altBackDestination) {
        case AppSections.sectionTitles.Home: {
          await this.$router.push({name: "home", params: {direction}})
          AppSections.changeActiveSection(AppSections.sectionTitles.Home);
          break;
        }
        case AppSections.sectionTitles.Packages: {
          await this.$router.push({name: "home", params: {direction}})
          AppSections.changeActiveSection(AppSections.sectionTitles.Packages);
          break;
        }
        }

      }
    }
  }
  public get currentRouteName():string|null|undefined{
    return this.$route.name
  }

  public get isDitcoUser(): boolean {
    return AcquisitionPackage.contractingShop === "DITCO"
  }
  public get disableContinue(): boolean {
    return AcquisitionPackage.disableContinue
  }
  public get hideNav(): boolean {
    return AcquisitionPackage.hideNavigation
  }
  public get hideSideNav(): boolean {
    return AcquisitionPackage.hideSideNavigation
  }

  @Watch('disableContinue')
  public disableContinueChanged(newVal:boolean): void {
    this.disableContinueButton = newVal
  }
  @Watch('hideNav')
  public hideNavigationChanged(newVal:boolean): void {
    this.hideNavigation = newVal
  }
  @Watch('hideSideNav')
  public hideSideNavigationChanged(newVal:boolean): void {
    this.hideSideNavigation = newVal
  }
  private setNavButtons(step: StepInfo): void {
    this.altBackDestination = Steps.altBackDestination;
    this.noPrevious = !step.prev && !this.altBackDestination;
    this.backButtonText = step.backButtonText || "Back";
    this.continueButtonText = step.continueButtonText || "Continue";
    this.altContinueAction = step.altContinueAction || "";
    if (step.stepName === routeNames.DOWSummary) {
      this.continueButtonText = DescriptionOfWork.currentDOWSection === "XaaS"
        ? "Wrap up XaaS requirements" : "Wrap up Cloud Support Package";
    }
    if (step.additionalButtons) {
      this.additionalButtons = step?.additionalButtons;
    }
    this.hideContinueButton = 
      step.stepName === routeNames.GeneratingPackageDocuments && !this.isDitcoUser 
      || step.stepName === routeNames.ReadyToSubmit && AcquisitionPackage.currentUserIsContributor;
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

  private async takeAltContinueAction() {
    if (this.altContinueAction) {
      await actionHandler(this.altContinueAction, []);
    }
  }
    
}
</script>
