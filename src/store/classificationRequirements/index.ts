/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule,} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import {
  ClassificationLevelDTO,
  ReferenceColumn,
  SelectedClassificationLevelDTO
} from "@/api/models";
import {SecurityRequirement} from "../../../types/Global";
import {AxiosRequestConfig} from "axios";

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

  @Mutation
  public setClassifications(value: ClassificationLevelDTO[]): void {
    this.classificationLevels = value;
  }

  @Action({ rawError: true })
  public async setSelectedClassificationLevels(
    value: SelectedClassificationLevelDTO[]
  ): Promise<void> {
    await this.doSetSelectedClassificationLevels(value)
  }

  @Mutation
  public async doSetSelectedClassificationLevels(
    value: SelectedClassificationLevelDTO[]
  ): Promise<void> {
    this.selectedClassificationLevels = value;
  }

  @Mutation
  public async setSecurityRequirements(value: SecurityRequirement[]): Promise<void> {
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
    let selectedClassLevelList = await api.selectedClassificationLevelTable
      .getQuery(selectedClassLevelsRequestConfig);
    if (selectedClassLevelList.length > 0) {
      selectedClassLevelList = selectedClassLevelList
        .map(selectedClassLevel => {
          const classLevelForMapping = this.classificationLevels
            .find(classLevel => classLevel.sys_id === selectedClassLevel.classification_level.value)
          if (classLevelForMapping) {
            selectedClassLevel.impact_level = classLevelForMapping.impact_level;
            selectedClassLevel.classification = classLevelForMapping.classification;
          }
          selectedClassLevel.data_growth_estimate_percentage
              = (selectedClassLevel.data_growth_estimate_percentage as unknown as string)
              .split(",").filter(nonEmptyVal => nonEmptyVal);
          selectedClassLevel.user_growth_estimate_percentage
              = (selectedClassLevel.user_growth_estimate_percentage as unknown as string)
              .split(",").filter(nonEmptyVal => nonEmptyVal);
          return selectedClassLevel;
        })
    }
    await this.setSelectedClassificationLevels(selectedClassLevelList);
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
      const apiCallList: Promise<SelectedClassificationLevelDTO | void>[] = [];
      markedForCreateList.forEach(markedForCreate => {
        apiCallList.push(api.selectedClassificationLevelTable
          .create(markedForCreate));
      })
      markedForDeleteList.forEach(markedForDelete => {
        apiCallList.push(api.selectedClassificationLevelTable
          .remove(markedForDelete.sys_id as string));
      })
      await Promise.all(apiCallList);
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
      selectedClassificationLevel = {
        ...selectedClassificationLevel,
        classification_level:
          selectedClassificationLevel.classification_level.value as unknown as ReferenceColumn,
        acquisition_package:
          selectedClassificationLevel.acquisition_package.value as unknown as ReferenceColumn}
      await api.selectedClassificationLevelTable
        .update(selectedClassificationLevel.sys_id as string, selectedClassificationLevel);
      return true;
    } catch (error) {
      throw new Error(`an error occurred saving a single selected classification level ${error}`);
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
  }

}

const ClassificationRequirements = getModule(ClassificationRequirementsStore);
export default ClassificationRequirements;
