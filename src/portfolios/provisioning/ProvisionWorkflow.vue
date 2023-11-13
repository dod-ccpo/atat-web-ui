<template>
  <div style="overflow: hidden;">
    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>
    <v-main class="_center-page-content _provisioning">
      <div id="app-content" class="_app-content d-flex flex-column pt-16">
				<div class="_app-content-wrap">
					<div class="_app-content-padding">

            <div  class="mb-auto _page-content">
              <router-view></router-view>
            </div>

            <ATATStepperNavigation
              v-if="showStepper"
              @next="navigate('next')"
              @previous="navigate('previous')"
              @additionalButtonClick="additionalButtonClick"
              @takeAltContinueAction="takeAltContinueAction"
              :additionalButtons="additionalButtons"
              :backButtonText="backButtonText"
              :continueButtonText="continueButtonText"
              :continueButtonColor="continueButtonColor"
              :altContinueAction="altContinueAction"
              :hideContinueButton="hideContinueButton"
              :disableContinue="disableContinueButton"
              :noPrevious="noPrevious"
              class="mb-8"
            />
            <ATATFooter/>
          </div>
        </div>
      </div>
    </v-main>
    <ATATDialog 
      id="TOConfirmModal"
      :showDialog="showTOConfirmModal"
      title="Add task order to your portfolio?"
      no-click-animation
      width="450"
      @cancelClicked="TOConfirmCancelled"
      cancelButtonId="TOConfirmCancelled"
      okText="Add task order"
      @ok="addTaskorderToPortfolio"
      :OKDisabled="disableOk"
      :showOKSpinner="showOkSpinner"
    >
      <template #content>
        <div class="body">
          <p>
            Upon initiation of this process, ATAT will submit Task Order 
            #{{TONumber}} to <span class="font-weight-bold">{{ csp }}</span> to update funding
            associated with your “{{ portfolioName }}” portfolio. This process cannot be undone.
          </p>
        </div>
      </template>
    </ATATDialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch,  Vue, toNative } from "vue-facing-decorator";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATStepperNavigation from "@/components/ATATStepperNavigation.vue";
import ATATFooter from "@/components/ATATFooter.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import Steps from "@/store/steps";
import ATATDialog from "@/components/ATATDialog.vue";

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
  provWorkflowRouteNames 
} from "@/router/provisionWorkflow";
import AcquisitionPackage from "@/store/acquisitionPackage";
import PortfolioStore from "@/store/portfolio";
import api from "@/api";
import PortfolioSummary from "@/store/portfolioSummary";

@Component({
  components: {
    ATATSlideoutPanel,
    ATATStepperNavigation,
    ATATFooter,
    ATATDialog
  },
})

class ProvisionWorkflow extends Vue {
 
  public routeNames: Record<string, string> = {};
  public portfolioSysId = "";
  public showTOConfirmModal = false;
  public bodyText ="";
  public TONumber = "";
  public csp = "";
  public portfolioName = "";
  public disableOk = false;
  public showOkSpinner = false;

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent || undefined;
  };

  private stepperData = buildProvisionWorkflowRouterData();
  private additionalButtons: AdditionalButton[] = [];
  private noPrevious = false;
  private backButtonText = "Back";
  private continueButtonText = "Continue";
  private continueButtonColor = "";
  private altContinueAction = "";
  private altBackDestination = "";
  private hideContinueButton = false;
  private disableContinueButton = false;

  public get disableContinue(): boolean {
    return AcquisitionPackage.disableContinue;
  }

  @Watch('disableContinue')
  public disableContinueChanged(newVal:boolean): void {
    this.disableContinueButton = newVal
  }  

  async mounted(): Promise<void> {
    Steps.setSteps(provisionWorkFlowRoutes);
    
    this.routeNames = provWorkflowRouteNames;
    //get first step and intitialize store to first step;
    const routeName = this.$route.name as string;
    const step = await Steps.findRoute(routeName || "");
    if (routeName && step) {
      const { stepName } = step;
      Steps.setCurrentStep(stepName);
      this.setNavButtons(step);
    }
  }

  @Watch("$route")
  async onRouteChanged(): Promise<void> {
    const routeName = this.$route.name as string;
    const step = await Steps.findRoute(routeName || "");
    if (routeName && step) {
      const { stepName } = step;
      Steps.setCurrentStep(stepName);
      this.setNavButtons(step);
      SlideoutPanel.closeSlideoutPanel();
    }
  }

  get showStepper(): boolean{
    return !["provisioned", "provisioning_issue"].includes(
      (this.$route.name as string).toLowerCase()
    )
  }

  public async TOConfirmCancelled(): Promise<void> {
    this.showTOConfirmModal = false
  }

  async navigate(direction: string): Promise<void> {
    const nextStepName = direction === "next" 
      ? await Steps.getNext() 
      : await Steps.getPrevious();
    
    const {activeSection} = await AppSections.getSectionData();
    if (nextStepName) {
      const currentPortfolio = PortfolioStore.currentPortfolio;

      if (PortfolioStore.isProvisioningTOFollowOn && activeSection === "ProvisionWorkflow" 
        && direction === "next" && currentPortfolio.sysId !== ""
      ){
        this.TONumber = PortfolioStore.portfolioProvisioningObj.taskOrderNumber as string;
        this.csp = PortfolioStore.portfolioProvisioningObj.cspLong as string;
        this.portfolioName = currentPortfolio.title as string;
        this.showTOConfirmModal = true
        return;
      }
      if (isRouteResolver(nextStepName)) {
        const routeResolver = nextStepName as StepRouteResolver;
        this.$router.push({
          name: "routeResolver",
          query: {
            resolver: routeResolver.name,
            direction
          },
        }).catch(() => console.log("avoiding redundant navigation"));;

        return ;
      }

      if (isPathResolver(nextStepName)) {
        const pathResolver = nextStepName as StepPathResolver;
        this.$router.push({
          name: "pathResolver",
          query: {
            resolver: pathResolver.name,
            direction
          },
        }).catch(() => console.log("avoiding redundant navigation"));;

        return ;
      }

      Steps.setAltBackDestination("");   
      this.$router.push({ name: nextStepName as string, query: { direction } });

    } else if (direction === "previous" && this.altBackDestination) { 
      if (this.$route.name === this.routeNames.AwardedTaskOrder) {
        await this.awardedTaskOrderRoutes(direction)
      }
    }
  }  

  public async awardedTaskOrderRoutes(direction: string){
    Steps.setAltBackDestination("");
    switch (this.altBackDestination) {
    case AppSections.sectionTitles.Home: {
      this.$router.push({name: "home", query: { direction } })
      AppSections.changeActiveSection(AppSections.sectionTitles.Home);
      break;
    }
    case AppSections.sectionTitles.Packages: {
      this.$router.push({name: "home", query: { direction } })
      AppSections.changeActiveSection(AppSections.sectionTitles.Packages);
      break;
    }
    case AppSections.sectionTitles.CreateFirstPortfolio: {
      this.$router.push({name: "home", query: { direction } })
      AppSections.changeActiveSection(AppSections.sectionTitles.CreateFirstPortfolio);
      break;
    }
    case AppSections.sectionTitles.Portfolios: {
      this.$router.push({name: "home", query: { direction } })
      AppSections.changeActiveSection(AppSections.sectionTitles.Portfolios);
      break;
    }
    case AppSections.sectionTitles.PortfolioSummary: {
      this.$router.push({name: "home", query: { direction } })
      await AppSections.setActiveTabIndex(1)
      AppSections.changeActiveSection(AppSections.sectionTitles.PortfolioSummary);
      break;
    }
    }
  }
  public async addTaskorderToPortfolio(){
    this.disableOk = true;
    this.showOkSpinner = true;
    const portfolioSysId = PortfolioStore.currentPortfolio.sysId as string;
    const {success} = await api.edaApi.addTO(
      this.TONumber, 
      portfolioSysId
    );

    if(success){
      await PortfolioSummary.searchPortfolioSummaryList();
      await PortfolioStore.setPortfolioIsUpdating(true)
      await PortfolioStore.setActiveTaskOrderNumber(this.TONumber)
      await AppSections.setActiveTabIndex(1);
      await PortfolioStore.setProvisioningTOFollowOn(false)
      this.disableOk = false;
      this.showOkSpinner = false;
      this.showTOConfirmModal = false;
      AppSections.changeActiveSection(AppSections.sectionTitles.PortfolioSummary);
    }
  }

  private setNavButtons(step: StepInfo): void {
    this.altBackDestination = Steps.altBackDestination;
    this.noPrevious = !step.prev && !this.altBackDestination;
    this.backButtonText = step.backButtonText ?? "Back";
    this.continueButtonColor = step.continueButtonColor ?? "_primary";
    this.continueButtonText = step.continueButtonText ?? "Continue";
    this.altContinueAction = step.altContinueAction ?? "";
    if (step.additionalButtons) {
      this.additionalButtons = step?.additionalButtons;
    }
  }

  private async additionalButtonClick(button: AdditionalButton) {
    if (button.emitText) {
      this.$emit("AdditionalButtonClicked", button.emitText);
    }

    if (button.actionName) {
      const actionArgs = button.actionArgs ?? [];
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
export default toNative(ProvisionWorkflow)
</script>
