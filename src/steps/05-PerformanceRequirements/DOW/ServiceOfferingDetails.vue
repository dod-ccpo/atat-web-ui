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
            >
              <p id="SingleClassificationIntro">
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
                :instances="instancesForForm"
                :avlInstancesLength="avlInstancesLength"
              />
            </div>

          </div>
        </v-col>
      </v-row>
    </v-container>

    <ATATDialog
      :showDialog.sync="showDialog"
      title="What classification level(s)are required for your
        cloud resources and/or services?"
      no-click-animation
      okText="Change Levels"
      width="670"
      :disabled="!hasChangedPackageClassificationLevels()"
      @ok="classificationOptionsChangedInModal"
    >
      <template #content>
        <p class="body">
          Changes to the selections below will be reflected in the overall Classification
          Requirements section. If you select more than one, we will ask you to specify a
          level for each performance requirement.
        </p>
        <p class="body mb-5">
          Select all that apply to your contracting effort.
        </p>
        <ATATCheckboxGroup
          id="ClassificationLevelCheckboxes"
          :value.sync="modalSelectedOptions"
          :hasOtherValue="true"
          :items="modalCheckboxItems"
          name="checkboxes"
          :card="false"
          :truncate="false"
          class="copy-max-width"
          :rules="[
            $validators.required('Please select at least one classification level.')
          ]"
        />
        <ATATAlert
          id="ClassificationRequirementsAlert"
          v-show="isIL6Selected === 'true'"
          type="warning"
          class="copy-max-width mt-10"
        >
          <template v-slot:content>
            <p class="mb-0 body">
              Contracts requiring access to classified information (IL6 level and above)
              must complete a <strong>DD Form 254, DoD Contract Security Classification
              Specification.</strong> We will walk you through uploading this form next.
            </p>
          </template>
        </ATATAlert>
      </template>
    </ATATDialog>

  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";

import RequirementsForm from './RequirementsForm.vue'
import ATATDialog from "@/components/ATATDialog.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";

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
    ATATDialog,
    ATATExpandableLink,
    RequirementsForm,
  }
})

export default class ServiceOfferingDetails extends Mixins(SaveOnLeave) {
  public serviceOfferingName = DescriptionOfWork.currentOfferingName;

  private showDialog = false;
  public modalSelectedOptions: string[] = [];
  private modalCheckboxItems: Checkbox[] = [];
  public isIL6Selected = "";
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
  public instancesForForm: DOWClassificationInstance[] = [];

  public periods = [{}];

  public modalSelectionsOnOpen: string[] = [];
  public openModal(): void {
    this.modalSelectionsOnOpen = this.modalSelectedOptions;
    this.showDialog = true
  }

  public get singleClassificationLabel(): string {
    if (this.instancesForForm.length && this.instancesForForm[0].classificationLevelLabels) {
      return this.instancesForForm[0].classificationLevelLabels.longLabel;
    }
    return "";
  }

  public async buildClassificationInstances(): Promise<void> {
    this.classificationInstances = [];
    this.avlClassificationLevelObjects.forEach((obj) => {
      const longLabel = buildClassificationLabel(obj, "long");
      const shortLabel = buildClassificationLabel(obj, "short");
      const instance: DOWClassificationInstance = {
        sysId: obj.sys_id,
        classificationLevelLabels: { 
          longLabel, 
          shortLabel,
        },
        impactLevel: obj.impact_level,
        classificationLevelSysId: obj.sys_id || "",
        anticipatedNeedUsage: "",
        entireDuration: "",
        selectedPeriods: []
      }
      this.classificationInstances.push(instance);
    }, this);
    await this.clearUnselected();
  }

  @Watch("selectedHeaderLevelSysIds")
  public headerSelectionChange(newSysIds: string[]): void {
    // add to array of forms to show if selectedOption not in the list
    newSysIds.forEach((selectedOption: string) => {
      if (this.headerCheckboxSelectedSysIds.indexOf(selectedOption) === -1) {
        this.headerCheckboxSelectedSysIds.push(selectedOption);
        const instance = this.classificationInstances.find(e => e.sysId === selectedOption);
        if (instance) {
          this.instancesForForm.push(instance);
        }
      }
    });
    // remove options not in new selected options array
    const instancesToShowClone = this.headerCheckboxSelectedSysIds;
    instancesToShowClone.forEach((sysId) => {
      if (!newSysIds.includes(sysId)) {
        const i = this.headerCheckboxSelectedSysIds.findIndex(e => e === sysId);
        if (i > -1) {
          this.headerCheckboxSelectedSysIds.splice(i, 1);
        }
      }
    });
    // remove previously selected instances from array of instances 
    const instancesForFormClone = _.cloneDeep(this.instancesForForm);
    instancesForFormClone.forEach((instance) => {
      const sysId = instance.sysId || "";
      if (!newSysIds.includes(sysId)) {
        const i = this.instancesForForm.findIndex(e => e.sysId === sysId);
        if (i > -1) {
          this.instancesForForm.splice(i, 1);
        }
      }
    });
    this.instancesForForm.sort((a,b) => (a.impactLevel > b.impactLevel) ? 1 : -1);   
  }

  @Watch("modalSelectedOptions")
  public modalSelectedOptionsChange(newVal: string[]): void {
    this.isIL6Selected = newVal.indexOf(this.IL6SysId) > -1 ? "true" : "false";
  };

  public async classificationOptionsChangedInModal(): Promise<void> {
    const arr: ClassificationLevelDTO[] = [];
    this.modalSelectedOptions.forEach(item => {
      const value = this.allClassificationLevels.filter(( data )=>{
        return item == data.sys_id
      })
      arr.push(value[0])
    })
    await ClassificationRequirements.setSelectedClassificationLevels(arr);
    await this.setAvailableClassificationLevels();
    await this.buildClassificationInstances();
  }

  public async clearUnselected(): Promise<void> {
    const filteredSelectedHeaderLevelSysIds = this.selectedHeaderLevelSysIds.filter(
      sysId => this.avlClassificationLevelSysIds.includes(sysId)
    );
    this.selectedHeaderLevelSysIds = filteredSelectedHeaderLevelSysIds;

    const filteredHeaderChecked = this.headerCheckboxSelectedSysIds.filter(
      sysId => this.avlClassificationLevelSysIds.includes(sysId)
    );
    this.headerCheckboxSelectedSysIds = filteredHeaderChecked;
    const filteredInstances = this.instancesForForm.filter((instance) => {
      if (instance.sysId) {
        return this.avlClassificationLevelSysIds.includes(instance.sysId);
      }
    });
    this.instancesForForm = filteredInstances;
  }

  public get currentPackageClassificationLevels(): ClassificationLevelDTO[] {
    const arr :ClassificationLevelDTO[] = [];
    this.modalSelectedOptions.forEach(item => {
      const value = this.allClassificationLevels.filter((data) => {
        return item == data.sys_id;
      })
      arr.push(value[0]);
    })
    return arr;
  };

  private hasChangedPackageClassificationLevels(): boolean {
    const arr1 = [...this.modalSelectionsOnOpen].sort();
    const arr2 = [...this.modalSelectedOptions].sort();
    return !_.isEqual(arr1, arr2) && this.modalSelectedOptions.length !== 0;
  };

  protected async saveOnLeave(): Promise<boolean> {
    try {
      // if (this.hasChanged()) {
      // todo in 7507
      // }
    } catch (error) {
      console.log(error);
    }
    return true;
  };

  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return data.length > 1 ? buildClassificationCheckboxList(data) : [];
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
    });
    this.headerCheckboxItems 
      = this.createCheckboxItems(this.avlClassificationLevelObjects);
    
  }

  public async loadOnEnter(): Promise<void> {
    // get classification levels selected in step 4 Contract Details
    this.avlClassificationLevelObjects 
      = await ClassificationRequirements.getSelectedClassificationLevels();
    
    // TODO: if no classification levels selected in step 4, show warning alert
    // ticket AT-7502

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
    this.modalCheckboxItems = this.createCheckboxItems(this.allClassificationLevels);
    const IL6Checkbox 
      = this.modalCheckboxItems.find(e => e.label.indexOf("IL6") > -1);
    this.IL6SysId = IL6Checkbox?.value || "";

    // load existing classification instances for this service offering
    this.classificationInstances 
      = await DescriptionOfWork.getClassificationInstances();

    // if no existing classification instances saved in store, build one for each
    // classification level selected in step 4 Contract Details
    if (this.classificationInstances.length === 0) {
      await this.buildClassificationInstances();
    }

    // set up PoP periods if not for entire duration
    const periods = await Periods.loadPeriods();
    if (periods && periods.length > 0) {
      this.periods = periods
    }

    // TODO: if no PoP periods selected in step 4 Contract Details, show warning alert
    // ticket AT-7502

  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  };
};

</script>
