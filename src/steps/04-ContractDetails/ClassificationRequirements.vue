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
              v-if="isIL6Selected"
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
            <ATATAlert
              id="RemoveExistingSelectionsAlert"
              v-if="showClassificationRequirementsAlert"
              type="warning"
              class="copy-max-width my-10"
            >
              <template v-slot:content>
                <p class="mb-0">
                  You currently have performance requirements for 
                  {{ classReqsAsCommaList }}. 
                  If you remove any of these selections, all requirements within the level will 
                  be deleted
                </p>
              </template>
            </ATATAlert>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <ATATDialog
      id="DeleteClassificationRequirements"
      :showDialog.sync="showDialog"
      :title="'Delete all ' + deselectedItem?.display + ' requirements?'"
      no-click-animation
      okText="Delete"
      cancelText="Cancel"
      width="450"
      @cancelClicked="cancelClicked"
      @ok="deleteClicked"
      :disableClickingOutside="true"
    >
      <template #content>
        <div class="body">
         This action will permanently delete {{ DOWOfferingsWithClassLevelLength  }} performance 
         requirements that you previously entered within {{ deselectedItem?.display }}. 
         This cannot be undone.
        </div>
      </template>
    </ATATDialog>
  </v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import Toast from "@/store/toast";

import { Checkbox, ToastObj } from "../../../types/Global";
import {
  AcquisitionPackageDTO,
  ClassificationLevelDTO, SelectedClassificationLevelDTO
} from "@/api/models";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { 
  hasChanges, 
  buildClassificationCheckboxList, 
  convertStringArrayToCommaList} from "@/helpers";
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
    ATATAlert,
    ATATDialog
  }
})

export default class ClassificationRequirements extends Mixins(SaveOnLeave) {
  public selectedOptions: string[] = [];
  public classifications: ClassificationLevelDTO[] = []
  public savedSelectedClassLevelList: SelectedClassificationLevelDTO[] = [];
  public existingClassificationsLevelsInDOW = [""];
  public classReqsAsCommaList = "";
  public acquisitionPackage: AcquisitionPackageDTO | undefined;
  public isIL6Selected = false;
  public IL6SysId = "";
  public showClassificationRequirementsAlert = false;
  public showDialog = false;
  private checkboxItems: Checkbox[] = []
  private deselectedItem: ClassificationLevelDTO|undefined|null = null;
  private DOWOfferingsWithClassLevelLength = 0;
  private isDeletionSuccessful = true;

  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return buildClassificationCheckboxList(data, "", true, true);
  }

  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[], oldVal: string[]): void {
    this.getDeselectedItem(oldVal, newVal);
    this.isIL6Selected = newVal.indexOf(this.IL6SysId) > -1;
  }

  /**
   * @param selection - preexisting selectedOptions array of sys_ids
   * @param updated - updated selectedOptions array of sys_ids
   */
  public getDeselectedItem(selection: string[], updated: string[]): void {
    const deselectedItemSysId = (selection.filter(x => updated.indexOf(x) === -1))[0];
    if (deselectedItemSysId !== ""){
      this.deselectedItem = 
        (this.classifications.filter(
          classifs => classifs.sys_id === deselectedItemSysId)
        )[0] || {};
      if (this.deselectedItem){
        this.deselectedItem.display = this.deselectedItem?.display?.replace(" - ", "/") || "";
      }
      this.getDOWOfferingsWithClassLevelLength(deselectedItemSysId);
      this.showDialog = this.deselectedItem?.display !== "";
    }
  }

  public async getDOWOfferingsWithClassLevelLength(classLevelSysId: string): Promise<void>{
    classLevelSysId = classLevelSysId || this.deselectedItem?.sys_id || "";
    const dowStringified  = JSON.stringify(DescriptionOfWork.DOWObject);
    const re = new RegExp(classLevelSysId, 'g');
    this.DOWOfferingsWithClassLevelLength = dowStringified.match(re)?.length || 0;
  }

  // restore the deselectedItem back to selectedOptions
  public cancelClicked(): void{
    this.selectedOptions.push(this.deselectedItem?.sys_id as string)
  }

  // restore the deselectedItem back to selectedOptions
  public async deleteClicked(): Promise<void>{
    this.isDeletionSuccessful = await DescriptionOfWork.removeClassificationLevelsGlobally(
      this.deselectedItem?.sys_id as string
    );
    await DescriptionOfWork.deleteClassificationLevelsfromDOWObject(
      this.deselectedItem?.sys_id as string
    )

    if (this.isDeletionSuccessful){
      //build warning alert
      this.buildClassificationRequirementsAlert();

      // reset isDeletionSuccessful
      this.isDeletionSuccessful = false;

      // build/display toast object
      const toastObj: ToastObj = {
        type: "success",
        message: this.deselectedItem?.display + " requirements deleted",
        isOpen: true,
        hasUndo: false,
        hasIcon: true,
      };

      Toast.setToast(toastObj);
    }
  }

  public get currentData(): SelectedClassificationLevelDTO[] {
    return buildCurrentSelectedClassLevelList(this.selectedOptions,
        this.acquisitionPackage?.sys_id as string, this.savedSelectedClassLevelList)
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedSelectedClassLevelList);
  }

  /**
   * iterated selectedOptions and returns the options that exist in DOWObject
   */
  public async buildClassificationRequirementsAlert(): Promise<void> {
    this.existingClassificationsLevelsInDOW = [];
    this.selectedOptions.forEach(
      (optionSysId) => {
        this.getDOWOfferingsWithClassLevelLength(optionSysId);
        if (this.DOWOfferingsWithClassLevelLength>0){
          this.existingClassificationsLevelsInDOW.push(optionSysId);
        }
      }
    );
    this.showClassificationRequirementsAlert = this.existingClassificationsLevelsInDOW.length>0;
    this.buildClassReqsAsCommaList();
  }

  /**
   * builds existing classified requirements as comma list 
   */
  public buildClassReqsAsCommaList(): void{
    const existingClassLabels = this.classifications.filter(
      classifs => this.existingClassificationsLevelsInDOW.find(so => so === classifs.sys_id)
    ).map(selectedClassifs => selectedClassifs.display?.replace(" - ", "/")) as string[];
    this.classReqsAsCommaList = convertStringArrayToCommaList(
      existingClassLabels.sort(), 'and'
    );
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    try {
      if (this.hasChanged()) {
        const itemsToBeAdded = (this.currentData.filter(
          x => this.savedSelectedClassLevelList.indexOf(x) === -1
        ));
        await classificationRequirements.createSelectedClassificationLevels(itemsToBeAdded)
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

    this.buildClassificationRequirementsAlert();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>

