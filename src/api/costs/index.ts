import { CostsDTO } from "../models";
import { TableApiBase } from "../tableApiBase";

export const TABLENAME = "x_g_dis_atat_costs";

export class CostsApi extends TableApiBase<CostsDTO> {
  constructor() {
    super(TABLENAME);
  }
}
