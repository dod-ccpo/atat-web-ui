import {StepperRouteConfig, StepperStep} from "../../types/Global";

// Step 1 - Acquisition Package Details
import AcquisitionPackageDetails from "../steps/AcquisitionPackageDetails/Index.vue";
import ProjectOverview from "../steps/AcquisitionPackageDetails/ProjectOverview.vue";
import ContactInfo from "../steps/AcquisitionPackageDetails/ContactInfo.vue";
import OrganizationInfo from "../steps/AcquisitionPackageDetails/Organization.vue";
import CorInfo from "../steps/AcquisitionPackageDetails/COR_ACOR/CorInfo.vue";
import AcorInfo from "../steps/AcquisitionPackageDetails/COR_ACOR/AcorInfo.vue";
import AlternateCOR from "../steps//AcquisitionPackageDetails/COR_ACOR/AlternateCOR.vue";
import Summary from "../steps/Summary.vue";

// Step 2 - Fair Opportunity Process
import FairOpportunityExceptions from "../steps/FairOpportunityProcess/Exceptions.vue";

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
import OtherContractConsiderations from "../steps/OtherContractConsiderations/Index.vue";
import PII from "../steps/OtherContractConsiderations/PII.vue";
import BAA from "../steps/OtherContractConsiderations/BAA.vue";
import PIIRecord from "../steps/OtherContractConsiderations/PIIRecord.vue";
import FOIA from "../steps/OtherContractConsiderations/FOIA.vue";
import FOIACoordinator from "../steps/OtherContractConsiderations/FOIACoordinator.vue";

// step 10 - Financial Details
import FinancialDetails from "../steps/FinancialDetails/Index.vue";
import ProjectScope from "../steps/FinancialDetails/ProjectScope.vue";
// other
import ValidatorsExample from "../validation/ValidatorsExample.vue";

// route resolves
import {
  AcorsRouteResolver,
  CurrentContractRouteResolver,
  CustodianRouteResolver,
  PIIRecordResolver,
  FOIARecordResolver,
} from "./resolvers";

export const routeNames = {
  ProjectOverview: "Project_Overview",
  ProjectScope: "Project_Scope",
  OrganizationInfo: "Organization_Info",
  ContactInformation: "Contact_Information",
  CorInformation: "Cor_Information",
  AlternateCor: "Alternate_Cor",
  AcorInformation: "Acor_Information",
  ExistingContractBackground: "Existing_Contract_Background",
  Summary: "Summary",
  Background: "Background",
  CurrentContract: "Current_Contract",
  CurrentContractDetails: "Current_Contract_Details",
  PerformanceRequirements: "Performance_Requirements",
  FairOpportunityExceptions: "Fair_Opportunity_Exceptions",
  PeriodOfPerformance: "Period_Of_Performance",
  PropertyRequirements: "Property_Requirements",
  WillGovtEquipBeFurnished: "Will_Govt_Equip_Be_Furnished",
  PropertyCustodian: "Property_Custodian",
  OtherContractConsiderations: "Other_Contract_Considerations",
  PII: "PII",
  BAA: "BAA",
  PIIRecord: "PIIRecord",
  PublicDisclosureofInformation: "Public_Disclosure_of_Information",
  FinancialDetails: "Financial_Details",
  FOIA: "FOIA",
  FOIACoordinator: "FOIA_Coordinator",
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
    completePercentageWeight: 14,
    component: AcquisitionPackageDetails,
    completed: true,
    children: [
      {
        menuText: "Project Overview",
        path: "/", // should be same as parent route
        name: routeNames.ProjectOverview,
        completePercentageWeight: 4,
        completed: true,
        component: ProjectOverview,
        additionalButtons: [
          {
            name: routeNames.ProjectOverview,
            buttonText: "Cancel",
            buttonId: "CancelButton",
            buttonClass: "tertirary",
            emitText: "sampleEmitText",
            actionName: "sampleAdditionalButtonAction",
            actionArgs: ["foo", "bar"],
          },
        ],
      },
      {
        menuText: "Organization",
        path: "organization-info",
        name: routeNames.OrganizationInfo,
        completed: true,
        completePercentageWeight: 5,
        component: OrganizationInfo,
      },
      {
        menuText: "Contact Information",
        path: "contact-info",
        name: routeNames.ContactInformation,
        completePercentageWeight: 5,
        completed: true,
        component: ContactInfo,
      },
      {
        menuText: "Cor Info",
        path: "cor-info",
        name: routeNames.CorInformation,
        excludeFromMenu: true,
        completePercentageWeight: 5,
        component: CorInfo,
      },
      {
        menuText: "Alternate COR",
        path: "alt-cor",
        name: routeNames.AlternateCor,
        excludeFromMenu: true,
        component: AlternateCOR,
      },
      {
        menuText: "Acors",
        path: "acor-info",
        name: routeNames.AcorInformation,
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
    component: FairOpportunityExceptions,
    children: [
      {
        menuText: "Exceptions",
        path: "/fair-opportunity-exceptions",
        name: routeNames.FairOpportunityExceptions,
        completePercentageWeight: 2,
      },
    ],
  },
  {
    stepNumber: "03",
    menuText: "Background",
    path: "/current-contract",
    name: routeNames.CurrentContract,
    completePercentageWeight: 10,
    component: Background,
    completed: false,
    children: [
      {
        menuText: "Current Contract",
        path: "/current-contract",
        name: routeNames.CurrentContract,
        completePercentageWeight: 0,
        component: CurrentContract,
        completed: false,
      },
      {
        menuText: "Details",
        path: "/current-contract-details",
        name: routeNames.CurrentContractDetails,
        excludeFromMenu: true,
        completePercentageWeight: 0,
        component: CurrentContractDetails,
        completed: false,
        routeResolver: CurrentContractRouteResolver,
        additionalButtons: [
          {
            buttonText: "I don’t have an existing contract",
            buttonId: "NoExistingContract",
            buttonClass: "secondary",
            name: routeNames.PerformanceRequirements,
          },
        ],
      }
    ]
  },
  {
    stepNumber: "04",
    name: routeNames.PerformanceRequirements,
    completePercentageWeight: 7,
    menuText: "Exception to Fair Opportunity",
    path: "/exception-to-fair-opportunity",
    completed: false,
  },
  {
    stepNumber: "05",
    completePercentageWeight: 7,
    name: routeNames.PeriodOfPerformance,
    menuText: "Contract Details",
    path: "/period-of-performance",
    component: PeriodOfPerformance,
    children: [
      {
        name: routeNames.PeriodOfPerformance,
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
    name: routeNames.PropertyRequirements,
    menuText: "Government Furnished Equipment",
    path: "/property-requirements",
    component: GovtFurnishedEquipment,
    children: [
      {
        name: routeNames.PropertyRequirements,
        menuText: "Property Requirements",
        path: "/property-requirements",
        completePercentageWeight: 2,
        component: PropertyRequirements,
      },
      {
        menuText: "Will Govt Equip Furnished",
        path: "/will-govt-equip-be-furnished",
        name: routeNames.WillGovtEquipBeFurnished,
        completePercentageWeight: 2,
        excludeFromMenu: true,
        component: WillGovtEquipBeFurnished,
      },
      {
        name: routeNames.PropertyCustodian,
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
    name: routeNames.PII,
    menuText: "Other Contract Considerations",
    path: "/personally-identifiable-information",
    component: OtherContractConsiderations,
    children: [
      {
        menuText: "Personally Identifiable Information",
        path: "/personally-identifiable-information",
        name: routeNames.PII,
        completePercentageWeight: 2,
        component: PII,
      },
      {
        menuText: "system of record",
        path: "/system-of-record",
        name: routeNames.PIIRecord,
        completePercentageWeight: 2,
        component: PIIRecord,
        excludeFromMenu: true,
        routeResolver: PIIRecordResolver
      },
      {
        menuText: "Business Associate Agreement (BAA)",
        path: "/business-associate-agreement",
        name: routeNames.BAA,
        completePercentageWeight: 2,
        component: BAA,
      },
      {
        menuText: "Public Disclosure of Information",
        path: "/foia",
        name: routeNames.FOIA,
        completePercentageWeight: 2,
        component: FOIA,
      },
      {
        menuText: "FOIA Coordinator",
        path: "/foia-coordinator",
        name: routeNames.FOIACoordinator,
        completePercentageWeight: 2,
        excludeFromMenu: true,
        component: FOIACoordinator,
        routeResolver: FOIARecordResolver
      },
    ]
  },
  {
    stepNumber: "08",

    completePercentageWeight: 7,
    name: routeNames.PublicDisclosureofInformation,
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
    name: routeNames.ProjectScope,
    menuText: "Financial Details",
    path: "/project-scope",
    component: FinancialDetails,
    children: [
      {
        menuText: "Project Scope",
        path: "/project-scope",
        name: routeNames.ProjectScope,
        completePercentageWeight: 1,
        component: ProjectScope,
      },
    ]
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
  };

  return stepperStep;
};

export const buildStepperData = (): StepperStep[] =>
  stepperRoutes.map((step) => mapStepRouteToStepperData(step));
