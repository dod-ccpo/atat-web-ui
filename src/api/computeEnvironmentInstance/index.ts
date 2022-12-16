import { ComputeEnvironmentInstanceDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_compute_environment_instance";
export class ComputeEnvironmentInstanceAPI extends TableApiBase<ComputeEnvironmentInstanceDTO> {
  constructor() {
    super(TABLENAME);
  }
}