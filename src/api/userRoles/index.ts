import { UserRolesDTO } from "../models";
import { AxiosError, AxiosRequestConfig } from "axios";
import { ApiBase } from "../apiBase";

export const ENDPOINTNAME = "x_g_dis_atat/user_proxy/self/roles"

export class UserRolesApi extends ApiBase{
  constructor() {
    super(ENDPOINTNAME);
  }

  public async getUserRoles(filter?: string): Promise<string[]> {
    try {
      /* eslint-disable camelcase */
      const config: AxiosRequestConfig = {
        params: {
          
        }
      }
      if(filter){
        config.params = {
          filter: filter
        }
      }
      /* eslint-enable camelcase */
      const response = await this.instance.get(this.endPoint, config);
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
