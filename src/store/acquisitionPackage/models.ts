import {
  AcquisitionPackageDTO,
  ContactDTO,
  OrganizationDTO,
  ProjectOverviewDTO,
  FairOpportunityDTO,
  CurrentContractDTO,
  SensitiveInformationDTO,
} from "@/api/models";

export interface SessionData {
  acquisitionPackage: AcquisitionPackageDTO;
  projectOverview: ProjectOverviewDTO;
  organization: OrganizationDTO;
  contactInfo: ContactDTO;
  fairOpportunity: FairOpportunityDTO;
  CurrentContract: CurrentContractDTO;
  SensitiveInformation: SensitiveInformationDTO
}
