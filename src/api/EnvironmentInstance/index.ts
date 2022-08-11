import { EnvironmentInstanceDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_environment_instance";
export class EnvironmentInstanceAPI extends TableApiBase<EnvironmentInstanceDTO> {
  constructor() {
    super(TABLENAME);
  }
}
