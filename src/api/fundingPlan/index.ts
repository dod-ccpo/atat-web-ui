import { FundingPlanDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_funding_plan";
export class FundingPlanApi extends TableApiBase<FundingPlanDTO> {
  constructor() {
    super(TABLENAME);
  }
}
