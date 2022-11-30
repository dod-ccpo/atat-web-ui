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

  currentUser: UserDTO = initialUser();

  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.currentUser)
  ];


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
    } else {
      if(sessionStorage.getItem('userId')){
        const tempUser = await api.userTable.retrieve(
          sessionStorage.getItem('userId') as string
        );

        if(tempUser){
          this.currentUser.first_name = tempUser.first_name;
          this.currentUser.last_name = tempUser.last_name;
          this.currentUser.name = tempUser.name;
          this.currentUser.email = tempUser.email;
          this.currentUser.sys_id = tempUser.sys_id;
          this.currentUser.user_name = tempUser.user_name;
          this.currentUser.last_login_time = tempUser.last_login_time;
        }
        storeDataToSession(this, this.sessionProperties, ATAT_USER_KEY);
      }  
    }
    this.setInitialized(true);
    
  }
}

const CurrentUserStore = getModule(UserStore);
export default CurrentUserStore;