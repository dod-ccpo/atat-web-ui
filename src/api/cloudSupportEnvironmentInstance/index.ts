import { CloudSupportEnvironmentInstanceDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_cloud_support_environment_instance";
export class CloudSupportEnvironmentInstanceAPI 
  extends TableApiBase<CloudSupportEnvironmentInstanceDTO> {
  constructor() {
    super(TABLENAME);
  }
}