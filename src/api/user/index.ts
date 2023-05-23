import { ApiBase } from "../apiBase";
import { UserDTO } from "../models";
import { AxiosError, AxiosRequestConfig } from "axios";

export const ENDPOINTNAME = "x_g_dis_atat/user_proxy"

export class UserApi extends ApiBase {
  constructor() {
    super(ENDPOINTNAME);
  }
  
  public async search(searchStr: string): Promise<UserDTO[]> {
    try {

      // eslint-disable-next-line max-len
      let searchQuery = `^first_nameSTARTSWITH${searchStr}^ORlast_nameSTARTSWITH${searchStr}^ORemailSTARTSWITH${searchStr}^emailISNOTEMPTY`;
      
      if (/^[A-Za-z0-9_.-]+@[A-Za-z0-9.-]+$/i.test(searchStr)) {
        // complete valid email -- search email equals
        searchQuery = `^email=${searchStr}`;
      } else if (/\d/.test(searchStr)) {
        searchQuery = `^emailSTARTSWITH${searchStr}^ORsys_idSTARTSWITH${searchStr}`
      } else if (searchStr.includes("@")) {
        // incomplete email - search email starts with
        searchQuery = `^emailSTARTSWITH${searchStr}`;
      } else if (searchStr.includes(".") || searchStr.includes("_") && !searchStr.includes(" ")) {
        searchQuery = `^emailSTARTSWITH${searchStr}^ORuser_nameSTARTSWITH${searchStr}` 
      } else if (searchStr.includes(".") || searchStr.includes(" ")) {
        // likely first and last name - search name starts with
        searchQuery = `^nameSTARTSWITH${searchStr}`;
      }
      searchQuery += `^active=true`;

      /* eslint-disable camelcase */
      const requestConfig: AxiosRequestConfig = {
        params: {
          sysparm_fields: "sys_id,name,first_name,last_name,user_name,email," +
            "mobile_phone,phone,home_phone,title",
          sysparm_display_value: "company",
          sysparm_query: searchQuery
        }
      };
      /* eslint-enable camelcase */
      const response = await this.instance.get(this.endPoint, requestConfig);
      if (response.status === 200) {
        const { result } = response.data;
        return result;
      } else {
        const { error } = response.data;
        return error;
      }
    } catch(error) {
      const axiosError = error as AxiosError;
      if (axiosError.response !== undefined && axiosError.response.status === 404) {
        return [];
      }
      throw new Error(error as string)
    }
  }
}