import { XaasEnvironmentInstanceDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_general_xaas_environmentinstance";
export class XaaSEnvironmentInstanceAPI extends TableApiBase<XaasEnvironmentInstanceDTO> {
  constructor() {
    super(TABLENAME);
  }
}