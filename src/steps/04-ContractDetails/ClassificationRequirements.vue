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
              v-if="isHighSideSelected"
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
                  If you remove 
                  {{ 
                      DOWOfferingsWithClassLevelLength > 1 
                      ? ' any of these selections' 
                      : ' this selection' 
                  }}, all requirements within the level will be deleted.
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
      :title="'Delete all ' + getServiceOfferingName + ' requirements?'"
      no-click-animation
      okText="Delete"
      cancelText="Cancel"
      width="450"
      @cancelClicked="cancelClicked"
      @ok="deleteClicked(true)"
      :disableClickingOutside="true"
    >
      <template #content>
        <div class="body">
         This action will permanently delete {{ DOWOfferingsWithClassLevelLength  }} performance 
         {{ getPluralRequirement }} that you previously 
         entered within {{ getServiceOfferingName }}. 
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
  convertStringArrayToCommaList,
  setItemToPlural} from "@/helpers";
import ClassificationReqs from "@/store/classificationRequirements";
import AcquisitionPackage from '@/store/acquisitionPackage';
import _ from "lodash";


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
  public IL6SysId = "";
  public showClassificationRequirementsAlert = false;
  public showDialog = false;
  private checkboxItems: Checkbox[] = []
  private itemDeleted = {} as ClassificationLevelDTO;
  private itemAdded = {} as ClassificationLevelDTO;
  private DOWOfferingsWithClassLevelLength = 0;
  private isDeletionSuccessful = true;
  

  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return buildClassificationCheckboxList(data, "", true, true);
  }

  get getServiceOfferingName():string {
    return this.itemDeleted.display || "";
  }

  get getPluralRequirement():string {
    return setItemToPlural(this.DOWOfferingsWithClassLevelLength, "requirement");
  }

  get isHighSideSelected(): boolean{
    return this.selectedOptions.some(
      so => ClassificationReqs.highSideSysIds.indexOf(so) > -1
    )
  }

  @Watch("selectedOptions")
  public async selectedOptionsChange(updated: string[], current: string[]): Promise<void> {
    if (updated.length < current.length){ //selectedOptions was `unchecked` and item removed
      this.itemDeleted = 
        this.getClassificationItem((current.filter(x => updated.indexOf(x) === -1))[0])
      this.itemDeleted.display = this.itemDeleted?.display?.replace(" - ", "/") || "";

      //only show dialog for classLevels that are currently used in DOW
      if (this.existingClassificationsLevelsInDOW.includes(this.itemDeleted.sys_id as string)){
        this.showDeleteDialog();
      } else {
        //removes all store/database `residue` that was added when the item was added
        this.deleteClicked(false);
      }
    } else if(updated.length > current.length){ //selectedOptions was `checked` and Item added
      this.itemAdded = 
        this.getClassificationItem((updated.filter(x => current.indexOf(x) === -1))[0]);
      this.processNewSelectedItem();
    }
  }

  public getClassificationItem(sysId: string): ClassificationLevelDTO {
    return this.classifications.find(c => c.sys_id === sysId) as ClassificationLevelDTO;
  }

  public showDeleteDialog(): void {
    this.getTotalOfDOWObjsWithClassLevel(this.itemDeleted.sys_id as string);
    this.showDialog = this.itemDeleted?.display !== "";
  }

  public processNewSelectedItem(): void {
    ClassificationReqs.addCurrentSelectedClassLevelList(this.itemAdded.sys_id as string);
  }

  public async getTotalOfDOWObjsWithClassLevel(classLevelSysId: string): Promise<void>{
    classLevelSysId = classLevelSysId || this.itemDeleted?.sys_id || "";
    this.DOWOfferingsWithClassLevelLength = 
      await ClassificationReqs.getTotalClassLevelInDOW(classLevelSysId)
  }

  // restore the itemDeleted back to selectedOptions
  public cancelClicked(): void{
    this.selectedOptions.push(this.itemDeleted?.sys_id as string)
  }

  // restore the itemDeleted back to selectedOptions
  public async deleteClicked(isClassLevelInDOW: boolean): Promise<void>{
    this.isDeletionSuccessful = 
    await ClassificationReqs.removeClassificationLevelsFromDBGlobally(
        this.itemDeleted?.sys_id as string
    );
    await ClassificationReqs.removeClassificationLevelsFromStoreGlobally(
      this.itemDeleted
    )

    // build/modify ui elements
    if (this.isDeletionSuccessful && isClassLevelInDOW){
      //build warning alert
      this.buildClassificationRequirementsAlert();

      // reset isDeletionSuccessful
      this.isDeletionSuccessful = false;

      // build/display toast object
      const toastObj: ToastObj = {
        type: "success",
        message: this.itemDeleted?.display + " requirements deleted",
        isOpen: true,
        hasUndo: false,
        hasIcon: true,
      };

      Toast.setToast(toastObj);
    }
  }

  public get currentData(): SelectedClassificationLevelDTO[] {
    return ClassificationReqs.selectedClassificationLevels;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedSelectedClassLevelList);
  }

  /**
   * iterated selectedOptions and returns the options that exist in DOWObject
   */
  public async buildClassificationRequirementsAlert(): Promise<void> {
    this.existingClassificationsLevelsInDOW = [];
    for (const opt of this.selectedOptions){
      const totalClassLevelInDOW = await ClassificationReqs.getTotalClassLevelInDOW(opt);
      if (totalClassLevelInDOW>0){
        await this.existingClassificationsLevelsInDOW.push(opt);
      }
    }
    this.showClassificationRequirementsAlert = 
        this.existingClassificationsLevelsInDOW.length>0;
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
        await ClassificationReqs.loadSelectedClassificationLevelsByAqId(
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
    this.classifications = await ClassificationReqs.getAllClassificationLevels();
    this.checkboxItems =this.createCheckboxItems(this.classifications);
    const IL6Checkbox = this.checkboxItems.find(e => e.label.indexOf("IL6") > -1);
    this.IL6SysId = IL6Checkbox?.value || "false";
    // need to clone so that the store data is not modified. Store data needs to be intact
    // for comparison purposes during save
    const selectedOptionsOnLoad = await ClassificationReqs.getSelectedClassificationLevels();
    this.selectedOptions = (await ClassificationReqs.getSelectedClassificationLevels())
      .map(savedSelectedClassLevel =>
        savedSelectedClassLevel.classification_level) as string[];

    this.savedSelectedClassLevelList =  _.cloneDeep(selectedOptionsOnLoad);

    this.buildClassificationRequirementsAlert();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>

