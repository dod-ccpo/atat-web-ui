import { AlertDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_alert";
export class AlertApi extends TableApiBase<AlertDTO> {
  constructor() {
    super(TABLENAME);
  }
}
