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

import ATATAlert from "@/components/ATATAlert.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import { Checkbox } from "../../../types/Global";
import { ClassificationLevelDTO } from "@/api/models";
import DescriptionOfWork from "@/store/descriptionOfWork";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { hasChanges, buildClassificationCheckboxList} from "@/helpers";
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
  public isIL6Selected = ""
  public IL6SysId = ""
  private checkboxItems: Checkbox[] = []

  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return buildClassificationCheckboxList(data);
  }

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

  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    this.isIL6Selected = newVal.indexOf(this.IL6SysId) > -1 ? "true" : "false"
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
    this.classifications = await classificationRequirements.getAllClassificationLevels();
    this.checkboxItems =this.createCheckboxItems(this.classifications)

    const IL6Checkbox = this.checkboxItems.find(e => e.label.indexOf("IL6") > -1);
    this.IL6SysId = IL6Checkbox?.value || "false";

    const storeData = await classificationRequirements.getSelectedClassificationLevels()
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

