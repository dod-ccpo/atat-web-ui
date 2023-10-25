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
import DAPPSChecklist from "@/steps/01-AcquisitionPackageDetails/DAPPSChecklist.vue";
import ContractingOfficeInfo from "@/steps/01-AcquisitionPackageDetails/ContractingOfficeInfo.vue";
import SummaryStepOne from "@/steps/01-AcquisitionPackageDetails/SummaryStepOne.vue";

// Step 2 - Evaluation Criteria
import FairOpportunityProcess from "../steps/02-EvaluationCriteria/Index.vue"
import Exceptions from "../steps/02-EvaluationCriteria/Exceptions.vue";

// J&A
import ProposedCSP from "../steps/02-EvaluationCriteria/JandA/ProposedCSP.vue";
import DescriptionOfJustification 
  from "../steps/02-EvaluationCriteria/JandA/DescriptionOfJustification.vue";
import MinimumRequirements from "../steps/02-EvaluationCriteria/JandA/MinimumRequirements.vue";
import SoleSourceCause from "../steps/02-EvaluationCriteria/JandA/SoleSourceCause.vue";
import SoleSourceReview from "../steps/02-EvaluationCriteria/JandA/SoleSourceReview.vue";
import UniqueSource from "../steps/02-EvaluationCriteria/JandA/UniqueSource.vue";
import ProcurementDiscussion from "../steps/02-EvaluationCriteria/JandA/ProcurementDiscussion.vue";
import ImpactOfRequirement from "../steps/02-EvaluationCriteria/JandA/ImpactOfRequirement.vue";
// MRR
import MRRNeed from "../steps/02-EvaluationCriteria/MRR/MRRNeed.vue";
import MarketResearchEfforts from "../steps/02-EvaluationCriteria/MRR/MarketResearchEfforts.vue";
import MarketResearchReview from "../steps/02-EvaluationCriteria/MRR/MarketResearchReview.vue";
import WhoConductedResearch from "../steps/02-EvaluationCriteria/MRR/WhoConductedResearch.vue";
import OtherSupportingFactors from "../steps/02-EvaluationCriteria/MRR/OtherSupportingFactors.vue";
import RemoveBarriers from "../steps/02-EvaluationCriteria/MRR/RemoveBarriers.vue";
import ReviewBarriers from "../steps/02-EvaluationCriteria/MRR/ReviewBarriers.vue";
import CertificationPOCs from "../steps/02-EvaluationCriteria/MRR/CertificationPOCs.vue";


// Eval Plan
import CreateEvalPlan from "../steps/02-EvaluationCriteria/EvalPlan/CreateEvalPlan.vue";
import EvalPlanDetails from "../steps/02-EvaluationCriteria/EvalPlan/EvalPlanDetails.vue";
import Differentiators from "../steps/02-EvaluationCriteria/EvalPlan/Differentiators.vue";
import SummaryStepTwo from "@/steps/02-EvaluationCriteria/SummaryStepTwo.vue"
//Step 3 - Background
import Background from "../steps/03-Background/Index.vue";
import CurrentContract from "../steps/03-Background/CurrentContract/CurrentContract.vue";
import CurrentContractDetails
  from "../steps/03-Background/CurrentContract/CurrentContractDetails.vue";
import ProcurementHistorySummary
  from "../steps/03-Background/CurrentContract/ProcurementHistorySummary.vue";
import HasCurrentEnvironment 
  from "../steps/03-Background/CurrentEnvironment/CurrentEnvironment.vue";
import CurrentEnvironmentLocation
  from "@/steps/03-Background/CurrentEnvironment/CurrentEnvironmentLocation.vue";
import ClassificationLevels
  from "@/steps/03-Background/CurrentEnvironment/ClassificationLevelsPage.vue";
import InstanceDetails
  from "@/steps/03-Background/CurrentEnvironment/InstanceDetails.vue";
import UploadSystemDocuments
  from "@/steps/03-Background/CurrentEnvironment/UploadSystemDocuments.vue";
import UploadMigrationDocuments
  from "@/steps/03-Background/CurrentEnvironment/UploadMigrationDocuments.vue";
import ReplicateDetails from "@/steps/03-Background/CurrentEnvironment/ReplicateDetails.vue";
import EnvironmentSummary from "@/steps/03-Background/CurrentEnvironment/EnvironmentSummary.vue";
import SummaryStepThree from "@/steps/04-ContractDetails/SummaryStepThree.vue";
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
import SummaryStepFour from "@/steps/03-Background/SummaryStepFour.vue"

// Step 5 - Performance Requirements
import PerformanceRequirementsIndex from "../steps/05-PerformanceRequirements/Index.vue";
import DOWLandingPage from "../steps/05-PerformanceRequirements/DOW/DOWLandingPage.vue";
import ArchitecturalDesign from "@/steps/05-PerformanceRequirements/DOW/ArchitecturalDesign.vue";
import ArchitecturalDesignDetails
  from "@/steps/05-PerformanceRequirements/DOW/ArchitecturalDesignDOW.vue";
import RequirementCategories
  from "../steps/05-PerformanceRequirements/DOW/RequirementCategories.vue";

import ServiceOfferings from "../steps/05-PerformanceRequirements/DOW/ServiceOfferings.vue";
import ServiceOfferingDetails 
  from "../steps/05-PerformanceRequirements/DOW/ServiceOfferingDetails.vue";
import OtherOfferingSummary 
  from "../steps/05-PerformanceRequirements/DOW/OtherOfferingSummary.vue";
import DOWSecurityRequirements
  from "../steps/05-PerformanceRequirements/DOW/DOWSecurityRequirements.vue";
import DOWSummary 
  from "../steps/05-PerformanceRequirements/DOW/SummaryStepFive.vue";
import AnticipatedUserAndDataNeeds
  from "@/steps/05-PerformanceRequirements/DOW/AnticipatedUserAndDataNeeds.vue";
import ReplicateAndOptimize
  from "@/steps/05-PerformanceRequirements/CurrentFunctions/ReplicateAndOptimize.vue";

// Step 7 - Other Contract Considerations
import ConflictOfInterest from "../steps/07-OtherContractConsiderations/ConflictOfInterest.vue";
import PackagingPackingAndShipping
  from "../steps/07-OtherContractConsiderations/PackagingPackingAndShipping.vue";
import Travel
  from "../steps/07-OtherContractConsiderations/Travel.vue";
import SummaryStepSix
  from "../steps/07-OtherContractConsiderations/SummaryStepSix.vue";

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
import SummaryStepSeven from "../steps/08-StandardsAndCompliance/SummaryStepSeven.vue";

// step 09 - Financial Details
import IGCE from "@/steps/10-FinancialDetails/IGCE/Index.vue";
import CreatePriceEstimate from "@/steps/10-FinancialDetails/IGCE/CreatePriceEstimate.vue";
import CannotProceed from "@/steps/10-FinancialDetails/IGCE/CannotProceed.vue";
import OptimizeOrReplicate from "@/steps/10-FinancialDetails/IGCE/OptimizeOrReplicate.vue";
import ArchitecturalDesignSolutions 
  from '@/steps/10-FinancialDetails/IGCE/ArchitecturalDesignSolutions.vue';
import GatherPriceEstimates from "@/steps/10-FinancialDetails/IGCE/GatherPriceEstimates.vue";
import IGCETraining from "@/steps/10-FinancialDetails/IGCE/Training.vue";
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
import GTC from "@/steps/10-FinancialDetails/GTCInformation.vue";
import RFD from "@/steps/10-FinancialDetails/RequireFundingDocuments.vue";
import CurrentlyHasFunding from "@/steps/10-FinancialDetails/CurrentlyHasFunding.vue";
import GeneratingPackageDocumentsFunding
  from "../steps/10-FinancialDetails/GeneratePackageDocumentsFunding.vue";
import Upload7600 from "@/steps/10-FinancialDetails/Upload7600.vue";
import FinancialPOCForm from "@/steps/10-FinancialDetails/FinancialPOCForm.vue";
import AppropriationOfFunds from "@/steps/10-FinancialDetails/AppropriationOfFunds.vue";
import SummaryStepEight from "@/steps/10-FinancialDetails/SummaryStepEight.vue";

// step 10 - Generate Package Documents
import GeneratePackageDocuments from "../steps/11-GeneratePackageDocuments/Index.vue";
import ReadyToGeneratePackage from "@/steps/11-GeneratePackageDocuments/ReadyToGeneratePackage.vue";
import GeneratingPackageDocuments
  from "../steps/11-GeneratePackageDocuments/GeneratePackageDocuments.vue";
import UploadSignedDocuments from "@/steps/11-GeneratePackageDocuments/UploadSignedDocuments.vue";
import ReadyToSubmit from "@/steps/11-GeneratePackageDocuments/ReadyToSubmit.vue";
import UnderReview from "@/steps/11-GeneratePackageDocuments/UnderReview.vue";

import {
  AcorsRouteResolver,
  ArchitecturalDesignResolver,
  ArchitecturalDesignDetailsResolver,
  CurrentContractRouteResolver,
  SummaryStepThreeRouteResolver,
  SummaryStepTwoRouteResolver,
  ExceptionToFairOpportunityResolver,
  CurrentContractDetailsRouteResolver,
  CurrentEnvRouteResolver,
  CurrentEnvironmentSummaryResolver,
  ProcurementHistorySummaryRouteResolver,
  CurrentEnvironmentResolver,
  ReplicateAndOptimizeResolver,
  ReplicateDetailsResolver,
  PIIRecordResolver,
  FOIARecordResolver,
  A11yRequirementResolver,
  // ContractTrainingReq,
  ServiceOfferingsPathResolver,
  OfferingDetailsPathResolver,
  DowSummaryPathResolver,
  MIPRResolver,
  CurrentlyHasFundingResolver,
  GTCInformationResolver,
  FundingPlanTypeResolver,
  Upload7600Resolver,
  AppropriationOfFundsResolver,
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
  BVTOResolver,
  ProposedCSPRouteResolver,
  MinimumRequirementsRouteResolver,
  SoleSourceFormRouteResolver,
  MRRNeedRouteResolver,
  MarketResearchFormRouteResolver,
  CertificationPOCsRouteResolver,
  EvalPlanRouteResolver,
  EvalPlanDetailsRouteResolver,
  SecurityRequirementsResolver,
  AnticipatedUserAndDataNeedsResolver,
  IGCETrainingPathResolver,
  FeeChargedResolver,
  RFDResolver,
  showDITCOPageResolver,
  ContractingInfoResolver,
  CrossDomainResolver,
  RemoveBarriersFormRouteResolver,
  OtherSupportingFactorsRouteResolver,
  conductedResearchRouteResolver,
  ClassificationRequirementsResolver,
  PeriodOfPerformanceRouteResolver,
  ContractTypeResolver,
  PIIRecordSummaryResolver,
  BAARecordSummaryResolver,
  FOIARecordSummaryResolver,
  PIIResolver,
  COIRouteResolver,
  PackagingPackingAndShippingResolver,
  TravelRouteResolver,
  SeverabilityAndIncrementalFundingResolver,
  CreatePriceEstimateResolver,
  ProjectOverviewResolver,
  OrganizationResolver,
  ContactInformationResolver,
  CorInformationResolver,
  ACorInformationQuestionResolver, 
  GeneratingPackageDocumentsFundingResolver
} from "./resolvers";


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
  SummaryStepOne: "SummaryStepOne",

  FairOpportunity: "Fair_Opportunity",
  Exceptions: "Exceptions",
  EvaluationPlan: "Evaluation_Plan",
  CreateEvalPlan: "Create_Eval_Plan",
  EvalPlanDetails: "Eval_Plan_Details",
  Differentiators: "Proposal_Required_BVTO",
  EvalPlanSummary: "Eval_Plan_Summary",
  //-----------------------------------------
  // J&A
  ProposedCSP: "Proposed_CSP",
  DescriptionOfJustification: "Description_Of_Justification",
  MinimumRequirements: "Minimum_Requirements",
  SoleSourceCause: "Sole_Source_Cause",
  SoleSourceReview: "Sole_Source_Review",
  UniqueSource: "Unique_Source",
  ProcurementDiscussion: "Procurement_Discussion",
  ImpactOfRequirement: "Impact_Of_Requirement",
  // MRR
  MRRNeed: "MRR_Need",
  MarketResearchEfforts: "Market_Research_Efforts",
  MarketResearchReview: "Market_Research_Review",
  WhoConductedResearch: "Who_Conducted_Research",
  OtherSupportingFactors: "Other_Supporting_Factors",
  RemoveBarriers: "Remove_Barriers",
  ReviewBarriers: "Review_Barriers",
  CertificationPOCs: "Certification_POCs",
  SummaryStepTwo: "SummaryStepTwo",
  //-----------------------------------------

  Background: "Background",
  CurrentContract: "Current_Contract",
  CurrentContractDetails: "Current_Contract_Details",
  ProcurementHistorySummary: "Procurement_History_Summary",
  CurrentEnvironment:"Current_Environment",
  DOWLandingPage: "DOW_Landing_Page",
  RequirementCategories: "Requirement_Categories",
  // DOWArchitecturalDesign: "DOW_Architectural_Design",
  ServiceOfferings: "Service_Offerings",
  ServiceOfferingDetails: "Service_Offering_Details",
  OtherOfferingSummary: "Other_Offering_Summary",
  DOWSecurityRequirements: "DOW_Security_Requirements",
  DOWSummary: "DOW_Summary",
  OptimizeCurrentEnvironment: "Optimize_Current_Environment",
  AnythingASAServiceXaas:"Anything_as_a_Service_Xaas",
  CloudSupportPackages: "Cloud_Support_Packages",
  PeriodOfPerformance: "Period_Of_Performance",
  SummaryStepThree: "SummaryStepThree",
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
  SummaryStepFour: "Summary_Step_Four",
  SummaryStepSix: "Summary_Step_Six",
  SummaryStepSeven: "Summary_Step_Seven",
  SummaryStepEight: "Summary_Step_Eight",
  ClassificationRequirements: "Classification_Requirements",
  SurgeCapabilities: "SurgeCapabilities",
  RequirementsCostForm: "Requirements_Cost_Form",
  MIPR: "MIPR",
  CurrentlyHasFunding: "Currently_Has_Funding",
  GTC: "GTC",
  RFD: "RFD",
  SeverabilityAndIncrementalFunding: "Severability_And_Incremental_Funding",
  IncrementalFunding: "Incremental_Funding",
  GeneratingPackageDocuments: "Generating_Package_Documents",
  GeneratingPackageDocumentsFunding: "Generating_Package_Documents_Funding",
  POPStart: "POP_Start",
  Section508AccessibilityRequirements: "Section_508_Accessibility_Requirements",
  Upload7600:'Upload_7600',
  FundingPlanType: "Funding_Plan_Type",
  FinancialPOCForm: "Financial_POC_Form",
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
  AppropriationOfFunds: "Appropriation_Of_Funds",
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
  ReadyToGeneratePackage:"Ready_To_Generate_Package",
  AnticipatedUserAndDataNeeds: "Anticipated_User_And_Data_Needs",
  UploadSignedDocuments:"Upload_Signed_Documents",
  ReadyToSubmit:"Ready_To_Submit",
  UnderReview:"Under_Review",
  DAPPSChecklist:"DAPPSChecklist",
  ContractingOfficeInfo:"Contracting_Office_Info"
};

/**
 * Stepper Route config definition
 * The menu items defined in this route drive both the Side Stepper Menu
 * and the Steps store both which invoke routing
 * Rules:
 * 1. Parent steps cannot have a name
 * 2. Parent steps need a page component with a router view defined
 * 3. All steps need to have unique names
 * 4. If a stepper route isn't meant to be rendered set it's 'excludeFromMenu' value to true
 */
export const stepperRoutes: Array<StepperRouteConfig> = [
  {
    stepNumber: "01",
    menuText: "Acquisition Package Details",
    path: "/",
    completePercentageWeight: 14,
    component: AcquisitionPackageDetails,
    completed: false,
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
    route: path as string,
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
