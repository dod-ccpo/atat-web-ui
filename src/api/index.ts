import { UsersApi } from "./users";
import { AcquisitionPackagesApi } from "./acquisitionPackages";

export default {
   users: new UsersApi(),
   acquisitionPackages: new AcquisitionPackagesApi(),
}