import {EvalPlanAssessmentAreaDTO} from "../models";
import {TableApiBase} from "../tableApiBase";

export const TABLENAME = "x_g_dis_atat_eval_plan_assessment_area";

export class EvalPlanAssessmentAreaApi extends TableApiBase<EvalPlanAssessmentAreaDTO> {
  constructor() {
    super(TABLENAME);
  }
}
