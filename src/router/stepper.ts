import {StepperRouteConfig, StepperStep} from "../../types/Global";

// Step 1 - Acquisition Package Details
import ContractingShop from "@/steps/01-AcquisitionPackageDetails/ContractingShop.vue";
import AcquisitionPackageDetails from "../steps/01-AcquisitionPackageDetails/Index.vue";
import ProjectOverview from "../steps/01-AcquisitionPackageDetails/ProjectOverview.vue";
import ContactInfo from "../steps/01-AcquisitionPackageDetails/ContactInfo.vue";
import OrganizationInfo from "../steps/01-AcquisitionPackageDetails/Organization.vue";
import CorInfo from "../steps/01-AcquisitionPackageDetails/COR_ACOR/CorInfo.vue";
import AcorInfo from "../steps/01-AcquisitionPackageDetails/COR_ACOR/AcorInfo.vue";
import AlternateCOR from "../steps/01-AcquisitionPackageDetails/COR_ACOR/AlternateCOR.vue";
import Summary from "../steps/Summary.vue";

// Step 2 - Evaluation Criteria
import FairOpportunityProcess from "../steps/02-EvaluationCriteria/Index.vue"
import Exceptions from "../steps/02-EvaluationCriteria/Exceptions.vue";
// KEEP JustificationAndApproval for future ticket
// import JustificationAndApproval
//   from "../steps/02-EvaluationCriteria/JustificationAndApproval.vue";
import CreateEvalPlan from "../steps/02-EvaluationCriteria/EvalPlan/CreateEvalPlan.vue";
import EvalPlanDetails from "../steps/02-EvaluationCriteria/EvalPlan/EvalPlanDetails.vue";
import Differentiators from "../steps/02-EvaluationCriteria/EvalPlan/Differentiators.vue";
import EvalPlanSummary from "../steps/02-EvaluationCriteria/EvalPlan/Summary.vue";
import NoEvalPlan from "../steps/02-EvaluationCriteria/EvalPlan/NoEvalPlan.vue";

//Step 3 - Background
import Background from "../steps/03-Background/Index.vue";
import CurrentContract from "../steps/03-Background/CurrentContract/CurrentContract.vue";
import CurrentContractDetails
  from "../steps/03-Background/CurrentContract/CurrentContractDetails.vue";
import HasCurrentEnvironment 
  from "../steps/03-Background/CurrentEnvironment/CurrentEnvironment.vue";
import CurrentEnvironmentLocation
  from "@/steps/03-Background/CurrentEnvironment/CurrentEnvironmentLocation.vue";
import ClassificationLevels
  from "@/steps/03-Background/CurrentEnvironment/ClassificationLevelsPage.vue";
import InstanceDetails
  from "@/steps/03-Background/CurrentEnvironment/InstanceDetails.vue";
import BackgroundSummary from "../steps/03-Background/Summary.vue"
import UploadSystemDocuments
  from "@/steps/03-Background/CurrentEnvironment/UploadSystemDocuments.vue";
import UploadMigrationDocuments
  from "@/steps/03-Background/CurrentEnvironment/UploadMigrationDocuments.vue";
import ReplicateAndOptimize
  from "@/steps/03-Background/CurrentEnvironment/ReplicateAndOptimize.vue";
import ReplicateDetails from "@/steps/03-Background/CurrentEnvironment/ReplicateDetails.vue";
import ArchitecturalDesign from "@/steps/03-Background/CurrentEnvironment/ArchitecturalDesign.vue";
import ArchitecturalDesignDetails
  from "@/steps/03-Background/CurrentEnvironment/ArchitecturalDesignDetails.vue";
import EnvironmentSummary from "@/steps/03-Background/CurrentEnvironment/EnvironmentSummary.vue";

// Step 4 - Contract Details
/* 4.0 */   import ContractDetails from "../steps/04-ContractDetails/Index.vue";
/* 4.1.1 */ import PeriodOfPerformance from "../steps/04-ContractDetails/PeriodOfPerformance.vue";
/* 4.1.2 */ import POPStart from "@/steps/04-ContractDetails/POPStart.vue";
/* 4.1.2 */ import RecurringRequirement from "../steps/04-ContractDetails/RecurringRequirement.vue";
/* 4.2 */   import ContractType from "../steps/04-ContractDetails/ContractType.vue";
/* 4.3 */   import ClassificationRequirements
  from "../steps/04-ContractDetails/ClassificationRequirements.vue";
import SecurityRequirements from "@/steps/04-ContractDetails/SecurityRequirements.vue";
import CrossDomain from "@/steps/04-ContractDetails/CrossDomain.vue";

// Step 5 - Performance Requirements
import PerformanceRequirementsIndex from "../steps/05-PerformanceRequirements/Index.vue";
import RequirementCategories
  from "../steps/05-PerformanceRequirements/DOW/RequirementCategories.vue";
import ServiceOfferings from "../steps/05-PerformanceRequirements/DOW/ServiceOfferings.vue";
import ArchitectureDesignDOW
  from "../steps/05-PerformanceRequirements/DOW/ArchitecturalDesign.vue";
import ServiceOfferingDetails 
  from "../steps/05-PerformanceRequirements/DOW/ServiceOfferingDetails.vue";
import OtherOfferingSummary 
  from "../steps/05-PerformanceRequirements/DOW/OtherOfferingSummary.vue";
import DOWSecurityRequirements
  from "../steps/05-PerformanceRequirements/DOW/DOWSecurityRequirements.vue";
import DOWSummary 
  from "../steps/05-PerformanceRequirements/DOW/Summary.vue";
import AnticipatedUserAndDataNeeds
  from "@/steps/05-PerformanceRequirements/DOW/AnticipatedUserAndDataNeeds.vue";

// Step 7 - Other Contract Considerations
import ConflictOfInterest from "../steps/07-OtherContractConsiderations/ConflictOfInterest.vue";
import PackagingPackingAndShipping
  from "../steps/07-OtherContractConsiderations/PackagingPackingAndShipping.vue";
import Travel
  from "../steps/07-OtherContractConsiderations/Travel.vue";

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

// step 09 - Financial Details
import IGCE from "@/steps/10-FinancialDetails/IGCE/Index.vue";
import CreatePriceEstimate from "@/steps/10-FinancialDetails/IGCE/CreatePriceEstimate.vue";
import CannotProceed from "@/steps/10-FinancialDetails/IGCE/CannotProceed.vue";
import OptimizeOrReplicate from "@/steps/10-FinancialDetails/IGCE/OptimizeOrReplicate.vue";
import ArchitecturalDesignSolutions 
  from '@/steps/10-FinancialDetails/IGCE/ArchitecturalDesignSolutions.vue';
import GatherPriceEstimates from "@/steps/10-FinancialDetails/IGCE/GatherPriceEstimates.vue";
import IGCETraining from "@/steps/10-FinancialDetails/IGCE/Traininig.vue";
import TravelEstimates from "@/steps/10-FinancialDetails/IGCE/TravelEstimates.vue";
import SurgeCapacity from "@/steps/10-FinancialDetails/IGCE/SurgeCapacity.vue";
import FeeCharged from "@/steps/10-FinancialDetails/IGCE/FeeCharged.vue";
import CostSummary from "@/steps/10-FinancialDetails/IGCE/CostSummary.vue";
import SupportingDocumentation from "@/steps/10-FinancialDetails/IGCE/SupportingDocumentation.vue";
import EstimatesDeveloped from "@/steps/10-FinancialDetails/IGCE/EstimatesDeveloped.vue";
import SurgeCapabilities from "../steps/10-FinancialDetails/IGCE/SurgeCapabilities.vue";
import MIPR from "../steps/10-FinancialDetails/MIPR.vue";
import SeverabilityAndIncrementalFunding 
  from "../steps/10-FinancialDetails/SeverabilityAndIncrementalFunding.vue";
import IncrementalFunding 
  from "../steps/10-FinancialDetails/IncrementalFunding.vue";
import FundingPlanType from "@/steps/10-FinancialDetails/FundingRequest.vue";
import GInvoicing from "@/steps/10-FinancialDetails/GInvoicing.vue";
import Upload7600 from "@/steps/10-FinancialDetails/Upload7600.vue";
import FinancialPOCForm from "@/steps/10-FinancialDetails/FinancialPOCForm.vue";
import SummaryPage from "@/steps/10-FinancialDetails/SummaryPage.vue";

// step 10 - Generate Package Documents
import GeneratePackageDocuments from "../steps/11-GeneratePackageDocuments/Index.vue";
import UploadJAMRRDocuments from "@/steps/11-GeneratePackageDocuments/UploadJAMRRDocuments.vue";
import ReadyToGeneratePackage from "@/steps/11-GeneratePackageDocuments/ReadyToGeneratePackage.vue";
import GeneratingPackageDocuments
  from "../steps/11-GeneratePackageDocuments/GeneratePackageDocuments.vue";

import {
  AcorsRouteResolver,
  CurrentContractDetailsRouteResolver,
  CurrentEnvRouteResolver,
  ReplicateDetailsResolver,
  PIIRecordResolver,
  FOIARecordResolver,
  A11yRequirementResolver,
  // ContractTrainingReq,
  ServiceOfferingsPathResolver,
  OfferingDetailsPathResolver,
  DowSummaryPathResolver,
  MIPRResolver,
  GInvoicingResolver,
  Upload7600Resolver,
  IncrementalFundingResolver,
  RequirementsPathResolver as PerformanceRequirementsPathResolver,
  FinancialPOCResolver,
  OtherOfferingSummaryPathResolver,
  DOWSecurityRequirementsPathResolver,
  IGCESurgeCapabilities,
  IGCECannotProceedResolver,
  IGCEOptimizeOrReplicateResolver,
  IGCEArchitecturalDesignSolutionsResolver,
  IGCESupportingDocumentationResolver,
  CreateEvalPlanRouteResolver,
  BVTOResolver,
  NoEvalPlanRouteResolver,
  EvalPlanDetailsRouteResolver,
  ArchitecturalDesignDetailsRouteResolver,
  SecurityRequirementsResolver,
  UploadJAMRRDocumentsRouteResolver,
  AnticipatedUserAndDataNeedsResolver,
  DOWArchitecturalDesignResolver,
  
} from "./resolvers";
import TraininigEstimates from "@/steps/10-FinancialDetails/IGCE/Traininig.vue";

export const routeNames = {
  ContractingShop: "Contracting_Shop",
  ProjectOverview: "Project_Overview",
  OrganizationInfo: "Organization_Info",
  ContactInformation: "Contact_Information",
  CorInformation: "Cor_Information",
  AlternateCor: "Alternate_Cor",
  AcorInformation: "Acor_Information",
  ExistingContractBackground: "Existing_Contract_Background",
  AcqPackageSummary: "Acquisition_Package_Summary",
  FairOpportunity: "Fair_Opportunity",
  Exceptions: "Exceptions",
  EvaluationPlan: "Evaluation_Plan",
  CreateEvalPlan: "Create_Eval_Plan",
  EvalPlanDetails: "Eval_Plan_Details",
  Differentiators: "Proposal_Required_BVTO",
  EvalPlanSummary: "Eval_Plan_Summary",
  NoEvalPlan: "No_Eval_Plan",
  // KEEP JustificationAndApproval for future ticket
  // JustificationAndApproval: "Justification_and_Approval",

  Background: "Background",
  CurrentContract: "Current_Contract",
  CurrentContractDetails: "Current_Contract_Details",
  CurrentEnvironment:"Current_Environment",
  RequirementCategories: "Requirement_Categories",
  DOWArchitecturalDesign: "DOW_Architectural_Design",
  ServiceOfferings: "Service_Offerings",
  ServiceOfferingDetails: "Service_Offering_Details",
  OtherOfferingSummary: "Other_Offering_Summary",
  DOWSecurityRequirements: "DOW_Security_Requirements",
  DOWSummary: "DOW_Summary",
  OptimizeCurrentEnvironment: "Optimize_Current_Environment",
  AnythingASAServiceXaas:"Anything_as_a_Service_Xaas",
  CloudSupportPackages: "Cloud_Support_Packages",
  PeriodOfPerformance: "Period_Of_Performance",
  RecurringRequirement: "Recurring_Requirement",
  ContractType: "Contract_Type",
  ConflictOfInterest: "Conflict_of_Interest",
  PackagingPackingAndShipping: "Packaging_Packing_and_Shipping",
  Travel: "Travel",
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
  ClassificationRequirements: "Classification_Requirements",
  SurgeCapabilities: "SurgeCapabilities",
  RequirementsCostForm: "Requirements_Cost_Form",
  MIPR: "MIPR",
  SeverabilityAndIncrementalFunding: "Severability_And_Incremental_Funding",
  IncrementalFunding: "Incremental_Funding",
  GeneratingPackageDocuments: "Generating_Package_Documents",
  POPStart: "POP_Start",
  Section508AccessibilityRequirements: "Section_508_Accessibility_Requirements",
  GInvoicing:'G_Invoicing',
  Upload7600:'Upload_7600',
  FundingPlanType: "Funding_Plan_Type",
  FinancialPOCForm: "Financial_POC_Form",
  SummaryPage: "Summary_Page",
  CurrentEnvironmentLocation: "Current_Environment_Location",
  ClassificationLevels: "Classification_Levels",
  BackgroundSummary: "Background_Summary",
  InstanceDetails:"Environment_Details_Page",
  IGCE:"IGCE",
  CreatePriceEstimate:"Create_Price_Estimate",
  CannotProceed:"Cannot_Proceed",
  GatherPriceEstimates:"Gather_Price_Estimates",
  OptimizeOrReplicate:"Optimize_Or_Replicate",
  ArchitecturalDesignSolutions:"ArchitecturalDesignSolutions",
  IGCETraining:"IGCE_Training",
  TravelEstimates:"Travel_Estimates",
  SurgeCapacity:"Surge_Capacity",
  FeeCharged:"Fee_Charged",
  CostSummary:"Cost_Summary",
  EstimatesDeveloped:"Estimates_Developed",
  SupportingDocumentation:"Supporting_Documentation",
  UploadSystemDocuments:"Upload_Charts_Diagrams",
  UploadMigrationDocuments:"Upload_Process_Documents",
  ReplicateAndOptimize:"Replicate_And_Optimize",
  ReplicateDetails:"Replicate_Details",
  ArchitecturalDesign:"Architectural_Design",
  ArchitecturalDesignDetails:"Architectural_Design_Details",
  EnvironmentSummary:"Environment_Summary",
  SecurityRequirements:"Security_Requirements",
  CrossDomain:"Cross_Domain",
  UploadJAMRRDocuments:"JA_MRR_Documents",
  ReadyToGeneratePackage:"Ready_To_Generate_Package",
  GeneratePackageDocuments: "Generate_Package_Documents",
  AnticipatedUserAndDataNeeds: "Anticipated_User_And_Data_Needs"
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
    path: "/package-details",
    completePercentageWeight: 14,
    component: AcquisitionPackageDetails,
    completed: false,
    children: [
      {
        menuText: "Contracting Shop",
        path: "/",
        name: routeNames.ContractingShop,
        completePercentageWeight: 0,
        completed: false,
        excludeFromMenu: true,
        component: ContractingShop
      },
      {
        menuText: "Project Overview",
        path: "project-overview",
        name: routeNames.ProjectOverview,
        completePercentageWeight: 4,
        completed: false,
        stepCompleteOnLeave: routeNames.ProjectOverview,
        component: ProjectOverview,
        // KEEP THIS FOR REFERENCE
        // additionalButtons: [
        //   {
        //     name: routeNames.ProjectOverview,
        //     buttonText: "Cancel",
        //     buttonId: "CancelButton",
        //     buttonClass: "tertirary",
        //     emitText: "sampleEmitText",
        //     actionName: "sampleAdditionalButtonAction",
        //     actionArgs: ["foo", "bar"],
        //   },
        // ],
      },
      {
        menuText: "Organization",
        path: "organization-info",
        name: routeNames.OrganizationInfo,
        completed: false,
        stepCompleteOnLeave: routeNames.OrganizationInfo,
        completePercentageWeight: 5,
        component: OrganizationInfo,
      },
      {
        menuText: "Contact Information",
        path: "contact-info",
        name: routeNames.ContactInformation,
        completePercentageWeight: 5,
        completed: false,
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
      // {
      //   menuText: "Summary",
      //   path: "summary",
      //   name: routeNames.AcqPackageSummary,
      //   excludeFromMenu: true,
      //   completePercentageWeight: 5,
      //   stepCompleteOnEnter: routeNames.ContactInformation,
      //   component: Summary,
      //   backButtonText: "Sample different Back text",
      // }
    ],
  },
  {
    stepNumber: "02",
    menuText: "Evaluation Criteria",
    path: "/exceptions",
    completePercentageWeight: 10,
    component: FairOpportunityProcess,
    stepCompleteOnEnter: routeNames.ContactInformation,
    completed: false,
    children: [
      {
        menuText: "Exception to Fair Opportunity",
        path: "exceptions",
        name: routeNames.Exceptions,
        component: Exceptions,
        completePercentageWeight: 5,
        completed: false,
      },
      {
        menuText: "No Evaluation Plan",
        path: "no-eval-plan",
        name: routeNames.NoEvalPlan,
        component: NoEvalPlan,
        completePercentageWeight: 0,
        completed: false,
        excludeFromMenu: true,
        stepCompleteOnEnter: routeNames.Exceptions,
        routeResolver: NoEvalPlanRouteResolver,
      },
      {
        menuText: "Create Evaluation Plan",
        path: "create-eval-plan",
        name: routeNames.CreateEvalPlan,
        component: CreateEvalPlan,
        completePercentageWeight: 5,
        stepCompleteOnEnter: routeNames.Exceptions,
        completed: false,
        routeResolver: CreateEvalPlanRouteResolver,
      },
      {
        menuText: "Evaluation Plan Details",
        path: "eval-plan-details",
        name: routeNames.EvalPlanDetails,
        component: EvalPlanDetails,
        completePercentageWeight: 5,
        excludeFromMenu: true,
        completed: false,
        routeResolver: EvalPlanDetailsRouteResolver,
        additionalButtons: [
          {
            buttonText: "I don’t need other assessment areas",
            buttonId: "NoOtherAssessmentAreas",
            buttonClass: "secondary",
            // name: routeNames.EvalPlanSummary, // TODO: restore when summaryu page added
            name: routeNames.PeriodOfPerformance,
          },
        ]
      },
      {
        menuText: "Proposal Required BVTO",
        path: "proposal-required-bvto",
        name: routeNames.Differentiators,
        component: Differentiators,
        completePercentageWeight: 5,
        completed: false,
        excludeFromMenu: true,
        routeResolver: BVTOResolver,
      },   
      // {
      //   menuText: "Evaluation Plan Summary",
      //   path: "eval-plan-summary",
      //   name: routeNames.EvalPlanSummary,
      //   component: EvalPlanSummary,
      //   completePercentageWeight: 0,
      //   completed: false,
      //   stepCompleteOnEnter: routeNames.CreateEvalPlan,
      //   excludeFromMenu: true,
      // },
      // KEEP JustificationAndApproval for future ticket
      // {
      //   menuText: "Justification and Approval",
      //   path: "justification-and-approval",
      //   name: routeNames.JustificationAndApproval,
      //   component: JustificationAndApproval,
      //   completePercentageWeight: 5,
      //   completed: false,
      //   excludeFromMenu: true,
      // },
    ],
  },
  {
    stepNumber: "03",
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
        stepCompleteOnEnter: routeNames.CreateEvalPlan,
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
        stepCompleteOnLeave: routeNames.PeriodOfPerformance,
        component: RecurringRequirement,
      },
      {
        name: routeNames.ContractType,
        menuText: "Contract Type",
        path: "contract-type",
        completePercentageWeight: 2,
        stepCompleteOnLeave: routeNames.ContractType,
        component: ContractType,
      },
      {
        menuText: "Classification Requirements",
        path:"classification-requirements",
        name: routeNames.ClassificationRequirements,
        completePercentageWeight: 1,
        component: ClassificationRequirements,
      },
      {
        menuText: "Security Requirements",
        path:"security-requirements",
        name: routeNames.SecurityRequirements,
        excludeFromMenu: true,
        completePercentageWeight: 1,
        component: SecurityRequirements,
        routeResolver: SecurityRequirementsResolver
      },
      {
        menuText: "CrossDomain",
        path:"cross-domain",
        name: routeNames.CrossDomain,
        excludeFromMenu: true,
        stepCompleteOnEnter: routeNames.ClassificationRequirements,
        completePercentageWeight: 1,
        component: CrossDomain,
      },
    ]
  },
  {
    stepNumber: "04",
    menuText: "Background",
    path: "/current-contract",
    completePercentageWeight: 10,
    component: Background,
    stepCompleteOnEnter: routeNames.ClassificationRequirements,
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
        stepCompleteOnLeave: routeNames.CurrentContract,
        routeResolver: CurrentContractDetailsRouteResolver,
        additionalButtons: [
          {
            buttonText: "I don’t have an existing contract",
            buttonId: "NoExistingContract",
            buttonClass: "secondary",
            name: routeNames.RequirementCategories,
            actionName: "clearCurrentContractInfo"
          },
        ],
      },
      {
        menuText: "Current Environment",
        path: "current-environment",
        name: routeNames.CurrentEnvironment,
        component: HasCurrentEnvironment,
        completePercentageWeight: 5,
        completed: false,
      },
      {
        menuText: "Upload Charts",
        path: "upload-charts",
        excludeFromMenu: true,
        name: routeNames.UploadSystemDocuments,
        component: UploadSystemDocuments,
        completePercentageWeight: 5,
        completed: false,
        routeResolver: CurrentEnvRouteResolver,
      },
      {
        menuText: "Upload Process",
        path: "upload-process",
        excludeFromMenu: true,
        name: routeNames.UploadMigrationDocuments,
        component: UploadMigrationDocuments,
        completePercentageWeight: 5,
        completed: false,
      },
      {
        menuText: "Current Environment Location",
        path: "current-environment-location",
        excludeFromMenu: true,
        name: routeNames.CurrentEnvironmentLocation,
        component: CurrentEnvironmentLocation,
        completePercentageWeight: 5,
        completed: false,
      },
      {
        menuText: "Classification Levels",
        path: "classification-levels",
        excludeFromMenu: true,
        name: routeNames.ClassificationLevels,
        component: ClassificationLevels,
        completePercentageWeight: 5,
        completed: false,
      },
      {
        menuText: "Environment Details Page",
        path: "environment-details-page",
        excludeFromMenu: true,
        name: routeNames.InstanceDetails,
        component: InstanceDetails,
        completePercentageWeight: 5,
        completed: false,
      },
      {
        menuText: "Environment Summary",
        path: "environment-summary",
        excludeFromMenu: true,
        name: routeNames.EnvironmentSummary,
        component: EnvironmentSummary,
        completePercentageWeight: 5,
        completed: false,
      },
      {
        menuText: "Replicate And Optimize",
        path: "replicate-and-optimize",
        excludeFromMenu: true,
        name: routeNames.ReplicateAndOptimize,
        component: ReplicateAndOptimize,
        completePercentageWeight: 5,
        completed: false,

      },
      {
        menuText: "Replicate Details",
        path: "replicate-details",
        excludeFromMenu: true,
        name: routeNames.ReplicateDetails,
        component: ReplicateDetails,
        completePercentageWeight: 5,
        completed: false,
        routeResolver: ReplicateDetailsResolver,
      },
      {
        menuText: "Architectural Design",
        path: "architectural-design",
        excludeFromMenu: true,
        name: routeNames.ArchitecturalDesign,
        component: ArchitecturalDesign,
        completePercentageWeight: 5,
        completed: false,
      },
      {
        menuText: "Architectural Design Details",
        path: "architectural-design-details",
        excludeFromMenu: true,
        name: routeNames.ArchitecturalDesignDetails,
        component: ArchitecturalDesignDetails,
        completePercentageWeight: 5,
        completed: false,
        routeResolver: ArchitecturalDesignDetailsRouteResolver
      },
      // {
      //   menuText: "Summary",
      //   path: "background-summary",
      //   excludeFromMenu: true,
      //   name: routeNames.BackgroundSummary,
      //   stepCompleteOnEnter: routeNames.CurrentEnvironment,
      //   component: BackgroundSummary,
      //   completePercentageWeight: 5,
      //   completed: false,
      // },
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
        stepCompleteOnEnter: routeNames.CurrentContract,
        completePercentageWeight: 1,
        component: RequirementCategories,
        routeResolver: PerformanceRequirementsPathResolver,
      },

      {
        menuText: "Architectural Design Requirements DOW",
        excludeFromMenu: true,
        path: "architectural-design-requirements-dow",
        name: routeNames.DOWArchitecturalDesign,
        completePercentageWeight: 5,
        completed: false,
        routeResolver: DOWArchitecturalDesignResolver,
        component: ArchitectureDesignDOW,
      },

      {
        menuText: "Anticipated Users and Data Needs",
        excludeFromMenu: true,
        path: "anticipated-users-and-data-needs",
        name: routeNames.AnticipatedUserAndDataNeeds,
        completePercentageWeight: 5,
        completed: false,
        routeResolver: AnticipatedUserAndDataNeedsResolver,
        component: AnticipatedUserAndDataNeeds,
      },
      {
        menuText: "Service Offerings",
        path: "service-offerings/:groupName",
        excludeFromMenu: true,
        name: routeNames.ServiceOfferings,
        completePercentageWeight: 1,
        component: ServiceOfferings,
        routeResolver: ServiceOfferingsPathResolver,
        additionalButtons: [
          {
            buttonText: "I don’t need these cloud resources",
            buttonId: "DontNeedResources",
            buttonClass: "secondary",
            actionName: "confirmServiceDeletion",
            emitText: "confirmDeleteService",
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
        menuText: "Other Service Offering Summary",
        path: "service-offerings/other/summary",
        excludeFromMenu: true,
        name: routeNames.OtherOfferingSummary,
        completePercentageWeight: 1,
        component: OtherOfferingSummary,
        routeResolver: OtherOfferingSummaryPathResolver, 
        additionalButtons: [
          {
            buttonText: "I don’t need compute resources",
            buttonId: "DontNeedResources",
            buttonClass: "secondary",
            actionName: "confirmComputeDeletion",
            emitText: "confirmDeleteCompute",
          },
        ],
      },
      {
        menuText: "Security Requirements",
        path: "dow-security-requirements",
        excludeFromMenu: true,
        name: routeNames.DOWSecurityRequirements,
        completePercentageWeight: 1,
        component: DOWSecurityRequirements,
        routeResolver: DOWSecurityRequirementsPathResolver,
      },

      {
        menuText: "DOW Summary",
        path: "dow-summary",
        excludeFromMenu: true,
        name: routeNames.DOWSummary,
        completePercentageWeight: 1,
        component: DOWSummary,
        routeResolver: DowSummaryPathResolver,
        backButtonText: "Back",
        continueButtonText: 'Wrap up this section',
      },
    ],
  },
  {
    stepNumber: "06",
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
        stepCompleteOnLeave: routeNames.ConflictOfInterest,
        component: ConflictOfInterest,
      },
      {
        name: routeNames.PackagingPackingAndShipping,
        menuText: "Packaging, Packing, and Shipping",
        path: "packaging-packing-and-shipping",
        completePercentageWeight: 2,
        stepCompleteOnLeave: routeNames.PackagingPackingAndShipping,
        component: PackagingPackingAndShipping,
      },
      {
        name: routeNames.Travel,
        menuText: "Travel",
        path: "travel",
        completePercentageWeight: 2,
        stepCompleteOnLeave: routeNames.Travel,
        component: Travel,
      },
    ]
  },

  {
    stepNumber: "07",
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
        stepCompleteOnLeave: routeNames.PII,
        excludeFromMenu: true,
        routeResolver: PIIRecordResolver
      },
      {
        menuText: "Business Associate Agreement (BAA)",
        path: "/business-associate-agreement",
        name: routeNames.BAA,
        stepCompleteOnEnter: routeNames.PII,
        stepCompleteOnLeave: routeNames.BAA,
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
        stepCompleteOnLeave: routeNames.FOIA,
        component: FOIACoordinator,
        routeResolver: FOIARecordResolver
      },
      {
        menuText: "Section 508 Standards",
        path: "/508-standards",
        name: routeNames.Section508Standards,
        stepCompleteOnEnter: routeNames.FOIA,
        completePercentageWeight: 2,
        component: Section508Standards,
      },
      {
        menuText: "Section 508 Accessibility Requirements",
        path: "/508-accessibility-reqs",
        name: routeNames.Section508AccessibilityRequirements,
        excludeFromMenu: true,
        stepCompleteOnLeave: routeNames.Section508Standards,
        completePercentageWeight: 2,
        component: Section508AccessibilityRequirements,
        routeResolver: A11yRequirementResolver
      },
    ]
  },
  {
    stepNumber: "08",
    completePercentageWeight: 7,
    menuText: "Financial Details",
    path: "/requirements-cost-estimate",
    component: IGCE,
    children: [
      {
        menuText: "Requirements Cost Estimates",
        path: "create-price-estimate",
        name: routeNames.CreatePriceEstimate,
        completePercentageWeight: 1,
        component: CreatePriceEstimate
      },
      {
        menuText: "Cannot Proceed",
        excludeFromMenu: true,
        path: "cannot-proceed",
        name: routeNames.CannotProceed,
        completePercentageWeight: 1,
        component: CannotProceed,
        routeResolver: IGCECannotProceedResolver
      },
      {
        menuText: "Optimize Or Replicate",
        excludeFromMenu: true,
        path: "optimize-or-replicate",
        name: routeNames.OptimizeOrReplicate,
        completePercentageWeight: 0,
        component: OptimizeOrReplicate,
        routeResolver: IGCEOptimizeOrReplicateResolver,
      },
      {
        menuText: "Architectural Design Solutions",
        excludeFromMenu: true,
        path: "architectural-design-solutions",
        name: routeNames.ArchitecturalDesignSolutions,
        completePercentageWeight: 0,
        component: ArchitecturalDesignSolutions,
        routeResolver: IGCEArchitecturalDesignSolutionsResolver,
      },
      {
        menuText: "Gather Price Estimates",
        excludeFromMenu: true,
        path: "gather-price-estimates",
        name: routeNames.GatherPriceEstimates,
        completePercentageWeight: 1,
        component: GatherPriceEstimates,
      },
      {
        menuText: "Training",
        excludeFromMenu: true,
        path: "training-estimate",
        name: routeNames.IGCETraining,
        completePercentageWeight: 1,
        component: IGCETraining
      },
      // {
      //   menuText: "Travel Estimates",
      //   excludeFromMenu: true,
      //   path: "travel-estimate",
      //   name: routeNames.TravelEstimates,
      //   completePercentageWeight: 1,
      //   component: TravelEstimates
      // },
      {
        menuText: "Surge Capacity",
        excludeFromMenu: true,
        path: "surge-capacity",
        name: routeNames.SurgeCapacity,
        completePercentageWeight: 1,
        component: SurgeCapacity
      },
      {
        menuText: "Surge Capabilities",
        excludeFromMenu: true,
        path: "surge-capabilities",
        name: routeNames.SurgeCapabilities,
        completePercentageWeight: 1,
        component: SurgeCapabilities,
        routeResolver: IGCESurgeCapabilities
      },
      {
        menuText: "Fee Charged",
        excludeFromMenu: true,
        path: "fee-charged",
        name: routeNames.FeeCharged,
        completePercentageWeight: 1,
        component: FeeCharged
      },
      // {
      //   menuText: "Cost Summary",
      //   excludeFromMenu: true,
      //   path: "cost-summary",
      //   name: routeNames.CostSummary,
      //   completePercentageWeight: 1,
      //   component: CostSummary
      // },
      {
        menuText: "Estimates Developed",
        excludeFromMenu: true,
        path: "estimates-developed",
        name: routeNames.EstimatesDeveloped,
        completePercentageWeight: 1,
        component: EstimatesDeveloped
      },
      {
        menuText: "Supporting Documentation",
        excludeFromMenu: true,
        path: "supporting-documentation",
        name: routeNames.SupportingDocumentation,
        completePercentageWeight: 1,
        component: SupportingDocumentation,
        routeResolver: IGCESupportingDocumentationResolver
      },
      {
        menuText: "Funding",
        path: "funding-plan",
        name: routeNames.FundingPlanType,
        completePercentageWeight: 1,
        component: FundingPlanType
      },
      {
        menuText: "MIPR",
        excludeFromMenu: true,
        path: "mipr",
        name: routeNames.MIPR,
        completePercentageWeight: 1,
        component: MIPR,
        routeResolver: MIPRResolver
      },
      {
        menuText: "G-Invoicing",
        excludeFromMenu: true,
        path: "g-invoicing",
        name: routeNames.GInvoicing,
        completePercentageWeight: 1,
        component: GInvoicing,
        routeResolver: GInvoicingResolver,
      },
      {
        menuText: "Upload-7600",
        excludeFromMenu: true,
        path: "upload-7600",
        name: routeNames.Upload7600,
        completePercentageWeight: 1,
        component: Upload7600,
        routeResolver: Upload7600Resolver
      },
      {
        menuText: "Severability and Incremental Funding",
        path: "severability-and-incremental-funding",
        name: routeNames.SeverabilityAndIncrementalFunding,
        completePercentageWeight: 1,
        component: SeverabilityAndIncrementalFunding,
      },
      {
        menuText: "Incremental Funding",
        excludeFromMenu: true,
        path: "incremental-funding",
        name: routeNames.IncrementalFunding,
        completePercentageWeight: 1,
        component: IncrementalFunding,
        routeResolver: IncrementalFundingResolver
      },
      {
        menuText: "Financial POC Form",
        excludeFromMenu: true,
        path: "financial-POC-Form",
        name: routeNames.FinancialPOCForm,
        completePercentageWeight: 1,
        component: FinancialPOCForm,
        routeResolver: FinancialPOCResolver

      },
      // {
      //   menuText: "SummaryPage",
      //   excludeFromMenu: true,
      //   path: "summary-page",
      //   name: routeNames.SummaryPage,
      //   completePercentageWeight: 1,
      //   component: SummaryPage,
      // },
    ]
  },
  {
    stepNumber: "09",
    completePercentageWeight: 7,
    menuText: "Generate Package Documents",
    path: "/upload-ja-mrr-documents",
    component: GeneratePackageDocuments,
    children: [
      {
        menuText: "Upload J&A and MRR Documents",
        path:"upload-ja-mrr-documents",
        excludeFromMenu: true,
        name: routeNames.UploadJAMRRDocuments,
        completePercentageWeight: 0,
        component: UploadJAMRRDocuments,
        routeResolver: UploadJAMRRDocumentsRouteResolver
      },
      {
        menuText: "Ready To Generate Package",
        path:"ready-to-generate-package",
        excludeFromMenu: true,
        name: routeNames.ReadyToGeneratePackage,
        completePercentageWeight: 0,
        component: ReadyToGeneratePackage,
        continueButtonText: "Generate my acquisition package"
      },
      {
        menuText: "Generate Package Documents",
        path:"generate-package-documents",
        excludeFromMenu: true,
        name: routeNames.GeneratingPackageDocuments,
        completePercentageWeight: 0,
        component: GeneratingPackageDocuments
      }
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

export const buildStepperData = (): StepperStep[] =>
  stepperRoutes.map((step) => mapStepRouteToStepperData(step));
