<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Next, we’ll gather your requirements for {{ serviceOfferingName }}
          </h1>
          <div class="copy-max-width">

            <div 
              v-if="avlClassificationLevelObjects.length === 1"
              id="SingleClassificationIntro"  
              class="mb-10"
            >
              <p>
                In the previous section, you specified 
                <strong>{{ singleClassificationLabel }}</strong> for the 
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
                :avlInstancesLength="avlInstancesLength"
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
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";

import RequirementsForm from './RequirementsForm.vue'
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ClassificationsModal from "./ClassificationsModal.vue";

import SaveOnLeave from "@/mixins/saveOnLeave";

import { Checkbox, DOWClassificationInstance } from "../../../../types/Global";
import ClassificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";
import { 
  buildClassificationCheckboxList, 
  buildClassificationLabel,
  hasChanges,
} from "@/helpers";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Periods from "@/store/periods";

import _ from "lodash";

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

  // used for checkboxes at top of form if multiple 
  public avlClassificationLevelObjects: ClassificationLevelDTO[] = [];
  public avlInstancesLength = 0;
  public avlClassificationLevelSysIds: string[] = [];

  private headerCheckboxItems: Checkbox[] = [];
  public headerCheckboxSelectedSysIds: string[] = [];
  public selectedHeaderLevelSysIds: string[] = [];
  public instancesFormData: DOWClassificationInstance[] = [];

  public periods = [{}];

  public modalSelectionsOnOpen: string[] = [];
  public openModal(): void {
    this.modalSelectionsOnOpen = this.modalSelectedOptions;
    this.showDialog = true;
  }

  public get singleClassificationLabel(): string {
    if (this.instancesFormData.length && this.instancesFormData[0].labelLong) {
      return this.instancesFormData[0].labelLong;
    }
    return "";
  }

  public async buildNewClassificationInstances(): Promise<void> {
    this.classificationInstances = [];
    this.avlClassificationLevelObjects.forEach((obj) => {
      const labelLong = buildClassificationLabel(obj, "long");
      const labelShort = buildClassificationLabel(obj, "short");
      const instance: DOWClassificationInstance = {
        sysId: "", // will be populated after saving
        impactLevel: obj.impact_level,
        classificationLevelSysId: obj.sys_id || "",
        anticipatedNeedUsage: "",
        entireDuration: "",
        selectedPeriods: [],
        labelLong,
        labelShort,
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
        }
      }
    }, this);
    // remove options not in new selected options array
    const instancesToShowClone = this.headerCheckboxSelectedSysIds;
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

    const arr = this.currentPackageClassificationLevels;
    await ClassificationRequirements.setSelectedClassificationLevels(arr);
    await this.setAvailableClassificationLevels();
    await this.buildNewClassificationInstances();
    this.checkSingleClassification();
  }

  public async clearUnselected(): Promise<void> {
    const filteredSelectedHeaderLevelSysIds = this.selectedHeaderLevelSysIds.filter(
      classificationLevelSysId => 
        this.avlClassificationLevelSysIds.includes(classificationLevelSysId)
    );
    this.selectedHeaderLevelSysIds = filteredSelectedHeaderLevelSysIds;

    const filteredHeaderChecked = this.headerCheckboxSelectedSysIds.filter(
      classificationLevelSysId => 
        this.avlClassificationLevelSysIds.includes(classificationLevelSysId)
    );
    this.headerCheckboxSelectedSysIds = filteredHeaderChecked;
    const filteredInstances = this.instancesFormData.filter((instance) => {
      return this.avlClassificationLevelSysIds.includes(instance.classificationLevelSysId);
    }, this);
    this.instancesFormData = filteredInstances;
  }

  public get currentPackageClassificationLevels(): ClassificationLevelDTO[] {
    const arr: ClassificationLevelDTO[] = [];
    this.modalSelectedOptions.forEach(item => {
      const value = this.allClassificationLevels.filter((e) => {
        return item == e.sys_id
      })
      arr.push(value[0]);
    })
    return arr;
  }

  private createCheckboxItems(data: ClassificationLevelDTO[], idSuffix: string) {
    idSuffix = idSuffix || "";
    return data.length > 1 ? buildClassificationCheckboxList(data, idSuffix) : [];
  }

  public classificationInstances: DOWClassificationInstance[] = [];

  public async setAvailableClassificationLevels(): Promise<void> {
    this.avlClassificationLevelObjects 
      = await ClassificationRequirements.getSelectedClassificationLevels();
    this.avlInstancesLength = this.avlClassificationLevelObjects.length;

    this.avlClassificationLevelSysIds = [];
    this.avlClassificationLevelObjects.forEach((e) => {
      if (e.sys_id) {
        this.avlClassificationLevelSysIds.push(e.sys_id);
      }
      this.isIL6Selected = e.impact_level === this.IL6SysId ? true : false;
    });
    this.headerCheckboxItems 
      = this.createCheckboxItems(this.avlClassificationLevelObjects, "");
  }

  public checkSingleClassification(): void {
    // if only one classification level selected in Contract Details, set
    // it as "selected" for instance forms
    if (this.avlInstancesLength === 1 && this.avlClassificationLevelObjects[0].sys_id) {
      const sysId = this.avlClassificationLevelObjects[0].sys_id;
      this.selectedHeaderLevelSysIds.push(sysId);
    }
  }

  public async loadOnEnter(): Promise<void> {
    // get classification levels selected in step 4 Contract Details
    this.avlClassificationLevelObjects 
      = await ClassificationRequirements.getSelectedClassificationLevels();

    // set checked items in modal to classification levels selected in step 4 Contract Details
    if(this.avlClassificationLevelObjects) {
      this.avlClassificationLevelObjects.forEach((val) => {
        this.modalSelectedOptions.push(val.sys_id || "")
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
      this.savedData = [...this.classificationInstances];
      this.classificationInstances.forEach((instance) => {
        if (instance.classificationLevelSysId) {
          this.selectedHeaderLevelSysIds.push(instance.classificationLevelSysId);
        }
      });
    }

    this.checkSingleClassification();

    // set up PoP periods if not for entire duration
    const periods = await Periods.loadPeriods();
    if (periods && periods.length > 0) {
      this.periods = periods
    }

  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  }

  public savedData: DOWClassificationInstance[] = [];

  // labels not saved to SNOW
  public async setSavedInstanceLabels(): Promise<void> {
    this.classificationInstances.forEach((instance) => {
      const classificationObj 
        = this.avlClassificationLevelObjects.find(e => e.sys_id === instance.sysId);
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
    try {
      if (this.hasChanged()) {
        // save to store
        await DescriptionOfWork.setOfferingDetails(this.instancesFormData);
        //save to backend
        await DescriptionOfWork.saveUserSelectedServices();
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }


};

</script>
