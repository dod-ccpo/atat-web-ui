import { StepperRouteConfig, StepperStep } from "../../types/Global";

// Step 1 - Acquisition Package Details
import AcquisitionPackageDetails from "../steps/AcquisitionPackageDetails/Index.vue";
import ProjectOverview from "../steps/AcquisitionPackageDetails/ProjectOverview.vue";
import ContactInfo from "../steps/AcquisitionPackageDetails/ContactInfo.vue";
import OrganizationInfo from "../steps/AcquisitionPackageDetails/Organization.vue";
import CorInfo from "../steps/AcquisitionPackageDetails/COR_ACOR/CorInfo.vue";
import AcorInfo from "../steps/AcquisitionPackageDetails/COR_ACOR/AcorInfo.vue";
import AlternateCOR from "../steps//AcquisitionPackageDetails/COR_ACOR/AlternateCOR.vue";
import ProjectScope from "../steps/AcquisitionPackageDetails/ProjectScope.vue";
import Summary from "../steps/Summary.vue";

// Step 2 - Fair Opportunity Process
import FairOpportunity_Exceptions from "../steps/FairOpportunityProcess/Exceptions.vue";

//Step 3 - Background
import Background from "../steps/Background/Index.vue";
import CurrentContract from "../steps/Background/CurrentContract/CurrentContract.vue";
import CurrentContractDetails from "../steps/Background/CurrentContract/CurrentContractDetails.vue";

// Step 5 - Contract Details
import PeriodOfPerformance from "../steps/ContractDetails/PeriodOfPerformance.vue";

// Step 6 - Government Furnished Equipment
import GovtFurnishedEquipment from "../steps/GovtFurnishedEquipment/Index.vue"
import PropertyRequirements from "../steps/GovtFurnishedEquipment/PropertyRequirements.vue";
import WillGovtEquipBeFurnished from "../steps/GovtFurnishedEquipment/WillGovtEquipBeFurnished.vue";
import PropertyCustodian from "../steps/GovtFurnishedEquipment/PropertyCustodian.vue";

// step 7 - Other Contract Considerations
import PII from "../steps/OtherContractConsiderations/PII.vue";

// other
import ValidatorsExample from "../validation/ValidatorsExample.vue";

// route resolves
import { AcorsRouteResolver, CustodianRouteResolver, CurrentContractRouteResolver } from "./resolvers";

export const routeNames = {
  Project_Overview: "Project_Overview",
  Project_Scope: "Project_Scope",
  Organization_Info: "Organization_Info",
  Contact_Information: "Contact_Information",
  Cor_Information: "Cor_Information",
  Alternate_Cor:"Alternate_Cor",
  Acor_Information: "Acor_Information",
  Existing_Contract_Background: "Existing_Contract_Background",
  Summary: "Summary",
  Background: "Background",
  Current_Contract: "Current_Contract",
  Current_Contract_Details: "Current_Contract_Details",
  Performance_Requirements: "Performance_Requirements",
  Fair_Opportunity_Exceptions: "Fair_Opportunity_Exceptions",
  Period_Of_Performance: "Period_Of_Performance",
  Property_Requirements: "Property_Requirements",
  Will_Govt_Equip_Be_Furnished: "Will_Govt_Equip_Be_Furnished",
  Property_Custodian: "Property_Custodian",
  PII: "PII",
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
        path: "/", // should be same as parent route
        name: routeNames.Project_Overview,
        completePercentageWeight: 4,
        completed: true,
        component: ProjectOverview,
        additionalButtons: [
          {
            name: routeNames.Project_Overview,
            buttonText: "Cancel",
            buttonId: "MyButton",
            buttonClass: "tertirary",
            emitText: "sampleEmitText", 
            actionName: "sampleAdditionalButtonAction",
            actionArgs: ["foo", "bar"],
          },
        ],
      },
      {
        menuText: "Project Scope",
        path: "project-scope",
        name: routeNames.Project_Scope,
        completePercentageWeight: 1,
        excludeFromMenu: true,
        component: ProjectScope,
        completed: true,
        additionalButtons: [
          {
            name: routeNames.Organization_Info,
            buttonText: "Skip this substep",
            buttonId: "MyButton2",
            buttonClass: "secondary",
          },
          {
            name: routeNames.Cor_Information,
            buttonText: "Skip several substeps",
            buttonId: "MyButton",
            buttonClass: "primary",
          },
        ],
      },
      {
        menuText: "Organization",
        path: "organization-info",
        name: routeNames.Organization_Info,
        completed: true,
        completePercentageWeight: 5,
        component: OrganizationInfo,
      },
      {
        menuText: "Contact Information",
        path: "contact-info",
        name: routeNames.Contact_Information,
        completePercentageWeight: 5,
        completed: true,
        component: ContactInfo,
      },
      {
        menuText: "Cor Info",
        path: "cor-info",
        name: routeNames.Cor_Information,
        excludeFromMenu: true,
        completePercentageWeight: 5,
        component: CorInfo,
      },
      {
        menuText: "Alternate COR",
        path: "alt-cor",
        name: routeNames.Alternate_Cor,
        excludeFromMenu: true,
        component: AlternateCOR,
      },
      {
        menuText: "Acors",
        path: "acor-info",
        name: routeNames.Acor_Information,
        excludeFromMenu: true,
        completePercentageWeight: 5,
        component: AcorInfo,
        routeResolver: AcorsRouteResolver,
      },
      {
        menuText: "Summary",
        path: "summary",
        name: routeNames.Summary,
        excludeFromMenu: true,
        completePercentageWeight: 5,
        component: Summary,
        backButtonText: "Sample different Back text",
      }
    ],
  },
  {
    stepNumber: "02",
    menuText: "Fair Opportunity Process",
    path: "/fair-opportunity-exceptions",
    completePercentageWeight: 10,
    component: FairOpportunity_Exceptions,
    children: [
      {
        menuText: "Exceptions",
        path: "/fair-opportunity-exceptions",
        name: routeNames.Fair_Opportunity_Exceptions,
        completePercentageWeight: 2,
      },
    ],
  },
  {
    stepNumber: "03",
    menuText: "Background",
    path: "/current-contract",
    name: routeNames.Current_Contract,
    completePercentageWeight: 10,
    component: Background,
    completed: false,
    children: [
      {
        menuText: "Current Contract",
        path: "/current-contract",
        name: routeNames.Current_Contract,
        completePercentageWeight: 0,
        component: CurrentContract,
        completed: false,
      },
      {
        menuText: "Details",
        path: "/current-contract-details",
        name: routeNames.Current_Contract_Details,
        excludeFromMenu: true,
        completePercentageWeight: 0,
        component: CurrentContractDetails,
        completed: false,
        routeResolver: CurrentContractRouteResolver,      
      }
    ]
  },
  {
    name: routeNames.Performance_Requirements,
    stepNumber: "04",
    completePercentageWeight: 7,
    menuText: "Exception to Fair Opportunity",
    path: "/exception-to-fair-opportunity",
  },
  {
    stepNumber: "05",
    completePercentageWeight: 7,
    name: routeNames.Period_Of_Performance,
    menuText: "Contract Details",
    path: "/period-of-performance",
    component: PeriodOfPerformance,
    children: [
      {
        name: routeNames.Period_Of_Performance,
        menuText: "Period of Performance",
        path: "/period-of-performance",
        completePercentageWeight: 2,
        component: PeriodOfPerformance,
      },
    ]
  },
  {
    stepNumber: "06",
    completePercentageWeight: 7,
    name: routeNames.Property_Requirements,
    menuText: "Government Furnished Equipment",
    path: "/property-requirements",
    component: GovtFurnishedEquipment,
    children: [
      {
        name: routeNames.Property_Requirements,
        menuText: "Property Requirements",
        path: "/property-requirements",
        completePercentageWeight: 2,
        component: PropertyRequirements,
      },
      {
        menuText: "Will Govt Equip Furnished",
        path: "/will-govt-equip-be-furnished",
        name: routeNames.Will_Govt_Equip_Be_Furnished,
        completePercentageWeight: 2,
        excludeFromMenu: true,
        component: WillGovtEquipBeFurnished,
      },
      {
        name: routeNames.Property_Custodian,
        menuText: "Property Custodian",
        path: "/property-custodian",
        completePercentageWeight: 2,
        component: PropertyCustodian,
        routeResolver: CustodianRouteResolver,
      },
    ]
  },
  {
    stepNumber: "07",
    completePercentageWeight: 7,
    name: "Other_Contract_Considerations",
    menuText: "Other Contract Considerations",
    path: "/personally-identifiable-information",
    component: PII,
    children : [
      {
        menuText: "Personally Identifiable Information",
        path: "/personally-identifiable-information",
        name: routeNames.PII,
        completePercentageWeight: 2,
      },
    ]
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
    name: "Financial_Details",
    menuText: "Financial Details",
    path: "/financial-details",
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
    component: ValidatorsExample,
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
  } = stepperRouteConfig;

  let { name } = stepperRouteConfig;
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
  };

  return stepperStep;
};

export const buildStepperData = (): StepperStep[] =>
  stepperRoutes.map((step) => mapStepRouteToStepperData(step));
