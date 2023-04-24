/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule, } from "vuex-module-decorators";
import rootStore from "../index";

import api from "@/api";
import { AxiosRequestConfig } from "axios"
import {TABLENAME as OrganizationTable} from "@/api/organization";
import { AgencyDTO, SystemChoiceDTO } from "@/api/models";
import  {nameofProperty, storeDataToSession, retrieveSession} from "../helpers"
import Vue from "vue";

const ATAT_ORGANIZATION_DATA_KEY = 'ATAT_ORGANIZATION_DATA_KEY';

@Module({
  name: "OrganizationData",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class OrganizationDataStore extends VuexModule {
  // NOTE: Make sure data vars that are typed are assigned a default value.
  // If left undefined, even when set with proper value, it will return undefined.
  // Also do not use `| undefined` e.g., `private foo: SelectData | undefined;` as
  // the undefined will be returned when getting the variable value.

  //has the store been initialized
  initialized = false;
  //keeps track of project title for global display
  public agency_data: AgencyDTO[] = [];
  public disa_org_data: SystemChoiceDTO[] = [];

  public get agencyData(): AgencyDTO[] {
    return this.agency_data;
  }

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this,x=> x.agency_data),
    nameofProperty(this, x=> x.disa_org_data),
  ];

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setAgencyData(value: AgencyDTO[]): void {
    this.agency_data = value;
  }

  @Action({rawError: true})
  public async getAgencyData():Promise<void>
  {
    const agencyRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "ORDERBYlabel",
        sysparm_fields: "label,title,acronym,css_id,sys_id",
      },
    };
    const agency_data = await api.agencyTable.all(agencyRequestConfig)
    this.setAgencyData(agency_data);
  }

  @Mutation
  public setDisOrgData(value: SystemChoiceDTO[]): void {
    this.disa_org_data = value;
  }

  @Action({rawError: true})
  private async getDisaOrgData():Promise<void> {
    const disa_org_data = await api.systemChoices.getChoices(
      OrganizationTable,
      "disa_organization"
    );
    this.setDisOrgData(disa_org_data);
  }

  @Mutation
  public setStoreData(sessionData: string):void{
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });

    } catch (error) {
      throw new Error('error restoring session for organization data store');
    }
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    try {
      const sessionRestored = retrieveSession(ATAT_ORGANIZATION_DATA_KEY);
      if (sessionRestored) {
        this.setStoreData(sessionRestored);
      } else {
        await this.getAgencyData();
        await this.getDisaOrgData();
        this.setInitialized(true);
        storeDataToSession(this, this.sessionProperties, ATAT_ORGANIZATION_DATA_KEY);
      }       
    } catch (error) {
      console.log(`error occurred loading organization data ${error}`)
    }
  }

  @Action({rawError: true})
  public async reset(): Promise<void> {
    sessionStorage.removeItem(ATAT_ORGANIZATION_DATA_KEY);
    this.doReset();
  }

  @Mutation
  private doReset(): void {
    this.initialized = false;
    this.agency_data = [];
    this.disa_org_data = [];
  }

}

const OrganizationData = getModule(OrganizationDataStore);
export default OrganizationData;
