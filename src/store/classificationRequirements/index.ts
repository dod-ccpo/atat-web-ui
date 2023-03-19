/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule,} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import {
  ClassificationLevelDTO,
  ClassifiedInformationTypeDTO,
  ReferenceColumn,
  CrossDomainSolutionDTO,
  SelectedClassificationLevelDTO
} from "@/api/models";
import {CrossDomainSolution, SecurityRequirement} from "../../../types/Global";
import {AxiosRequestConfig} from "axios";
import AcquisitionPackage from "../acquisitionPackage";
import IGCEStore from "@/store/IGCE";
import { convertColumnReferencesToValues } from "@/api/helpers";

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
    const selectedClassLevelList = this.selectedClassificationLevels;
    const requirements = this.securityRequirements;
    const levelIndex = selectedClassLevelList.findIndex(item => item.classification === "S");
    if(levelIndex > -1){
      const classLevel = selectedClassLevelList[levelIndex];
      const typeIndex = requirements.findIndex(item => item.type === "SECRET");
      const informationType = typeIndex > -1 
        ? requirements[typeIndex].classification_information_type.join(",") 
        : "";

      classLevel.classified_information_types = informationType;
      classLevel.acquisition_package =
        typeof classLevel.acquisition_package === "object"
          ? classLevel.acquisition_package.value as string
          : classLevel.acquisition_package as string

      classLevel.classification_level =
        typeof classLevel.classification_level === "object"
          ? classLevel.classification_level.value as string
          : classLevel.classification_level as string

      const apiCall = classLevel.sys_id ? api.selectedClassificationLevelTable.update(
        classLevel.sys_id,
        classLevel
      ) : api.selectedClassificationLevelTable.create(classLevel);

      await Promise.all([apiCall]);

      selectedClassLevelList[levelIndex] = classLevel;

      await this.setSelectedClassificationLevels(selectedClassLevelList);
    } 
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
    return this.selectedClassificationLevels;
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

          if(selectedClassLevel.classification === "S"){        
            const index = tempRequirements.findIndex(item => item.type === "SECRET");
            let types: string[] = [];
            if(selectedClassLevel.classified_information_types)
              types = selectedClassLevel.classified_information_types?.split(",") as string[];
            if(index > -1) {
              tempRequirements[index] = {
                type: "SECRET",
                classification_information_type: types
              };
            } else {
              tempRequirements.push({
                type: "SECRET",
                classification_information_type: types
              });
            }            
          }
          return selectedClassLevel;
        })
    }
    await this.setSecurityRequirements(tempRequirements);
    await this.setSelectedClassificationLevels(selectedClassLevelList);
  }

  /**
   * @param itemsToBeAdded  SelectedClassificationLevelDTO[] items to be added to store
   *                        and database
   */
  @Action({rawError: true})
  async createSelectedClassificationLevels(
    itemsToBeAdded: SelectedClassificationLevelDTO[])
    : Promise<boolean> {
    try {
      // add to database and store
      itemsToBeAdded.forEach(async item => {
        await api.selectedClassificationLevelTable.create(item);
        await this.selectedClassificationLevels.push(item);
      })
      return true;
    } catch (error) {
      throw new Error(`an error occurred saving selected classification levels ${error}`);
    }
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
    // need to sync up IGCE estimate records based on user selections on the CDS screen.
    if (value.cross_domain_solution_required === "YES") {
      const domainPairTypeList =
        JSON.parse(value.traffic_per_domain_pair) as CrossDomainSolution["solutionType"];
      await IGCEStore.syncUpIgceEstimateCDS({
        cdsSysId: objSysId,
        crossDomainPairTypeList: domainPairTypeList.map(domainPairType => domainPairType.type),
        description: value.anticipated_need_or_usage,
      })
    } else {
      await IGCEStore.deleteIgceEstimateCDS(objSysId)
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

}

const ClassificationRequirements = getModule(ClassificationRequirementsStore);
export default ClassificationRequirements;
