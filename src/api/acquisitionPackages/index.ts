import {AcquisitionPackageDTO, AcquisitionPackageSummaryDisplay} from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_acquisition_package";
export class AcquisitionPackagesApi extends TableApiBase<AcquisitionPackageDTO> {
  constructor() {
    super(TABLENAME);
  }
}
export class AcquisitionPackagesSummaryApi extends TableApiBase<AcquisitionPackageSummaryDisplay> {
  constructor() {
    super(TABLENAME);
  }
}
