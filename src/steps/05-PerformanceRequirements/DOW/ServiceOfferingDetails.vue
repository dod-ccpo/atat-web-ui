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
import { Component, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import RequirementsForm from './RequirementsForm.vue'

import { Checkbox, DOWClassificationInstance } from "../../../../types/Global";
import ClassificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";
import { buildClassificationCheckboxList, buildClassificationLabel } from "@/helpers";

import DescriptionOfWork from "@/store/descriptionOfWork";
import _ from "lodash";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATExpandableLink,
    RequirementsForm,
  }
})

export default class ServiceOfferingDetails extends Vue {
  private classificationLevelCheckboxItems: Checkbox[] = []

  public categoryName = "";

  public buildClassificationInstances(): void {
    debugger;
    this.classificationLevelOptions.forEach((obj) => {
      const longLabel = buildClassificationLabel(obj, "long");
      const shortLabel = buildClassificationLabel(obj, "short");
      const instance: DOWClassificationInstance = {
        sysId: obj.sys_id,
        classificationLevels: { 
          longLabel, 
          shortLabel,
          classification: obj.classification,
          impactLevel: obj.impact_level,
        },
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
  public selectedClassificationLevels = [];

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
    // this.instancesForForm.sort((a,b) => (a.classificationLevels?.impactLevel > b.impactLevel) ? 1 : -1);
  }

  // used for checkboxes at top of form if multiple 
  public classificationLevelOptions: ClassificationLevelDTO[] = [];
  public avlInstancesLength = 0;
  // get periods from data when implemented
  public periods = [{}];

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

    this.classificationInstances 
      = await DescriptionOfWork.getClassificationInstances();
    debugger;

    if (this.classificationInstances.length === 0) {
      this.buildClassificationInstances();
    }
  }

  public async mounted(): Promise<void> {
    // get this from store data when implemented 
    await this.loadOnEnter();
    
    this.categoryName = "Data Management"; // EJY get from data
  }

  public openModal(): void {
    // open modal functionality in task 7411
  }

}

</script>
