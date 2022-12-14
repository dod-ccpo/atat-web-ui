import { DatabaseEnvironmentInstanceDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_database_environment_instance";
export class DatabaseEnvironmentInstanceAPI extends TableApiBase<DatabaseEnvironmentInstanceDTO> {
  constructor() {
    super(TABLENAME);
  }
}