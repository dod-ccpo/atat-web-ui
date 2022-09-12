
<template>
  <div>
    <EmergencyDeclarationSupport
      :isForm="false"
      :emergencyDeclaration="emergencyDeclaration"
      legend="1.  Emergency: This requirement is in support of an Emergency Declaration.">
    </EmergencyDeclarationSupport>
    <ProjectTitle :isForm="false" :currentTitle="currentTitle"></ProjectTitle>
    <ProjectScope :isForm="false" :projectScope="projectScope"></ProjectScope>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";

import EmergencyDeclarationSupport from 
  "@/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.vue"
import ProjectTitle from
  "@/steps/01-AcquisitionPackageDetails/components/ProjectTitle.vue"
import ProjectScope from 
  "@/steps/01-AcquisitionPackageDetails/components/ProjectScope.vue"

import AcquisitionPackage, {
  StoreProperties,
} from "@/store/acquisitionPackage";
import { ProjectOverviewDTO } from "@/api/models";

@Component({
  components: {
    EmergencyDeclarationSupport,
    ProjectTitle,
    ProjectScope
  }
})

export default class ReviewRequiredFormsStepOne extends Vue {
  private currentTitle = "";
  private projectScope = "";
  private emergencyDeclaration = "";

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadData<ProjectOverviewDTO>({
      storeProperty: StoreProperties.ProjectOverview,
    });

    if (storeData) {
      this.currentTitle = storeData.title;
      this.projectScope = storeData.scope;
      if (
        storeData.emergency_declaration &&
        storeData.emergency_declaration.length > 0
      ) {
        this.emergencyDeclaration =
          storeData.emergency_declaration === "true" ? "yes" : "no";
      }
    }
  }
}
</script>

