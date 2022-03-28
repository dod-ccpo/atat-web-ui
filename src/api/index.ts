import { UsersApi } from "./users";
import { AcquisitionPackagesApi } from "./acquisitionPackages";
import { ProjectOverviewApi } from "./projectOverview";
import { OrganizationApi } from "./organization";

export default {
   users: new UsersApi(),
   acquisitionPackageTable: new AcquisitionPackagesApi(),
   projectOverviewTable: new ProjectOverviewApi(),
   organizationTable: new OrganizationApi(),
}