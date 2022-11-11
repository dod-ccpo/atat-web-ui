<template>
  <div class="foobar">
    <v-container class="container-max-width" fluid>
      <v-row v-if="envLocation !=='HYBRID'">
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
            <p id="ClassificationLevelP" class="mb-2 font-weight-500">
              What classification levels are your instances currently deployed in?
            </p>
            <p id="SelectMessage" class="mb-4">
              Select all that apply to your current environment.
            </p>
            <ATATCheckboxGroup
              id="ClassificationTypesCheckboxes"
              :card="false"
              :hasOtherValue="true"
              :items="topLevelClassifications"
              :rules="[
              $validators.required('Please select at least one classification level.')
            ]"
              :value.sync="selectedClassifications"
              class="copy-max-width mb-10"
              name="classificationTypesCheckboxes"
            />
            <div v-if="envLocation === 'CLOUD'">
              <div v-if="impactLevels.length > 1">
                <p id="DeployedP" class="mb-3 font-weight-500">
                  For your Unclassified instance(s), what impact levels are you currently deployed
                  in?
                </p>
              <p id="SelectMessage2" class="mb-4">
                  Select all that apply to your current environment.
                </p>
                <ATATCheckboxGroup
                id="ImpactLevelCheckboxes"
                  :card="false"
                  :hasOtherValue="true"
                  :items="impactLevels"
                  :rules="[$validators.required('Please select at least one impact level.')]"
                  :value.sync="selectedImpactLevels"
                  class="copy-max-width mb-10"
                  name="impactLevelCheckboxes"
                />
              </div>
            </div>

            <div v-if="envLocation === 'ON_PREM'">
              <div v-if="unclassifiedSelected">
                <p id="HostingP" class="mb-3 font-weight-500">
                  For your Unclassified instances, what type of information are you hosting?
                </p>
                <p id="SelectMessage" class="mb-4">
                  Select all that apply to your current environment.
                </p>
                <ATATCheckboxGroup
                  id="InstanceCheckbox"
                  :card="false"
                  :hasOtherValue="true"
                  :items="instanceClass"
                  :rules="[
                    $validators.
                    required('Please select at least one type of information that you are hosting.')
                ]"
                  :value.sync="selectedInstances"
                  class="copy-max-width mb-10"
                  name="instanceCheckbox"
                />
              </div>
            </div>

            <!-- START -- PRESERVE CODE FOR POST-MVP -->
            <!-- <div v-if="IL2Selected">
              <p id="CloudTypeP" class="mb-4 font-weight-500">
                  For your IL2 instance(s), what type of cloud are currently deployed in?
                </p>
                <ATATCheckboxGroup
                id="CloudTypeCheckboxes"
                  :card="false"
                  :hasOtherValue="true"
                :items="cloudTypes"
                  :rules="[
                    $validators.required('Please select at least one type of cloud.')
                ]"
                :value.sync="selectedCloudTypes"
                class="copy-max-width"
                name="cloudTypeCheckboxes"
              />
            </div> -->
            <!-- END -- PRESERVE CODE FOR POST-MVP -->
              
          </div>
        </v-col>
      </v-row>
      <v-row v-if="envLocation ==='HYBRID'">
        <v-col>
          Future hybrid classification
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
import CurrentEnvironment,
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";

@Component({
  components: {
    ATATCheckboxGroup,
  }
})
export default class ClassificationLevelsPage extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;
  public envLocation = "";
  public envClassificationsCloud: string[] = []
  public envClassificationsOnPrem: string[] = []

  private impactLevels: Checkbox[] = [];
  public selectedImpactLevels: string[] = [];
  public selectedClassifications: string[] = [];

  public allClassificationLevels: ClassificationLevelDTO[] = []

  public selectedCloudTypes: string[] = [];
  public selectedInstances: string[] = [];
  public classifications: ClassificationLevelDTO[] = []
  public unclassifiedSelected = false;

  private topLevelClassifications: Checkbox[] = [
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
  ];

  private instanceClass: Checkbox[] = [
    {
      id: "PublicRelease",
      label: "Information approved for public release (Low Confidentiality and Moderate Integrity)",
      value: "IL2",
      description: "Equivalent to a Impact Level 2 (IL2) deployment"
    },
    {
      id: "CUI",
      label: "Controlled Unclassified Information (CUI)",
      value: "IL4",
      description: "Equivalent to a Impact Level 4 (IL4) deployment"
    },
    {
      id: "NationalSecuritySystems",
      label: "CUI and National Security Systems",
      value: "IL5",
      description: "Equivalent to a Impact Level 5 (IL5) deploytment"
    },
  ];

  private cloudTypes: Checkbox[] = [
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
  ];
  
  @Watch("selectedClassifications")
  public selectedTypeChange(newVal: string[]): void {
    let filteredList :ClassificationLevelDTO[] = []
    if(newVal.includes("U")) {
      let filtered = this.allClassificationLevels
        .filter(classification => classification.classification === "U" )
      this.unclassifiedSelected = true
      filteredList.push(...filtered)
      if (this.impactLevels.length === 0) {
        this.impactLevels = this.createCheckboxItems(filteredList)
      }
    }
    if (!newVal.includes("U")) {
      this.unclassifiedSelected = false
      this.impactLevels = [];
      this.selectedInstances = []
      this.selectedImpactLevels = []
    }
  }

  // private getSelectedClassificationLevels() {
  //   const arr :ClassificationLevelDTO[] = [];
  //   this.selectedImpactLevels.forEach(item => {
  //     const value = this.allClassificationLevels.filter(( data )=>{
  //       return item == data.sys_id
  //     })
  //     arr.push(value[0])
  //   })
  //   return arr
  // }

  // public get selectedClassificationSysIds(): string[] {
  // EJY FINISH AFTER DEVONTE HAS REFACTORED FOR HYBRID
  // }

  public get currentData(): Record<string, string[]> {
    return {
      envClassificationsCloud: [],
      envClassificationsOnPrem: [],
    }
  }

  public savedData: Record<string, string[]> = {
    envClassificationsCloud: [],
    envClassificationsOnPrem: [],
  };


  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return buildClassificationCheckboxList(data, "", true, true);
  }

  public async loadOnEnter(): Promise<void> {
    this.allClassificationLevels = await classificationRequirements.getAllClassificationLevels();

    const secret = this.allClassificationLevels.find(obj => obj.classification === "S");
    const secretIndex = this.topLevelClassifications.findIndex(obj => obj.value === "S");
    this.topLevelClassifications[secretIndex].value = secret?.sys_id || "S";
    const topSecret = this.allClassificationLevels.find(obj => obj.classification === "TS");
    const topSecretIndex = this.topLevelClassifications.findIndex(obj => obj.value === "TS");
    this.topLevelClassifications[topSecretIndex].value = topSecret?.sys_id || "TS";

    // TODO - get from ACQPKG store or CURRENV store??
    const storeData = await AcquisitionPackage.getCurrentEnvironment();

    if (storeData) {
      this.currEnvDTO = storeData;
      this.envLocation = storeData.env_location;
      this.envClassificationsCloud = storeData.env_classifications_cloud;
      this.envClassificationsOnPrem = storeData.env_classifications_on_prem;
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
    try {
      if (this.hasChanged()) {
        // TODO - this needs to save to CurrentEnvironment, not classificationRequirements
        // classificationRequirements.saveSelectedClassificationInstances(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }


  // START -- PRESERVE CODE FOR POST-MVP
  // CLOUD TYPES WILL BE POST MVP - it was a late addition
  // public IL2Selected = false;
  // public selectedCloudTypes: string[] = [];
  // private cloudTypes: Checkbox[] = [
  //   {
  //     id: "CommercialCloud",
  //     label: "Commercial cloud",
  //     value: "commercialCloud",
  //   },
  //   {
  //     id: "GovernmentCloud",
  //     label: "Federal community cloud (government cloud)",
  //     value: "GovernmentCloud",
  //   },
  // ]
  // @Watch("selectedImpactLevels")
  // public selectedOptionChange(newVal: string[]): void {
  //   let filtered = this.allClassificationLevels
  //     .filter(classification => classification.impact_level === "IL2")
  //   if(filtered[0].sys_id){
  //     this.IL2Selected = newVal.includes(filtered[0].sys_id);
  //   }
  //   if(!this.IL2Selected){
  //     this.selectedCloudTypes = [];
  //   }
  // }
  // END -- PRESERVE CODE FOR POST-MVP


}
</script>

