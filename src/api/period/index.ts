import { TableApiBase } from "../tableApiBase";
import { PeriodDTO } from "@/api/models";

export const TABLENAME = "x_g_dis_atat_period";

export class PeriodApi extends TableApiBase<PeriodDTO> {
  constructor() {
    super(TABLENAME);
  }

}
