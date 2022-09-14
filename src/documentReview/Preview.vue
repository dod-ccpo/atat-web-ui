<template>
  <div>
    <router-link
      to="/docReviewForm"
      id="goBackLink"
      class="no-text-decoration d-flex align-center py-3"
    >
      <v-btn class="plain bg-transparent pa-0">
        <ATATSVGIcon class="mr-2" name="arrowLeft" width="16" height="16" />
      </v-btn>
      <h3>Document Preview: {{ docTitle }}</h3>
    </router-link>
    <hr class="ma-0 bg-base-lighter" />
    <div id="PreviewForm">
      <h1>{{ docTitle }}</h1>
      <ol>
        <li>
          <EmergencyDeclarationSupport
            :isForm="false"
            :emergencyDeclaration="emergencyDeclaration"
            legend="Emergency: This requirement is in support of an Emergency Declaration."
          >
          </EmergencyDeclarationSupport>
        </li>
        <li>
          <div id="ReqInfo" class="mb-4">
            <strong>Requirements Information</strong></div>
          <div aria-describedby="ReqInfo">
            <ProjectTitle
              class="mb-2"
              :isForm="false"
              :currentTitle="currentTitle"
            ></ProjectTitle>

            <ProjectScope
              :isForm="false" 
              :projectScope="projectScope"
            ></ProjectScope>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import EmergencyDeclarationSupport 
  from "@/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.vue";
import ProjectTitle from "@/steps/01-AcquisitionPackageDetails/components/ProjectTitle.vue";
import ProjectScope from "@/steps/01-AcquisitionPackageDetails/components/ProjectScope.vue";

import { Component, Prop } from "vue-property-decorator";
import AcquisitionPackage, {
  StoreProperties,
} from "@/store/acquisitionPackage";
import { ProjectOverviewDTO } from "@/api/models";
@Component({
  components: {
    ATATSVGIcon,
    EmergencyDeclarationSupport,
    ProjectTitle,
    ProjectScope,
  },
})
export default class DocumentReviewPreview extends Vue {
  @Prop({ default: "" }) private docTitle!: string;
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
