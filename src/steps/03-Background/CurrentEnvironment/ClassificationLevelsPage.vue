<template>
  <div>
    <v-container class="container-max-width" fluid>
      <v-row v-if="environment.toLowerCase() === 'cloud computing environment'">
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
            <p id="DeployedP" class="mb-2 font-weight-500">
              What classification levels are your instances currently deployed in?
            </p>
            <p id="SelectMessage" class="mb-4">
              Select all that apply to your current environment.
            </p>
            <ATATCheckboxGroup
              id="ClassificationTypesCheckboxes"
              :card="false"
              :hasOtherValue="true"
              :items="classificationsTier"
              :rules="[
              $validators.required('Please select at least one classification level.')
            ]"
              :value.sync="selectedClassifications"
              class="copy-max-width mb-10"
              name="checkboxes"
            />
            <div v-if="checkboxItems.length > 1">
              <p id="DeployedP" class="mb-3 font-weight-500">
                For your Unclassified instance(s), what impact levels are you currently deployed in?
              </p>
              <p id="SelectMessage" class="mb-4">
                Select all that apply to your current environment.
              </p>
              <ATATCheckboxGroup
                id="ClassificationLevelCheckboxes"
                :card="false"
                :hasOtherValue="true"
                :items="checkboxItems"
                :rules="[
                    $validators.required('Please select at least one impact level.')
                ]"
                :value.sync="selectedImpactLevels"
                class="copy-max-width mb-10"
                name="checkboxes"
              />
            </div>
            <div v-if="IL2Selected">
              <p id="DeployedP" class="mb-4 font-weight-500">
                For your IL2 instance(s), what type of cloud are currently deployed in?
              </p>
              <ATATCheckboxGroup
                id="ImpactLevelCheckboxes"
                :card="false"
                :hasOtherValue="true"
                :items="cloudDeployment"
                :rules="[
                    $validators.required('Please select at least one cloud.')
                ]"
                :value.sync="selectedCloudTypes"
                class="copy-max-width"
                name="checkboxes"
              />
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="environment.toLowerCase() === 'hybrid cloud environment'">
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Future Hybrid Page
          </h1>
          <p>shown for testing purposes</p>
        </v-col>
      </v-row>
      <v-row v-if="environment.toLowerCase() === 'on-premises'">
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Future on-Prem Page
          </h1>
          <p>shown for testing purposes</p>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>
<script lang="ts">

import { Component, Mixins, Watch } from "vue-property-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { Checkbox } from "../../../../types/Global";
import { ClassificationLevelDTO } from "@/api/models";
import classificationRequirements from "@/store/classificationRequirements";
import { buildClassificationCheckboxList, hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";


@Component({
  components: {
    ATATCheckboxGroup,
  }
})
export default class ClassificationLevelsPage extends Mixins(SaveOnLeave) {
  private checkboxItems: Checkbox[] = [];
  private environment = "";
  public selectedImpactLevels: string[] = [];
  public selectedClassifications: string[] = [];
  public selectedCloudTypes: string[] = [];
  public classifications: ClassificationLevelDTO[] = []
  public savedData: ClassificationLevelDTO[] = [];
  public IL2Selected = false;
  private classificationsTier: Checkbox[] = [
    {
      id: "Unclassified",
      label: "Unclassified",
      value: "U",
    },
    {
      id: "Secret",
      label: "Secret",
      value: "S",
    },
    {
      id: "TopSecret",
      label: "Top Secret",
      value: "TS",
    },
  ]
  private cloudDeployment: Checkbox[] = [
    {
      id: "CommercialCloud",
      label: "Commercial cloud",
      value: "commercialCloud",
    },
    {
      id: "GovernmentCloud",
      label: "Federal community cloud (government cloud)",
      value: "GovernmentCloud",
    },

  ]
  @Watch("selectedClassifications")
  public selectedTypeChange(newVal: string[]): void {
    let filteredList :ClassificationLevelDTO[] = []
    if(newVal.includes("U")) {
      let filtered = this.classifications
        .filter(classification => classification.classification === "U" )
      filteredList.push(...filtered)
    }
    this.selectedImpactLevels = []
    this.checkboxItems =this.createCheckboxItems(filteredList)
  }

  @Watch("selectedImpactLevels")
  public selectedOptionChange(newVal: string[]): void {
    let filtered = this.classifications
      .filter(classification => classification.impact_level === "IL2")
    if(filtered[0].sys_id){
      this.IL2Selected = newVal.includes(filtered[0].sys_id);
    }
    if(!this.IL2Selected){
      this.selectedCloudTypes = [];
    }

  }



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
    await classificationRequirements.loadEnvironmentInstances()
    const storeData = await classificationRequirements.getCurrentENVClassificationLevels()
    if(storeData) {
      this.savedData = storeData
      storeData.forEach((val) => {
        if (val.sys_id) {
          this.selectedImpactLevels.push(val.sys_id)
        }
      })
    }
    this.environment = AcquisitionPackage.currentEnvironment?.additional_information || ""
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>

