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
  currentOfferingName = "";
  currentOfferingSysId = "";

  xaaSNoneValue = "XaaS_NONE";
  cloudNoneValue = "Cloud_NONE";

  returnToDOWSummary = false;
  addingGroupFromSummary = false;

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.serviceOfferings),
    nameofProperty(this, (x) => x.serviceOfferingGroups),
  ];
  
  // getters
  public get currentOfferingGroupIndex(): number {
    return this.DOWObject
      .findIndex(group=>group.serviceOfferingGroupId === this.currentGroupId);
  }

  public get currentOfferingIndex(): number {
    const groupIndex = this.currentOfferingGroupIndex;
    const offeringIndex = groupIndex > -1 ? this.DOWObject[groupIndex]
      .serviceOfferings.findIndex(offering=> offering.name 
        === this.currentOfferingName): groupIndex;
    return offeringIndex;
  }

  public get serviceOfferingsForGroup(): DOWServiceOffering[] {
    const groupIndex = this.currentOfferingGroupIndex;
    return groupIndex > -1 ? this.DOWObject[groupIndex].serviceOfferings : [];
  }

  public get validServiceGroups(): DOWServiceOfferingGroup[] {
    return this.DOWObject.filter(
      obj => obj.serviceOfferingGroupId.indexOf("NONE") === -1
    );
  }

  public get isEndOfServiceOfferings(): boolean {
    
    const offerings =  this.serviceOfferingsForGroup;
    const currentOfferingIndex = offerings
      .findIndex(offering=> offering.name === this.currentOfferingName);
    return (currentOfferingIndex + 1) === offerings.length;
  }

  public get isEndOfServiceGroups(): boolean {
    const groupIndex = this.validServiceGroups
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);
    return (groupIndex + 1) === this.validServiceGroups.length;
  }

  public get isAtBeginningOfServiceOfferings(): boolean {
    const offerings =  this.serviceOfferingsForGroup;
    const currentOfferingIndex = offerings
      .findIndex(offering=> offering.name === this.currentOfferingName);
    return currentOfferingIndex == 0; 
  }

  public get isAtBeginningOfServiceGroups(): boolean {
    const groupIndex = this.validServiceGroups
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);
    return groupIndex === 0;

  }

  public get nextServiceOffering(): { name: string, sysId: string} | undefined {
 
    const serviceOfferings = this.serviceOfferingsForGroup;

    if(!serviceOfferings.length)
    {
      return undefined;
    }

    const currentServiceIndex = serviceOfferings
      .findIndex(offering=>offering.name === this.currentOfferingName);

    if(currentServiceIndex < 0)
    {
      throw new Error(`unable to get index for current offer ${this.currentOfferingName}`);
    }

    if((currentServiceIndex + 2) <= serviceOfferings.length )
    {
      const nextOffering = serviceOfferings[currentServiceIndex + 1];
      return { name: nextOffering.name, sysId: nextOffering.sys_id }
    }

    return undefined;
  }

  public get previousServiceOffering(): { name: string, sysId: string } | undefined {

    const serviceOfferings = this.serviceOfferingsForGroup;

    if(!serviceOfferings.length)
    {
      return undefined;
    }

    const currentServiceIndex = serviceOfferings
      .findIndex(offering=>offering.name === this.currentOfferingName);

    if(currentServiceIndex < 0)
    {
      throw new Error(`unable to get index for current offer ${this.currentOfferingName}`);
    }

    if(currentServiceIndex > -1 )
    {
      const serviceIndex = currentServiceIndex > 0 ? currentServiceIndex - 1: currentServiceIndex;
      const nextOffering = serviceOfferings[serviceIndex];
      return { name: nextOffering.name, sysId: nextOffering.sys_id }
    }

    return undefined;
  }

  public get nextOfferingGroup(): string | undefined {
    const currentGroupIndex = this.validServiceGroups
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);

    if(currentGroupIndex < 0){
      return undefined;
    }

    if((currentGroupIndex + 2) <= this.validServiceGroups.length){
      const nextGroup = this.validServiceGroups[currentGroupIndex + 1].serviceOfferingGroupId;
      return nextGroup;
    }

    return undefined;
  }

  public get prevOfferingGroup(): string | undefined {

    const currentGroupIndex = this.validServiceGroups
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);

    if(currentGroupIndex < 0){
      return undefined;
    }
  
    const groupIndex = currentGroupIndex > 0 ? currentGroupIndex - 1 :  currentGroupIndex;
    const nextGroup = this.validServiceGroups[groupIndex].serviceOfferingGroupId;
    return nextGroup;
  }

  public get lastOfferingForGroup(): { name: string, sysId: string } | undefined {

    const currentGroupIndex = this.validServiceGroups
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);

    if(currentGroupIndex < 0){
      return undefined;
    }
  
    const lastOffering =  last(this.validServiceGroups[currentGroupIndex].serviceOfferings);

    return lastOffering 
      ? { name: lastOffering.name, sysId: lastOffering.sys_id } 
      : undefined;
  }

  public get canGetPreviousServiceOffering(): boolean {

    const currentOfferingIndex = this.currentOfferingIndex;

    return currentOfferingIndex >=0;
    
  }

  public get selectedServiceOfferingGroups(): string[] {
    return this.DOWObject.map(group=> group.serviceOfferingGroupId);
  }

  public get selectedServiceOfferings(): string[] {
    return this.DOWObject.map(group=>
      group.serviceOfferings.flatMap(offering=>offering.name)).flat();
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
    value.forEach((value, index) => {
      // ensure "none apply" options are last in sequence
      value.sequence = value.value.indexOf("NONE") > -1 ? 99 : index;
    });
    this.serviceOfferingGroups = value;
  }

  public currentGroupRemoved = false;
  public lastGroupRemoved = false;

  @Mutation
  public setCurrentGroupRemoved(bool: boolean): void {
    this.currentGroupRemoved = bool;
  }
  @Mutation
  public setLastGroupRemoved(bool: boolean): void {
    this.lastGroupRemoved = bool;
  }

  // removes current offering group if user clicks  the "I don't need these cloud resources"
  // button or does not select any offerings and clicks "Continue" button
  @Mutation
  public async removeCurrentOfferingGroup(): Promise<void> {
    if (!this.currentGroupRemoved) {
      const groupIdToRemove = this.currentGroupId;
      const groupIndex = this.DOWObject.findIndex(
        e => e.serviceOfferingGroupId === groupIdToRemove
      );

      const DOWObjectBeforeRemoval = _.clone(this.DOWObject);
      // remove group from DOWObject
      this.DOWObject = this.DOWObject.filter(
        obj => obj.serviceOfferingGroupId !== groupIdToRemove
      );
  
      const onlyNoneRemain = this.DOWObject.every((e) => {
        return e.serviceOfferingGroupId.indexOf("NONE") > -1;
      });

      // check if last group was removed
      if (groupIndex === DOWObjectBeforeRemoval.length - 1 || onlyNoneRemain) {
        this.lastGroupRemoved = true;
        // set currentGroupId to previous if has one
        if (DOWObjectBeforeRemoval.length > 1 && !onlyNoneRemain) {
          this.currentGroupId = DOWObjectBeforeRemoval[groupIndex -1].serviceOfferingGroupId;
        } else {
          // removed group was last in DOWObject, clear currentGroupId
          this.currentGroupId = "";
        }
      } else {
        this.lastGroupRemoved = false;
        // set currentGroupId to next group in DOWObject
        this.currentGroupId = DOWObjectBeforeRemoval[groupIndex + 1].serviceOfferingGroupId;
      }
      this.currentGroupRemoved = true; 
    }
  }

  @Mutation
  public setReturnToDOWSummary(bool: boolean): void {
    this.returnToDOWSummary = bool;
  }
  @Mutation
  public setAddingGroupFromSummary(bool: boolean): void {
    this.addingGroupFromSummary = bool;
  }

  @Mutation
  public addOfferingGroup(groupId: string): void {
    const group = this.serviceOfferingGroups.find(e => e.value === groupId)
    const offeringGroup: DOWServiceOfferingGroup = {
      serviceOfferingGroupId: groupId,
      sequence: group?.sequence || 99,
      serviceOfferings: []
    }
    this.DOWObject.push(offeringGroup);
  }

  @Mutation
  public async setSelectedOfferingGroups(selectedOfferingGroupIds: string[]): Promise<void> {
    if (selectedOfferingGroupIds.length) {
      selectedOfferingGroupIds.forEach(async (selectedOfferingGroupId) => {
        if (!this.DOWObject.some(e => e.serviceOfferingGroupId === selectedOfferingGroupId)) {
          const groupIndex = this.DOWObject.findIndex((obj) => {
            return obj.serviceOfferingGroupId === selectedOfferingGroupId
          });
          if (groupIndex === -1) {
            const group = this.serviceOfferingGroups.find(e => e.value === selectedOfferingGroupId)
            const offeringGroup: DOWServiceOfferingGroup = {
              serviceOfferingGroupId: selectedOfferingGroupId,
              sequence: group?.sequence || 99,
              serviceOfferings: []
            }
            this.DOWObject.push(offeringGroup);
          }
        }
        // remove any groups that were previously checked and now unchecked
        this.DOWObject.forEach((offeringGroup, index) => {
          const groupId = offeringGroup.serviceOfferingGroupId;
          if (!selectedOfferingGroupIds.includes(groupId)) {
            this.DOWObject.splice(index, 1);
            // todo future ticket - remove from SNOW db
          }
        });

        this.DOWObject.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
      });
    } else {
      this.DOWObject = [];
    }
    this.currentGroupId = this.DOWObject.length > 0 
      && this.DOWObject[0].serviceOfferingGroupId.indexOf("NONE") === -1 
      ? this.DOWObject[0].serviceOfferingGroupId 
      : "";
    this.currentOfferingName = "";
    this.currentOfferingSysId = "";

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
              sequence: foundOffering.sequence
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

      this.DOWObject[groupIndex].serviceOfferings.sort(
        (a, b) => parseInt(a.sequence) > parseInt(b.sequence) ? 1 : -1
      );

      this.currentOfferingName = currentOfferings.length > 0
        ? currentOfferings[0].name : "";
      this.currentOfferingSysId = currentOfferings.length > 0 
        ? currentOfferings[0].sys_id : "";
    }
  }

  @Mutation
  public async setOfferingDetails(instancesData: DOWClassificationInstance[]): Promise<void> {
    const groupIndex = this.DOWObject.findIndex(
      obj => obj.serviceOfferingGroupId === this.currentGroupId
    );
    const offeringIndex = this.DOWObject[groupIndex].serviceOfferings.findIndex(
      obj => obj.sys_id === this.currentOfferingSysId
    );
    this.DOWObject[groupIndex].serviceOfferings[offeringIndex].classificationInstances
      = instancesData;
  }

  @Mutation
  public setCurrentOffering(value: { name: string, sysId: string }): void {
    this.currentOfferingName = value.name;
    this.currentOfferingSysId = value.sysId;
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
      = currentGroup?.serviceOfferings.find((obj) => obj.name === this.currentOfferingName);
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
        sequence: obj.sequence,
        description: obj.description,
      };
      serviceOfferings.push(offering);
    })
    serviceOfferings.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
    return serviceOfferings;
  }

  @Action({ rawError: true })
  public getOfferingGroupName(): string {
    const currentGroup = this.serviceOfferingGroups.find((obj) => {
      return obj.value === this.currentGroupId;
    });
    return currentGroup?.label || "";
  }

  @Action({ rawError: true })
  public getServiceOfferingName(): string {
    return this.currentOfferingName;
  }
  
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
