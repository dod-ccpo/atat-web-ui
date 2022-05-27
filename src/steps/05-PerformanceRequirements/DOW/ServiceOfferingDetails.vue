<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Next, we’ll gather your requirements for {{ categoryName }}
          </h1>
          <div class="copy-max-width">

            <div
              v-if="selectedClassificationLevelsOnLoad.length === 1"
              id="SingleClassificationIntro"
            >
              <p id="SingleClassificationIntro">
                In the previous section, you specified
                <strong>{{ selectedClassificationLevelsOnLoad[0].name }}</strong> for the
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
                title="
                What classification level(s) are required for your cloud resources and/or services?"
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
                        must
                        complete a <strong>DD Form 254, DoD Contract Security Classification
                        Specification.</strong> We will walk you through uploading this form next.
                      </p>
                    </template>
                  </ATATAlert>
                </template>
              </ATATDialog>
            </div>

            <div v-else id="ClassificationCheckboxes">
              <!-- classification checkboxes placeholder -->
            </div>

            <div id="OfferingDetailsForms">
              <!-- form component placeholder -->
              <RequirementsForm
              :data="instances"
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
import { Component, Watch } from "vue-property-decorator";
import { buildClassificationCheckboxList, hasChanges } from "@/helpers";

import RequirementsForm from './RequirementsForm.vue'
import { getIdText } from "@/helpers";
import ATATDialog from "@/components/ATATDialog.vue";
import { Checkbox } from "../../../../types/Global";



import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";

import DescriptionOfWork from "@/store/descriptionOfWork";
import classificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";
import Periods from "@/store/periods";


@Component({
  components: {
    ATATDialog,
    ATATCheckboxGroup,
    ATATAlert,
    RequirementsForm
  }
})


export default class ServiceOfferingDetails extends Vue {
  private showDialog = false
  public selectedOptions: string[] = [];
  private checkboxItems: Checkbox[] = []
  public savedData: ClassificationLevelDTO[] = []
  public isIL6Selected = ''
  private classifications: ClassificationLevelDTO[] = []
  public categoryName = "";

  // generate from data from backend when implemented
  public instances = [
    {
      classification: {
        name: "Unclassified / Impact Level 2 (IL2)",
        value: "IL2",
      },
      description: "",
      neededForEntireDuration: null,
      periods: []
    },

  ]

  private createInstanceObjects(data: ClassificationLevelDTO[]) {
    const arr: any = []
    data.forEach((val)=>{
      let instance = {
        classification:{
          name:'',
          value:'',
        },
        description:'',
        neededForEntireDuration: null,
        periods: []
      }
      switch (val.impact_level) {
      case 'IL4':
        instance.classification.value = val.impact_level;
        instance.classification.name = 'Unclassified / Impact Level 4 (IL4)'
        break;
      case 'IL2':
        instance.classification.value = val.impact_level;
        instance.classification.name = 'Unclassified / Impact Level 2 (IL2)'
        break;
      case 'IL5':
        instance.classification.value = val.impact_level;
        instance.classification.name = 'Unclassified / Impact Level 5 (IL5)'
        break;
      case 'IL6':
        instance.classification.value= val.impact_level;
        instance.classification.name = 'Secret / Impact Level 6 (IL6)'
        break;
      default:
        return
      }
      arr.push(instance)
    })
    return arr
  }

  // create classification level type when get data from backend implemented
  public selectedClassificationLevelsOnLoad = [{}];
  public selectedClassificationLevels = [{}];
  public classificationLevels:ClassificationLevelDTO[] = [];

  // get periods from data when implemented
  public periods = [{}];

  private getIdText(string: string) {
    return getIdText(string);
  }

  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    this.isIL6Selected
      = newVal.indexOf('405b52af87970590ec3b777acebb3556') > -1 ?
        "true" : "false";
  }

  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return data.length > 1 ? buildClassificationCheckboxList(data) : [];
  }
  private saveSelected() {
    const arr :ClassificationLevelDTO[] = [];
    this.selectedOptions.forEach(item => {
      const value = this.classificationLevels.filter(( data )=>{
        return item == data.sys_id
      })
      arr.push(value[0])
    })
    return arr
  }

  public get currentData(): ClassificationLevelDTO[] {
    return this.saveSelected()
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        classificationRequirements.setSelectedClassificationLevels(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  public async loadOnEnter(): Promise<void> {
    this.classificationLevels
      = await DescriptionOfWork.getClassificationLevels();
    this.checkboxItems = this.createCheckboxItems(this.classificationLevels)
    const storeData = await classificationRequirements.getClassificationLevels()
    if(storeData) {
      this.savedData = storeData
      storeData.forEach((val) => {
        this.selectedOptions.push(val.sys_id || '')
      })
    }
    this.classifications = await classificationRequirements.getClassificationLevels()
    if(this.classifications){
      this.instances = this.createInstanceObjects(this.classifications)
    }
    const periods = await Periods.loadPeriods();
    if (periods && periods.length > 0) {
      this.periods = periods
    }
  }
  public mounted(): void {
    // get this from store data when implemented
    this.categoryName = "Data Management";

    // get this from store data when implemented
    this.selectedClassificationLevels = [
      {
        name: "Unclassified / Impact Level 2 (IL2)",
        value: "IL2",
      },
    ];

    // get this from store data when implemented

    this.selectedClassificationLevelsOnLoad = this.selectedClassificationLevels;


    this.loadOnEnter()
  }
}

</script>
