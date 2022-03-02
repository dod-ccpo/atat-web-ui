import { StepperRouteConfig, StepperStep } from "../../types/Global";
import AcquisitionPackageDetails from "../steps/Index.vue";
import ProjectOverview from "../steps/AcquisitionPackageDetails/ProjectOverview.vue";
import ContactInfo from "../steps/AcquisitionPackageDetails/ContactInfo.vue";
import ProjectScope from "../steps/AcquisitionPackageDetails/ProjectScope.vue";
import StepTwo from "../steps/StepTwo.vue";

/**
 * Stepper Route config definition
 * The menu items defined in this route drive both the Side Stepper Menu 
 * and the Steps store both which invoke routing
 * Rules:
 * 1. Parent steps cannot have a name
 * 2. Parent steps need a page component with a router view defined
 * 2. All steps needs to have unique names
 * 3. If a stepper route isn't meant to be rendered set it's 'excludeFromMenu' value to true
 */
export const stepperRoutes: Array<StepperRouteConfig> = [
  {
    stepNumber: "01",
    menuText: "Acquisition Package Details",
    path: "/", // should be same as first substep route
    completePercentageWeight: 15,
    component: AcquisitionPackageDetails,
    completed: true,
    children: [
      {
        menuText: "Project Overview",
        path: "/project-overview", // should be same as parent route
        name: "Project_Overview",
        completePercentageWeight: 4,
        completed: true,
        component: ProjectOverview,
      },
      {
        menuText: "Project Scope",
        path: "project-scope",
        name: "Project_Scope",
        completePercentageWeight: 1,
        excludeFromMenu: true,
        component: ProjectScope,
        completed: true,
      },
      {
        menuText: "Organization",
        path: "organization-info",
        name: "Organization",
        completed: true,
        completePercentageWeight: 5,
      },
      {
        menuText: "Contact Information",
        path: "contact-info",
        name: "Contact_Information",
        completePercentageWeight: 5,
        completed: true,
        component: ContactInfo,
      },
    ],
  },
  {
    stepNumber: "02",
    menuText: "Existing Contract / Background",
    path: "/steptwo",
    completePercentageWeight: 10,
    name: "Existing_Contract_Background",
    component: StepTwo,
    children: [
      {
        name: "Substep_1",
        menuText: "Substep 1",
        path: "/steptwo", // should be same as parent route

        completePercentageWeight: 2,
      },
      {
        name: "Substep_2",
        menuText: "Substep 2",
        path: "steptwo-2",
        completed: true,
        completePercentageWeight: 3,
      },
      {
        name: "Substep_3",
        menuText: "Substep 3",
        path: "steptwo-3",

        completePercentageWeight: 4,
      },
      {
        name: "Substep 4",
        menuText: "Substep 4",
        path: "steptwo-4",
        completed: true,
        completePercentageWeight: 1,
      },
    ],
  },
  {
    stepNumber: "03",
    name: "Order_Type",

    completePercentageWeight: 5,
    menuText: "Order Type",
    path: "/order-type",
    children: [
      {
        name: "Substep_A",
        menuText: "Substep A",
        path: "/order-type",

        completePercentageWeight: 3,
      },
      {
        name: "Substep_B",
        menuText: "Substep B",
        path: "stepthree-B",

        completePercentageWeight: 2,
      },
    ],
  },
  {
    name: "Exception_to_Fair_Opportunity",
    stepNumber: "04",

    completePercentageWeight: 7,
    menuText: "Exception to Fair Opportunity",
    path: "/exception-to-fair-opportunity",
  },
  {
    stepNumber: "05",

    completePercentageWeight: 7,
    name: "Evaluation_Criteria",
    menuText: "Evaluation Criteria",
    path: "/evaluation-criteria",
  },
  {
    stepNumber: "06",

    completePercentageWeight: 7,
    name: "Classification_Requirements",
    menuText: "Classification Requirements",
    path: "/classification-requirements",
  },
  {
    stepNumber: "07",

    completePercentageWeight: 7,
    name: "Financial_Details",
    menuText: "Financial Details",
    path: "/financial-details",
  },
  {
    stepNumber: "08",

    completePercentageWeight: 7,
    name: "Public_Disclosure_of_Information",
    menuText: "Public Disclosure of Information",
    path: "/public-disclosure-of-information",
  },
  {
    stepNumber: "09",

    completePercentageWeight: 7,
    name: "Statutory_Compliance",
    menuText: "Statutory Compliance",
    path: "/statutory-compliance",
  },
  {
    stepNumber: "10",

    completePercentageWeight: 7,
    name: "Supply_Chain_Risk_Management",
    menuText: "Supply Chain Risk Management",
    path: "/supply-chain-risk-management",
  },
  {
    stepNumber: "11",

    completePercentageWeight: 7,
    name: "Government_Furnished_Equipment",
    menuText: "Government Furnished Equipment",
    path: "/government-furnished-equipment",
  },
  {
    stepNumber: "12",

    completePercentageWeight: 7,
    name: "Section_508",
    menuText: "Section 508",
    path: "/section-508",
  },
  {
    stepNumber: "13",

    completePercentageWeight: 7,
    name: "Review_Required_Forms",
    menuText: "Review Required Forms",
    path: "/review-required-forms",
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
  const { completePercentageWeight, completed, menuText, path, stepNumber } =
    stepperRouteConfig;
  let { name } = stepperRouteConfig;
  name = name || "";

  const stepperStep: StepperStep = {
    stepNumber,
    menuText,
    name,
    completed,
    completePercentageWeight,
    route: path,
    subSteps: stepperRouteConfig.children
      ?.filter((child) => child.excludeFromMenu != true)
      .map((child) => mapStepRouteToStepperData(child)),
  };

  return stepperStep;
};

export const buildStepperData = (): StepperStep[] =>
  stepperRoutes.map((step) => mapStepRouteToStepperData(step));
