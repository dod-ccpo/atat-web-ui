import {
  AcquisitionPackageDTO,
  ContactDTO,
  CurrentContractDTO,
  FairOpportunityDTO,
  GFEOverviewDTO,
  OrganizationDTO,
  ProjectOverviewDTO,
  SensitiveInformationDTO,
  RequirementsCostEstimateDTO,
  PeriodOfPerformanceDTO,
  ContractTypeDTO,
  ContractConsiderationsDTO,
  FundingPlanDTO,
} from "@/api/models";

export interface SessionData {
  acquisitionPackage: AcquisitionPackageDTO;
  acorInfo: ContactDTO;
  contactInfo: ContactDTO;
  contractConsiderations: ContractConsiderationsDTO;
  corInfo: ContactDTO;
  contractType: ContractTypeDTO;
  currentContract: CurrentContractDTO;
  fairOpportunity: FairOpportunityDTO;
  gFEOverview: GFEOverviewDTO;
  organization: OrganizationDTO;
  periods: string;
  periodOfPerformance: PeriodOfPerformanceDTO;
  projectOverview: ProjectOverviewDTO;
  requirementsCostEstimate: RequirementsCostEstimateDTO;
  SensitiveInformation: SensitiveInformationDTO;
}