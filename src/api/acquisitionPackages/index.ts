import {AcquisitionPackageDTO, AcquisitionPackageSummaryDisplay, AcquisitionPackageSummaryDTO} from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_acquisition_package";
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
