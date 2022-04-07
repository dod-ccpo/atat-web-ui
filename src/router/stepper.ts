import {StepperRouteConfig, StepperStep} from "../../types/Global";
import BlankPage from "../steps/BlankPage.vue"

// todo 03 routeResolver does not work

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
import FairOpportunityProcess from "../steps/FairOpportunityProcess/Index.vue"
import Exceptions from "../steps/FairOpportunityProcess/Exceptions.vue";
import JustificationAndApproval from "../steps/FairOpportunityProcess/JustificationAndApproval.vue";

//Step 3 - Background
import Background from "../steps/Background/Index.vue";
import CurrentContract from "../steps/Background/CurrentContract/CurrentContract.vue";
import CurrentContractDetails from "../steps/Background/CurrentContract/CurrentContractDetails.vue";
import CurrentEnvironment from "../steps/Background/CurrentEnvironment/CurrentEnvironment.vue";

// Step 4 - Performance requirements
import PerformanceRequirements from "../steps/PerformanceRequirements/Index.vue"
import OptimizeCurrentEnvironment from "../steps/PerformanceRequirements/OptimizeCurrentEnvironment.vue";
import AnythingAsAServiceXaas from "../steps/PerformanceRequirements/AnythingAsAServiceXaas.vue";
import CloudSupportPackages from "../steps/PerformanceRequirements/CloudSupportPackages.vue";

// Step 5 - Contract Details
import ContractDetails from "../steps/ContractDetails/Index.vue";
import PeriodOfPerformance from "../steps/ContractDetails/PeriodOfPerformance.vue";
import ConflictOfInterest from "../steps/ContractDetails/ConflictOfInterest.vue";
import PackagingPackingAndShipping from "../steps/ContractDetails/PackagingPackingAndShipping.vue";
import Training from "../steps/ContractDetails/Training.vue";

// Step 6 - Government Furnished Equipment
import GovtFurnishedEquipment from "../steps/GovtFurnishedEquipment/Index.vue"
import PropertyDetails from "../steps/GovtFurnishedEquipment/PropertyDetails.vue";
import WillGovtEquipBeFurnished from "../steps/GovtFurnishedEquipment/WillGovtEquipBeFurnished.vue";
import Justification from "../steps/GovtFurnishedEquipment/Justification.vue";

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
  Project_Overview: "Project_Overview",
  Project_Scope: "Project_Scope",
  Organization_Info: "Organization_Info",
  Contact_Information: "Contact_Information",
  Cor_Information: "Cor_Information",
  Alternate_Cor: "Alternate_Cor",
  Acor_Information: "Acor_Information",
  Existing_Contract_Background: "Existing_Contract_Background",
  Summary: "Summary",
  Fair_Opportunity: "Fair_Opportunity",
  Exceptions: "Exceptions",
  Justification_and_Approval: "Justification_and_Approval",
  Background: "Background",
  Current_Contract: "Current_Contract",
  Current_Contract_Details: "Current_Contract_Details",
  Current_Environment:"Current_Environment",
  Performance_Requirements: "Performance_Requirements",
  Optimize_Current_Environment: "Optimize_Current_Environment",
  Anything_as_a_Service_Xaas:"Anything_as_a_Service_Xaas",
  Cloud_Support_Packages: "Cloud_Support_Packages",
  Period_Of_Performance: "Period_Of_Performance",
  Conflict_of_Interest: "Conflict_of_Interest",
  Packaging_Packing_and_Shipping: "Packaging_Packing_and_Shipping",
  Training: "Training",
  Property_Details: "Property_Details",
  Will_Govt_Equip_Be_Furnished: "Will_Govt_Equip_Be_Furnished",
  Justification: "Justification",
  Other_Contract_Considerations: "Other_Contract_Considerations",
  PII: "PII",
  BAA: "BAA",
  PIIRecord: "PIIRecord",
  Public_Disclosure_of_Information: "Public_Disclosure_of_Information",
  Financial_Details: "Financial_Details",
  FOIA: "FOIA",
  FOIA_Coordinator: "FOIA_Coordinator",
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
        name: routeNames.Project_Overview,
        completePercentageWeight: 4,
        completed: true,
        component: ProjectOverview,
        additionalButtons: [
          {
            name: routeNames.Project_Overview,
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
    path: "/exceptions",
    completePercentageWeight: 10,
    component: FairOpportunityProcess,
    completed: false,
    children: [
      {
        menuText: "Exceptions",
        path: "exceptions",
        name: routeNames.Exceptions,
        component: Exceptions,
        completePercentageWeight: 5,
        completed: false,
      },
      {
        menuText: "Justification and Approval",
        path: "justification-and-approval",
        name: routeNames.Justification_and_Approval,
        component: JustificationAndApproval,
        completePercentageWeight: 5,
        completed: false,
      },
    ],
  },
  {
    stepNumber: "03",
    menuText: "Background",
    path: "/current-contract",
    completePercentageWeight: 10,
    component: CurrentContract,
    completed: false,
    children: [
      {
        menuText: "Current Contract",
        path: "current-contract",
        name: routeNames.Current_Contract,
        completePercentageWeight: 0,
        component: CurrentContract,
        completed: false,
      },
      {
        menuText: "Details",
        path: "current-contract-details",
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
            name: routeNames.Performance_Requirements,
          },
        ],
      },
      {
        menuText: "Current Environment",
        path: "current-environment",
        name: routeNames.Current_Environment,
        component: CurrentEnvironment,
        completePercentageWeight: 5,
        completed: false,
      },
    ]
  },
  {
    stepNumber: "04",
    component: PerformanceRequirements,
    completePercentageWeight: 7,
    menuText: "Performance Requirements",
    path: "/optimize_current_environment",
    completed: false,
    children: [
      {
        menuText: "Optimize Current Environment?",
        path: "optimize_current_environment",
        name: routeNames.Optimize_Current_Environment,
        component: OptimizeCurrentEnvironment,
        completePercentageWeight: 0,
        completed: false,
      },
      {
        menuText: "Anything as a Service (Xaas)",
        path: "anything_as_a_service_xaas",
        name: routeNames.Anything_as_a_Service_Xaas,
        component: AnythingAsAServiceXaas,
        completePercentageWeight: 0,
        completed: false,
      },
      {
        menuText: "Cloud Support Packages",
        path: "cloud-support-packages",
        name: routeNames.Cloud_Support_Packages,
        component: CloudSupportPackages,
        completePercentageWeight: 0,
        completed: false,
      },
    ],
  },
  {
    stepNumber: "05",
    completePercentageWeight: 7,
    menuText: "Contract Details",
    path: "/period-of-performance",
    component: ContractDetails,
    children: [
      {
        name: routeNames.Period_Of_Performance,
        menuText: "Period of Performance",
        path: "period-of-performance",
        completePercentageWeight: 2,
        component: PeriodOfPerformance,
      },
      {
        name: routeNames.Conflict_of_Interest,
        menuText: "Conflict of Interest",
        path: "conflict-of-interest",
        completePercentageWeight: 2,
        component: ConflictOfInterest,
      },
      {
        name: routeNames.Packaging_Packing_and_Shipping,
        menuText: "Packaging, Packing, and Shipping",
        path: "packaging-packing-and-shipping",
        completePercentageWeight: 2,
        component: PackagingPackingAndShipping,
      },
      {
        name: routeNames.Training,
        menuText: "Training",
        path: "training",
        completePercentageWeight: 2,
        component: Training,
      },
    ]
  },
  {
    stepNumber: "06",
    completePercentageWeight: 7,
    menuText: "Government Furnished Equipment",
    path: "/property-requirements",
    component: GovtFurnishedEquipment,
    children: [
      {
        name: routeNames.Property_Details,
        menuText: "Property Details",
        path: "/property-details",
        completePercentageWeight: 2,
        component: PropertyDetails,
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
        name: routeNames.Justification,
        menuText: "Justification",
        path: "/property-custodian",
        completePercentageWeight: 2,
        component: Justification,
        routeResolver: CustodianRouteResolver,
      },
    ]
  },
  {
    stepNumber: "07",
    completePercentageWeight: 7,
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
        name: routeNames.FOIA_Coordinator,
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
    name: routeNames.Public_Disclosure_of_Information,
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
    menuText: "Financial Details",
    path: "/project-scope",
    component: FinancialDetails,
    children: [
      {
        menuText: "Project Scope",
        path: "/project-scope",
        name: routeNames.Project_Scope,
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
