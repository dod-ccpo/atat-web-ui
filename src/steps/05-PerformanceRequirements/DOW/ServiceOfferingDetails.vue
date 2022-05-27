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
              v-if="classificationLevelOptions.length === 1"
              id="SingleClassificationIntro"  
            >
              <p id="SingleClassificationIntro">
                In the previous section, you specified 
                <strong>{{ classificationLevelOptions[0].name }}</strong> for the 
                classification level of all cloud resources and services. If you 
                need this within a different level, 
                <a 
                  role="button" 
                  id="UpdateClassification"
                  tabindex="0"
                  @click="showDialog = true"
                  @keydown.enter="showDialog = true"
                  @keydown.space="showDialog = true"
                >update your Classification Requirements</a>.
              </p>
              <ATATDialog
                :showDialog.sync="showDialog"
                title="What classification level(s)are required for your
                  cloud resources and/or services?"
                no-click-animation
                okText="Change Levels"
                width="670"
                :disabled="!hasChanged()"
                @ok="saveOnLeave"

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
                    :value.sync="selectedOptions"
                    :hasOtherValue="true"
                    :items="checkboxItems"
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

            <div v-else id="ClassificationCheckboxWrapper">
              <ATATCheckboxGroup
                id="ClassificationCheckboxes"
                aria-describedby="ClassificationGroupLabel"
                :value.sync="selectedClassificationLevels"
                :items="classificationLevelCheckboxItems"
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
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
  getIdText,
  hasChanges,
} from "@/helpers";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Periods from "@/store/periods";

import _ from "lodash";

@Component({
  components: {

    ATATCheckboxGroup,
    ATATDialog,
    ATATExpandableLink,
    RequirementsForm,
  }
})

export default class ServiceOfferingDetails extends Mixins(SaveOnLeave) {
  private classificationLevelCheckboxItems: Checkbox[] = [];
  private showDialog = false;
  public selectedOptions: string[] = [];
  private checkboxItems: Checkbox[] = [];
  public savedData: ClassificationLevelDTO[] = [];
  public isIL6Selected = "";
  public IL6SysId = "";
  private classifications: ClassificationLevelDTO[] = [];
  // public selectedClassificationLevels = [];
  public classificationLevels:ClassificationLevelDTO[] = [];

  public serviceOfferingName = DescriptionOfWork.currentOfferingName;

  public buildClassificationInstances(): void {
    this.classificationLevelOptions.forEach((obj) => {
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
    });
  }

  public classificationInstancesToShow: string[] = [];
  public instancesForForm: DOWClassificationInstance[] = [];
  public selectedClassificationLevels: string[] = [];

  @Watch("selectedClassificationLevels")
  public classificationLevelSelectionChange(newSelectedOptions: string[]): void {
    debugger;
    // add to array of forms to show if selectedOption not in the list

    newSelectedOptions.forEach((selectedOption: string) => {
      if (this.classificationInstancesToShow.indexOf(selectedOption) === -1) {
        this.classificationInstancesToShow.push(selectedOption);
        const instance = this.classificationInstances.find(e => e.sysId === selectedOption);
        if (instance) {
          this.instancesForForm.push(instance);
        }
      }
    });
    // remove options not in new selected options array
    const instancesToShowClone = this.classificationInstancesToShow;
    instancesToShowClone.forEach((sysId) => {
      if (!newSelectedOptions.includes(sysId)) {
        const i = this.classificationInstancesToShow.findIndex(e => e === sysId);
        if (i > -1) {
          this.classificationInstancesToShow.splice(i, 1);
        }
      }
    });

    const instancesForFormClone = _.cloneDeep(this.instancesForForm);
    instancesForFormClone.forEach((instance) => {
      const sysId = instance.sysId || "";
      if (!newSelectedOptions.includes(sysId)) {
        const i = this.instancesForForm.findIndex(e => e.sysId === sysId);
        if (i > -1) {
          this.instancesForForm.splice(i, 1);
        }
      }
    });
    this.instancesForForm.sort((a,b) => (a.impactLevel > b.impactLevel) ? 1 : -1);
  }

  // used for checkboxes at top of form if multiple 
  public classificationLevelOptions: ClassificationLevelDTO[] = [];
  public avlInstancesLength = 0;
  public periods = [{}];


  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    this.isIL6Selected = newVal.indexOf(this.IL6SysId) > -1 ? "true" : "false"
  };

  private saveSelected() {
    const arr :ClassificationLevelDTO[] = [];
    this.selectedOptions.forEach(item => {
      const value = this.classificationLevels.filter(( data )=>{
        return item == data.sys_id
      })
      arr.push(value[0])
    })
    return arr
  };

  public get currentData(): ClassificationLevelDTO[] {
    return this.saveSelected()
  };

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  };

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        ClassificationRequirements.setSelectedClassificationLevels(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  };

  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return data.length > 1 ? buildClassificationCheckboxList(data) : [];
  }

  public classificationInstances: DOWClassificationInstance[] = [];

  public async loadOnEnter(): Promise<void> {
    this.classificationLevelOptions 
      = await ClassificationRequirements.getSelectedClassificationLevels();
    this.avlInstancesLength = this.classificationLevelOptions.length;

    this.classificationLevelCheckboxItems 
      = this.createCheckboxItems(this.classificationLevelOptions);

    const IL6Checkbox 
      = this.classificationLevelCheckboxItems.find(e => e.label.indexOf("IL6") > -1);
    this.IL6SysId = IL6Checkbox?.value || "false";

    this.classificationInstances 
      = await DescriptionOfWork.getClassificationInstances();

    if (this.classificationInstances.length === 0) {
      this.buildClassificationInstances();
    }
    const periods = await Periods.loadPeriods();
    if (periods && periods.length > 0) {
      this.periods = periods
    }

    const storeData = await ClassificationRequirements.getSelectedClassificationLevels()
    if(storeData) {
      this.savedData = storeData
      storeData.forEach((val) => {
        this.selectedOptions.push(val.sys_id || "")
      })
    }

  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  };
};

</script>
