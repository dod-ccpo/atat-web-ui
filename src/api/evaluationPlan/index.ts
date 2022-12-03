import {EvaluationPlanDTO} from "../models";
import {TableApiBase} from "../tableApiBase";

export const TABLENAME = "x_g_dis_atat_evaluation_plan";

export class EvaluationPlanApi extends TableApiBase<EvaluationPlanDTO> {
  constructor() {
    super(TABLENAME);
  }
}
