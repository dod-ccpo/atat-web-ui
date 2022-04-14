import {
  AcquisitionPackageDTO,
  ContactDTO,
  OrganizationDTO,
  ProjectOverviewDTO,
  FairOpportunityDTO,
  CurrentContractDTO,
  SensitiveInformationDTO,
  RequirementsCostEstimateDTO,
  PeriodOfPerformanceDTO,
} from "@/api/models";

export interface SessionData {
  acquisitionPackage: AcquisitionPackageDTO;
  projectOverview: ProjectOverviewDTO;
  organization: OrganizationDTO;
  contactInfo: ContactDTO;
  corInfo: ContactDTO;
  acorInfo: ContactDTO;
  fairOpportunity: FairOpportunityDTO;
  periodOfPerformance: PeriodOfPerformanceDTO;
  CurrentContract: CurrentContractDTO;
  SensitiveInformation: SensitiveInformationDTO;
  requirementsCostEstimate: RequirementsCostEstimateDTO;
}
