import { AcquisitionPackageDTO } from "@/models/AcquisitionPackageDTO";
import { ContactDTO } from "@/models/ContactDTO";
import { OrganizationDTO } from "@/models/OrganizationDTO";
import { ProjectOverviewDTO } from "@/models/ProjectOverviewDTO";
import { FairOpportunityDTO } from "@/models/FairOpportunityDTO";
import { CurrentContractDTO } from "@/models/BackgroundDTOs";

export interface SessionData {
     acquisitionPackage: AcquisitionPackageDTO,
     projectOverview: ProjectOverviewDTO,
     organization: OrganizationDTO,
     contactInfo: ContactDTO,
     fairOpportunity: FairOpportunityDTO,
     CurrentContract: CurrentContractDTO,
}
