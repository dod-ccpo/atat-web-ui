import { UsersApi } from "./users";
import { AcquisitionPackagesApi } from "./acquisitionPackages";
import { ProjectOverviewApi } from "./projectOverview";

export default {
   users: new UsersApi(),
   acquisitionPackages: new AcquisitionPackagesApi(),
   projectOverview: new ProjectOverviewApi(),
}