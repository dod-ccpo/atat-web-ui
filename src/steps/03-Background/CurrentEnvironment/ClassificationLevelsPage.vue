<template>
  <div>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            What classification level(s) are your instances deployed in?
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-10">
              If you have instances within two or more classification levels, we will gather details
              about each instance later.
            </p>
            <p id="SelectMessage" class="mb-4">
              Select all that apply to your current environment.
            </p>
          </div>
          <ATATCheckboxGroup
            id="ClassificationLevelCheckboxes"
            :card="false"
            :hasOtherValue="true"
            :items="checkboxItems"
            :rules="[
              $validators.required('Please select at least one classification level.')
            ]"
            :value.sync="selectedOptions"
            class="copy-max-width"
            name="checkboxes"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">

import { Component, Mixins } from "vue-property-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { Checkbox } from "../../../../types/Global";
import { ClassificationLevelDTO, EnvironmentInstanceDTO } from "@/api/models";
import classificationRequirements from "@/store/classificationRequirements";
import { buildClassificationCheckboxList, hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";


@Component({
  components: {
    ATATCheckboxGroup,
  }
})
export default class ClassificationLevelsPage extends Mixins(SaveOnLeave) {
  private checkboxItems: Checkbox[] = []
  public selectedOptions: string[] = [];
  public classifications: ClassificationLevelDTO[] = []
  public savedData: ClassificationLevelDTO[] = []

  private saveSelected() {
    const arr :ClassificationLevelDTO[] = [];
    this.selectedOptions.forEach(item => {
      const value = this.classifications.filter(( data )=>{
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
        classificationRequirements.saveSelectedClassificationInstances(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return buildClassificationCheckboxList(data, "", true, true);
  }

  public async loadOnEnter(): Promise<void> {
    this.classifications = await classificationRequirements.getAllClassificationLevels();
    this.checkboxItems =this.createCheckboxItems(this.classifications)
    await classificationRequirements.loadEnvironmentInstances()
    const storeData = await classificationRequirements.getCurrentENVClassificationLevels()
    if(storeData) {
      this.savedData = storeData
      storeData.forEach((val) => {
        if (val.sys_id) {
          this.selectedOptions.push(val.sys_id)
        }
      })
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>

