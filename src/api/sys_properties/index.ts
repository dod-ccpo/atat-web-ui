/* eslint-disable camelcase */
import { SystemPropertiesDTO } from "../models";
import { TableApiBase } from "../tableApiBase";

const TABLENAME = "sys_properties";

/**
 * Api extention to retrieve table column choice values
 */
export class SysPropertiesApi extends TableApiBase<SystemPropertiesDTO> {
  constructor() {
    super(TABLENAME);
  }

}