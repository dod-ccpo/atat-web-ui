import { AcquisitionPackageDTO } from "@/models/AcquisitionPackageDTO";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_acquisition_package";
export class AcquisitionPackagesApi extends TableApiBase<AcquisitionPackageDTO> {
  constructor() {
    super(TABLENAME);
  }
}
