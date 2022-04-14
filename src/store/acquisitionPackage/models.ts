import {
  AcquisitionPackageDTO,
  ContactDTO,
  CurrentContractDTO,
  FairOpportunityDTO,
  GFEOverviewDTO,
  OrganizationDTO,
  ProjectOverviewDTO,
  SensitiveInformationDTO,
} from "@/api/models";

export interface SessionData {
  acquisitionPackage: AcquisitionPackageDTO;
  projectOverview: ProjectOverviewDTO;
  organization: OrganizationDTO;
  contactInfo: ContactDTO;
  corInfo: ContactDTO;
  acorInfo: ContactDTO;
  fairOpportunity: FairOpportunityDTO;
  CurrentContract: CurrentContractDTO;
  SensitiveInformation: SensitiveInformationDTO;
  GFEOverview: GFEOverviewDTO;
}
