<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Now we’ll gather your requirements for {{ serviceOfferingName }}
            </h1>
            <div class="copy-max-width">

              <div 
                v-if="selectedClassificationLevelList.length === 1"
                id="SingleClassificationIntro"  
                class="mb-10"
              >
                <p>
                  In the previous section, you specified 
                  <strong>{{ singleClassificationLevelName }}</strong> for the 
                  classification level of all cloud resources and services. If you 
                  need this within a different level, 
                  <a 
                    role="button" 
                    id="UpdateClassification"
                    tabindex="0"
                    @click="openModal"
                    @keydown.enter="openModal"
                    @keydown.space="openModal"
                  >update your Classification Requirements</a>.
                </p>
              </div>

              <div v-else id="ClassificationCheckboxWrapper">
                <ATATCheckboxGroup
                  id="ClassificationCheckboxes"
                  aria-describedby="ClassificationGroupLabel"
                  :value.sync="selectedHeaderLevelSysIds"
                  :items="headerCheckboxItems"
                  :card="false"
                  class="copy-max-width"
                  :rules="[
                    $validators.required('Please select at least one option.')
                  ]"
                  groupLabel="What classification level(s) do you need?"
                  groupLabelId="ClassificationGroupLabel"
                />

                <ATATExpandableLink aria-id="AboutClassificationLevels" class="mt-10">
                  <template v-slot:header>
                    I need this requirement within a different classification level. What do I do?
                  </template>
                  <template v-slot:content>
                    <p>
                      The levels listed above are based on the classification requirements 
                      you specified in the previous Contract Details section. If you need 
                      to make changes to these levels, 
                      <a 
                        role="button"
                        id="UpdateClassification"
                        tabindex="0"
                        @click="openModal"
                        @keydown.enter="openModal"
                        @keydown.space="openModal"
                      >update your Classification Requirements</a>.
                    </p>
                  </template>
                </ATATExpandableLink>

              </div>

              <div id="OfferingDetailsForms">
                <RequirementsForm
                  :instances="instancesFormData"
                  :avlInstancesLength="selectedInstancesLength"
                  :isPeriodsDataMissing="isPeriodsDataMissing"
                  :groupId="groupId"
                  :serviceOfferingName="serviceOfferingName"
                />
              </div>

            </div>
          </v-col>
        </v-row>
      </v-container>

      <ClassificationsModal 
        :showDialog="showDialog"
        @cancelClicked="modalCancelClicked"
        @okClicked="modalOkClicked"
        :modalSelectedOptions.sync="modalSelectedOptions"
        :modalSelectionsOnOpen="modalSelectionsOnOpen"
        :modalCheckboxItems="modalCheckboxItems"
        :IL6SysId="IL6SysId"
        :isIL6Selected.sync="isIL6Selected"
      />

    </div>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";

import RequirementsForm from './RequirementsForm.vue'
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ClassificationsModal from "./ClassificationsModal.vue";

import SaveOnLeave from "@/mixins/saveOnLeave";

import { Checkbox, DOWClassificationInstance, ToastObj } from "../../../../types/Global";
import ClassificationRequirements from "@/store/classificationRequirements";
import Periods from "@/store/periods";

import {
  AcquisitionPackageDTO,
  ClassificationLevelDTO,
  ReferenceColumn,
  SelectedClassificationLevelDTO
} from "@/api/models";
import { 
  buildClassificationCheckboxList, 
  buildClassificationLabel,
  hasChanges,
} from "@/helpers";
import DescriptionOfWork from "@/store/descriptionOfWork";

import _ from "lodash";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {
  buildCurrentSelectedClassLevelList
} from "@/packages/helpers/ClassificationRequirementsHelper";
import classificationRequirements from "@/store/classificationRequirements";
import { convertColumnReferencesToValues } from "@/api/helpers";

@Component({
  components: {
    ATATAlert,
    ATATCheckboxGroup,
    ATATExpandableLink,
    ClassificationsModal,
    RequirementsForm,
  }
})

export default class ServiceOfferingDetails extends Mixins(SaveOnLeave) {
  public serviceOfferingName = DescriptionOfWork.currentOfferingName;
  public serviceOfferingSysId = DescriptionOfWork.currentOfferingSysId;
  public groupId = DescriptionOfWork.currentGroupId;

  private showDialog = false;
  public modalSelectedOptions: string[] = [];
  private modalCheckboxItems: Checkbox[] = [];
  public isIL6Selected = false;
  public IL6SysId = "";

  public classificationLevelsFromStore: ClassificationLevelDTO[] = [];
  public allClassificationLevels:ClassificationLevelDTO[] = [];
  public singleClassificationLevelName: string | undefined = "";

  // used for checkboxes at top of form if multiple 
  public selectedClassificationLevelList: SelectedClassificationLevelDTO[] = [];
  public selectedInstancesLength = 0;
  public selectedClassificationLevelSysIds: string[] = [];

  private headerCheckboxItems: Checkbox[] = [];
  public headerCheckboxSelectedSysIds: string[] = [];
  public selectedHeaderLevelSysIds: string[] = [];
  public instancesFormData: DOWClassificationInstance[] = [];
  public isPeriodsDataMissing = false;

  public modalSelectionsOnOpen: string[] = [];
  public acquisitionPackage: AcquisitionPackageDTO | undefined;
  public openModal(): void {
    this.modalSelectionsOnOpen = this.modalSelectedOptions;
    this.showDialog = true;
  }
  public get isOther():boolean {
    return DescriptionOfWork.currentOfferingName === "Other"
  }

  public async buildNewClassificationInstances(): Promise<void> {
    this.classificationInstances = [];
    this.selectedClassificationLevelList.forEach((obj) => {
      obj = convertColumnReferencesToValues(obj);
      const labelLong = buildClassificationLabel(obj, "long");
      const labelShort = buildClassificationLabel(obj, "short");
      const classificationLevelSysId = typeof obj.classification_level === "object"
        ? (obj.classification_level as ReferenceColumn).value 
        : obj.classification_level;
      const instance: DOWClassificationInstance = {
        sysId: "",
        impactLevel: obj.impact_level,
        classificationLevelSysId: classificationLevelSysId as string,
        anticipatedNeedUsage: "",
        entireDuration: "",
        selectedPeriods: [],
        labelLong,
        labelShort,
        classifiedInformationTypes: "",
        typeOfDelivery: "",
        typeOfMobility: "",
        typeOfMobilityOther: "",
        acquisitionPackage: ""
      }
      this.classificationInstances.push(instance);
    }, this);
    await this.clearUnselected();
  }

  @Watch("selectedHeaderLevelSysIds")
  public async updateInstances(newSysIds: string[]): Promise<void> {
    // add to array of instance forms to show if selectedOption not in the list
    // of previously selected classification levels
    newSysIds.forEach((selectedOption: string) => {
      if (this.headerCheckboxSelectedSysIds.indexOf(selectedOption) === -1) {
        this.headerCheckboxSelectedSysIds.push(selectedOption);
        const instance = this.classificationInstances.find(
          e => e.classificationLevelSysId === selectedOption
        );
        if (instance) {
          this.instancesFormData.push(instance);
        } else if (!instance) {
          let newInstance = this.selectedClassificationLevelList
            .find(obj => obj.classification_level === selectedOption)
          if (newInstance) {
            newInstance = convertColumnReferencesToValues(newInstance);
            const labelLong = buildClassificationLabel(newInstance, "long");
            const labelShort = buildClassificationLabel(newInstance, "short");
            const classificationLevelSysId = typeof newInstance.classification_level === "object"
              ? (newInstance.classification_level as ReferenceColumn).value
              : newInstance.classification_level;
            const classificationInstance: DOWClassificationInstance = {
              sysId: "",
              impactLevel: newInstance.impact_level,
              classificationLevelSysId: classificationLevelSysId as string,
              anticipatedNeedUsage: "",
              entireDuration: "",
              selectedPeriods: [],
              labelLong,
              labelShort,
              classifiedInformationTypes: "",
              typeOfDelivery: "",
              typeOfMobility: "",
              typeOfMobilityOther: "",
              acquisitionPackage: "",
            }
            this.instancesFormData.push(classificationInstance);
          }
        }
      }
    }, this);
    // remove options not in new selected options array
    const instancesToShowClone = _.cloneDeep(this.headerCheckboxSelectedSysIds);
    instancesToShowClone.forEach((classificationLevelSysId) => {
      if (!newSysIds.includes(classificationLevelSysId)) {
        const i = this.headerCheckboxSelectedSysIds.findIndex(
          e => e === classificationLevelSysId
        );
        if (i > -1) {
          this.headerCheckboxSelectedSysIds.splice(i, 1);
        }
      }
    }, this);
    // remove previously selected instances from array of instances 
    const instancesFormDataClone = _.cloneDeep(this.instancesFormData);
    instancesFormDataClone.forEach((instance) => {
      const classificationLevelSysId = instance.classificationLevelSysId || "";
      if (!newSysIds.includes(classificationLevelSysId)) {
        const i = this.instancesFormData.findIndex(
          e => e.classificationLevelSysId === classificationLevelSysId
        );
        if (i > -1) {
          this.instancesFormData.splice(i, 1);
        }
      }
    }, this);
    this.instancesFormData.sort((a,b) => (a.impactLevel > b.impactLevel) ? 1 : -1);   
  }

  public modalCancelClicked(): void {
    this.showDialog = false;
  }

  public async modalOkClicked(): Promise<void> {
    this.showDialog = false;
    
   
    // remove any previously selected classifications no longer selected in modal
    const keepSelected = this.modalSelectedOptions;
    this.selectedHeaderLevelSysIds = this.selectedHeaderLevelSysIds.filter((sysId) => {
      return keepSelected.indexOf(sysId) > -1;
    });
    const currentData = await buildCurrentSelectedClassLevelList(this.modalSelectedOptions,
        this.acquisitionPackage?.sys_id as string, this.selectedClassificationLevelList)
    await classificationRequirements.saveSelectedClassificationLevels(currentData);
    setTimeout(async () => {
     
      // await classificationRequirements.loadSelectedClassificationLevelsByAqId(
      //     this.acquisitionPackage?.sys_id as string);
      
      this.selectedClassificationLevelList = 
          await ClassificationRequirements.getSelectedClassificationLevels();
    
      await this.setAvailableClassificationLevels();
      await this.buildNewClassificationInstances();
      await this.checkSingleClassification();
      ClassificationRequirements.createToast();
    }, 1000);

    
  }
 
  public async clearUnselected(): Promise<void> {
    const filteredSelectedHeaderLevelSysIds = this.selectedHeaderLevelSysIds.filter(
      classificationLevelSysId => 
        this.selectedClassificationLevelSysIds.includes(classificationLevelSysId)
    );
    this.selectedHeaderLevelSysIds = filteredSelectedHeaderLevelSysIds;
    const filteredHeaderChecked = this.headerCheckboxSelectedSysIds.filter(
      classificationLevelSysId => 
        this.selectedClassificationLevelSysIds.includes(classificationLevelSysId)
    );
    this.headerCheckboxSelectedSysIds = filteredHeaderChecked;
    const filteredInstances = this.instancesFormData.filter((instance) => {
      return this.selectedClassificationLevelSysIds.includes(instance.classificationLevelSysId);
    }, this);
    this.instancesFormData = filteredInstances;
  }

  private createCheckboxItems(data: ClassificationLevelDTO[], idSuffix: string) {
    idSuffix = idSuffix || "";
    return data.length > 1 ? buildClassificationCheckboxList(data, idSuffix, false, false) : [];
  }

  public classificationInstances: DOWClassificationInstance[] = [];

  public async setAvailableClassificationLevels(): Promise<void> {
    // this.selectedClassificationLevelList 
    //  = await ClassificationRequirements.selectedClassificationLevels;
    this.selectedInstancesLength = await this.selectedClassificationLevelList.length;

    this.selectedClassificationLevelSysIds = [];
    this.selectedClassificationLevelList.forEach(selectedClassLevel => {
      const sysId = typeof selectedClassLevel.classification_level === "object"
        ? (selectedClassLevel.classification_level as ReferenceColumn).value
        : selectedClassLevel.classification_level as string;
      if (sysId) {
        this.selectedClassificationLevelSysIds.push(sysId);
      }
      this.isIL6Selected = selectedClassLevel.impact_level === this.IL6SysId;
    });
    this.headerCheckboxItems
        = await this.createCheckboxItems(this.selectedClassificationLevelList, "");
  }

  public checkSingleClassification(): void {
    // if only one classification level selected in Contract Details, set
    // it as "selected" for instance forms
    if (this.selectedInstancesLength === 1
      && this.selectedClassificationLevelList[0].sys_id) {
      const classificationObj = this.selectedClassificationLevelList[0];
      const sysId = typeof classificationObj.classification_level === "object"
        ? (classificationObj.classification_level as ReferenceColumn).value
        : classificationObj.classification_level as string;

      if(sysId) {
        this.selectedHeaderLevelSysIds.push(sysId);
      }
      this.singleClassificationLevelName 
        = buildClassificationLabel(classificationObj, "short");
    }
  }

  public async loadOnEnter(): Promise<void> {
    this.acquisitionPackage = await AcquisitionPackage
      .getAcquisitionPackage() as AcquisitionPackageDTO;
    // get classification levels selected in step 4 Contract Details
    this.selectedClassificationLevelList 
      = await ClassificationRequirements.getSelectedClassificationLevels();
    // set name for other
    if(DescriptionOfWork.currentOfferingName === "Other"){
      const offeringGroupIndex = DescriptionOfWork.currentOfferingGroupIndex
      const OfferingIndex = DescriptionOfWork.currentOfferingIndex
      const name = DescriptionOfWork.DOWObject[offeringGroupIndex]
        .serviceOfferings[OfferingIndex].otherOfferingName
      this.serviceOfferingName = name || ""
    }
    // set checked items in modal to classification levels selected in step 4 Contract Details
    if(this.selectedClassificationLevelList) {
      this.selectedClassificationLevelList.forEach((val) => {
        val = convertColumnReferencesToValues(val);
        this.modalSelectedOptions.push(val.classification_level as string)
      });
    }
    // set up header checkbox items and list of sysIds for available classification levels
    await this.setAvailableClassificationLevels();
    // get list of all possible classification levels to generate checkbox list and labels
    this.allClassificationLevels
      = await ClassificationRequirements.getAllClassificationLevels();
    this.modalCheckboxItems = this.createCheckboxItems(this.allClassificationLevels, "Modal");
    const IL6Checkbox 
      = this.modalCheckboxItems.find(e => e.label.indexOf("IL6") > -1);
    this.IL6SysId = IL6Checkbox?.value || "";

    // load existing classification instances for this service offering
    this.classificationInstances 
      = await DescriptionOfWork.getClassificationInstances();

    // if no existing classification instances saved in store, build one for each
    // classification level selected in step 4 Contract Details
    if (this.classificationInstances.length === 0) {
      await this.buildNewClassificationInstances();
    } else {
      await this.setSavedInstanceLabels();
      const tempClassInstances = _.cloneDeep(this.classificationInstances)
      this.savedData = [...tempClassInstances];
      this.classificationInstances.forEach((instance) => {
        if (instance.classificationLevelSysId) {
          if (typeof instance.classificationLevelSysId === "object") {
            instance.classificationLevelSysId 
              = (instance.classificationLevelSysId as ReferenceColumn).value || "";
          }
          this.selectedHeaderLevelSysIds.push(instance.classificationLevelSysId);
        }
      });
    }

    this.checkSingleClassification();
    const periods = await Periods.loadPeriods();
    this.isPeriodsDataMissing = periods.length === 0 ? true : false;

  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  }

  public savedData: DOWClassificationInstance[] = [];

  // labels not saved to SNOW
  public async setSavedInstanceLabels(): Promise<void> {
    this.classificationInstances.forEach((instance) => {
      const classificationObj 
        = this.selectedClassificationLevelList.find(e => e.sys_id === instance.sysId);
      if (classificationObj) {
        instance.labelLong = buildClassificationLabel(classificationObj, "long");
        instance.labelShort = buildClassificationLabel(classificationObj, "short");
      }
    });
  }

  private hasChanged(): boolean {
    return hasChanges(this.instancesFormData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    const isValid = this.$refs.form.validate();
    try {
      this.instancesFormData.forEach((instance, index) => {
        if (instance.entireDuration.toLowerCase() === "yes") {
          this.instancesFormData[index].selectedPeriods = [];
        }
      });

      if ((this.hasChanged()|| this.isOther) && isValid) {
        await DescriptionOfWork.setOfferingDetails(this.instancesFormData);
      } else if (!isValid) {
        // scroll to first errored input/issue
        const el = document.getElementsByClassName("error--text")[0];
        el.scrollIntoView({
          behavior: "smooth"
        });
      } else {
        await DescriptionOfWork.setNeedsSecurityRequirements();
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }


};

</script>
