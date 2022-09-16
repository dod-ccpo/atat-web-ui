<template>
  <div id="FormDiv" class="container-max-width">
    <PageHead :docTitle="docTitle" class="ml-4"></PageHead>
    <div class="mt-10">
      <v-form id="ReviewForm">
        <h2 class="ml-4">Part I. Requirements Owner Information</h2>
        
        <div class="_comment-wrap">
          <CommentButton id="EmergencyDeclaration" />
          <EmergencyDeclarationSupport
            legend="Is this requirement in support of an emergency declaration?"
            :emergencyDeclaration.sync="emergencyDeclaration"
          ></EmergencyDeclarationSupport>
        </div>

        <div class="_comment-wrap">
          <CommentButton id="ProjectTitle" />
          <ProjectTitle
            label="Project/Requirements Title"
            :currentTitle.sync = "currentTitle"
          ></ProjectTitle>
        </div>

        <div class="_comment-wrap">
          <CommentButton id="ProjectScope" />
          <ProjectScope
            label="What is the scope of your requirement?"
            :projectScope.sync="projectScope"
          ></ProjectScope>
        </div>
        <hr />

        <h2 class="mb-5 ml-4">Part II. Requirement Information</h2>

        <div class="_comment-wrap">
          <CommentButton id="ProjectScope" />
          <FairOppExceptions 
            legend="Based on your market research, do any of the following exceptions to fair 
              opportunity apply to your acquisition?"
            classes=""
            :selectedException.sync="fairOpportunityException"
          />
        </div>

      </v-form>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import PageHead from "./components/DocReviewHead.vue"
import { Component, Prop } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import CommentButton from "./components/CommentButton.vue";

import EmergencyDeclarationSupport 
  from "@/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.vue";
import ProjectTitle from "@/steps/01-AcquisitionPackageDetails/components/ProjectTitle.vue";
import ProjectScope from "@/steps/01-AcquisitionPackageDetails/components/ProjectScope.vue";
import FairOppExceptions from "@/steps/02-FairOpportunityProcess/components/FairOppExceptions.vue";


import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { ProjectOverviewDTO, FairOpportunityDTO } from "@/api/models";

@Component({
  components: {
    ATATSVGIcon,
    CommentButton,
    PageHead,
    EmergencyDeclarationSupport,
    FairOppExceptions,
    ProjectTitle,
    ProjectScope
  },
})
export default class DocumentReviewForm extends Vue {
  @Prop({ default: "" }) private docTitle!: string;

  private currentTitle = "";
  private projectScope = "";
  private emergencyDeclaration = "";
  private fairOpportunityException = "";


  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeDataOverview = await AcquisitionPackage.loadData<ProjectOverviewDTO>({
      storeProperty: StoreProperties.ProjectOverview,
    });

    if (storeDataOverview) {
      this.currentTitle = storeDataOverview.title;
      this.projectScope = storeDataOverview.scope;
      if (
        storeDataOverview.emergency_declaration &&
        storeDataOverview.emergency_declaration.length > 0
      ) {
        this.emergencyDeclaration =
          storeDataOverview.emergency_declaration === "true" ? "yes" : "no";
      }
    }

    const storeDataFairOpp = await AcquisitionPackage
      .loadData<FairOpportunityDTO>({storeProperty: StoreProperties.FairOpportunity});
    debugger;
    if (storeDataFairOpp) {
      this.fairOpportunityException = storeDataFairOpp.exception_to_fair_opportunity;
    }


  }
}
</script>
