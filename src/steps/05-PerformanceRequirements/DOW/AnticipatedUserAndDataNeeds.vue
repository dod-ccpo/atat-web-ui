<template>
  <v-form ref="form" lazy-validation>
  <v-container fluid class="container-max-width _anticipated-users-accordion">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          <span v-if="!comingFromReview">
            First, tell
          </span>
          <span v-else>
            Tell
          </span>
           us about your anticipated users and data needs
        </h1>
        <p class="page-intro">
          <span v-if="!comingFromReview">
            Before we walk through each of your selected XaaS categories, we
          </span>
          <span v-else>
            We
          </span>
            need
          to know some basic information about your users and data within each
          classification level.
        </p>
        <v-expansion-panels
          v-model="accordionClosed[index]"
          v-for="(classification, index) in anticipatedNeedsData"
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
                :regionUsersOnLoad="anticipatedNeedsData[index].users_per_region"
                :id="'Regions' +index"
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
</v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */

import { Component, Mixins, Watch } from "vue-property-decorator";
import ClassificationRequirements from "@/store/classificationRequirements";
import { PeriodDTO, SelectedClassificationLevelDTO } from "@/api/models";
import { buildClassificationLabel, hasChanges } from "@/helpers";
import RegionsDeployedAndUserCount from "@/components/DOW/RegionsDeployedAndUserCount.vue";
import AnticipatedDataNeeds from "@/components/DOW/AnticipatedDataNeeds.vue";
import Periods from "@/store/periods";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Vue from "vue";

@Component({
  components: {
    RegionsDeployedAndUserCount,
    AnticipatedDataNeeds
  },
})
export default class AnticipatedUserAndDataNeeds extends Mixins(SaveOnLeave) {
  
  $refs!: {
    form: Vue & { validate: () => boolean};
  }

  private periods: PeriodDTO[] | null = [];
  public accordionClosed: number[] = [];
  public anticipatedNeedsData: SelectedClassificationLevelDTO[] = [];
  public savedData: SelectedClassificationLevelDTO[] = []
  public get comingFromReview():boolean {
    return DescriptionOfWork.returnToDOWSummary === true
  }

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  private async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
  public buildClassificationLabel = buildClassificationLabel
  public regionUserDataUpdate(data: string,index:number): void {
    this.anticipatedNeedsData[index].users_per_region = data;
  }
  private async loadOnEnter(): Promise<void> {
    this.periods = Periods.periods;
    const classifications = await ClassificationRequirements.getSelectedClassificationLevels()
    this.savedData = _.cloneDeep(classifications);
    this.anticipatedNeedsData = classifications
      .sort((a,b) => a.impact_level > b.impact_level ? 1 : -1)
    this.accordionClosed = new Array(this.anticipatedNeedsData.length).fill(0)
  }

  public get currentData(): SelectedClassificationLevelDTO[] {
    return this.anticipatedNeedsData
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  private async updateSnowSelected(value:SelectedClassificationLevelDTO): Promise<void> {
    await ClassificationRequirements.saveSingleSelectedClassificationLevel(value)
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    await AcquisitionPackage.setAnticipatedUsersAndDataNeedsVisited(true);
    try {
      if (this.hasChanged()) {
        for(const classification of this.currentData){
          classification.isValid = this.$refs.form.validate();
          await this.updateSnowSelected(classification);
        }
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }
}
</script>

