import { StepperRouteConfig, StepperStep } from "../../types/Global";
import ProjectOverview from "../steps/ProjectOverview.vue";
import ProjectScope from "../steps/ProjectScope.vue";
import StepTwo from "../steps/StepTwo.vue";

export const stepperRoutes: Array<StepperRouteConfig> = [
  {
    path: "/",
    stepNumber: "01",
    name: "Acquisition_Package_Details",
    completePercentageWeight: 15,
    menuText: "Acquisition Package Details",
    component: ProjectOverview,
    children: [
      {
        menuText: "Project Overview",
        name: "Project_Overview",
        path: "/", // should be same as parent route
        completePercentageWeight: 5,
        children: [
          {
            name: "Project_Scope",
            menuText: "Project Scope",
            component: ProjectScope,
            path: "project-scope",
          }
        ]
        //exclude from menu example
        // children: [

        //   {
        //     name: "Excluded Path",
        //     excludeFromMenu: true,
        //     component: SomeComponent
        //     path: "",  // whatever the path should be
        //   }
        // ]
      },
      {
        menuText: "Organization",
        name: "Organization",
        path: "stepone-2",

        completePercentageWeight: 5,
      },
      {
        menuText: "Contact Information",
        name: "Contact_Information",
        path: "stepone-3",

        completePercentageWeight: 5,
      },
    ],
  },
  {
    path: "/steptwo",
    stepNumber: "02",

    completePercentageWeight: 10,
    menuText: "Existing Contract / Background",
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
  const { completePercentageWeight, menuText, path, stepNumber } =
    stepperRouteConfig;
  let { name } = stepperRouteConfig;
  name = name || "";
  
  const stepperStep: StepperStep = {
    stepNumber,
    menuText,
    name,
    completed: false,
    completePercentageWeight,
    route: path,
    subSteps: stepperRouteConfig.children?.map((child) =>
      mapStepRouteToStepperData(child)
    ),
  };

  return stepperStep;
};

export const buildStepperData = (): StepperStep[] =>
  stepperRoutes.filter(step=> step.excludeFromMenu !== true)
  .map((step) => mapStepRouteToStepperData(step));