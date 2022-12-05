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
import { AcquisitionPackageSummarySearchDTO, UserDTO } from "@/api/models";
import AcquisitionPackageSummary from "../acquisitionPackageSummary";

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

  @Action({rawError: true})
  async ensureInitialized(): Promise<void> {
    await this.initialize();
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    if(this.initialized)
      return;

    const sessionRestored = retrieveSession(ATAT_USER_KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
      this.setInitialized(true);
    } else {
      if(sessionStorage.getItem('userId')){
        const user = await api.userTable.retrieve(
          sessionStorage.getItem('userId') as string
        );
        if (user) {
          const userObj: UserDTO = {
            first_name: user.first_name,
            last_name: user.last_name,
            name: user.name,
            email: user.email,
            sys_id: user.sys_id,
            user_name: user.user_name,
            last_login_time: user.last_login_time,
          };

          this.setCurrentUser(userObj);
          storeDataToSession(this, this.sessionProperties, ATAT_USER_KEY);
          this.setInitialized(true);
        }
      }  
    }    
  }
}

const CurrentUserStore = getModule(UserStore);
export default CurrentUserStore;