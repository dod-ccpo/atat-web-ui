import {CurrentEnvironmentInstanceDTO} from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_current_environment_instance";
export class CurrentEnvironmentInstanceAPI extends TableApiBase<CurrentEnvironmentInstanceDTO> {
  constructor() {
    super(TABLENAME);
  }
}
