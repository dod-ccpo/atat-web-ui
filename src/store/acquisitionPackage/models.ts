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
  ContractConsiderationsDTO,
} from "@/api/models";

export interface SessionData {
  acquisitionPackage: AcquisitionPackageDTO;
  projectOverview: ProjectOverviewDTO;
  organization: OrganizationDTO;
  contactInfo: ContactDTO;
  contractConsiderations: ContractConsiderationsDTO;
  corInfo: ContactDTO;
  acorInfo: ContactDTO;
  fairOpportunity: FairOpportunityDTO;
  periodOfPerformance: PeriodOfPerformanceDTO;
  CurrentContract: CurrentContractDTO;
  SensitiveInformation: SensitiveInformationDTO;
  requirementsCostEstimate: RequirementsCostEstimateDTO;
  GFEOverview: GFEOverviewDTO;
}
