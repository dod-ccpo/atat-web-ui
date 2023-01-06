<template>
  <v-form ref="form" lazy-validation>
    <div>
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header mb-3">
              What classification level(s) will be required 
              for your cloud resources and/or services?
            </h1>
            <div class="copy-max-width">
              <p class="mb-10" id="IntroP">
                In the next section, we will dive into the types of resources, tools, and services
                that you need for this acquisition. The classification level(s) that you 
                select below will be applied to any performance requirements that you specify. 
                If you need more than one level, 
                we will walk you through what is required within each level later.
              </p>
              <p id="SelectMessage">
                Select all that apply to your project.
              </p>
            </div>
            <ATATCheckboxGroup
              id="ClassificationLevelCheckboxes"
              :value.sync="selectedOptions"
              :items="checkboxItems"
              name="checkboxes"
              :card="false"
              class="copy-max-width"
              :rules="[
                $validators.required('Please select at least one classification level.')
              ]"
            />
            <ATATAlert
              id="ClassificationRequirementsAlert"
              v-show="isIL6Selected === 'true'"
              type="info"
              class="copy-max-width my-10"
            >
              <template v-slot:content>
                <p class="mb-0">
                  <strong> You do not need to complete a DD Form 254,
                  DoD Contract Security Classification Specification, for this task order.</strong>
                  JWCC provides a DD Form 254 at the contract level that covers access to all 
                  classification levels for the task orders ordered within it.
                </p>
              </template>
            </ATATAlert>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import { Checkbox } from "../../../types/Global";
import {
  AcquisitionPackageDTO,
  ClassificationLevelDTO, ReferenceColumn, SelectedClassificationLevelDTO
} from "@/api/models";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { hasChanges, buildClassificationCheckboxList} from "@/helpers";
import classificationRequirements from "@/store/classificationRequirements";
import AcquisitionPackage from '@/store/acquisitionPackage';
import _ from "lodash";
import {
  buildCurrentSelectedClassLevelList
} from "@/packages/helpers/ClassificationRequirementsHelper";
import DescriptionOfWork from "@/store/descriptionOfWork";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATAlert
  }
})

export default class ClassificationRequirements extends Mixins(SaveOnLeave) {
  public selectedOptions: string[] = [];
  public classifications: ClassificationLevelDTO[] = []
  public savedSelectedClassLevelList: SelectedClassificationLevelDTO[] = [];
  public acquisitionPackage: AcquisitionPackageDTO | undefined;
  public isIL6Selected = ""
  public IL6SysId = ""
  private checkboxItems: Checkbox[] = []

  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return buildClassificationCheckboxList(data, "", true, false);
  }

  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    this.isIL6Selected = newVal.indexOf(this.IL6SysId) > -1 ? "true" : "false"
  }

  public get currentData(): SelectedClassificationLevelDTO[] {
    return buildCurrentSelectedClassLevelList(this.selectedOptions,
        this.acquisitionPackage?.sys_id as string, this.savedSelectedClassLevelList)
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedSelectedClassLevelList);
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    try {
      if (this.hasChanged()) {

        const selectedClassificationLevelSysIdsOnLoad: string[] 
          = this.savedSelectedClassLevelList.map(obj => obj.classification_level as string);
        const removed = selectedClassificationLevelSysIdsOnLoad.filter(
          sysId => !this.selectedOptions.includes(sysId)
        );
        if (removed.length) {
          await DescriptionOfWork.removeAllInstancesInClassificationLevel(removed);        
        }

        await classificationRequirements.saveSelectedClassificationLevels(this.currentData)
        await classificationRequirements.loadSelectedClassificationLevelsByAqId(
            this.acquisitionPackage?.sys_id as string);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  /**
   * Loads all classification level choices, loads all previously selected classification
   * levels and then sets the context for pre-selecting the checkboxes.
   */
  public async loadOnEnter(): Promise<void> {
    this.acquisitionPackage = await AcquisitionPackage
      .getAcquisitionPackage() as AcquisitionPackageDTO;
    this.classifications = await classificationRequirements.getAllClassificationLevels();
    this.checkboxItems =this.createCheckboxItems(this.classifications);
    const IL6Checkbox = this.checkboxItems.find(e => e.label.indexOf("IL6") > -1);
    this.IL6SysId = IL6Checkbox?.value || "false";
    // need to clone so that the store data is not modified. Store data needs to be intact
    // for comparison purposes during save
    this.savedSelectedClassLevelList =
        _.cloneDeep(await classificationRequirements.getSelectedClassificationLevels());
    this.selectedOptions = this.savedSelectedClassLevelList
      .map(savedSelectedClassLevel =>
        savedSelectedClassLevel.classification_level) as string[];
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>

