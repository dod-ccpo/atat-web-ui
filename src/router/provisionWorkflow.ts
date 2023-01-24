import {StepperRouteConfig, StepperStep} from "../../types/Global";

// Step 1 - Acquisition Package Details
import RouterIndex from "@/home/RouterIndex.vue";
import AwardedTaskOrder from "@/home/AwardedTaskOrder.vue";
import AddCSPAdmin from "@/home/AddCSPAdmin.vue";
import ReadyToProvision from "@/home/ReadyToProvision.vue";
import Provisioned from "@/home/Provisioned.vue";

export const provWorkflowRouteNames = {
  RouterIndex: "Router_Index",
  ProvisionWorkflow: "Provision_Workflow",
  AwardedTaskOrder: "Awarded_Task_Order",
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
    path: "/router-index-home",
    component: RouterIndex,
    stepNumber: "02",
    completed: false,
  },
  {
    name: provWorkflowRouteNames.AwardedTaskOrder,
    path: "/awarded-task-order",
    component: AwardedTaskOrder, 
    additionalButtons: [
      {
        buttonText: "I need to enter a different task order number",
        buttonId: "EnterAnotherTaskOrderNumber",
        buttonClass: "secondary",
      },
    ]
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
    continueButtonColor: "primary"
  },
  {
    name: provWorkflowRouteNames.Provisioned,
    path: "/provisioned",
    component: Provisioned,
  }
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
    route: path,
    subSteps: stepperRouteConfig.children?.map((child) =>
      mapStepRouteToStepperData(child)
    ),
    additionalButtons,
    backButtonText,
    continueButtonText,
  };
  return stepperStep;
};

export const buildProvisionWorkflowRouterData = (): StepperStep[] =>
  provisionWorkFlowRoutes.map((step) => mapStepRouteToStepperData(step));
