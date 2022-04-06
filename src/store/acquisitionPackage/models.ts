import { AcquisitionPackageDTO } from "@/models/AcquisitionPackageDTO";
import { ContactDTO } from "@/models/ContactDTO";
import { OrganizationDTO } from "@/models/OrganizationDTO";
import { ProjectOverviewDTO } from "@/models/ProjectOverviewDTO";
import { 
     CurrentContractExistsDTO, 
     CurrentContractDetailsDTO 
} from "@/models/BackgroundDTOs";

export interface SessionData {
     acquisitionPackage: AcquisitionPackageDTO,
     projectOverview: ProjectOverviewDTO,
     organization: OrganizationDTO,
     contactInfo: ContactDTO,
     CurrentContractExists: CurrentContractExistsDTO,
     CurrentContractDetails: CurrentContractDetailsDTO,
}