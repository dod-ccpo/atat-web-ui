import { AxiosRequestConfig } from "axios";
import { StateDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "sys_report_map";
export class StatesApi extends TableApiBase<StateDTO> {
  constructor() {
    super(TABLENAME);
  }


  async all(): Promise<StateDTO[]> {
    const config:AxiosRequestConfig = {
      params: {
        // eslint-disable-next-line camelcase
        sysparm_query:"active=true^ORDERBYname^keySTARTSWITHus",
        // eslint-disable-next-line camelcase
        sysparm_fields:"name,key"
      }
    }
    return await super.all(config);
  }

}
