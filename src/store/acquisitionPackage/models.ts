import {
  AcquisitionPackageDTO,
  ClassificationLevelDTO,
  ContactDTO,
  ContractConsiderationsDTO,
  ContractTypeDTO,
  CurrentContractDTO,
  FairOpportunityDTO,
  FundingIncrementDTO,
  // FundingPlanAmountsDTO,
  FundingPlanDTO,
  GFEOverviewDTO,
  OrganizationDTO,
  PeriodOfPerformanceDTO,
  ProjectOverviewDTO,
  RequiredServicesDTO,
  RequirementsCostEstimateDTO,
  SensitiveInformationDTO,
} from "@/api/models";

export interface SessionData {
  acquisitionPackage: AcquisitionPackageDTO;
  acorInfo: ContactDTO;
  classificationLevel: ClassificationLevelDTO;
  contactInfo: ContactDTO;
  contractConsiderations: ContractConsiderationsDTO;
  corInfo: ContactDTO;
  contractType: ContractTypeDTO;
  currentContract: CurrentContractDTO;
  fairOpportunity: FairOpportunityDTO;
  fundingIncrement: FundingIncrementDTO,
  fundingPlan: FundingPlanDTO;
  // fundingPlanAmounts: FundingPlanAmountsDTO;
  gfeOverview: GFEOverviewDTO;
  organization: OrganizationDTO;
  periodOfPerformance: PeriodOfPerformanceDTO;
  periods: string;
  projectOverview: ProjectOverviewDTO;
  requiredServices: RequiredServicesDTO;
  requirementsCostEstimate: RequirementsCostEstimateDTO;
  sensitiveInformation: SensitiveInformationDTO;
}