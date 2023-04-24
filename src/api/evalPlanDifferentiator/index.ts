import {EvalPlanDifferentiatorDTO} from "../models";
import {TableApiBase} from "../tableApiBase";

export const TABLENAME = "x_g_dis_atat_eval_plan_differentiator";

export class EvalPlanDifferentiatorApi extends TableApiBase<EvalPlanDifferentiatorDTO> {
  constructor() {
    super(TABLENAME);
  }
}
