import {StepperRouteConfig, StepperStep} from "../../types/Global";


// Step 1 - Acquisition Package Details
import AcquisitionPackageDetails from "../steps/01-AcquisitionPackageDetails/Index.vue";
import ProjectOverview from "../steps/01-AcquisitionPackageDetails/ProjectOverview.vue";
import ContactInfo from "../steps/01-AcquisitionPackageDetails/ContactInfo.vue";
import OrganizationInfo from "../steps/01-AcquisitionPackageDetails/Organization.vue";
import CorInfo from "../steps/01-AcquisitionPackageDetails/COR_ACOR/CorInfo.vue";
import AcorInfo from "../steps/01-AcquisitionPackageDetails/COR_ACOR/AcorInfo.vue";
import AlternateCOR from "../steps/01-AcquisitionPackageDetails/COR_ACOR/AlternateCOR.vue";
import Summary from "../steps/Summary.vue";

// Step 2 - Fair Opportunity Process
import FairOpportunityProcess from "../steps/02-FairOpportunityProcess/Index.vue"
import Exceptions from "../steps/02-FairOpportunityProcess/Exceptions.vue";
import JustificationAndApproval
  from "../steps/02-FairOpportunityProcess/JustificationAndApproval.vue";

//Step 3 - Background
import Background from "../steps/03-Background/Index.vue";
import CurrentContract from "../steps/03-Background/CurrentContract/CurrentContract.vue";
import CurrentContractDetails
  from "../steps/03-Background/CurrentContract/CurrentContractDetails.vue";
import CurrentEnvironment 
  from "../steps/03-Background/CurrentEnvironment/CurrentEnvironment.vue";

// Step 4 - Contract Details
/* 4.0 */   import ContractDetails from "../steps/04-ContractDetails/Index.vue";
/* 4.1.1 */ import PeriodOfPerformance from "../steps/04-ContractDetails/PeriodOfPerformance.vue";
/* 4.1.2 */ import POPStart from "@/steps/04-ContractDetails/POPStart.vue";
/* 4.1.2 */ import RecurringRequirement from "../steps/04-ContractDetails/RecurringRequirement.vue";
/* 4.2 */   import ContractType from "../steps/04-ContractDetails/ContractType.vue";
/* 4.3 */   import ClassificationRequirements
  from "../steps/04-ContractDetails/ClassificationRequirements.vue";


// Step 5 - Performance Requirements

import PerformanceRequirementsIndex from "../steps/05-PerformanceRequirements/Index.vue";
import RequirementCategories
  from "../steps/05-PerformanceRequirements/DOW/RequirementCategories.vue";
import ServiceOfferings from "../steps/05-PerformanceRequirements/DOW/ServiceOfferings.vue"
import ServiceOfferingDetails 
  from "../steps/05-PerformanceRequirements/DOW/ServiceOfferingDetails.vue"
import DOWSummary 
  from "../steps/05-PerformanceRequirements/DOW/Summary.vue"

// Step 6 - Government Furnished Equipment
import GovtFurnishedEquipment from "../steps/06-GovtFurnishedEquipment/Index.vue"
import PropertyDetails from "../steps/06-GovtFurnishedEquipment/PropertyDetails.vue";
import Justification from "../steps/06-GovtFurnishedEquipment/Justification.vue";

// Step 7 - Other Contract Considerations
import ConflictOfInterest from "../steps/07-OtherContractConsiderations/ConflictOfInterest.vue";
import PackagingPackingAndShipping
  from "../steps/07-OtherContractConsiderations/PackagingPackingAndShipping.vue";
import Training from "../steps/07-OtherContractConsiderations/Training.vue";
import TrainingCourses from "@/steps/07-OtherContractConsiderations/TrainingCourses.vue";


// Step 8 - Standards and Compliance
import OtherContractConsiderations from "../steps/08-StandardsAndCompliance/Index.vue";
import PII from "../steps/08-StandardsAndCompliance/PII.vue";
import BAA from "../steps/08-StandardsAndCompliance/BAA.vue";
import PIIRecord from "../steps/08-StandardsAndCompliance/PIIRecord.vue";
import FOIA from "../steps/08-StandardsAndCompliance/FOIA.vue";
import FOIACoordinator from "../steps/08-StandardsAndCompliance/FOIACoordinator.vue";
import Section508Standards from "../steps/08-StandardsAndCompliance/Section508Standards.vue";
import Section508AccessibilityRequirements
  from "../steps/08-StandardsAndCompliance/Section508AccessibilityRequirements.vue";

// Step 9 - Evaluation Criteria
import EvaluationCriteriaIndex from "../steps/09-EvaluationCriteria/Index.vue";
import EvaluationCriteria
  from "../steps/09-EvaluationCriteria/EvaluationCriteria.vue";

// step 10 - Financial Details
import FinancialDetails from "../steps/10-FinancialDetails/Index.vue";
import RequirementsCostEstimate from "../steps/10-FinancialDetails/RequirementsCostEstimate.vue";
import FundingPlan from "../steps/10-FinancialDetails/FundingPlan.vue";
import SeverabilityAndIncrementalFunding 
  from "../steps/10-FinancialDetails/SeverabilityAndIncrementalFunding.vue";

import ReviewRequiredForms from "../steps/11-ReviewRequiredForms/Index.vue";
import ReviewRequiredFormsStepOne 
  from "../steps/11-ReviewRequiredForms/ReviewRequiredFormsStepOne.vue";

import {
  AcorsRouteResolver,
  CurrentContractDetailsRouteResolver,
  CurrentContractEnvRouteResolver,
  PIIRecordResolver,
  FOIARecordResolver,
  A11yRequirementResolver,
  ContractTrainingReq,
  OfferGroupOfferingsPathResolver,
  OfferingDetailsPathResolver,
  DowSummaryPathResolver,
} from "./resolvers";

export const routeNames = {
  ProjectOverview: "Project_Overview",
  OrganizationInfo: "Organization_Info",
  ContactInformation: "Contact_Information",
  CorInformation: "Cor_Information",
  AlternateCor: "Alternate_Cor",
  AcorInformation: "Acor_Information",
  ExistingContractBackground: "Existing_Contract_Background",
  Summary: "Summary",
  FairOpportunity: "Fair_Opportunity",
  Exceptions: "Exceptions",
  JustificationAndApproval: "Justification_and_Approval",
  Background: "Background",
  CurrentContract: "Current_Contract",
  CurrentContractDetails: "Current_Contract_Details",
  CurrentEnvironment:"Current_Environment",
  RequirementCategories: "Requirement_Categories",
  ServiceOfferings: "Service_Offerings",
  ServiceOfferingDetails: "Service_Offering_Details",
  DOWSummary: "DOW_Summary",
  OptimizeCurrentEnvironment: "Optimize_Current_Environment",
  AnythingASAServiceXaas:"Anything_as_a_Service_Xaas",
  CloudSupportPackages: "Cloud_Support_Packages",
  PeriodOfPerformance: "Period_Of_Performance",
  RecurringRequirement: "Recurring_Requirement",
  ContractType: "Contract_Type",
  ConflictOfInterest: "Conflict_of_Interest",
  PackagingPackingAndShipping: "Packaging_Packing_and_Shipping",
  Training: "Training",
  TrainingCourses: "Training_Courses",
  PropertyDetails: "Property_Details",
  Justification: "Justification",
  OtherContractConsiderations: "Other_Contract_Considerations",
  PII: "PII",
  BAA: "BAA",
  PIIRecord: "PIIRecord",
  FinancialDetails: "Financial_Details",
  FOIA: "FOIA",
  FOIACoordinator: "FOIA_Coordinator",
  Section508Standards: "Section_508_Standards",
  EvaluationCriteriaIndex: "Evaluation_Criteria_Index",
  EvaluationCriteria: "Evaluation_Criteria",
  ClassificationRequirements: "Classification_Requirements",
  RequirementsCostEstimate: "Requirements_Cost_Estimate",
  FundingPlan: "Funding_Plan",
  SeverabilityAndIncrementalFunding: "Severability_And_Incremental_Funding",
  ReviewRequiredForms: "Review_Required_Forms",
  ReviewRequiredFormsStepOne: "Review_Required_Forms_Step_One",
  POPStart: "POP_Start",
  Section508AccessibilityRequirements: "Section_508_Accessibility_Requirements",
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
        name: routeNames.JustificationAndApproval,
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
    component: Background,
    completed: false,
    children: [
      {
        menuText: "Current Contract",
        path: "current-contract",
        name: routeNames.CurrentContract,
        completePercentageWeight: 0,
        component: CurrentContract,
        completed: false,
      },
      {
        menuText: "Details",
        path: "current-contract-details",
        excludeFromMenu: true,
        name: routeNames.CurrentContractDetails,
        completePercentageWeight: 0,
        component: CurrentContractDetails,
        completed: false,
        routeResolver: CurrentContractDetailsRouteResolver,
        additionalButtons: [
          {
            buttonText: "I don’t have an existing contract",
            buttonId: "NoExistingContract",
            buttonClass: "secondary",
            name: routeNames.PeriodOfPerformance,
          },
        ],
      },
      {
        menuText: "Current Environment",
        path: "current-environment",
        name: routeNames.CurrentEnvironment,
        component: CurrentEnvironment,
        completePercentageWeight: 5,
        completed: false,
        routeResolver: CurrentContractEnvRouteResolver,
      },
    ]
  },
  {
    stepNumber: "04",
    completePercentageWeight: 7,
    menuText: "Contract Details",
    path: "/period-of-performance",
    component: ContractDetails,
    children: [
      {
        name: routeNames.PeriodOfPerformance,
        menuText: "Period of Performance",
        path: "period-of-performance",
        completePercentageWeight: 2,
        component: PeriodOfPerformance,
      },
      {
        name: routeNames.POPStart,
        menuText: "Period of Performance Start Date",
        path: "period-of-performance-start-date",
        excludeFromMenu: true,
        completePercentageWeight: 2,
        component: POPStart,
      },
      {
        name: routeNames.RecurringRequirement,
        menuText: "Recurring Requirement",
        excludeFromMenu: true,
        path: "recurring-requirement",
        completePercentageWeight: 2,
        component: RecurringRequirement,
      },
      {
        name: routeNames.ContractType,
        menuText: "Contract Type",
        path: "contract-type",
        completePercentageWeight: 2,
        component: ContractType,
      },
      {
        menuText: "Classification Requirements",
        path:"classification-requirements",
        name: routeNames.ClassificationRequirements,
        completePercentageWeight: 1,
        component: ClassificationRequirements,
      },
    ]
  },
  {
    stepNumber: "05",
    completePercentageWeight: 7,
    menuText: "Performance Requirements",
    path: "/performance-requirements",
    component: PerformanceRequirementsIndex,
    children: [
      {
        menuText: "Performance Requirements",
        path: "/",
        excludeFromMenu: true,
        name: routeNames.RequirementCategories,
        completePercentageWeight: 1,
        component: RequirementCategories,
      },
      {
        menuText: "Service Offerings",
        path: "service-offerings/:groupName",
        excludeFromMenu: true,
        name: routeNames.ServiceOfferings,
        completePercentageWeight: 1,
        component: ServiceOfferings,
        routeResolver: OfferGroupOfferingsPathResolver,
        additionalButtons: [
          {
            buttonText: "I don’t need these cloud resources",
            buttonId: "DontNeedResources",
            buttonClass: "secondary",
            name: routeNames.ServiceOfferings, // functionality TBD in future ticket
          },
        ],
      },
      {
        menuText: "Service Offering Details",
        path: "service-offering-details/:groupName/:serviceOffering",
        excludeFromMenu: true,
        name: routeNames.ServiceOfferingDetails,
        completePercentageWeight: 1,
        component: ServiceOfferingDetails,
        routeResolver: OfferingDetailsPathResolver,
      },
      {
        menuText: "DOW Summary",
        path: "dow-summary",
        excludeFromMenu: true,
        name: routeNames.DOWSummary,
        completePercentageWeight: 1,
        component: DOWSummary,
        routeResolver: DowSummaryPathResolver,
      },
    ],
  },
  {
    stepNumber: "06",
    completePercentageWeight: 7,
    menuText: "Government Furnished Equipment",
    path: "/property-details",
    component: GovtFurnishedEquipment,
    children: [
      {
        name: routeNames.PropertyDetails,
        menuText: "Property Details",
        path: "property-details",
        completePercentageWeight: 2,
        component: PropertyDetails,
      },
      {
        name: routeNames.Justification,
        menuText: "Justification",
        path: "justification",
        completePercentageWeight: 2,
        component: Justification,
      },
    ]
  },
  {
    stepNumber: "07",
    completePercentageWeight: 7,
    menuText: "Other Contract Considerations",
    path: "/conflict-of-interest",
    component: OtherContractConsiderations,
    children: [
      {
        name: routeNames.ConflictOfInterest,
        menuText: "Conflict of Interest",
        path: "conflict-of-interest",
        completePercentageWeight: 2,
        component: ConflictOfInterest,
      },
      {
        name: routeNames.PackagingPackingAndShipping,
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
      {
        name: routeNames.TrainingCourses,
        menuText: "Training Courses",
        excludeFromMenu: true,
        path: "training",
        completePercentageWeight: 2,
        component: TrainingCourses,
        routeResolver: ContractTrainingReq

      },
    ]
  },

  {
    stepNumber: "08",
    completePercentageWeight: 7,
    menuText: "Standards and Compliance",
    path: "/personally-identifiable-information",
    component: OtherContractConsiderations,
    children: [
      {
        menuText: "Personally Identifiable Information (PII)",
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
      {
        menuText: "Section 508 Standards",
        path: "/508-standards",
        name: routeNames.Section508Standards,
        completePercentageWeight: 2,
        component: Section508Standards,
      },
      {
        menuText: "Section 508 Accessibility Requirements",
        path: "/508-accessibility-reqs",
        name: routeNames.Section508AccessibilityRequirements,
        excludeFromMenu: true,
        completePercentageWeight: 2,
        component: Section508AccessibilityRequirements,
        routeResolver: A11yRequirementResolver
      },
    ]
  },
  {
    stepNumber: "09",
    completePercentageWeight: 7,
    menuText: "Evaluation Criteria",
    path: "/evaluation-criteria",
    component: EvaluationCriteriaIndex,
    children: [
      {
        menuText: "Evaluation Criteria",
        path: "evaluation-criteria",
        excludeFromMenu: true,
        name: routeNames.EvaluationCriteria,
        completePercentageWeight: 1,
        component: EvaluationCriteria,
      },
    ],
  },
  {
    stepNumber: "10",
    completePercentageWeight: 7,
    menuText: "Financial Details",
    path: "/requirements-cost-estimate",
    component: FinancialDetails,
    children: [
      {
        menuText: "Requirements Cost Estimate",
        path: "requirements-cost-estimate",
        name: routeNames.RequirementsCostEstimate,
        completePercentageWeight: 1,
        component: RequirementsCostEstimate,
      },
      {
        menuText: "Funding Plan",
        path: "funding-plan",
        name: routeNames.FundingPlan,
        completePercentageWeight: 1,
        component: FundingPlan,
      },
      {
        menuText: "Severability and Incremental Funding",
        path: "severability-and-incremental-funding",
        name: routeNames.SeverabilityAndIncrementalFunding,
        completePercentageWeight: 1,
        component: SeverabilityAndIncrementalFunding,
      },
    ]
  },
  {
    stepNumber: "11",
    completePercentageWeight: 7,
    menuText: "Review Required Forms",
    path: "/review-required-forms",
    component: ReviewRequiredForms,
    children: [
      {
        menuText: "Step One",
        path:"review-required-forms",
        excludeFromMenu: true,
        name: routeNames.ReviewRequiredFormsStepOne,
        completePercentageWeight: 1,
        component: ReviewRequiredFormsStepOne,
      },
    ],
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
