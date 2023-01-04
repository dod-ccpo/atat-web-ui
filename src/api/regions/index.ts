import { RegionsDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_region";
export class RegionsAPI extends TableApiBase<RegionsDTO> {
  constructor() {
    super(TABLENAME);
  }
}
