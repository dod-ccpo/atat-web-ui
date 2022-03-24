import { AcquisitionPackageDTO } from "@/models/AcquisitionPackageDTO";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_acquisition_package";

export class AcquisitionPackagesApi extends TableApiBase {
  constructor() {
    super(TABLENAME);
  }

  async create(): Promise<AcquisitionPackageDTO> {
    try {
      const response = await this.post();
      if (response.status == 201) {
        const { result } = response.data;
        return result as AcquisitionPackageDTO;
      } else {
        throw new Error("unable to create acquisition package");
      }
    } catch (error) {
      throw new Error(`unable to create acquisition package ${error}`);
    }
  }
}
