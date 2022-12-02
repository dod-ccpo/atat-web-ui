<template>
  <v-container fluid class="container-max-width">
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
          flat
        >
          <v-expansion-panel expand>
            <v-expansion-panel-header>
              <div class="d-flex justify-space-between">
                <div class="h4">
                  {{buildClassificationLabel(classification,'short')}}
                </div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <span>1. Anticipated users</span>
              <RegionsDeployedAndUserCount
                label="Where are your users located?"
                description="Enter the approximate number of users that you expect within each
                 selected region."
              />
              <AnticipatedUserAndDataNeeds
                DataOrUsers="Users"
              />
              <hr />
              <span>2. Anticipated data needs</span>
              <AnticipatedUserAndDataNeeds
                DataOrUsers="Data"
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

@Component({
  components: {
    RegionsDeployedAndUserCount,
    AnticipatedUserAndDataNeeds
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

