/* eslint-disable camelcase */
import {Action, getModule, Module, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {UserManagementDTO} from "@/api/models";
import {AxiosRequestConfig} from "axios";
import {api} from "@/api";

/**
 * This module contains all the store and api support that is needed for searching the
 * user by various search parameters and across various use cases throughout the application.
 */
@Module({
  name: "UserManagementStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class UserManagementStore extends VuexModule {
  /**
   * Searches for an active user by name, email. Returns a specific set of columns that are needed
   * for the use case instead of all the columns to protect user information.
   */
  @Action({rawError: true})
  public async searchUserByNameAndEmail(searchBy: string):
    Promise<UserManagementDTO[]> {
    try {
      const searchQuery = `^nameLIKE${searchBy}^ORemailLIKE${searchBy}^active=true`;
      const userSearchRequestConfig: AxiosRequestConfig = {
        params: {
          sysparm_fields: 'sys_id,name,first_name,last_name,email,department',
          sysparm_display_value: "department",
          sysparm_query: searchQuery
        }
      };
      return await api.userTable.getQuery(userSearchRequestConfig);
    } catch (error) {
      throw new Error("error occurred searching for users :" + error);
    }
  }
}

const UserManagement = getModule(UserManagementStore);
export default UserManagement;
