<template>
  <div>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Tell us about your current data classification and impact levels
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-10">
              If you only have data within a single level, then we will apply your selection below
              to every instance within your current environment. If you have data within two or more
              levels, we will gather details about each instance next.
            </p>
            <ClassificationLevelForm
              v-if="isCloud|| isHybrid"
              hybridText="1. Your cloud instances"
              :isHybrid="isHybrid"
              :isCloud="isCloud"
              :selectedImpactLevels.sync="selectedImpactLevels"
              :selectedClassifications.sync="selectedClassifications"
              :selectedCloudTypes.sync="selectedCloudTypes"
              :selectedInstances.sync="selectedInstances"
            />
            <hr v-if="isHybrid" />
            <ClassificationLevelForm
              v-if="onPrem|| isHybrid"
              hybridText="2. Your on-premise instances"
              :isHybrid="isHybrid"
              :onPrem="onPrem"
              :selectedImpactLevels.sync="selectedImpactLevels"
              :selectedClassifications.sync="selectedOnPremClassifications"
              :selectedCloudTypes.sync="selectedCloudTypes"
              :selectedInstances.sync="selectedInstances"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">

import { Component, Mixins, Watch } from "vue-property-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { ClassificationLevelDTO } from "@/api/models";
import classificationRequirements from "@/store/classificationRequirements";
import { buildClassificationCheckboxList, hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ClassificationLevelForm
  from "@/steps/03-Background/CurrentEnvironment/ClassificationLevelForm.vue";


@Component({
  components: {
    ClassificationLevelForm,
    ATATCheckboxGroup,
  }
})
export default class ClassificationLevelsPage extends Mixins(SaveOnLeave) {
  public envLocation = "";
  private isHybrid = false;
  private isCloud = false;
  private onPrem = false;
  public selectedImpactLevels: string[] = [];
  public selectedClassifications: string[] = [];
  public selectedOnPremClassifications: string[] = [];
  public selectedCloudTypes: string[] = [];
  public selectedInstances: string[] = [];
  public classifications: ClassificationLevelDTO[] = []
  public savedData: ClassificationLevelDTO[] = [];




  private saveSelected() {
    const arr :ClassificationLevelDTO[] = [];
    this.selectedImpactLevels.forEach(item => {
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
        // await classificationRequirements.saveSelectedClassificationInstances(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }



  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.getCurrentEnvironment();
    if(storeData){
      this.envLocation = storeData.env_location;
      this.onPrem = this.envLocation === 'ON_PREM'
      this.isCloud = this.envLocation === 'CLOUD'
      this.isHybrid = this.envLocation === 'HYBRID'
      if(this.isHybrid) {
        this.isCloud = true;
        this.onPrem = true
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>