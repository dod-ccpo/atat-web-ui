<template>
  <div id="FormDiv" class="container-max-width">
    <PageHead :docTitle="docTitle" class="ml-4" />
    <div class="mt-10">
      <v-form id="ReviewForm">
        <h2 class="ml-4">Part I. Requirements Owner Information</h2>

        <div class="_comment-wrap">
          <CommentButton id="EmergencyDeclaration" />
            <EmergencyDeclarationSupport
              legend="Is this requirement in support of an emergency declaration?"
              :emergencyDeclaration.sync="_docData.projectOverview.emergency_declaration"
            />
        </div>

        <div class="_comment-wrap">
          <CommentButton id="ProjectTitle" />
          <ProjectTitle
            label="Project/Requirements Title"
            :currentTitle.sync="_docData.projectOverview.title"
          />
        </div>
        
        <div class="_comment-wrap">
          <CommentButton id="ProjectScope" />
          <ProjectScope
            label="What is the scope of your requirement?"
            :projectScope.sync="_docData.projectOverview.scope"
          />
        </div>

        <h2 class="mb-5 ml-4">Part II. Requirement Information</h2>

        <div class="_comment-wrap">
          <CommentButton id="CurrentContract" />
          <CurrentContractOptions 
            legend="Do you have a current contract for this effort?"
            :selectedOption.sync="_docData.currentContract.current_contract_exists"
          />
        </div>

        <div class="_comment-wrap">
          <CommentButton id="IncumbentContractorName" />
            <IncumbentContractorName
                :value.sync="_docData.currentContract.incumbent_contractor_name"
            />
        </div>

        <div class="_comment-wrap">
          <CommentButton id="FairOpportunity" />
          <FairOppExceptions 
            legend="Based on your market research, do any of the following exceptions to fair 
              opportunity apply to your acquisition?"
            :selectedException.sync="_docData.fairOpportunity.exception_to_fair_opportunity"
          />
        </div>        
      </v-form>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import PageHead from "./components/DocReviewHead.vue"
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import CommentButton from "./components/CommentButton.vue";

// Step 1 Components
import EmergencyDeclarationSupport 
  from "@/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.vue";
import ProjectTitle from "@/steps/01-AcquisitionPackageDetails/components/ProjectTitle.vue";
import ProjectScope from "@/steps/01-AcquisitionPackageDetails/components/ProjectScope.vue";

// Step 2 Components
import FairOppExceptions from "@/steps/02-FairOpportunityProcess/components/FairOppExceptions.vue";

// Step 3 Components
import CurrentContractOptions 
  from "@/steps/03-Background/CurrentContract/components/CurrentContractOptions.vue";
import IncumbentContractorName from "@/steps/03-Background/components/IncumbentContractorName.vue";
import { DocReviewData } from "types/Global";

@Component({
  components: {
    ATATSVGIcon,
    CommentButton,
    CurrentContractOptions,
    EmergencyDeclarationSupport,
    FairOppExceptions,
    IncumbentContractorName,
    PageHead,
    ProjectScope,
    ProjectTitle,
  },
})

export default class DocumentReviewForm extends Vue {
  @Prop({ default: "" }) private docTitle!: string;
  @PropSync("docData") private _docData!: DocReviewData;  
}

</script>
