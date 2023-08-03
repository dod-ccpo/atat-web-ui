import { CustomerFeedbackDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_dapps_feedback";
export class FeedbackAPI extends TableApiBase<CustomerFeedbackDTO> {
  constructor() {
    super(TABLENAME);
  }
}
