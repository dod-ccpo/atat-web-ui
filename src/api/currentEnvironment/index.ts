import { CurrentEnvironmentDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_current_environment";
export class CurrentEnvironmentAPI extends TableApiBase<CurrentEnvironmentDTO> {
  constructor() {
    super(TABLENAME);
  }
}
