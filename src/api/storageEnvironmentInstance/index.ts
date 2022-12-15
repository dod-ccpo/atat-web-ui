import { StorageEnvironmentInstanceDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_storage_environment_instance";
export class StorageEnvironmentInstanceAPI extends TableApiBase<StorageEnvironmentInstanceDTO> {
  constructor() {
    super(TABLENAME);
  }
}