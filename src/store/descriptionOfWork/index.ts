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

import _, { last } from "lodash";
import { off } from "process";


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

  
  public get currentOfferingGroupIndex(): number {
    return this.DOWObject
      .findIndex(group=>group.serviceOfferingGroupId === this.currentGroupId);
  }

  public get currentOfferingIndex(): number {

    const groupIndex = this.currentOfferingGroupIndex;
    const offeringIndex = this.DOWObject[groupIndex]
      .serviceOfferings.findIndex(offering=> offering.name === this.currentOffering);

    return offeringIndex;
  }

  public get serviceOfferingsForGroup(): DOWServiceOffering[] {
    const groupIndex = this.currentOfferingGroupIndex;
    if(groupIndex == undefined || groupIndex < 0)
    {
      throw new Error ('unable to get current group index');
    }
    return this.DOWObject[groupIndex].serviceOfferings;
  }

  public get isEndOfServiceOfferings(): boolean {
    
    const offerings =  this.serviceOfferingsForGroup;
    const currentOfferingIndex = offerings
      .findIndex(offering=> offering.name === this.currentOffering);
    return (currentOfferingIndex + 1) === offerings.length;
  }

  public get isEndOfServiceGroups(): boolean {
    const groupIndex = this.DOWObject
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);
    return (groupIndex + 1) === this.DOWObject.length;
  }

  public get isAtBeginningOfServiceOfferings(): boolean {
    const offerings =  this.serviceOfferingsForGroup;
    const currentOfferingIndex = offerings
      .findIndex(offering=> offering.name === this.currentOffering);
    return currentOfferingIndex == 0; 
  }

  public get isAtBeginningOfServiceGroups(): boolean {
    const groupIndex = this.DOWObject
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);
    return groupIndex === 0;

  }

  public get nextServiceOffering(): string | undefined {

    const serviceOfferings = this.serviceOfferingsForGroup;

    const currentServiceIndex = serviceOfferings
      .findIndex(offering=>offering.name === this.currentOffering);

    if(currentServiceIndex < 0)
    {
      throw new Error(`unable to get index for current offer ${this.currentOffering}`);
    }

    if((currentServiceIndex + 2) <= serviceOfferings.length )
    {
      const nextOffering = serviceOfferings[currentServiceIndex + 1];
      return nextOffering.name
    }

    return undefined;
  }

  public get previousServiceOffering(): string | undefined {

    const serviceOfferings = this.serviceOfferingsForGroup;

    const currentServiceIndex = serviceOfferings
      .findIndex(offering=>offering.name === this.currentOffering);

    if(currentServiceIndex < 0)
    {
      throw new Error(`unable to get index for current offer ${this.currentOffering}`);
    }

    if(currentServiceIndex > -1 )
    {
      const nextOffering = serviceOfferings[currentServiceIndex - 1];
      return nextOffering.name
    }

    return undefined;
  }

  public get nextOfferingGroup(): string | undefined {

    const currentGroupIndex = this.DOWObject
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);

    if(currentGroupIndex < 0){

      throw new Error(`unable to get index for current offer group ${this.currentGroupId}`);
    }

    if((currentGroupIndex + 2) <= this.DOWObject.length){
      const nextGroup = this.DOWObject[currentGroupIndex + 1].serviceOfferingGroupId;
      return nextGroup;
    }

    return undefined;
  }

  public get prevOfferingGroup(): string | undefined {

    const currentGroupIndex = this.DOWObject
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);

    if(currentGroupIndex < 0){

      throw new Error(`unable to get index for current offer group ${this.currentGroupId}`);
    }

    if(currentGroupIndex > -1){
      const nextGroup = this.DOWObject[currentGroupIndex - 1].serviceOfferingGroupId;
      return nextGroup;
    }

    return undefined;
  }

  public get lastOfferingForGroup(): string | undefined {

    const currentGroupIndex = this.DOWObject
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);
    

    if(currentGroupIndex < 0){

      throw new Error(`unable to get index for current offer group ${this.currentGroupId}`);
    }
  
    const offerings = this.DOWObject[currentGroupIndex].serviceOfferings;
    const lastOffering =  this.DOWObject[currentGroupIndex].serviceOfferings[offerings.length -1];

    return lastOffering.name;
  }

  public get canGetPreviousServiceOffering(): boolean {

    const currentOfferingIndex = this.currentOfferingIndex;

    if(currentOfferingIndex < 0){
      throw new Error('unable to get current offering index');
    }
    return currentOfferingIndex -1 >= 0;
    
  }

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
              description: foundOffering.description,
            }
            currentOfferings.push(offering);
            // todo future ticket - add to SNOW db
          }
        }
      });
      
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

  @Mutation
  public setCurrentOffering(value: string): void {
    this.currentOffering = value;
  }

  @Mutation
  public setCurrentOfferingGroupId(value: string): void {
    this.currentGroupId = value;
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
    
    const serviceOfferingsForGroup = this.serviceOfferings.filter((obj) => {
      return obj.service_offering_group === this.currentGroupId;
    })
    const serviceOfferings: DOWServiceOffering[] = [];
    serviceOfferingsForGroup.forEach((obj) => {
      const offering: DOWServiceOffering = {
        name: obj.name,
        "sys_id": obj.sys_id || "",
        description: obj.description,
      };
      serviceOfferings.push(offering);
    })
    return serviceOfferings;
  }

  @Action({ rawError: true })
  public getOfferingGroupName(): string {
    
    const currentGroup = this.serviceOfferingGroups.find((obj) => {
      return obj.value === this.currentGroupId;
    });
    
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
