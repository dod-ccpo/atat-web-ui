import { FeedbackOptionsDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_dapps_feedback_options_table";
export class FeedbackOptionsAPI extends TableApiBase<FeedbackOptionsDTO> {
  constructor() {
    super(TABLENAME);
  }
}
