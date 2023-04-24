import { TableApiBase } from "../tableApiBase";
import { IgceEstimateDTO } from "@/api/models";

export const TABLENAME = "x_g_dis_atat_igce_estimate";
export class IgceEstimateApi extends TableApiBase<IgceEstimateDTO> {
  constructor() {
    super(TABLENAME);
  }
}
