import { TableApiBase } from "../tableApiBase";
import {RequirementsCostEstimateFlat} from "@/api/models";

export const TABLENAME = "x_g_dis_atat_requirements_cost_estimate";
export class RequirementsCostEstimateApi extends TableApiBase<RequirementsCostEstimateFlat> {
  constructor() {
    super(TABLENAME);
  }
}
