import { PeriodOfPerformanceDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_period_of_performance";
export class PeriodOfPerformanceApi extends TableApiBase<PeriodOfPerformanceDTO> {
  constructor() {
    super(TABLENAME);
  }
}
