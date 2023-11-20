import {StepperRouteConfig, StepperStep} from "../../types/Global";

import ProvisioningIndex from "@/portfolios/provisioning/Index.vue";
import AwardedTaskOrder from "@/portfolios/provisioning/AwardedTaskOrder.vue";
import GeneratedFromPackage from "@/portfolios/provisioning/GeneratedFromPackage.vue";
import PortfolioDetails from "@/portfolios/provisioning/PortfolioDetails.vue";
import AddCSPAdmin from "@/portfolios/provisioning/AddCSPAdmin.vue";
import ReadyToProvision from "@/portfolios/provisioning/ReadyToProvision.vue";
import AddToExistingPortfolio from "@/portfolios/provisioning/AddToExistingPortfolio.vue"
import ProvisioningIssue from "@/portfolios/provisioning/ProvisioningIssue.vue"
import { StepRouteResolver } from "@/store/steps/types";
import PortfolioStore from "@/store/portfolio";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import PortfolioSummary from "@/store/portfolioSummary";

const provFromMeatball = (): boolean => {
  return PortfolioStore.provisioningFromMeatball
}
const cspHasILs = (): boolean => {
  return PortfolioStore.CSPHasImpactLevels
}
const taskOrderHasUnclass = (): boolean => {
  return PortfolioStore.doesTaskOrderHaveUnclassified
}
const userHasActivePortfolios = (): boolean => {
  return PortfolioSummary.hasActivePortfolios
}

export const AddToExistingPortfolioResolver = (current: string): string => {
  const hasActivePortfolios: boolean = userHasActivePortfolios()
  // moving backward
  if (
    current === provWorkflowRouteNames.GeneratedFromPackage ||
		current === provWorkflowRouteNames.PortfolioDetails
  ) {
    return hasActivePortfolios
      ? provWorkflowRouteNames.AddToExistingPortfolio
      : provWorkflowRouteNames.AwardedTaskOrder
  }

  // moving forward
  if (provFromMeatball()) {
    return taskOrderHasUnclass() && cspHasILs()
      ? provWorkflowRouteNames.PortfolioDetails
      : provWorkflowRouteNames.AddCSPAdmin
  }

  if (hasActivePortfolios) return provWorkflowRouteNames.AddToExistingPortfolio

  return GeneratedFromPackageRouteResolver(current)
}

export const GeneratedFromPackageRouteResolver = (current: string): string => {
  const packageCount = AcquisitionPackageSummary.packagesWaitingForTaskOrderCount;
  const acqPkgSysId = PortfolioStore.getSelectedAcquisitionPackageSysId
  const showPackageSelection = PortfolioStore.showTOPackageSelection

  if (packageCount && (!acqPkgSysId || showPackageSelection)) {
    return provWorkflowRouteNames.GeneratedFromPackage
  }

  if (current !== provWorkflowRouteNames.PortfolioDetails && acqPkgSysId && !cspHasILs()) {
    return provWorkflowRouteNames.AddCSPAdmin
  }

  if (current === provWorkflowRouteNames.PortfolioDetails) {
    if (provFromMeatball()) return provWorkflowRouteNames.AwardedTaskOrder;
    return userHasActivePortfolios()
      ? provWorkflowRouteNames.AddToExistingPortfolio
      : provWorkflowRouteNames.AwardedTaskOrder
  }

  if (!acqPkgSysId && current === provWorkflowRouteNames.AwardedTaskOrder) {
    return provWorkflowRouteNames.PortfolioDetails;
  }

  return taskOrderHasUnclass() && cspHasILs()
    ? provWorkflowRouteNames.PortfolioDetails
    : provWorkflowRouteNames.AddCSPAdmin
}

export const PortfolioDetailsRouteResolver = (current: string): string => {
  if (current === provWorkflowRouteNames.AddCSPAdmin && provFromMeatball()) {
    return taskOrderHasUnclass() && cspHasILs()
      ? provWorkflowRouteNames.PortfolioDetails
      : provWorkflowRouteNames.AwardedTaskOrder
  }
  const acqPkgSysId = PortfolioStore.getSelectedAcquisitionPackageSysId
  if (!acqPkgSysId || (taskOrderHasUnclass() && cspHasILs())) {
    return provWorkflowRouteNames.PortfolioDetails
  }
  if (
    current === provWorkflowRouteNames.AddCSPAdmin &&
		acqPkgSysId &&
		!taskOrderHasUnclass()
  ) {
    return provWorkflowRouteNames.GeneratedFromPackage
  }
  if (
    current === provWorkflowRouteNames.AddCSPAdmin &&
		!acqPkgSysId &&
		!taskOrderHasUnclass()
  ) {
    return userHasActivePortfolios()
      ? provWorkflowRouteNames.AddToExistingPortfolio
      : provWorkflowRouteNames.AwardedTaskOrder
  }
  // eslint-disable-next-line max-len
  return current === provWorkflowRouteNames.GeneratedFromPackage ||
		provWorkflowRouteNames.AddToExistingPortfolio
    ? provWorkflowRouteNames.AddCSPAdmin
    : provWorkflowRouteNames.GeneratedFromPackage
}


export const provWorkflowRouteNames = {
  ProvisioningIndex: "Provisioning_Index",
  ProvisionWorkflow: "Provision_Workflow",
  ProvisioningIssue: "Provisioning_Issue",
  AwardedTaskOrder: "Awarded_Task_Order",
  AddToExistingPortfolio: "Add_To_Existing_Portfolio",
  GeneratedFromPackage: "Generated_From_Package",
  PortfolioDetails: "Portfolio_Details",
  AddCSPAdmin: "Add_CSP_Admin",
  ReadyToProvision: "Ready_To_Provision",
  Provisioned: "Provisioned"
};

/**
 * Stepper Route config definition
 * The menu items defined in this route drive both the Side Stepper Menu
 * and the Steps store both which invoke routing
 * Rules:
 * 1. Parent steps cannot have a name
 * 2. Parent steps need a page component with a router view defined
 * 3. All steps needs to have unique names
 * 4. If a stepper route isn't meant to be rendered set it's 'excludeFromMenu' value to true
 */
export const provisionWorkFlowRoutes: Array<StepperRouteConfig> = [
  {
    path: "/provisioning",
    component: ProvisioningIndex,
    children: [
      {
        name: provWorkflowRouteNames.AwardedTaskOrder,
        path: "/awarded-task-order",
        component: AwardedTaskOrder, 
        additionalButtons: [
          {
            buttonText: "I need to enter a different task order number",
            buttonId: "EnterAnotherTaskOrderNumber",
            buttonClass: "_secondary",
            actionName: "openTOSearchModal",
          },
        ]
      },
      {
        name: provWorkflowRouteNames.AddToExistingPortfolio,
        path: "/add-to-portfolio",
        component: AddToExistingPortfolio, 
        routeResolver: AddToExistingPortfolioResolver,
        additionalButtons: [
          {
            buttonText: "I need to create a new portfolio",
            buttonId: "CreateANewPortfolio",
            buttonClass: "_secondary",
            actionName: "startNewPortfolio",
          },
        ]
      },
      {
        name: provWorkflowRouteNames.GeneratedFromPackage,
        path: "/generated-from-package",
        component: GeneratedFromPackage, 
        routeResolver: GeneratedFromPackageRouteResolver,
        additionalButtons: [
          {
            buttonText: "I didn’t use DAPPS for this task order",
            buttonId: "DidNotUseDapps",
            buttonClass: "_secondary",
            actionName: "didNotUseDapps",
          },
        ]
      },
      {
        name: provWorkflowRouteNames.PortfolioDetails,
        path: "/portfolio-details",
        component: PortfolioDetails,
        routeResolver: PortfolioDetailsRouteResolver,
      },
      {
        name: provWorkflowRouteNames.AddCSPAdmin,
        path: "/add-csp-admin",
        component: AddCSPAdmin,
      },
      {
        name: provWorkflowRouteNames.ReadyToProvision,
        path: "/ready-to-provision",
        component: ReadyToProvision,
        continueButtonText: "Start Provisioning",
        altContinueAction: "startProvisioning",
      },
      {
        name: provWorkflowRouteNames.ProvisioningIssue,
        path: "/provisioning-issue",
        component: ProvisioningIssue
      }
    ]
  },

];

const provisioningRouteResolvers: Record<string, StepRouteResolver> = {
  GeneratedFromPackageRouteResolver,
  AddToExistingPortfolioResolver,
  PortfolioDetailsRouteResolver,
}

export const InvokeATATRouteResolver = (
  resolverName: string,
  currentStep: string
): string => provisioningRouteResolvers[resolverName](currentStep)



/**
 * Helper method to convert Stepper Route
 * to Stepper Step
 * @param stepperRouteConfig
 * @returns StepperStep
 */
const mapStepRouteToStepperData = (
  stepperRouteConfig: StepperRouteConfig
): StepperStep => {
  const {
    completePercentageWeight,
    excludeFromMenu,
    completed,
    menuText,
    path,
    stepNumber,
    additionalButtons,
    backButtonText,
    continueButtonText,
    altContinueAction,
  } = stepperRouteConfig;
  let {name} = stepperRouteConfig;
  name = name as string || "";

  const stepperStep: StepperStep = {
    stepNumber,
    menuText,
    excludeFromMenu,
    name,
    completed,
    completePercentageWeight,
    route: path ?? "",
    subSteps: stepperRouteConfig.children?.map((child) =>
      mapStepRouteToStepperData(child)
    ),
    additionalButtons,
    backButtonText,
    continueButtonText,
    altContinueAction,
  };
  return stepperStep;
};

export const buildProvisionWorkflowRouterData = (): StepperStep[] =>
  provisionWorkFlowRoutes.map((step) => mapStepRouteToStepperData(step));
