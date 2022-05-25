import {  ServiceOfferingDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_service_offering";
export class ServiceOfferingApi extends TableApiBase<ServiceOfferingDTO> {
  constructor() {
    super(TABLENAME);
  }
}
