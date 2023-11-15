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
          :id="'AnticipatedUserAndDataNeedsAccordion_' + index"
          :key="index"
          class="mb-4"
          borderless
        >
          <v-expansion-panel expand>
            <v-expansion-panel-title :id="`AccordionButton_${index}`" >
              <div class="d-flex justify-space-between">
                <div class="h4 _expansion-panel-header">
                  {{buildClassificationLabel(classification,'short',true)}}
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <span class="font-weight-500 font-size-20">1. Anticipated users</span>
              <RegionsDeployedAndUserCount
                :id="'Regions' + index"
                :ref="'RegionsRef' + index"
                groupLabel="Where are your users located?"
                groupLabelHelpText="Enter the approximate number of users that you expect within
                 each selected region."
                :hasTextFields="true"
                class="mb-12 mt-5"
                :componentIndex="index"
                :regionUsersOnLoad="anticipatedNeedsData[index].users_per_region"
                @update:regionUsersOnLoad="anticipatedNeedsData[index].users_per_region = $event"
                :index="index"
                :rules="[
                  $validators.required('Select at least one region')
                ]"
                :textfieldRules="[
                  $validators.required('Enter the number of users in this region.')
                ]"
          
                @regionUserDataUpdate="regionUserDataUpdate"
              />
              <AnticipatedDataNeeds
                :ref="'AnticipatedUserNeeds' + index + 'Ref'"
                :index="index"
                :periods="periods"
                :increaseSelection="anticipatedNeedsData[index].increase_in_users"
                @update:increaseSelection="anticipatedNeedsData[index].increase_in_users = $event"
                :growthSelection="anticipatedNeedsData[index].user_growth_estimate_type"
                @update:growthSelection="anticipatedNeedsData[index].user_growth_estimate_type 
                  = $event"
                :percentages="anticipatedNeedsData[index].user_growth_estimate_percentage"
                @update:percentages="anticipatedNeedsData[index].user_growth_estimate_percentage 
                  = $event"
                needs="user"
                :rules="[$validators.required('Please select an option')]"
              />
              <hr class="mb-10 mt-5" />
              <span class="font-weight-500 font-size-20 mb-5">2. Anticipated data needs</span>
              <AnticipatedDataNeeds
                :ref="'AnticipatedDataNeeds' + index + 'Ref'"
                class="mt-5"
                needs="data"
                :index="index"
                :periods="periods"
                :increaseSelection="anticipatedNeedsData[index].data_increase"
                @update:increaseSelection="anticipatedNeedsData[index].data_increase = $event"
                :growthSelection="anticipatedNeedsData[index].data_growth_estimate_type"
                @update:growthSelection="anticipatedNeedsData[index].data_growth_estimate_type 
                  = $event"
                :percentages="anticipatedNeedsData[index].data_growth_estimate_percentage"
                @update:percentages="anticipatedNeedsData[index].data_growth_estimate_percentage 
                  = $event"
                :dataTextFieldValue="anticipatedNeedsData[index].data_egress_monthly_amount"
                @update:dataTextFieldValue="anticipatedNeedsData[index].data_egress_monthly_amount
                  = $event"
                :dataDropdownValue="anticipatedNeedsData[index].data_egress_monthly_unit"
                @update:dataDropdownValue="anticipatedNeedsData[index].data_egress_monthly_unit 
                  = $event"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */

import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import ClassificationRequirements from "@/store/classificationRequirements";
import { PeriodDTO, SelectedClassificationLevelDTO } from "@/api/models";
import { buildClassificationLabel, hasChanges } from "@/helpers";
import RegionsDeployedAndUserCount from "@/components/DOW/RegionsDeployedAndUserCount.vue";
import AnticipatedDataNeeds from "@/components/DOW/AnticipatedDataNeeds.vue";
import Periods from "@/store/periods";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import DescriptionOfWork from "@/store/descriptionOfWork";
import { SaveOnLeaveRefs } from "types/Global";


@Component({
  components: {
    RegionsDeployedAndUserCount,
    AnticipatedDataNeeds
  },
})
class AnticipatedUserAndDataNeeds extends Vue {
    
  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }
  private periods: PeriodDTO[] = [];
  public accordionClosed: number[] = [];
  public anticipatedNeedsData: SelectedClassificationLevelDTO[] = [];
  public savedData: SelectedClassificationLevelDTO[] = []
  public get comingFromReview():boolean {
    return DescriptionOfWork.returnToDOWSummary === true
  }

  private async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
  public buildClassificationLabel = buildClassificationLabel
  public regionUserDataUpdate(data: string, index: number): void {
    this.anticipatedNeedsData[index].users_per_region = data;
  }
  private async loadOnEnter(): Promise<void> {
    this.periods = Periods.periods;
    const classifications = await ClassificationRequirements.getSelectedClassificationLevels();
    classifications.forEach((c) => {
      c.data_egress_monthly_unit = c.data_egress_monthly_unit !== "" 
        ? c.data_egress_monthly_unit : "GB";
    });
    this.savedData = _.cloneDeep(classifications);
    this.anticipatedNeedsData = classifications.sort(
      (a,b) => a.impact_level > b.impact_level ? 1 : -1
    );

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
          classification.isValid = 
            (await(await this.$refs.form as SaveOnLeaveRefs["form"]).validate()).valid
          await this.updateSnowSelected(classification);
        }
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }
}
export default toNative(AnticipatedUserAndDataNeeds )
</script>

