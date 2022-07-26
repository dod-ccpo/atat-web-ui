/* eslint-disable camelcase */
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import { ClassificationInstanceDTO, SelectedServiceOfferingDTO, 
  ServiceOfferingDTO, SystemChoiceDTO } from "@/api/models";
import {TABLENAME as ServiceOfferingTableName } from "@/api/serviceOffering"
import {
  nameofProperty,
  storeDataToSession,
  retrieveSession,
} from "../helpers";
import Vue from "vue";
import { 
  DOWServiceOfferingGroup, 
  DOWServiceOffering, 
  DOWClassificationInstance,
  ComputeData
} from "../../../types/Global";

import _, { differenceWith, last } from "lodash";
import ClassificationRequirements from "@/store/classificationRequirements";


// Classification Proxy helps keep track of saved
// Classification Instances so we can efficiently
// update the DOW object
type ClassificationInstanceProxy = {
   dowClassificationInstanceIndex: number;
   classificationInstance: ClassificationInstanceDTO;
}
// service proxy type for saving service offerings
// and associated classification instances
// helps keep track of changes and updating dow object
type ServiceOfferingProxy =  {
  serviceOffering: SelectedServiceOfferingDTO,
  classificationInstances: ClassificationInstanceProxy[]
  dowServiceGroupIndex: number,
  dowServiceIndex: number
}

//helper to map DowService offering
//from DOW object to a ServiceOffering Proxy 
// that can be saved
const mapDOWServiceOfferingToServiceProxy= 
(dowServiceOffering: DOWServiceOffering, groupIndex: number, 
  serviceIndex: number): ServiceOfferingProxy=> {

  
      
  const serviceOffering: SelectedServiceOfferingDTO = {
    service_offering : dowServiceOffering['sys_id'] || "",
    classification_instances: "",
    other_service_offering: dowServiceOffering.otherOfferingName || "",
    sys_id : dowServiceOffering.serviceId.length ? 
      dowServiceOffering.serviceId : undefined
  };


  if(serviceOffering.service_offering === "Other"){
    const soOther = ((dowServiceOffering as unknown) as ServiceOfferingDTO);

    serviceOffering.service_offering = "";
    serviceOffering.other_service_offering = soOther && soOther.other ? soOther.other : ""
  }

  const classificationInstances = dowServiceOffering
    .classificationInstances?.map((instance, instanceIndex)=> {

      const classificationInstance: ClassificationInstanceProxy = {
        dowClassificationInstanceIndex: instanceIndex,
        classificationInstance: {
          selected_periods: instance
            .selectedPeriods?.map(period=>period).join(',') || "",
          classification_level: instance.classificationLevelSysId,
          sys_id: instance.sysId,
          usage_description: instance.anticipatedNeedUsage,
          need_for_entire_task_order_duration: instance.entireDuration
        },
      }
      return classificationInstance;
    }) || [];

  
  return {
    serviceOffering,
    classificationInstances,
    dowServiceGroupIndex: groupIndex,
    dowServiceIndex: serviceIndex
  }

}

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

    //list of required services -- this is synchronized to back end
    userSelectedServiceOfferings: SelectedServiceOfferingDTO[] = [];

  currentGroupId = "";
  currentOfferingName = "";
  currentOfferingSysId = "";

  xaaSNoneValue = "XaaS_NONE";
  cloudNoneValue = "Cloud_NONE";

  returnToDOWSummary = false;
  reviewGroupFromSummary = false;
  addGroupFromSummary = false;

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.serviceOfferings),
    nameofProperty(this, (x) => x.serviceOfferingGroups),
    nameofProperty(this, (x)=> x.userSelectedServiceOfferings),
    nameofProperty(this, (x)=> x.DOWObject)
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

  public get lastOfferingGroup(): string | undefined {
    const len = this.validServiceGroups.length;
    return len ? this.validServiceGroups[len - 1].serviceOfferingGroupId : undefined;
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

  public get missingClassificationLevels(): boolean {
    return ClassificationRequirements.selectedClassificationLevels.length === 0;;
  }

  public get selectedServiceOfferingGroups(): string[] {
    return this.DOWObject.map(group=> group.serviceOfferingGroupId);
  }

  public get selectedServiceOfferings(): string[] {
    const currentGroup = this.DOWObject.find(group => 
      group.serviceOfferingGroupId === this.currentGroupId);
    if (currentGroup?.serviceOfferings) {
      return currentGroup.serviceOfferings.flatMap(offering => 
        offering.sys_id === "Other" ? "Other" : offering.name);
    }
    return [""];
  }

  public get otherServiceOfferingEntry(): string {
    const otherServiceOffer = this.serviceOfferingsForGroup
      .find(offering=>offering.sys_id === "Other");
    return otherServiceOffer ? otherServiceOffer.name : "";
  }

  public get currentOfferingGroupHasOfferings(): boolean {
    return this.serviceOfferingsForGroup.length > 0;
  }

  public summaryBackToContractDetails = false;

  @Mutation
  public setBackToContractDetails(bool: boolean): void {
    this.summaryBackToContractDetails = bool;
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
      value.sequence = value.value.indexOf("NONE") > -1 ? 99 : index + 1;
    });
    this.serviceOfferingGroups = value;
  }

  public currentGroupRemoved = false;
  public currentGroupRemovedForNav = false;
  public lastGroupRemoved = false;

  @Mutation
  public setCurrentGroupRemoved(bool: boolean): void {
    this.currentGroupRemoved = bool;
  }

  @Mutation
  public setCurrentGroupRemovedForNav(bool: boolean): void {
    this.currentGroupRemovedForNav = bool;
  }

  @Mutation
  public setLastGroupRemoved(bool: boolean): void {
    this.lastGroupRemoved = bool;
  }

  @Action
  public async removeCurrentOfferingGroup(): Promise<void> {
    await this.setSelectedOfferings({selectedOfferingSysIds: [], otherValue: ""});
    this.doRemoveCurrentOfferingGroup();
  }

  // removes current offering group if user clicks  the "I don't need these cloud resources"
  // button or does not select any offerings and clicks "Continue" button
  @Mutation
  public doRemoveCurrentOfferingGroup(): void {
    if (!this.currentGroupRemoved) {
      this.currentGroupRemovedForNav = true;    
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
  public setReviewGroupFromSummary(bool: boolean): void {
    this.reviewGroupFromSummary = bool;
  }

  @Mutation
  public setAddGroupFromSummary(bool: boolean): void {
    this.addGroupFromSummary = bool;
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

  @Action
  public async setSelectedOfferingGroups(selectedOfferingGroupIds: string[]): Promise<void> {
    this.doSetSelectedOfferingGroups(selectedOfferingGroupIds);
  }

  @Mutation
  public doSetSelectedOfferingGroups(selectedOfferingGroupIds: string[]): void {
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

  @Action 
  public async setSelectedOfferings(
    { selectedOfferingSysIds, otherValue }: { selectedOfferingSysIds: string[], otherValue: string }
  ): Promise<void> {
    this.doSetSelectedOfferings({ selectedOfferingSysIds, otherValue });
  }

  @Mutation
  public doSetSelectedOfferings(
    { selectedOfferingSysIds, otherValue }: { selectedOfferingSysIds: string[], otherValue: string }
  ): void {
    const groupIndex 
      = this.DOWObject.findIndex((obj) => obj.serviceOfferingGroupId === this.currentGroupId);
    let currentOfferings = this.DOWObject[groupIndex].serviceOfferings;
    if (groupIndex >= 0) {
      if (selectedOfferingSysIds.length === 0) {
        this.DOWObject[groupIndex].serviceOfferings = [];
        currentOfferings = [];
      } else {
        // add selectedOfferings to DOWObject
        selectedOfferingSysIds.forEach((selectedOfferingSysId) => {
          if (!currentOfferings.some((e) => e.sys_id === selectedOfferingSysId)) {
            const foundOffering 
              = this.serviceOfferings.find((e) => e.sys_id === selectedOfferingSysId);
            if (foundOffering || otherValue) {
              const name = foundOffering ? foundOffering.name : otherValue;
              const description = foundOffering ? foundOffering.description : "";
              const sequence = foundOffering ? foundOffering.sequence : "99";

              const offering = {
                name,
                other: otherValue,
                "sys_id": selectedOfferingSysId,
                classificationInstances: [],
                description,
                sequence,
              }
              currentOfferings.push({...offering,serviceId : ""});
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
          }
        });

        this.DOWObject[groupIndex].serviceOfferings.sort(
          (a, b) => parseInt(a.sequence) > parseInt(b.sequence) ? 1 : -1
        );

      }
      this.currentOfferingName = currentOfferings.length > 0
        ? currentOfferings[0].name : "";
      this.currentOfferingSysId = currentOfferings.length > 0 
        ? currentOfferings[0].sys_id : "";
    }
  }

  @Action
  public async setOfferingDetails(instancesData: DOWClassificationInstance[]): Promise<void> {
    this.doSetOfferingDetails(instancesData);
  }

  @Mutation
  public doSetOfferingDetails(instancesData: DOWClassificationInstance[]): void {
    const groupIndex = this.DOWObject.findIndex(
      obj => obj.serviceOfferingGroupId === this.currentGroupId
    );
    const offeringIndex = this.DOWObject[groupIndex].serviceOfferings.findIndex(
      obj => obj.sys_id === this.currentOfferingSysId
    );
    this.DOWObject[groupIndex].serviceOfferings[offeringIndex].classificationInstances
      = instancesData;
  }

  // set (if selecting from table to edit) or increment (if adding new instance) 
  // currentComputeInstanceNumber when working on AT-7765
  currentComputeInstanceNumber = 0;

  @Mutation
  public setCurrentComputeInstanceNumber(number: number): void {
    this.currentComputeInstanceNumber = number;
  }

  @Action
  public async setComputeData(computeData: ComputeData): Promise<void> {
    this.doSetComputeData(computeData);
  }

  @Mutation
  public doSetComputeData(computeData: ComputeData): void {
    const computeIndex = this.DOWObject.findIndex(
      o => o.serviceOfferingGroupId.toLowerCase() === "compute"
    );
    if (computeIndex > -1) {
      const computeObj = this.DOWObject[computeIndex];
      if (!Object.prototype.hasOwnProperty.call(computeObj, "computeData")) {
        computeObj.computeData = [];
        computeObj.computeData?.push(computeData);
      } else {
        const instanceNumber = computeData.instanceNumber;
        const existingInstance = computeObj.computeData?.find(
          o => o.instanceNumber === instanceNumber
        );
        if (existingInstance ) {
          Object.assign(existingInstance, computeData);
        } else {
          computeObj.computeData?.push(computeData);
        }
      }

    } else {
      throw new Error("Error saving Compute data to store");
    }
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

  @Mutation
  public setUserSelectedServices(value: SelectedServiceOfferingDTO[]): void {
    this.userSelectedServiceOfferings = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_DESCRIPTION_OF_WORK_KEY
    );
  }

  @Mutation
  public updateDOWObjectWithSavedIds(values: ServiceOfferingProxy[]): void {

    values.forEach(value=> {
      const data = this.DOWObject[value.dowServiceGroupIndex]
        .serviceOfferings[value.dowServiceIndex];

      //updated classification instances with ids
      data.classificationInstances?.forEach((instance, index)=> {
        const savedInstanceProxy = 
          value.classificationInstances
            .find(cInstance=>cInstance.dowClassificationInstanceIndex === index);
        if(savedInstanceProxy)
        {
          instance.sysId = savedInstanceProxy?.classificationInstance.sys_id;
        }
      })

      //update service instances with ids
      data.serviceId = value.serviceOffering.sys_id || "";
    })

    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_DESCRIPTION_OF_WORK_KEY
    );
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
    //map services offerings from the service offering list
    const serviceOfferings: DOWServiceOffering[] = [];
    const dowOfferings = this.serviceOfferingsForGroup;

    serviceOfferingsForGroup.forEach((obj) => {
      
      //does the saved offering exist in DOW store?
      const savedInDown = dowOfferings.find(offering=>offering.sys_id === obj.sys_id);

      const offering = savedInDown ? savedInDown :{
        name: obj.name,
        "sys_id": obj.sys_id || "",
        sequence: obj.sequence,
        description: obj.description,
        serviceId: "",
      };

      serviceOfferings.push(offering);

    });

    const groupsWithNoOtherOption = ["ADVISORY", "TRAINING"];
    
    if (groupsWithNoOtherOption.indexOf(this.currentGroupId) === -1) {
      const otherOffering: DOWServiceOffering = {
        name: "Other",
        sys_id: "Other",
        sequence: "99",
        description: "",
        serviceId: "",
      };
      serviceOfferings.push(otherOffering);
    }


    //now map any from the DOW that might've been saved

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
      return;
    }
    
    const sessionRestored = retrieveSession(ATAT_DESCRIPTION_OF_WORK_KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
      this.setInitialized(true);
    } else {
      try {
        await Promise.all([
          this.loadServiceOfferings(),
          this.LoadServiceOfferingGroups(),
        ]);
        storeDataToSession(
          this,
          this.sessionProperties,
          ATAT_DESCRIPTION_OF_WORK_KEY
        );
        this.setInitialized(true);
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

  @Action({rawError: true})
  public async removeClassificationInstances(classificationInstances:
    string[]): Promise<void>{

    
  
    try {

      const calls:Promise<void>[] = [];
     
      classificationInstances.forEach(instance=> {

        if(instance.length> 0){
          calls.push(api.classificationInstanceTable.remove(instance))
        }
      })
      await Promise.all(calls);
    } catch (error) {
      //do nothing here we'll delete optimistically
    } 
  }

  @Action({rawError: true})
  public async removeUserSelectedService(service: SelectedServiceOfferingDTO): Promise<void>{
    try {
      

      await api.selectedServiceOfferingTable.remove(service.sys_id || "");
     
      const classificationInstances = service.classification_instances.split(',');

      if(classificationInstances && classificationInstances.length)
      {
        await this.removeClassificationInstances(classificationInstances);
      }
  
    } catch (error) {
      //do nothing here we'll delete optimistically
    }
  }

  @Action({rawError: true})
  public async removeUserSelectedServices(requiredServices: SelectedServiceOfferingDTO[])
 : Promise<void>{
    try {

      const calls = requiredServices.reduce<Promise<void>[]>((previous, current)=>  {
        const values = [...previous];

        if(current.sys_id){
          values.push(this.removeUserSelectedService(current));
        }
        return values;

      }, []);
      await Promise.all(calls);
       
    } catch (error) {
      //to nothing here we're deleting stuff optimistically
    }
  }

  @Action({rawError: true})
  public async saveClassificationInstance(data: 
    ClassificationInstanceProxy):Promise<ClassificationInstanceProxy>{
    const sysId = data.classificationInstance.sys_id;
    const { classification_level, need_for_entire_task_order_duration, 
      selected_periods, usage_description, } = data.classificationInstance;
    const saveClassificationInstance = (sysId && sysId.length > 0) ? 
      api.classificationInstanceTable.update(sysId, {
        classification_level,
        need_for_entire_task_order_duration,
        selected_periods,
        usage_description
      }) : 
      api.classificationInstanceTable.create({
        classification_level,
        need_for_entire_task_order_duration,
        selected_periods,
        usage_description
      });
    const savedClassificationInstance =  await saveClassificationInstance;
    data.classificationInstance = savedClassificationInstance;
   
    return data;
  }

  @Action({rawError: true})
  public async saveclassificationInstances(data: ClassificationInstanceProxy[]):
   Promise<ClassificationInstanceProxy[]>{
 
    try {
       
      //create a save call for each classification instance
      const calls = data.map(instance=> this.saveClassificationInstance(instance));
      const savedInstances = await Promise.all(calls);
      return savedInstances;
       
    } catch (error) {
      throw new Error(`error saving classification instances ${error}`);
       
    }
    
  }


  @Action({rawError: true})
  public async saveUserService(serviceProxy: ServiceOfferingProxy): Promise<ServiceOfferingProxy>{

    try {
      let savedClassificationInstances: ClassificationInstanceProxy[] = [];

      //first save classification instances
      if(serviceProxy.classificationInstances.length)
      {
        savedClassificationInstances = 
      await this.saveclassificationInstances(serviceProxy.classificationInstances);
      }
      
      //save service instance
      serviceProxy.serviceOffering.classification_instances = 
      savedClassificationInstances
        .map(instance=> instance.classificationInstance.sys_id || "").join(',') || "";

      const apiTable = api.selectedServiceOfferingTable;

      const saveService = serviceProxy.serviceOffering.sys_id ? 
        apiTable.update(serviceProxy.serviceOffering.sys_id || "", serviceProxy.serviceOffering)
        : apiTable.create(serviceProxy.serviceOffering);
      
      const savedService = await saveService;
      
      serviceProxy.classificationInstances = savedClassificationInstances;
      serviceProxy.serviceOffering = savedService;
     
      return serviceProxy;

    } catch (error) {
      
      throw new Error( `error occurred while saving service proxy`)
    }

  }

  @Action({rawError: true})
  public async saveUserServices(serviceProxies: ServiceOfferingProxy[]): Promise<void>{

    try {
      const calls = serviceProxies.map(proxy=> this.saveUserService(proxy));
      const savedProxies = await Promise.all(calls);
      
      //update dow object with saved ids
      this.updateDOWObjectWithSavedIds(savedProxies);
      const savedServices = savedProxies.map(proxy=> proxy.serviceOffering);
      this.setUserSelectedServices(savedServices);
      
    } catch (error) {
      console.error(error);
      throw new Error(`error occurred saving services ${error}`);
    }
  }

  //synchronizes back end with DOW
  @Action({rawError: true})
  public async saveUserSelectedServices(): Promise<void>{
    try {
      const requiredServices = this.userSelectedServiceOfferings;
      const dowOfferingGroups = this.DOWObject;

      //grab all of the selected services in the dow object
      //build a list of Service Proxy items

      //grab all of the selected services in the dow object
      const serviceOfferingProxies: ServiceOfferingProxy[] = [];

      dowOfferingGroups.forEach((group, groupIndex)=> {
        group.serviceOfferings.forEach((offering, offeringIndex)=> {
          serviceOfferingProxies.push(
            mapDOWServiceOfferingToServiceProxy(offering, groupIndex, offeringIndex));
        });
      });

      const unsavedServices = serviceOfferingProxies
        .filter(proxy=>(proxy.serviceOffering.sys_id === undefined || 
        proxy.serviceOffering.sys_id.length === 0));

      const savedServices = serviceOfferingProxies
        .filter(proxy=>proxy.serviceOffering.sys_id?.length);

      const servicesToRemove: SelectedServiceOfferingDTO[] = [];

      if(requiredServices.length)
      {
      //get services to delete - delete all of the service offerings
      //that are no longer in the dow object
        requiredServices.forEach(service=> {

          const inSaved = savedServices
            .find(saved=> saved.serviceOffering.sys_id === service.sys_id);
          if(!inSaved){
            servicesToRemove.push(service);
          }
        });
   
        if(servicesToRemove.length){
          await this.removeUserSelectedServices(servicesToRemove);
        }
      }

      //get all of the services that haven't been removed for updating
      const servicesToUpdate = differenceWith<ServiceOfferingProxy, SelectedServiceOfferingDTO>
      (savedServices, servicesToRemove, ({serviceOffering}, selected)=> 
        serviceOffering.service_offering === selected.service_offering);

      const servicesTosave: ServiceOfferingProxy[] = [...servicesToUpdate, ...unsavedServices];
      await this.saveUserServices(servicesTosave);
     
    } catch (error) {
      console.error(error);
      throw new Error(`error persisting services ${error}`);
    }
    
  }
}

const DescriptionOfWork = getModule(DescriptionOfWorkStore);
export default DescriptionOfWork;
