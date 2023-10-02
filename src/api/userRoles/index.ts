import { UserRolesDTO } from "../models";
import { AxiosError, AxiosRequestConfig } from "axios";
import { TableApiBase } from "../tableApiBase";

export const TABLENAME = "sys_user_has_role"

export class UserRolesApi extends TableApiBase<UserRolesDTO> {
  constructor() {
    super(TABLENAME);
  }

  public async getUserRoles(sysId: string): Promise<UserRolesDTO[]> {
    try {
      /* eslint-disable camelcase */
      const config: AxiosRequestConfig = {
        params: {
          sysparm_query: "user=" + sysId,
          sysparm_display_value: true,
          sysparm_exclude_reference_link: true,
          sysparm_fields: "role",
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
