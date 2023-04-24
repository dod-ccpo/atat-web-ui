import { CurrentEnvironmentDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_current_environment";
export class CurrentEnvironmentApi extends TableApiBase<CurrentEnvironmentDTO> {
  constructor() {
    super(TABLENAME);
  }
}
