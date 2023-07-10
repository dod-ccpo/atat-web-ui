/* eslint-disable camelcase */
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "@/store";
import { UserSearchResultDTO } from "@/api/models";
import { AxiosRequestConfig } from "axios";
import { api } from "@/api";
import { User } from "types/Global";

export interface UserSearchObj {
  isLoading: boolean;
  searchResults: User[];
  noResults: boolean;
  alreadyInvited: boolean;
}

export const initialSearchObj = (): UserSearchObj => {
  return {
    alreadyInvited: false,
    searchResults: [],
    noResults: false,
    isLoading: false,
  }
}

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
  public initialSearchObj = initialSearchObj();

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

  @Action
  public async sortUsersByFullName(users: User[]): Promise<User[]> {
    users.sort((a, b) => {
      if (a.fullName && b.fullName) {
        return a.fullName > b.fullName ? 1 : -1;
      } else {
        return 0;
      }
    });
    return users;  
  }

  @Action
  public async resetSearchObj(): Promise<UserSearchObj> {
    return initialSearchObj();
  }

  @Action
  public async isAlreadyListed(
    data: {
      sysId: string, users1: User[], users2: User[]
    }
  ): Promise<boolean> {
    const found1 = data.users1.find(usr => usr.sys_id === data.sysId);
    const found2 = data.users2.find(usr => usr.sys_id === data.sysId);
    return found1 !== undefined || found2 !== undefined;
  }

}

const UserManagement = getModule(UserManagementStore);
export default UserManagement;
