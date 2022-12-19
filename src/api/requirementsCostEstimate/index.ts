import { TableApiBase } from "../tableApiBase";
import {RequirementsCostEstimateDFlat} from "@/api/models";

export const TABLENAME = "x_g_dis_atat_requirements_cost_estimate";
export class RequirementsCostEstimateApi extends TableApiBase<RequirementsCostEstimateDFlat> {
  constructor() {
    super(TABLENAME);
  }
}
