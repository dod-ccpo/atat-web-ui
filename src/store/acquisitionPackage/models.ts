import {
  AcquisitionPackageDTO,
  ClassificationLevelDTO,
  ContactDTO,
  ContractConsiderationsDTO,
  ContractTypeDTO,
  CurrentContractDTO,
  FairOpportunityDTO,
  GFEOverviewDTO,
  OrganizationDTO,
  PeriodOfPerformanceDTO,
  ProjectOverviewDTO,
  RequiredServicesDTO,
  RequirementsCostEstimateDTO,
  SensitiveInformationDTO,
  CurrentEnvironmentDTO,
  EnvironmentInstanceDTO
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
  gfeOverview: GFEOverviewDTO;
  organization: OrganizationDTO;
  periodOfPerformance: PeriodOfPerformanceDTO;
  periods: string;
  projectOverview: ProjectOverviewDTO;
  requiredServices: RequiredServicesDTO;
  requirementsCostEstimate: RequirementsCostEstimateDTO;
  sensitiveInformation: SensitiveInformationDTO;
  currentEnvironment:CurrentEnvironmentDTO;
  environmentInstance:EnvironmentInstanceDTO;
}
