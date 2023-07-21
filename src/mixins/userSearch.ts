import Vue from "vue";
import UserManagement, { UserSearchObj } from "@/store/user/userManagement";
import _ from "lodash";
import { Component, Watch } from "vue-property-decorator";
import { User } from "types/Global";

@Component({})

export default class UserSearch extends Vue {
  public searchString = "";
  public isSearching = false;
  public searchObj: UserSearchObj = _.cloneDeep(UserManagement.initialSearchObj);
  public userSelectedList: User[] = [];

  public get showNoResults(): boolean {
    return this.searchObj.noResults && !!this.searchString
  }  

  public get OKDisabled(): boolean {
    return this.userSelectedList.length === 0;
  }

  public get showSearchResults(): boolean {
    return this.searchObj.searchResults.length > 0;
  }

  public get showRefineSearchMessage(): boolean {
    return this.searchObj.searchResults.length === 100;
  }

  public async onUserSearchValueChange(searchStr: string): Promise<void> {
    if (!this.isSearching && searchStr) {
      await UserManagement.doResetAbortController();
      await this.clearResults();
      this.isSearching = true;
      this.searchObj.isLoading = true;
      const response = await UserManagement.searchUserByNameAndEmail(searchStr)
      this.searchObj.searchResults = response.map(userSearchDTO => {
        /* eslint-disable camelcase */
        return {
          sys_id: userSearchDTO.sys_id,
          firstName: userSearchDTO.first_name,
          lastName: userSearchDTO.last_name,
          fullName: userSearchDTO.name,
          email: userSearchDTO.email,
          phoneNumber: userSearchDTO.phone,
          agency: userSearchDTO.company ? "(" + userSearchDTO.company + ")" : "",
          title: userSearchDTO.title ? ", " + userSearchDTO.title : "",
        }
        /* eslint-enable camelcase */
      });
  
      this.searchObj.noResults = this.searchObj.searchResults.length === 0;
      this.searchObj.isLoading = false;
      this.isSearching = false;
    } else {
      await UserManagement.triggerAbort();
      this.searchObj = await UserManagement.resetSearchObj();       
      this.isSearching = false;
      if (searchStr) {
        await this.onUserSearchValueChange(searchStr);
      }
    }
  }

  public async clearResults(): Promise<void> {
    this.searchObj.isLoading = false;
    this.searchObj.searchResults = [];      
    await UserManagement.triggerAbort();
  }


  @Watch("searchString")
  public async searchStringChanged(newVal: string, oldVal: string): Promise<void> {
    this.searchObj.noResults = false;
    this.searchObj.alreadyInvited = false
    await this.debouncedSearch(newVal, oldVal)
  }

  public debouncedSearch = _.debounce(async (newVal: string, oldVal: string) => {
    if (newVal && newVal !== oldVal && newVal.trim().length > 2 && !this.isSearching) {
      await this.onUserSearchValueChange(newVal);
    } else {  
      await this.clearResults();
    }
  }, 1000);

  public async clearSearch(): Promise<void> {
    this.searchString = "";
    this.searchObj.alreadyInvited = false;
    await this.clearResults();
  }

  /**
  * Resets the state of the modal and all the properties.
  */
  public async onCancel(): Promise<void> {
    this.searchString = "";
    this.searchObj = await UserManagement.resetSearchObj();
    await UserManagement.triggerAbort();    
  }


}
