/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule,} from "vuex-module-decorators";
import rootStore from "../index";

import api from "@/api";
import {TABLENAME as OrganizationTable} from "@/api/organization";
import { SystemChoiceDTO } from "@/api/models";


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
  public service_agency_data: SystemChoiceDTO[] = [];
  public disa_org_data: SystemChoiceDTO[] = [];


  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setServiceAgencyData(value: SystemChoiceDTO[]): void {

    this.service_agency_data = value;

  }

  @Action({rawError: true})
  private async getServiceAgencyData():Promise<void>
  {
    const service_agency_data = await api.systemChoices.getChoices(
      OrganizationTable,
      "service_agency"
    );
    this.setServiceAgencyData(service_agency_data);
  }

  @Mutation
  public setDisOrgData(value: SystemChoiceDTO[]): void {

    this.disa_org_data = value;

  }

  @Action({rawError: true})
  private async getDisaOrgData():Promise<void>
  {
    const disa_org_data = await api.systemChoices.getChoices(
      OrganizationTable,
      "disa_organization"
    );
    this.setDisOrgData(disa_org_data);
  }




  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    try {

      await this.getServiceAgencyData();
      await this.getDisaOrgData();
      this.setInitialized(true);
        
    } catch (error) {
      console.log(`error occurred loading organization data ${error}`)
    }
  }

}

const OrganiationData = getModule(OrganizationDataStore);
export default OrganiationData;
