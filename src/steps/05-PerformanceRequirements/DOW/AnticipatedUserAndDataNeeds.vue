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
        <v-expansion-panels v-for="(classification, index) in selectedClassifications"
          :id="'AnticipatedUserAndDataNeedsAccordion' + index"
          :key="index"
          class="mb-4"
          flat
        >
          <v-expansion-panel expand>
            <v-expansion-panel-header>
              <div class="d-flex justify-space-between">
                <div class="h4">
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
              />
              <AnticipatedDataNeeds
                needs="user"
              />
              <hr class="mb-10 mt-5" />
              <span class="font-weight-500 font-size-20 mb-5">2. Anticipated data needs</span>
              <AnticipatedDataNeeds
                class="mt-5"
                needs="data"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ClassificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";
import { buildClassificationLabel } from "@/helpers";
import RegionsDeployedAndUserCount from "@/components/DOW/RegionsDeployedAndUserCount.vue";
import AnticipatedDataNeeds from "@/components/DOW/AnticipatedDataNeeds.vue";

@Component({
  components: {
    RegionsDeployedAndUserCount,
    AnticipatedDataNeeds
  },
})
export default class AnticipatedUserAndDataNeeds extends Vue {
  public selectedClassifications: ClassificationLevelDTO[] = []

  private async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
  public buildClassificationLabel = buildClassificationLabel

  private async loadOnEnter(): Promise<void> {
    const classificationLevels = ClassificationRequirements.selectedClassificationLevels
    const allClassificationLevels = await ClassificationRequirements.getAllClassificationLevels()
    classificationLevels.forEach((classification) =>{
      allClassificationLevels.forEach((storedClassification) => {
        if(classification.sys_id === storedClassification.sys_id){
          this.selectedClassifications.push(storedClassification)
        }
      })
    })
  }
}
</script>

