<template>
  <v-container fluid class="container-max-width _anticipated-users-accordion">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          First, tell us about your anticipated users and data needs
        </h1>
        <p class="page-intro">
          Before we walk through each of your selected XaaS categories, we need
          to know some basic information about your users and data within each
          classification level.
        </p>
        <v-expansion-panels
          v-model="accordionClosed"
          v-for="(classification, index) in selectedClassifications"
          :id="'AnticipatedUserAndDataNeedsAccordion' + index"
          :key="index"
          class="mb-4"
          flat
        >
          <v-expansion-panel expand>
            <v-expansion-panel-header>
              <div class="d-flex justify-space-between">
                <div class="h4 _expansion-panel-header">
                  {{buildClassificationLabel(classification,'short',true)}}
                </div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <span class="font-weight-500 font-size-20">1. Anticipated users</span>
              <RegionsDeployedAndUserCount
                groupLabel="Where are your users located?"
                groupLabelHelpText="Enter the approximate number of users that you expect within
                 each selected region."
                :hasTextFields="true"
                class="mb-12 mt-5"
                :componentIndex="index"
                @regionUserDataUpdate="regionUserDataUpdate"
              />
              <AnticipatedDataNeeds
                :periods="periods"
                :increaseSelection.sync="anticipatedNeedsData[index].increase_in_users"
                :growthSelection.sync="anticipatedNeedsData[index].user_growth_estimate_type"
                :percentages.sync="anticipatedNeedsData[index].user_growth_estimate_percentage"
                needs="user"
              />
              <hr class="mb-10 mt-5" />
              <span class="font-weight-500 font-size-20 mb-5">2. Anticipated data needs</span>
              <AnticipatedDataNeeds
                class="mt-5"
                needs="data"
                :periods="periods"
                :increaseSelection.sync="anticipatedNeedsData[index].data_increase"
                :growthSelection.sync="anticipatedNeedsData[index].data_growth_estimate_type"
                :percentages.sync="anticipatedNeedsData[index].data_growth_estimate_percentage"
                :dataTextFieldValue.sync="anticipatedNeedsData[index].data_egress_monthly_amount"
                :dataDropdownValue.sync="anticipatedNeedsData[index].data_egress_monthly_unit"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Mixins } from "vue-property-decorator";
import ClassificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO, PeriodDTO, SelectedClassificationLevelDTO } from "@/api/models";
import { buildClassificationLabel, hasChanges } from "@/helpers";
import RegionsDeployedAndUserCount from "@/components/DOW/RegionsDeployedAndUserCount.vue";
import AnticipatedDataNeeds from "@/components/DOW/AnticipatedDataNeeds.vue";
import Periods from "@/store/periods";
import SaveOnLeave from "@/mixins/saveOnLeave";
import DescriptionOfWork from "@/store/descriptionOfWork";
import { StorageUnit } from "../../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import classificationRequirements from "@/store/classificationRequirements";

@Component({
  components: {
    RegionsDeployedAndUserCount,
    AnticipatedDataNeeds
  },
})
export default class AnticipatedUserAndDataNeeds extends Mixins(SaveOnLeave) {
  public selectedClassifications: ClassificationLevelDTO[] = []
  private periods: PeriodDTO[] | null = [];
  public accordionClosed = 0;
  public anticipatedNeedsData: SelectedClassificationLevelDTO[] = []

  private async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
  public buildClassificationLabel = buildClassificationLabel
  public regionUserDataUpdate(data: string,index:number): void {
    this.anticipatedNeedsData[index].users_per_region = data;
    console.log(this.anticipatedNeedsData)
  }
  private async loadOnEnter(): Promise<void> {
    this.periods = Periods.periods;
    const classificationLevels = ClassificationRequirements.selectedClassificationLevels
    const allClassificationLevels = await ClassificationRequirements.getAllClassificationLevels()
    classificationLevels.forEach((classification) =>{
      allClassificationLevels.forEach((storedClassification) => {
        if(classification.sys_id === storedClassification.sys_id){
          this.selectedClassifications.push(storedClassification)
        }
      })
    })
    this.selectedClassifications.forEach((classification)=>{
      let data: SelectedClassificationLevelDTO = {
        classification_level: classification.sys_id || "", // sys id
        acquisition_package: AcquisitionPackage.getAcquisitionPackageSysId(),
        impact_level : classification.impact_level,
        classification : classification.classification,
        users_per_region : "",// json stringified sys_id/count pairs
        increase_in_users : "",
        user_growth_estimate_type : "",
        user_growth_estimate_percentage : [],
        data_egress_monthly_amount : null,
        data_egress_monthly_unit : "GB",
        data_increase : "",
        data_growth_estimate_type : "",
        data_growth_estimate_percentage : []
      }
      this.anticipatedNeedsData.push(data)
    })
    console.log("data",this.anticipatedNeedsData)
  }
  public savedData: SelectedClassificationLevelDTO[] = []

  public get currentData(): SelectedClassificationLevelDTO[] {
    return this.anticipatedNeedsData
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);

    try {
      if (this.hasChanged()) {
        await classificationRequirements.setSelectedClassificationLevels(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }
}
</script>

