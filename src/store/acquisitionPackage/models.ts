import {
  AcquisitionPackageDTO,
  ClassificationLevelDTO,
  ContactDTO,
  ContractConsiderationsDTO,
  ContractTypeDTO,
  CurrentContractDTO,
  FairOpportunityDTO,
  EvaluationPlanDTO,
  GFEOverviewDTO,
  OrganizationDTO,
  PeriodOfPerformanceDTO,
  ProjectOverviewDTO,
  RequiredServicesDTO,
  RequirementsCostEstimateDTO,
  SensitiveInformationDTO,
  CurrentEnvironmentDTO,
  EnvironmentInstanceDTO,
  RegionsDTO,
  PackageDocumentsSignedDTO,
  AddressDTO
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
  evaluationPlan: EvaluationPlanDTO;
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
  allowDeveloperNavigation: boolean;
  regions: RegionsDTO[];
  packageDocumentsSigned:PackageDocumentsSignedDTO
  contractingShopNonDitcoAddress:AddressDTO
}
