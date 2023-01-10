<template>
  <div  style="overflow: hidden;">
    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>
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
          :hideContinueButton="hideContinueButton"
          :noPrevious="noPrevious"
          class="mb-8"
        />
         <ATATFooter/>
      </div>
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATStepperNavigation from "@/components/ATATStepperNavigation.vue";
import ATATFooter from "@/components/ATATFooter.vue";
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

import actionHandler from "@/action-handlers/index";
import AppSections from "@/store/appSections";
import {
  buildProvisionWorkflowRouterData, 
  provisionWorkFlowRoutes, 
  provWorkflowRouteNames } from "@/router/provisionWorkflow";
import { StepperStep } from "types/Global";

@Component({
  components: {
    ATATSlideoutPanel,
    ATATStepperNavigation,
    ATATFooter
  },
})

export default class ProvisionWorkflow extends Vue {
 
  public routeNames: Record<string, string> = {};

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent || undefined;
  };

  private stepperData:StepperStep[] = []; 
  private additionalButtons: AdditionalButton[] = [];
  private noPrevious = false;
  private backButtonText = "Back";
  private continueButtonText = "Continue";
  private altBackDestination = "";
  private hideContinueButton = false;

  async mounted(): Promise<void> {
    this.stepperData = await buildProvisionWorkflowRouterData();
    await Steps.setSteps(provisionWorkFlowRoutes);
    
    this.routeNames = provWorkflowRouteNames;
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

      Steps.setAltBackDestination("");   
      this.$router.push({ name: nextStepName as string, params: { direction } });

    } else if (direction === "previous" && this.altBackDestination) { 

      if (this.$route.name === this.routeNames.ProjectOverview) {
        Steps.setAltBackDestination("");

        switch (this.altBackDestination) {
        case AppSections.sectionTitles.Home: {
          this.$router.push({name: "home", params: { direction } })
          AppSections.changeActiveSection(AppSections.sectionTitles.Home);
          break;
        }
        case AppSections.sectionTitles.Packages: {
          this.$router.push({name: "home", params: { direction } })
          AppSections.changeActiveSection(AppSections.sectionTitles.Packages);
          break;
        }
        }

      }
    }
  }

  private setNavButtons(step: StepInfo): void {
    this.altBackDestination = Steps.altBackDestination;
    this.noPrevious = !step.prev && !this.altBackDestination;
    this.backButtonText = step.backButtonText || "Back";
    this.continueButtonText = step.continueButtonText || "Continue";
    if (step.additionalButtons) {
      this.additionalButtons = step?.additionalButtons;
    }
    //this.hideContinueButton = step.stepName === routeNames.GeneratingPackageDocuments;
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
