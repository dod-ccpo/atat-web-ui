<template>
  <div class="_preview-wrap">
    <v-app-bar app flat v-if="!isForm" class="_preview-header d-flex align-center bg-white">
      <router-link
        to="/docReviewForm"
        id="GoBackLink"
        class="no-text-decoration d-flex align-center py-3"
      >
        <v-btn class="plain bg-transparent pa-0">
          <ATATSVGIcon class="mr-2" name="arrowLeft" width="16" height="16" />
        </v-btn>
      </router-link>
      <h3>Document Preview: {{ docTitle }}</h3>
    </v-app-bar>    

    <div class="_document-wrap">
      <div class="_sheet">
        <div id="PreviewForm">
          <h1 class="mb-10">{{ docTitle }}</h1>
          <h2 class="mb-5">PART I. REQUIREMENT OWNER INFORMATION</h2>
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

          <hr />
          <h2 class="mb-5">Part II. Requirement Information</h2>
          <FairOppExceptions 
            :isForm="false"
            legend="Does your market research indicate an exception to the fair 
              opportunity process (Federal Acquisition Regulation (FAR) 16.505(b)(2))?"
            :selectedException.sync="fairOpportunityException"
          />

        </div>
      </div>
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
import FairOppExceptions from "@/steps/02-FairOpportunityProcess/components/FairOppExceptions.vue";

import { Component, Prop } from "vue-property-decorator";
import AcquisitionPackage, {
  StoreProperties,
} from "@/store/acquisitionPackage";
import { ProjectOverviewDTO, FairOpportunityDTO } from "@/api/models";
@Component({
  components: {
    ATATSVGIcon,
    EmergencyDeclarationSupport,
    FairOppExceptions,
    ProjectTitle,
    ProjectScope,
  },
})
export default class DocumentReviewPreview extends Vue {
  @Prop({ default: "" }) private docTitle!: string;
  private currentTitle = "";
  private projectScope = "";
  private emergencyDeclaration = "";
  private fairOpportunityException = "";

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

    const storeDataFairOpp = await AcquisitionPackage
      .loadData<FairOpportunityDTO>({storeProperty: StoreProperties.FairOpportunity});
    if (storeDataFairOpp) {
      debugger;
      this.fairOpportunityException = storeDataFairOpp.exception_to_fair_opportunity;
    }


  }
}
</script>
