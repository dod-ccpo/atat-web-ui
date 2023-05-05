/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule,} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import {
  ClassificationLevelDTO,
  ClassifiedInformationTypeDTO,
  ReferenceColumn,
  CrossDomainSolutionDTO,
  SelectedClassificationLevelDTO,
  BaseTableDTO
} from "@/api/models";
import {
  CrossDomainSolution, 
  SecurityRequirement, 
  ToastObj, 
  totalClassLevelsInDOWObject
} from "../../../types/Global";
import {AxiosRequestConfig} from "axios";
import AcquisitionPackage from "../acquisitionPackage";
import IGCEStore from "@/store/IGCE";
import { convertColumnReferencesToValues } from "@/api/helpers";
import { TableApiBase } from "@/api/tableApiBase";
import DescriptionOfWork from "../descriptionOfWork";
import { getDOWOfferingsWithClassLevelTotal, setItemToPlural } from "@/helpers";
import Toast from "../toast";

@Module({
  name: "ClassificationRequirements",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class ClassificationRequirementsStore extends VuexModule {
  public classificationLevels: ClassificationLevelDTO[] = [];
  public selectedClassificationLevels: SelectedClassificationLevelDTO[] = [];
  public securityRequirements: SecurityRequirement[] = [];
  public classifiedInformationTypes: ClassifiedInformationTypeDTO[] = [];
  public classificationSecretSysId = "";
  public classificationTopSecretSysId = "";
  public performanceRequirementsDeletedTotal = 0;
  public classLevelsInDOWTotal: totalClassLevelsInDOWObject[] = [];
  public classLevelsToBeDeleted: SelectedClassificationLevelDTO[] = [];
  public get highSideSysIds(): string[] {
    return [this.classificationSecretSysId, this.classificationTopSecretSysId];
  }

  public get packageHasSecretOrHigher(): boolean {
    const found = this.selectedClassificationLevels.filter(obj => 
      obj.classification === "S" || obj.classification === "TS"
    );
    return found.length > 0;
  }

  public cdsSolution: CrossDomainSolutionDTO | null = null;

  @Mutation
  public setClassifications(value: ClassificationLevelDTO[]): void {
    this.classificationLevels = value;
    const secretObj = value.find(obj => obj.classification === "S");
    if (secretObj) {
      this.classificationSecretSysId = secretObj.sys_id || "";
    }
    const topSecretObj = value.find(obj => obj.classification === "TS");
    if (topSecretObj) {
      this.classificationTopSecretSysId = topSecretObj.sys_id || "";
    }
  }




  @Action({ rawError: true })
  public async setSelectedClassificationLevels(
    value: SelectedClassificationLevelDTO[]
  ): Promise<void> {
    this.doSetSelectedClassificationLevels(value);
  }

  @Mutation
  private doSetSelectedClassificationLevels(
    value: SelectedClassificationLevelDTO[]
  ): void {
    value.forEach(val => {
      val = convertColumnReferencesToValues(val);
    })
    this.selectedClassificationLevels = value;
  }

  @Action({rawError: true})
  public async setSecurityRequirements(value: SecurityRequirement[]): Promise<void> {
    this.doSetSecurityRequirements(value);
  }

  @Mutation
  private doSetSecurityRequirements(value: SecurityRequirement[]): void {
    this.securityRequirements = value;
  }

  @Action({rawError: true})
  public async getAllClassificationLevels(): Promise<ClassificationLevelDTO[]> {
    if (this.classificationLevels.length === 0) {
      await this.loadClassificationLevels();
    }
    return this.classificationLevels;
  }

  @Action({rawError: true})
  public async loadClassificationLevels(): Promise<void> {
    try {
      const classificationLevels = await api.classificationLevelTable.all();
      this.setClassifications(classificationLevels);
    } catch (error) {
      throw new Error(`error loading Classification Levels ${error}`);
    }
  }

  @Action({rawError: true})
  public async getAllClassifiedInformationTypes(): Promise<ClassifiedInformationTypeDTO[]> {
    if (this.classifiedInformationTypes.length === 0) {
      await this.loadClassifiedInformationTypes();
    }
    return this.classifiedInformationTypes;
  }

  @Mutation
  private doSetClassifiedInformationTypes(value: ClassifiedInformationTypeDTO[]): void {
    this.classifiedInformationTypes = value;
  }

  @Action({rawError: true})
  public async saveClassifiedInformationTypes(): Promise<void> {
    const highSideQuery = this.highSideSysIds.map(
      (sysId) => {
        return "classification_level=" + sysId + "^OR"
      }
    ).join("").replace(/\^OR*$/, '');;

    const queryForExistingSecurityRequirements: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" + AcquisitionPackage.packageId + "^" + highSideQuery
      }
    };

    const existingSecurityRequirements = await api.selectedClassificationLevelTable.getQuery(
      queryForExistingSecurityRequirements
    )

    const selectedClassLevelList = this.selectedClassificationLevels;
    this.securityRequirements.forEach(
      async (sr) =>{
        const classLevel = this.selectedClassificationLevels.find(
          scl => scl.classification === (sr.type === "SECRET" ? "S" :"TS")
        ) as SelectedClassificationLevelDTO;
       
        classLevel.classified_information_types =
          sr.classification_information_type.join(",");
  
        const secReqExistsSNOW = existingSecurityRequirements.some(
          scl => scl.sys_id === classLevel.sys_id
        )
        secReqExistsSNOW
          ? await api.selectedClassificationLevelTable.update(
              classLevel.sys_id as string,
              classLevel
          ) : await api.selectedClassificationLevelTable.create(classLevel);
      }
    )
    await this.setSelectedClassificationLevels(selectedClassLevelList);
  }

  @Action({rawError: true})
  public async setClassifiedInformationTypes(
    value: ClassifiedInformationTypeDTO[]
  ): Promise<void> {
    this.doSetClassifiedInformationTypes(value);
  }

  @Action({rawError: true})
  public async loadClassifiedInformationTypes(): Promise<void> {
    try {
      const classifiedInformationTypes = await api.classifiedInformationTypeTable.all();
      await this.setClassifiedInformationTypes(classifiedInformationTypes);
    } catch (error) {
      throw new Error(`error loading Classification Information Types ${error}`);
    }
  }

  @Action({rawError: true})
  public async getSelectedClassificationLevels(): Promise<SelectedClassificationLevelDTO[]> {
    return await this.selectedClassificationLevels;
  }

  /**
   * Loads the selected classification levels by acquisition id and then does some mapping
   * for backward compatibility.
   * @param acquisitionSysId - sys_id of the acquisition package table record
   */
  @Action({rawError: true})
  public async loadSelectedClassificationLevelsByAqId(acquisitionSysId: string): Promise<void> {
    const selectedClassLevelsRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" + acquisitionSysId
      }
    };

    const tempRequirements = this.securityRequirements;

    let selectedClassLevelList = await api.selectedClassificationLevelTable
      .getQuery(selectedClassLevelsRequestConfig);
    if (selectedClassLevelList.length > 0) {
      selectedClassLevelList = selectedClassLevelList
        .map(selectedClassLevel => {
          selectedClassLevel = convertColumnReferencesToValues(selectedClassLevel);
          const classLevelForMapping = this.classificationLevels
            .find(classLevel => classLevel.sys_id === selectedClassLevel.classification_level)
          if (classLevelForMapping) {
            selectedClassLevel.impact_level = classLevelForMapping.impact_level;
            selectedClassLevel.classification = classLevelForMapping.classification;
          }
          let dataGrowth 
            = selectedClassLevel.data_growth_estimate_percentage as unknown as string;
          if (dataGrowth.indexOf("[") > -1) {
            dataGrowth = dataGrowth.substring(1, dataGrowth.length - 1);
          }
          dataGrowth = dataGrowth.replace(/\s/g, '');
          selectedClassLevel.data_growth_estimate_percentage
              = dataGrowth.split(",").filter(nonEmptyVal => nonEmptyVal);

          let userGrowth
            = selectedClassLevel.user_growth_estimate_percentage as unknown as string;
          if (userGrowth.indexOf("[") > - 1) {
            userGrowth = userGrowth.substring(1, userGrowth.length - 1);
          }
          userGrowth = userGrowth.replace(/\s/g, '');
          selectedClassLevel.user_growth_estimate_percentage
              = userGrowth.split(",").filter(nonEmptyVal => nonEmptyVal);
          if (["TS", "S"].includes(selectedClassLevel.classification)){
            this.securityRequirements.push(
              {
                classification_information_type: 
                  selectedClassLevel.classified_information_types?.split(",") as string[],
                type: selectedClassLevel.classification === "S" ? "SECRET" : "TOPSECRET"
              }
            )
          }

          return selectedClassLevel;
        })
    }
    await this.setSecurityRequirements(tempRequirements);
    await this.setSelectedClassificationLevels(selectedClassLevelList);
  }

  /**
   * creates an array of totalClassLevelsInDOWObject containing all class levels and 
   * total number of each level in DOW object currently
   */
  @Action({rawError: true})
  async getTotalClassLevelsInDOW(): Promise<void> {
    const totalArray: totalClassLevelsInDOWObject[] = [];
    this.classificationLevels.forEach(
      cl => totalArray.push({
        classLevelSysId: cl.sys_id as string, 
        DOWObjectTotal: getDOWOfferingsWithClassLevelTotal(cl.sys_id as string)
      })
    )
    this.setClassLevelsInDOWTotal(totalArray);
  }

  /**
   * retrieves total number of a single class level in the DOW currently
   * @param sysId 
   */
  @Action({rawError: true})
  async getTotalClassLevelInDOW(sysId: string): Promise<number> {
    await this.getTotalClassLevelsInDOW();
    return this.classLevelsInDOWTotal.find(
      cl => cl.classLevelSysId === sysId
    )?.DOWObjectTotal || 0
  }

  @Action({rawError: true})
  public async setClassLevelsInDOWTotal(total: totalClassLevelsInDOWObject[]): Promise<void> {
    this.doSetClassLevelsInDOWTotal(total);
  }

  @Mutation
  private doSetClassLevelsInDOWTotal(total: totalClassLevelsInDOWObject[]): void {
    this.classLevelsInDOWTotal = total;
  }
  

  @Action({rawError: true})
  public async setClassLevelsToBeDeleted(items: SelectedClassificationLevelDTO[]): Promise<void> {
    this.doSetClassLevelsToBeDeleted(items);
  }

  @Mutation
  private doSetClassLevelsToBeDeleted(items: SelectedClassificationLevelDTO[]): void {
    this.classLevelsToBeDeleted = items;
  }
  
  
 /**
   * Compares the currently selected classification list from this store, with the new list
   * passed into this function. Then marks classifications for either create or
   * delete. No need to update since the selected classification level is already tied to the
   * acquisition. Then performs the API calls to complete the save.
   */
 @Action({rawError: true})
  async saveSelectedClassificationLevels(
    newSelectedClassLevelList: SelectedClassificationLevelDTO[])
   : Promise<boolean> {
    try {
      await this.getTotalClassLevelsInDOW();
      const markedForCreateList = newSelectedClassLevelList
        .filter(newSelected => newSelected.sys_id ? newSelected.sys_id.length === 0 : true);
      const currSelectedClasLevelList = await this.getSelectedClassificationLevels();
      const markedForDeleteList = currSelectedClasLevelList
        .filter(currSelected => (newSelectedClassLevelList.find(newSelected =>
          newSelected.sys_id === currSelected.sys_id)) === undefined);
      newSelectedClassLevelList.forEach((obj) => {
        obj.data_growth_estimate_percentage
           = obj.data_growth_estimate_percentage?.toString() as unknown as string[];
        obj.user_growth_estimate_percentage
           = obj.user_growth_estimate_percentage?.toString() as unknown as string[];
      });
      await markedForCreateList.forEach(async markedForCreate => {
        await this.addCurrentSelectedClassLevelList(
            markedForCreate.classification_level as string
        )
      })
      
      await markedForDeleteList.forEach(async markedForDelete => {
        const deleteItemSysId = markedForDelete.classification_level as string;
        await this.removeClassificationLevelsFromDBGlobally(deleteItemSysId);
        await this.removeClassificationLevelsFromStoreGlobally(markedForDelete);
      })
      this.doSetClassLevelsToBeDeleted(markedForDeleteList);
      
      
      return true;
    } catch (error) {
      throw new Error(`an error occurred saving selected classification levels ${error}`);
    }
  }

 @Action({rawError: true})
 async createToast():Promise<void>{
   // craft toast text
   
   let total = 0;
   for (let i=0;i<this.classLevelsToBeDeleted.length;i++){
     total += this.classLevelsInDOWTotal.find(
       total => total.classLevelSysId === this.classLevelsToBeDeleted[i].classification_level
     )?.DOWObjectTotal || 0
   }

   const perfReqDeletedText = total > 0 
     ? total + " performance " + setItemToPlural(total, 'requirement') + " deleted."
     : "";

   const classificationLevelToast: ToastObj = {
     type: "success",
     message: "Classification requirements updated.<br />" + perfReqDeletedText,  
     isOpen: true,
     hasUndo: false,
     hasIcon: true,
   };
   Toast.setToast(classificationLevelToast);
 }

  /**
   * Saves a single selected classification level and sets the context
   * @param selectedClassificationLevel - object from this store (not cloned) that is retrieved
   * and filtered using the call to "getSelectedClassificationLevels".
   */
  @Action({rawError: true})
 async saveSingleSelectedClassificationLevel(
   selectedClassificationLevel: SelectedClassificationLevelDTO)
    : Promise<boolean> {
   try {
     const packageId = 
        typeof selectedClassificationLevel.acquisition_package === "object"
          ? selectedClassificationLevel.acquisition_package.value as string
          : selectedClassificationLevel.acquisition_package as string;
      
     const classLevel = 
        typeof selectedClassificationLevel.classification_level === "object"
          ? selectedClassificationLevel.classification_level.value as string
          : selectedClassificationLevel.classification_level as string;

     selectedClassificationLevel = {
       ...selectedClassificationLevel,
       classification_level: classLevel,
       acquisition_package: packageId
     }
     await api.selectedClassificationLevelTable
       .update(selectedClassificationLevel.sys_id as string, selectedClassificationLevel);
     return true;
   } catch (error) {
     throw new Error(`an error occurred saving a single selected classification level ${error}`);
   }
 }

  @Action({rawError: true})
  public async setCdsSolution(value: CrossDomainSolution): Promise<void> {
    const packageId = AcquisitionPackage.acquisitionPackage?.sys_id as string;
    const cdsSolution: CrossDomainSolutionDTO = {
      acquisition_package: packageId,
      anticipated_need_or_usage: value.anticipatedNeedUsage,
      cross_domain_solution_required: value.crossDomainSolutionRequired,
      need_for_entire_task_order_duration: value.entireDuration,
      projected_file_stream_type: value.projectedFileStream,
      selected_periods: value.selectedPeriods.join(",") || "",
      traffic_per_domain_pair: JSON.stringify(value.solutionType) || ""
    };

    if(this.cdsSolution && this.cdsSolution.sys_id)
      cdsSolution.sys_id = this.cdsSolution.sys_id;

    const sysId = await this.saveCdsSolution(cdsSolution);
    this.doSetCdsSolution({
      ...cdsSolution,
      sys_id: sysId
    });
  }

  @Action({rawError: true})
  public async removeCdsSolution(): Promise<void> {
    
    const cdsIGCESysId = await this.getCDSInIGCEEstimateTable(this.cdsSolution?.sys_id as string)
    await this.delectCDSInIGCEEstimateTable(cdsIGCESysId)

    const cdsSolution: CrossDomainSolution = {
      crossDomainSolutionRequired: "NO",
      entireDuration: "",
      anticipatedNeedUsage: "",
      solutionType: [],
      projectedFileStream: "",
      selectedPeriods: [""]

    }
    await this.setCdsSolution(cdsSolution)
  }

  @Action({rawError: true})
  public async getCDSInIGCEEstimateTable(sys_id: string): Promise<string> {
    const requestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "GOTOcross_domain_solution.sys_id<=" + sys_id
      }
    }
    const cdsRecordInIGCE = await api.igceEstimateTable.getQuery(requestConfig);
    return cdsRecordInIGCE[0].sys_id as string;
  }

  @Action({rawError: true})
  public async delectCDSInIGCEEstimateTable(sys_id: string): Promise<void> {
    await api.igceEstimateTable.remove(sys_id);
  }

  @Mutation
  private doSetCdsSolution(value: CrossDomainSolutionDTO): void {
    this.cdsSolution = value;
  }

  @Action({rawError: true})
  public async getCdsSolution(): Promise<CrossDomainSolutionDTO> {
    return this.cdsSolution as CrossDomainSolutionDTO;
  }

  @Action({rawError: true})
  public async saveCdsSolution(value: CrossDomainSolutionDTO): Promise<string>{
    let objSysId = "";

    if(value.sys_id){
      await api.crossDomainSolutionTable.update(
        value.sys_id,
        value
      );
      objSysId = value.sys_id;
    } else {
      const savedObject = await api.crossDomainSolutionTable.create(
        value
      );
      objSysId = savedObject.sys_id as string;
    }

    return objSysId;
  }

  @Action({rawError: true})
  public async loadCdsSolutionByPackageId(packageId: string): Promise<void> {
    const cdsRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" + packageId
      }
    };

    const cdsSolution = await api.crossDomainSolutionTable.getQuery(cdsRequestConfig);

    if(cdsSolution.length > 0){
      const sysId = typeof cdsSolution[0].acquisition_package === "object"
        ? cdsSolution[0].acquisition_package.value as string
        : cdsSolution[0].acquisition_package as string;
      this.doSetCdsSolution({
        ...cdsSolution[0],
        acquisition_package: sysId
      });
    }
  }

  @Action({ rawError: true })
  public async reset(): Promise<void> {
    this.doReset();
  }

  @Mutation
  public doReset(): void {
    this.selectedClassificationLevels = [];
    this.securityRequirements = [];
    this.cdsSolution = null;
  }

  @Action({rawError: true})
  public async removeClassificationLevelsFromDBGlobally (
    classLevelSysIdToBeDeleted: string
  ): Promise<boolean> {
    const success:boolean[] = []
    // delete classification_instances from classification_instance tbl
    success.push(await this.deleteClassificationLevels({
      tables: ["classificationInstanceTable"],
      classLevelSysId: classLevelSysIdToBeDeleted
    }));
    
    // delete classification_instances from instance Tables
    success.push(await this.deleteClassificationLevels({
      tables: [
        "cloudSupportEnvironmentInstanceTable",
        "storageEnvironmentInstanceTable",
        "databaseEnvironmentInstanceTable",
        "computeEnvironmentInstanceTable",
        "xaaSEnvironmentInstanceTable"
      ],
      classLevelSysId: classLevelSysIdToBeDeleted
    }));

    // // Deletes from selectedClassificationLevelTable
    // // 1. `anticipated users and data` data 
    // // 2. security requirements for Secret and TS classification levels
    success.push(await this.deleteClassificationLevels({
      tables: ["selectedClassificationLevelTable"],
      classLevelSysId: classLevelSysIdToBeDeleted
    }));
    
    // // delete classification_instances from IGCE cost estimate table
    success.push(await this.deleteClassificationLevels({
      tables: ["igceEstimateTable"],
      classLevelSysId: classLevelSysIdToBeDeleted
    }));
    return await success.every(call => call);
  } 

  @Action({rawError: true})
  public async deleteClassificationLevels(
    deleteItem:{
      tables: string[], 
      classLevelSysId: string
    }): 
    Promise<boolean> {
    let success = true;
    const deleteQuery: AxiosRequestConfig = {
      params: {
        sysparm_fields: "sys_id",
        sysparm_query: "acquisition_package=" 
            + AcquisitionPackage.acquisitionPackage?.sys_id + 
            "^classification_level=" + deleteItem.classLevelSysId
      }
    };

    deleteItem.tables.forEach(async (tblName)=>{
      // retrieve the property dynamically from the api object.  
      // (Note: the api object does NOT have an interface)
      try{
        const tbl = api[(tblName) as keyof typeof api] as TableApiBase<BaseTableDTO>
        const sysIds = await tbl.getQuery(deleteQuery);
        if (sysIds.length>0){
          if (tblName === "classificationInstanceTable"){
            await this.deleteSelectedServiceOfferingsClassificationInstances(sysIds);
          }
          if (tblName === "cloudSupportEnvironmentInstanceTable"){
            await this.deleteTrainingEstimates(sysIds)
          }
          sysIds.forEach(async (itemToBeDeleted)=>{
            await tbl.remove(itemToBeDeleted.sys_id as string);
          })
        }
      } catch (error){
        success = false;
        throw new Error("Error: deleting from tbl " + tblName)
      }

    })
    return success;
  }

  @Action({rawError: true})
  public async deleteTrainingEstimates(sysIds: BaseTableDTO[]):Promise<void>{

    if (sysIds.length>0){
      const sysParmQuery = sysIds.map(
        item => "cloud_support_environment_instance=" + item.sys_id + "^OR")
        .join("").replace(/\^OR\s*$/, "");

    
      const getTrainingEstimatesQuery: AxiosRequestConfig = {
        params: {sysparm_query: sysParmQuery}
      };

      const estimatesToBeDeleted = 
        await api.trainingEstimateTable.getQuery(getTrainingEstimatesQuery);
      if (estimatesToBeDeleted.length>0){
        estimatesToBeDeleted.forEach(
          async estimate => await api.trainingEstimateTable.remove(estimate.sys_id as string)
        )
      }
    }
    
  }

  @Action({rawError: true})
  public async deleteSelectedServiceOfferingsClassificationInstances(
    sysIds: BaseTableDTO[]
  ):Promise<void>{
    const sysIdsToBeDeleted = Object.values(sysIds).map(x=>x.sys_id);
    //retrieve selectedServiceOfferings.classification_instances with acqPackageId 
    const getSelectedServiceOfferingsQuery: AxiosRequestConfig = {
      params: {
        sysparm_query: "acquisition_package=" 
          + AcquisitionPackage.acquisitionPackage?.sys_id
      }
    };

    const selectedServiceOfferings = 
      await api.selectedServiceOfferingTable.getQuery(getSelectedServiceOfferingsQuery);
    selectedServiceOfferings.forEach(async (sso)=>{
      const instancesArray = sso.classification_instances.split(",");
      const updatedInstances = instancesArray.filter(
        (instance) => sysIdsToBeDeleted.indexOf(instance) === -1
      )
      const instanceWasDeleted = updatedInstances.length < instancesArray.length;
      if (instanceWasDeleted){
        if (updatedInstances.length>0){
          // if NOT all classification instances have been deleted
          // update select_service_offerings.classification_instances
          // with updatedInstances
          await api.selectedServiceOfferingTable.update(
              sso.sys_id as string,{
                ...sso,
                acquisition_package: AcquisitionPackage.packageId,
                service_offering: (sso.service_offering as ReferenceColumn).value || "",
                classification_instances: updatedInstances.join(",").replace(/,\x*$/, "")
              }
          )
        } else if (updatedInstances.length === 0){
          // if all classifications instances have been deleted
          // remove the selectedServiceOffering row
          await api.selectedServiceOfferingTable.remove(sso.sys_id as string);
        }
      }
    })
    DescriptionOfWork.DOWObject.forEach((dowObj)=>dowObj.serviceOfferingGroupId === "Applications")
  }

  @Action({rawError: true})
  public async removeClassificationLevelsFromStoreGlobally(
    classLevelItemToBeDeleted: ClassificationLevelDTO | SelectedClassificationLevelDTO
  ): Promise<void> {
    // in case item is of type `SelectedClassificationLevelDTO`
    // transform to a `ClassificationLevelDTO`
    const sysIdToBeDeleted = classLevelItemToBeDeleted.classification_level 
                || classLevelItemToBeDeleted.sys_id;

    classLevelItemToBeDeleted = this.classificationLevels.find(
      cl => cl.sys_id === sysIdToBeDeleted
    ) as ClassificationLevelDTO;

    /**
     * Deletes classification levels of items in 
     * 1. IGCEStore.trainingItems
    */
    await this.removeTrainingItemsFromIGCEStore(
    classLevelItemToBeDeleted.sys_id as string);

    /**
     * Deletes ALL service offerings and Cloud Support Instances
    */
    await this.removeClassificationLevelsFromDOWObject(
      classLevelItemToBeDeleted.sys_id as string);

    /**
     * Deletes from selectedClassification
     * 1. `anticipated users and data` data 
     * 2. security requirements for Secret and TS classification levels
    */
    await this.removeClassificationLevelsFromClassificationRequirementsStore(
      classLevelItemToBeDeleted
    );

    /**
     * deletes IGCE items that have classLevelItemToBeDeleted
     */
    await this.removeClassificationLevelsFromIGCECostEstimate(
      classLevelItemToBeDeleted.sys_id as string
    )
  }


  @Action({rawError: true})
  public async removeTrainingItemsFromIGCEStore(
    classLevelSysIdToBeDeleted: string
  ): Promise<void> {
    // get training item in DOWObject
    const training = DescriptionOfWork.DOWObject.find(
      groupsId => groupsId.serviceOfferingGroupId.toUpperCase() === "TRAINING"
    )

    // iterate through training.otherOfferingData to get the sysIds \\
    // that match classLevelSysIdToBeDeleted
    const offeringsSysIdsToBeDeleted = training?.otherOfferingData?.filter(
      offering => offering.classificationLevel === classLevelSysIdToBeDeleted
    ).map(item => item.sysId);

    // if any offeringsSysIdsToBeDeleted exist.....
    if (offeringsSysIdsToBeDeleted){
      // ...filter out deleted items, assign to updatedTrainingItems
      const updatedTrainingItems = IGCEStore.trainingItems.filter(
        trainingItem => offeringsSysIdsToBeDeleted.indexOf(
        trainingItem.cloudSupportEnvironmentInstance as string
        ) === -1
      )
      IGCEStore.setTrainingItems(updatedTrainingItems)
    }
  }

  @Action({rawError: true})
  public async removeClassificationLevelsFromDOWObject(
    classLevelSysIdToBeDeleted: string
  ): Promise<void> {
    const dowObject = DescriptionOfWork.DOWObject;
    dowObject.forEach(async (dowObj)=>{
      if (dowObj.serviceOfferings.length>0){
        dowObj.serviceOfferings.forEach(
          async (so) => {
            so.classificationInstances = await so.classificationInstances?.filter(
              cl=>cl.classificationLevelSysId !== classLevelSysIdToBeDeleted
            )
          })
      } else if (dowObj.otherOfferingData && dowObj.otherOfferingData.length>0){
        dowObj.otherOfferingData = await dowObj.otherOfferingData.filter(
          (others)=> others.classificationLevel !== classLevelSysIdToBeDeleted
        )}
    })
  }

  @Action({rawError: true})
  public async removeClassificationLevelsFromClassificationRequirementsStore(
    classLevelItemToBeDeleted: ClassificationLevelDTO
  ): Promise<void> {

    const highSideClassLevel = 
      classLevelItemToBeDeleted.classification === "S" ? "SECRET" : "TOPSECRET"
    await this.removeSelectedClassificationLevel(
      classLevelItemToBeDeleted.sys_id as string);
    await this.removeSecurityRequirements({
      classLevelItemToBeDeleted: classLevelItemToBeDeleted, 
      highSideClassLevel
    });
    await this.removeClassificationLevelsFromIGCECostEstimate(
      classLevelItemToBeDeleted.sys_id as string);
  }

  /**
   * @param classLevelSysIdToBeDeleted 
   * removes classificationLevel from ClassificationRequirements.selectedClassificationLevels
   */
  @Action({rawError: true})
  public async removeSelectedClassificationLevel(
    classLevelSysIdToBeDeleted: string
  ): Promise<void>{
    const updatedSelectedClassificationLevels = 
        ClassificationRequirements.selectedClassificationLevels.filter (
          (selClassLevel) => selClassLevel.classification_level !== classLevelSysIdToBeDeleted
        )
    this.setSelectedClassificationLevels(updatedSelectedClassificationLevels)
  }

  /**
   * 
   * @param classLevelItemToBeDeleted 
   * @param highSideClassLevel 
   * 
   * removes ClassificationRequirements.SecurityRequirement 
   */
  @Action({rawError: true})
  public async removeSecurityRequirements(
    deleteSecurityReqItem:{
      classLevelItemToBeDeleted: ClassificationLevelDTO,
      highSideClassLevel: string
    }
  ): Promise<void>{
    const hasSecurityRequirements = ["TS","S"].includes(
      deleteSecurityReqItem.classLevelItemToBeDeleted.classification
    );
    if (hasSecurityRequirements){
      const updatedSecurityRequirements = this.securityRequirements.filter(
        sr=>sr.type !== deleteSecurityReqItem.highSideClassLevel
      )
      this.setSecurityRequirements(updatedSecurityRequirements);
    }
  }

  /**
   * @param highSideClassLevel 
   * syncs necessary ClassificationRequirements attribs if an item is deleted.
   */
  @Action({rawError: true})
  public async removeAdditionalClassificationProperties(
    highSideClassLevel: string
  ): Promise<void>{
    if (highSideClassLevel === "SECRET") {
      this.classificationSecretSysId = "";
    } else if (highSideClassLevel === "TOPSECRET"){
      this.classificationTopSecretSysId = "";
    }
  }

  @Action({rawError: true})
  public async removeClassificationLevelsFromIGCECostEstimate(
    classLevelSysIdToBeDeleted: string
  ): Promise<void>{
    const updatedIGCE = IGCEStore.igceEstimateList.filter(
      igce => igce.classification_level as string !== classLevelSysIdToBeDeleted
    )
    IGCEStore.setIgceEstimate(updatedIGCE);
  }

  /**
 * Builds the current selected classification level list by using the saved list and the default
 * object. For the default object, sets the selected classification_level sys_id
 */

  @Action({rawError: true})
  public async addCurrentSelectedClassLevelList(
    addedItemSysId: string): Promise<void> {
    const isAlreadySelected = ClassificationRequirements.selectedClassificationLevels.findIndex(
      level => level.classification_level === addedItemSysId
    )>-1;
    if (!isAlreadySelected){
      const itemToBeAdded = ClassificationRequirements.classificationLevels.filter(
        cl => cl.sys_id === addedItemSysId
      )[0];
      const newSelectedClassificationLevel: SelectedClassificationLevelDTO =
        {
          classification_level: addedItemSysId,
          acquisition_package: AcquisitionPackage.packageId,
          impact_level: itemToBeAdded.impact_level,
          classification: itemToBeAdded.classification
        }
      
      const newRecord = 
        await this.addCurrentSelectedClassLevelListToDB(newSelectedClassificationLevel);
      await this.addCurrentSelectedClassLevelListToStore(newRecord);
    }
  }

  @Action({rawError: true})
  public async addCurrentSelectedClassLevelListToStore(
    newSelectedClassificationLevel: SelectedClassificationLevelDTO
  ): Promise<void> {
    ClassificationRequirements.selectedClassificationLevels.push(
      newSelectedClassificationLevel
    );
  }

  @Action({rawError: true})
  public async addCurrentSelectedClassLevelListToDB(
    newSelectedClassificationLevel: SelectedClassificationLevelDTO
  ): Promise<SelectedClassificationLevelDTO> {
    await api.selectedClassificationLevelTable.create(newSelectedClassificationLevel);

    const queryForCreatedRecord: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_package=" + AcquisitionPackage.packageId 
          + "^classification_level=" + newSelectedClassificationLevel.classification_level
      }
    };
    const newRecord = 
      (await api.selectedClassificationLevelTable.getQuery(queryForCreatedRecord))[0]
    newRecord.classification_level = newSelectedClassificationLevel.classification_level;
    newRecord.classification = newSelectedClassificationLevel.classification;
    newRecord.impact_level = newSelectedClassificationLevel.impact_level;
    return newRecord;
  }
}

const ClassificationRequirements = getModule(ClassificationRequirementsStore);
export default ClassificationRequirements;
