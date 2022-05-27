import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import { ServiceOfferingDTO, SystemChoiceDTO } from "@/api/models";
import {TABLENAME as ServiceOfferingTableName } from "@/api/serviceOffering"
import {
  nameofProperty,
  storeDataToSession,
  retrieveSession,
} from "../helpers";
import Vue from "vue";
import { 
  stringObj, 
  DOWServiceOfferingGroup, 
  DOWServiceOffering, 
  DOWClassificationInstance 
} from "../../../types/Global";

import _ from "lodash";


const ATAT_DESCRIPTION_OF_WORK_KEY = "ATAT_DESCRIPTION_OF_WORK_KEY";

@Module({
  name: "DescriptionOfWork",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class DescriptionOfWorkStore extends VuexModule {
  initialized = false;
  serviceOfferings: ServiceOfferingDTO[] = [];
  serviceOfferingGroups: SystemChoiceDTO[] = [];

  // selectedOfferingGroups: stringObj[] = [];
  DOWObject: DOWServiceOfferingGroup[] = [];

  currentGroupId = "";
  currentOffering = "";

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.serviceOfferings),
    nameofProperty(this, (x) => x.serviceOfferingGroups),
  ];

  @Mutation
  private setInitialized(value: boolean) {
    this.initialized = value;
  }

  @Mutation
  private setServiceOfferings(value: ServiceOfferingDTO[]) {
    this.serviceOfferings = value;
  }

  @Mutation
  private setServiceOfferingGroups(value: SystemChoiceDTO[]) {
    this.serviceOfferingGroups = value;
  }

  @Mutation
  public setSelectedOfferingGroups(selectedOfferingGroups: string[]): void {
    selectedOfferingGroups.forEach((selectedOfferingGroup) => {
      if (!this.DOWObject.some(e => e.serviceOfferingGroupId === selectedOfferingGroup)) {
        const offeringGroup: DOWServiceOfferingGroup = {
          serviceOfferingGroupId: selectedOfferingGroup,
          serviceOfferings: []
        }
        this.DOWObject.push(offeringGroup);
      }
      // remove any groups that were previously checked
      this.DOWObject.forEach((offeringGroup, index) => {
        const groupId = offeringGroup.serviceOfferingGroupId;
        if (!selectedOfferingGroups.includes(groupId)) {
          this.DOWObject.splice(index, 1);
          // todo future ticket - remove from SNOW db
        }
      });
      this.currentGroupId = this.DOWObject[0].serviceOfferingGroupId;
      this.currentOffering = "";
    });
  }

  @Mutation
  public async setSelectedOfferings(selectedOfferingSysIds: string[]): Promise<void> {
    const groupIndex 
      = this.DOWObject.findIndex((obj) => obj.serviceOfferingGroupId === this.currentGroupId);
    if (groupIndex >= 0) {
      const currentOfferings = this.DOWObject[groupIndex].serviceOfferings;
      // add selectedOfferings to DOWObject
      selectedOfferingSysIds.forEach((selectedOfferingSysId) => {
        if (!currentOfferings.some((e) => e.sys_id === selectedOfferingSysId)) {
          const foundOffering 
            = this.serviceOfferings.find((e) => e.sys_id === selectedOfferingSysId);
          if (foundOffering) {
            const offering = {
              name: foundOffering.name,
              "sys_id": selectedOfferingSysId,
              classificationInstances: [],
            }
            currentOfferings.push(offering);
            // todo future ticket - add to SNOW db
          }
        }
      });
      debugger;
      // remove any service offerings previously selected but unchecked this pass
      const currentOfferingsClone = _.cloneDeep(currentOfferings);
      // const currentOfferingsClone = JSON.parse(JSON.stringify(currentOfferings));
      currentOfferingsClone.forEach((offering) => {
        const sysId = offering.sys_id;
        if (!selectedOfferingSysIds.includes(sysId)) {
          const i = currentOfferings.findIndex(e => e.sys_id === sysId);
          currentOfferings.splice(i, 1);
          // todo future ticket - remove from SNOW db
        }
      });
      this.currentOffering = currentOfferings[0].name;
    }
  }

  @Action({ rawError: true })
  public async getClassificationInstances(): Promise<DOWClassificationInstance[]> {
    const currentGroup 
      = this.DOWObject.find((obj) => obj.serviceOfferingGroupId === this.currentGroupId);
    const currentOffering
      = currentGroup?.serviceOfferings.find((obj) => obj.name === this.currentOffering);
    if (currentOffering && currentOffering.classificationInstances) {
      return currentOffering.classificationInstances;
    }
    return [];
  }


  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for contact data store");
    }
  }

  @Action({ rawError: true })
  public async getServiceOfferingGroups(): Promise<SystemChoiceDTO[]> {
    await this.ensureInitialized();
    return this.serviceOfferingGroups;
  }

  @Action({ rawError: true })
  public async getServiceOfferings(): Promise<DOWServiceOffering[]> {
    await this.ensureInitialized();
    debugger;
    const serviceOfferingsForGroup = this.serviceOfferings.filter((obj) => {
      return obj.service_offering_group === this.currentGroupId;
    })
    const serviceOfferings: DOWServiceOffering[] = [];
    serviceOfferingsForGroup.forEach((obj) => {
      const offering: DOWServiceOffering = {
        name: obj.name,
        "sys_id": obj.sys_id || "",
      };
      serviceOfferings.push(offering);
    })
    return serviceOfferings;
  }

  @Action({ rawError: true })
  public getOfferingGroupName(): string {
    debugger;
    const currentGroup = this.serviceOfferingGroups.find((obj) => {
      return obj.value === this.currentGroupId;
    });
    debugger;
    return currentGroup?.label || "";
  }

  // @Action({ rawError: true })
  // public getClassificationInstances(): {
  //   // EJY 
  // }

  // @Action({ rawError: true })
  // public async getSelectedServiceOfferingGroups(): Promise<stringObj[]> {
  //   await this.ensureInitialized();
  //   return this.selectedOfferingGroups;
  // }

  @Action({ rawError: true })
  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    if (this.initialized) {
      const sessionRestored = retrieveSession(ATAT_DESCRIPTION_OF_WORK_KEY);
      if (sessionRestored) {
        this.setStoreData(sessionRestored);
      }
    } else {
      try {
        await Promise.all([
          this.loadServiceOfferings(),
          this.LoadServiceOfferingGroups(),
        ]);
        this.setInitialized(true);
        storeDataToSession(
          this,
          this.sessionProperties,
          ATAT_DESCRIPTION_OF_WORK_KEY
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  @Action({ rawError: true })
  public async loadServiceOfferings(): Promise<void> {
    try {
      const serviceOfferings = await api.serviceOfferingTable.all();
      this.setServiceOfferings(serviceOfferings);
    } catch (error) {
      throw new Error(`error loading Service Offerings ${error}`);
    }
  }

  @Action({rawError: true})
  public async LoadServiceOfferingGroups(): Promise<void> {
    try {
      const serviceOfferingGroups = await api.systemChoices
        .getChoices(ServiceOfferingTableName, "service_offering_group");
      this.setServiceOfferingGroups(serviceOfferingGroups);  
    } catch (error) {
      throw new Error(`error loading Service Offering Groups ${error}`);
    }
  }
}

const DescriptionOfWork = getModule(DescriptionOfWorkStore);
export default DescriptionOfWork;
