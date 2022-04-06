import { AcquisitionPackageDTO } from "@/models/AcquisitionPackageDTO";
import { ContactDTO } from "@/models/ContactDTO";
import { OrganizationDTO } from "@/models/OrganizationDTO";
import { ProjectOverviewDTO } from "@/models/ProjectOverviewDTO";
import { BackgroundDTO } from "@/models/BackgroundDTO";

export interface SessionData {

     acquisitionPackage: AcquisitionPackageDTO,
     projectOverview: ProjectOverviewDTO,
     organization: OrganizationDTO,
     contactInfo: ContactDTO,
     background: BackgroundDTO,
}