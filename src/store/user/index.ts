/* eslint-disable camelcase */
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import api from "@/api";
import Vue from "vue";
import { User } from "types/Global";
import { convertColumnReferencesToValues } from "@/api/helpers";
import {
  PortfolioSummarySearchDTO, 
  UserDTO 
} from "@/api/models";
import AcquisitionPackageSummaryStore from "../acquisitionPackageSummary";
import PortfolioSummary from "../portfolioSummary";
import { TABLENAME as AcquisitionPackageTable } from "@/api/acquisitionPackages";
import { TABLENAME as PortfolioTable } from "@/api/portfolio";
import { getTableRecordCount } from "@/helpers";

const ATAT_USER_KEY = "ATAT_USER_KEY";

// initialUser for unit tests
const initialUser = ()=> {
  return {
    sys_id: "e0c4c728875ed510ec3b777acebb356f", // pragma: allowlist secret
    name: "Maria Missionowner ",
    first_name: "Maria",
    last_name: "Missionowner ",
    user_name: "maria.missionowner.civ@mail.mil",
    email: "maria.missionowner.civ@mail.mil",
    last_login_time: "2022-10-03 14:15:07"
  }
}

@Module({
  name: "UserStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class UserStore extends VuexModule {
  initialized = false;
  public get isInitialized(): boolean {
    return this.initialized;
  }

  currentUser: UserDTO = {};
  public currentUserPackageCount = 0;
  public currentUserPortfolioCount = 0;
  
  public currentUserRoles: string[] = [];
  public get currentUserIsHaCCAdmin(): boolean {
    return this.currentUserRoles.includes("x_g_dis_atat.hacc_admin");
  }
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.currentUser)
  ];

  public get getCurrentUserData(): UserDTO {
    return this.currentUser;
  }

  public get getInitialUser(): UserDTO {
    return initialUser();
  }

  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for user data store");
    }
  }

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setCurrentUser(value: UserDTO): void {
    this.currentUser = value;
  }

  @Action({rawError: true})
  public async setUserPackageCount(): Promise<void> {
    if (!this.initialized) {
      // SET TOTAL PACKAGE COUNT
      let query = "package_statusINDRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER";
      const userQuery = await AcquisitionPackageSummaryStore.getMandatorySearchParameterQuery();
      query += userQuery;
      const count = await getTableRecordCount(AcquisitionPackageTable, query)
      this.doSetPackageCount(count);
      await this.setUserPortfolioCount();
    }

  }
  @Mutation
  public doSetPackageCount(count: number): void {
    this.currentUserPackageCount = count;
  }
  public get getCurrentUserPackageCount(): number {
    return this.currentUserPackageCount;
  }
  public get getUserHasPackages(): boolean {
    return this.currentUserPackageCount > 0;
  }
 
  @Action({rawError: true})
  public async setUserPortfolioCount(): Promise<void> {
    // SET TOTAL PORTFOLIO COUNT
    let query = "portfolio_statusINPROCESSING,PROVISIONING_ISSUE,ACTIVE,ARCHIVED";
    const searchDTO: PortfolioSummarySearchDTO = { 
      role: "ALL" 
    };
    const userQuery = await PortfolioSummary.getMandatorySearchParameterQuery(searchDTO);
    query += userQuery;
    const count = await getTableRecordCount(PortfolioTable, query)
    await this.doSetPortfolioCount(count);
  }
  @Mutation
  public async doSetPortfolioCount(count: number): Promise<void> {
    this.currentUserPortfolioCount = count;
  }
  public get getCurrentUserPortfolioCount(): number {
    return this.currentUserPortfolioCount;
  }
  public get getUserHasPortfolios(): boolean {
    return this.currentUserPortfolioCount > 0;
  }

  @Action({rawError: true})
  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    await this.initialize();
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    const sessionRestored = retrieveSession(ATAT_USER_KEY);
    const userId = sessionStorage.getItem('userId');
    if (sessionRestored) {
      this.setInitialized(false);
      this.setStoreData(sessionRestored);
      await this.setUserRoles(this.currentUser.sys_id as string);
      await this.setUserPackageCount();
      this.setInitialized(true);
    } else if (userId && 
      (this.currentUser.sys_id === "" || this.currentUser.sys_id === undefined)
    ) {
      const response = await api.userTable.search(userId);
      if (response) {
        const userObj: UserDTO = response[0];
        this.setCurrentUser(userObj);
        await this.setUserRoles(userObj.sys_id as string);
        await this.setUserPackageCount();
        storeDataToSession(this, this.sessionProperties, ATAT_USER_KEY);
        this.setInitialized(true);
      }
    } else {
      setTimeout(async () => { 
        await this.initialize() 
      }, 500)
    } 
  }

  @Action({ rawError: true })
  public async setUserRoles(sysId: string): Promise<void> {
    const roles = await this.getUserRoles(sysId);
    await this.doSetCurrentUserRoles(roles);
  }

  @Mutation
  public async doSetCurrentUserRoles(roles: string[]): Promise<void> {
    this.currentUserRoles = roles;
  }

  @Action({rawError: true})
  public async getUserRoles(sysId: string): Promise<string[]> {
    try {
      const response = await api.userRolesTable.getUserRoles(sysId);
      return response.map(obj => obj.role);
    } catch(error) {
      throw new Error(`error retrieving alert data ${error}`);
    }
  }

  @Action({rawError: true})
  public async getUserRecord(data: {searchStr: string, searchCol?: string}): Promise<User> {
    const user: User = {};
    try {
      const response = await api.userTable.search(data.searchStr, data.searchCol);
      if (response.length) {
        const userRecord: UserDTO = convertColumnReferencesToValues(response[0]);
        user.firstName = userRecord.first_name?.trim();
        user.lastName = userRecord.last_name?.trim();
        user.salutation = userRecord.title?.trim();
        user.fullName = user.salutation 
          ? user.salutation + " " + user.firstName + " " + user.lastName
          : user.firstName + " " + user.lastName;
        user.fullNameForSort = user.salutation 
          ? user.firstName + " " + user.lastName + ", " + user.salutation
          : user.firstName + " " + user.lastName;
        
        user.email = userRecord.email;
        
        user.phoneNumber = userRecord.phone;
        user.officePhone = userRecord.phone;
        user.mobilePhone = userRecord.mobile_phone;
        user.dsnPhone = userRecord.home_phone;
        const username = userRecord.user_name;
        if (username) {
          const ext: string = username.substring(username.length - 3, username.length);
          const designations: Record<string, string> = {
            MIL: "Military",
            CIV: "Civilian",
            CTR: "Contractor",
          }
          user.designation = designations[ext];
          user.sys_id = userRecord.sys_id;
        }

      }
    }
    catch(error){
      throw new Error(`error retrieving alert data ${error}`);
    }

    return user;
  }
}

const CurrentUserStore = getModule(UserStore);
export default CurrentUserStore;