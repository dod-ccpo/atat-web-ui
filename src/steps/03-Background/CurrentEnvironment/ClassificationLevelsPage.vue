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
              v-if="isCloud || isHybrid"
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
              v-if="isOnPrem || isHybrid"
              hybridText="2. Your on-premise instances"
              :isHybrid="isHybrid"
              :isOnPrem="isOnPrem"
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
  private isOnPrem = false;

  public selectedImpactLevels: string[] = [];
  public selectedClassifications: string[] = [];
  public selectedOnPremClassifications: string[] = [];
  public selectedCloudTypes: string[] = [];
  public selectedInstances: string[] = [];
  public classifications: ClassificationLevelDTO[] = []



  public allClassificationLevels: ClassificationLevelDTO[] = []

  public envClassificationsCloud: string[] = []
  public envClassificationsOnPrem: string[] = []


  public savedData: Record<string, string[]> = {
    envClassificationsCloud: [],
    envClassificationsOnPrem: [],
  };

  public get currentData(): Record<string, string[]> {
    return {
      envClassificationsCloud: this.envClassificationsCloud,
      envClassificationsOnPrem: this.envClassificationsOnPrem,
    }
  };



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
    if (storeData) {
      this.currEnvDTO = storeData;
      this.envLocation = storeData.env_location;
      this.isHybrid = this.envLocation === "HYBRID";
      this.isOnPrem = this.envLocation === "ON_PREM" || this.isHybrid;
      this.isCloud = this.envLocation === "CLOUD" || this.isHybrid;
      this.envClassificationsCloud = storeData.env_classifications_cloud;
      this.envClassificationsOnPrem = storeData.env_classifications_on_prem;
    }

    this.allClassificationLevels = await classificationRequirements.getAllClassificationLevels();


  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
