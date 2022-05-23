import {  ServiceOfferingDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_jdb_app_service_offering";
export class ServiceOfferingApi extends TableApiBase<ServiceOfferingDTO> {
  constructor() {
    super(TABLENAME);
  }
}
