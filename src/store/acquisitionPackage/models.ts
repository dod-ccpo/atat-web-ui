import {
  AcquisitionPackageDTO,
  ContactDTO,
  OrganizationDTO,
  ProjectOverviewDTO,
  FairOpportunityDTO,
  CurrentContractDTO,
} from "@/api/models";

export interface SessionData {
  acquisitionPackage: AcquisitionPackageDTO;
  projectOverview: ProjectOverviewDTO;
  organization: OrganizationDTO;
  contactInfo: ContactDTO;
  fairOpportunity: FairOpportunityDTO;
  CurrentContract: CurrentContractDTO;
}
