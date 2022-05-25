<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            What classification level(s) will be required for your cloud resources and/or services?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10" id="IntroP">
              In the next section, we will dive into the types of resources, tools, and services
              that you need for this acquisition. The classification level(s) that you select below
              will be applied to any performance requirements that you specify. If you need more
              than one level, we will walk you through what is required within each level later.
            </p>
            <p id="SelectMessage">
              Select all that apply to your contracting effort.
            </p>
          </div>
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
            type="info"
            class="copy-max-width my-10"
          >
            <template v-slot:content>
              <p class="mb-0">
                Contracts requiring access to classified information (IL6 level and above) must
                complete a <strong>DD Form 254, DoD Contract Security Classification
                Specification.</strong> We will walk you through uploading this form next.
              </p>
            </template>
          </ATATAlert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import vue from 'vue'
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { Checkbox, stringObj } from "../../../types/Global";
import ATATAlert from "@/components/ATATAlert.vue";
import { ClassificationLevelDTO, ContactDTO } from "@/api/models";
import DescriptionOfWork from "@/store/descriptionOfWork";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { hasChanges } from "@/helpers";
import classificationRequirements from "@/store/classificationRequirements";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATAlert
  }
})

export default class ClassificationRequirements extends Mixins(SaveOnLeave) {
  public selectedOptions: string[] = [];
  public classifications: ClassificationLevelDTO[] = []
  public isIL6Selected = ''
  private checkboxItems: Checkbox[] = []


  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    const arr :Checkbox[] = [];
    data.forEach((val)=>{
      let classification: Checkbox = {
        id:'',
        value: '',
        label: '',
      }
      classification.id = val.sys_id || '';
      switch (val.impact_level) {
      case 'IL4':
        classification.value = val.impact_level;
        classification.label = 'Unclassified / Impact Level 4 (IL4)'
        break;
      case 'IL2':
        classification.value = val.impact_level;
        classification.label = 'Unclassified / Impact Level 2 (IL2)'
        break;
      case 'IL5':
        classification.value = val.impact_level;
        classification.label = 'Unclassified / Impact Level 5 (IL5)'
        break;
      case 'IL6':
        classification.value = val.impact_level;
        classification.label = 'Secret / Impact Level 6 (IL6)'
        break;
      default:
        return
      }
      arr.push(classification)
    })
    return arr.sort((a, b) => (a.value > b.value) ? 1 : -1)
  }

  private saveSelected() {
    const arr :ClassificationLevelDTO[] = [];
    this.selectedOptions.forEach(item => {
      const value = this.classifications.filter(( data )=>{
        return item == data.impact_level
      })
      arr.push(value[0])
    })
    return arr
  }


  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    this.isIL6Selected
      = newVal.indexOf('IL6') > -1 ? "true" : "false";
  }
  public savedData: ClassificationLevelDTO[] = []

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
    this.classifications = await DescriptionOfWork.getClassificationLevels();
    this.checkboxItems =this.createCheckboxItems(this.classifications)
    const storeData = await classificationRequirements.getClassificationLevels()
    if(storeData) {
      this.savedData = storeData
      storeData.forEach((val) => {
        this.selectedOptions.push(val.impact_level)
      })
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>

