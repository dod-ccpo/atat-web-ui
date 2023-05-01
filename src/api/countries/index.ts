import { AxiosRequestConfig } from "axios";
import { CountryDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "core_country";
export class CountriesApi extends TableApiBase<CountryDTO> {
  constructor() {
    super(TABLENAME);
  }


  async all(): Promise<CountryDTO[]> {
    const config:AxiosRequestConfig = {
      params: {
        // eslint-disable-next-line camelcase
        sysparm_query:"active=true^ORDERBYname",
        // eslint-disable-next-line camelcase
        sysparm_fields:"name,iso3166_2,sys_id"
      }
    }
    return await super.all(config);
  }

}
