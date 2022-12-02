<template>
  <v-form ref="form" lazy-validation>
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
              :selectedClassifications.sync="envClassificationsCloud"
            />
            <hr v-if="isHybrid" />
            <ClassificationLevelForm
              v-if="isOnPrem || isHybrid"
              hybridText="2. Your on-premise instances"
              :isHybrid="isHybrid"
              :isOnPrem="isOnPrem"
              :selectedClassifications.sync="envClassificationsOnPrem"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">

import { Component, Mixins } from "vue-property-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ClassificationLevelForm
  from "@/steps/03-Background/CurrentEnvironment/ClassificationLevelForm.vue";
import CurrentEnvironment, 
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";


@Component({
  components: {
    ClassificationLevelForm,
    ATATCheckboxGroup,
  }
})
export default class ClassificationLevelsPage extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;
  public envLocation = "";
  private isHybrid = false;
  private isCloud = false;
  private isOnPrem = false;
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

  public async loadOnEnter(): Promise<void> {
    const storeData = await CurrentEnvironment.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = storeData;
      this.envLocation = storeData.env_location;
      this.isHybrid = this.envLocation === "HYBRID";
      this.isOnPrem = this.envLocation === "ON_PREM" || this.isHybrid;
      this.isCloud = this.envLocation === "CLOUD" || this.isHybrid;
      this.envClassificationsCloud = storeData.env_classifications_cloud;
      this.envClassificationsOnPrem = storeData.env_classifications_onprem;
      this.savedData = {
        envClassificationsCloud: this.envClassificationsCloud,
        envClassificationsOnPrem: this.envClassificationsOnPrem,
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {

    await AcquisitionPackage.setValidateNow(true);

    try {
      if (this.hasChanged()) {
        /* eslint-disable camelcase */
        this.currEnvDTO.env_classifications_cloud = this.envClassificationsCloud;
        this.currEnvDTO.env_classifications_onprem = this.envClassificationsOnPrem;
        /* eslint-enable camelcase */
        await CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }  
}
</script>
