/* eslint-disable camelcase */
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "@/store";
import { UserSearchResultDTO } from "@/api/models";
import { AxiosRequestConfig } from "axios";
import { api } from "@/api";

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
  public controller = new AbortController();

  @Action({rawError: true})
  public async triggerAbort(): Promise<void> {
    this.controller.abort();
    await this.doResetAbortController();
  }
  
  /**
   * Searches for an active user by name, email. Returns a specific set of columns that are needed
   * for the use case instead of all the columns to protect user information.
   */
  @Action({rawError: true})
  public async searchUserByNameAndEmail(searchStr: string):
    Promise<UserSearchResultDTO[]> {
    try {
      if (searchStr) {
        const response = await api.userTable.search(searchStr);
        return response;  
      }
      return [];
    } catch (error) {
      await this.doResetAbortController();
      throw new Error("error occurred searching for users :" + error);
    }
  }

  @Mutation
  public async doResetAbortController(): Promise<void> {
    this.controller = new AbortController();
  }
}

const UserManagement = getModule(UserManagementStore);
export default UserManagement;
