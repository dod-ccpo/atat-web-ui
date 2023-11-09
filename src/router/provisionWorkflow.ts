import {StepperRouteConfig, StepperStep} from "../../types/Global";

import ProvisioningIndex from "@/portfolios/provisioning/Index.vue";
import AwardedTaskOrder from "@/portfolios/provisioning/AwardedTaskOrder.vue";
import GeneratedFromPackage from "@/portfolios/provisioning/GeneratedFromPackage.vue";
import PortfolioDetails from "@/portfolios/provisioning/PortfolioDetails.vue";
import AddCSPAdmin from "@/portfolios/provisioning/AddCSPAdmin.vue";
import ReadyToProvision from "@/portfolios/provisioning/ReadyToProvision.vue";
import AddToExistingPortfolio from "@/portfolios/provisioning/AddToExistingPortfolio.vue"
import ProvisioningIssue from "@/portfolios/provisioning/ProvisioningIssue.vue"

const GeneratedFromPackageRouteResolver = (): string => {
  return "";
}
const PortfolioDetailsRouteResolver = (): string => {
  return "";
}
const AddToExistingPortfolioResolver = (): string => {
  return "";
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
  name = name || "";

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
