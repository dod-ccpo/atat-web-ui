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
import { AxiosRequestConfig } from "axios";
import { User } from "types/Global";
import { convertColumnReferencesToValues } from "@/api/helpers";
import {
  AcquisitionPackageSummarySearchDTO, 
  CompanyDTO,
  PortfolioSummarySearchDTO, 
  UserDTO 
} from "@/api/models";
import AcquisitionPackageSummary from "../acquisitionPackageSummary";
import PortfolioSummary from "../portfolioSummary";


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

  currentUser: UserDTO = {};

  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.currentUser)
  ];

  @Action({rawError: true})
  public async resetUser(): Promise<void> {
    this.setInitialized(false);
    sessionStorage.removeItem(ATAT_USER_KEY);
    this.setCurrentUser({});
    await this.ensureInitialized();
  }

  public get getCurrentUserData(): UserDTO {
    return this.currentUser;
  }

  @Action({rawError: true})
  public async getCurrentUser(): Promise<UserDTO> {
    await this.ensureInitialized();
    return this.currentUser as UserDTO;
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
  public async hasPackages(): Promise<boolean> {

    let userHasPackages = false;

    const searchDTO:AcquisitionPackageSummarySearchDTO = {
      acquisitionPackageStatus: "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER",
      searchString: "",
      sort: "DESCsys_updated_on",
      limit: 5,
      offset: 0
    };

    const packageData = await AcquisitionPackageSummary
      .searchAcquisitionPackageSummaryList(searchDTO);

    userHasPackages = packageData.total_count > 0;

    return userHasPackages;
  }

  public userHasPortfolios = false;
 
  @Action({rawError: true})
  public async hasPortfolios(): Promise<boolean> {
    const searchDTO:PortfolioSummarySearchDTO = {
      role: "ALL",
      fundingStatuses: [],
      csps: [],
      portfolioStatus: "",
      sort: "DESCsys_updated_on",
      limit: 1,
      offset: 0
    };
   
    const portfolioData = await PortfolioSummary
      .searchPortfolioSummaryList(searchDTO);
    const hasPortfolios = portfolioData.total_count > 0;
    await this.doSetUserHasPortfolios(hasPortfolios);
    return this.userHasPortfolios;
  }
  @Mutation
  public async doSetUserHasPortfolios(bool: boolean): Promise<void> {
    this.userHasPortfolios = bool;
  }
  public get getUserHasPortfolios(): boolean {
    return this.userHasPortfolios;
  }


  @Action({rawError: true})
  async ensureInitialized(): Promise<void> {
    await this.initialize();
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    if(this.initialized)
      return;

    const sessionRestored = retrieveSession(ATAT_USER_KEY);
    const userId = sessionStorage.getItem('userId');
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
      this.setInitialized(true);
    } else if (userId) {
      const response = await api.userTable.search(userId);
      if (response) {
        const userObj: UserDTO = response[0];
        this.setCurrentUser(userObj);
        storeDataToSession(this, this.sessionProperties, ATAT_USER_KEY);
        this.setInitialized(true);
      }
    }    
  }

  @Action({rawError: true})
  public async getUserRecord(searchStr: string): Promise<User> {
    const user: User = {};
    try {
      const response = await api.userTable.search(searchStr);
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