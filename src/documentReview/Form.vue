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

        <!-- placeholder for ORGANIZATION agency/DISA org components -->
        <p class="ml-4">What service or agency is this contracting effort for? </p>
        <p class="ml-4">DISA Organization</p>
        <!-- END placeholder from ORGANIZATION -->

        <hr />
        
        <div class="_comment-wrap">
          <CommentButton id="COR_Contact" />
          <CommonCorAcor
            :isACOR="false"
            :isWizard="false"
            :currentContactData.sync="_docData.cor"
          />
        </div>

        <div class="_comment-wrap">
          <CommentButton id="COR_DoDAAC" />
          <DoDAAC 
            :isForm="true"
            :isWizard="false"
            :dodaac="_docData.cor ? _docData.cor.dodaac : ''"
            corOrAcor="COR"
            @valueChange="dodaacChange"
          />
        </div>

        <hr />

        <div v-if="hasACOR">
          <div class="_comment-wrap">
            <CommentButton id="ACOR_Contact" />
            <CommonCorAcor
              :isACOR="true"
              :isWizard="false"
              :currentContactData.sync="_docData.acor"
            />
          </div>

          <div class="_comment-wrap">
            <CommentButton id="ACOR_DoDAAC" />
            <DoDAAC 
              :isForm="true"
              :isWizard="false"
              :dodaac="_docData.acor ? _docData.acor.dodaac : ''"
              corOrAcor="ACOR"
              @valueChange="dodaacChange"
            />
          </div>

          <hr />
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
          <CommentButton id="ContractNumber" />
          <ContractNumber
              :value.sync="_docData.currentContract.contract_number"
          />
        </div>

        <div class="_comment-wrap">
          <CommentButton id="TaskOrderNumber" />
          <TaskOrderNumber
              :value.sync="_docData.currentContract.task_delivery_order_number"
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

import AcquisitionPackage from "@/store/acquisitionPackage";

// Step 1 Components
import EmergencyDeclarationSupport 
  from "@/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.vue";
import ProjectTitle from "@/steps/01-AcquisitionPackageDetails/components/ProjectTitle.vue";
import ProjectScope from "@/steps/01-AcquisitionPackageDetails/components/ProjectScope.vue";
import CommonCorAcor 
  from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/Common.vue";
import DoDAAC from "@/steps/01-AcquisitionPackageDetails/components/DoDAAC.vue";


// Step 2 Components
import FairOppExceptions from "@/steps/02-EvaluationCriteria/components/FairOppExceptions.vue";

// Step 3 Components
import ContractNumber from "@/steps/03-Background/components/ContractNumber.vue";
import CurrentContractOptions 
  from "@/steps/03-Background/CurrentContract/components/CurrentContractOptions.vue";
import IncumbentContractorName from "@/steps/03-Background/components/IncumbentContractorName.vue";
import { DocReviewData } from "types/Global";
import TaskOrderNumber from "@/steps/03-Background/components/TaskOrderNumber.vue";

@Component({
  components: {
    ATATSVGIcon,
    CommentButton,
    CommonCorAcor,
    ContractNumber,
    CurrentContractOptions,
    DoDAAC,
    EmergencyDeclarationSupport,
    FairOppExceptions,
    IncumbentContractorName,
    PageHead,
    ProjectScope,
    ProjectTitle,
    TaskOrderNumber
  },
})

export default class DocumentReviewForm extends Vue {
  @Prop({ default: "" }) private docTitle!: string;
  @PropSync("docData") private _docData!: DocReviewData; 
  
  private hasACOR = AcquisitionPackage.hasAlternativeContactRep;

  private dodaacChange(val: string, corOrAcor: string): void {
    if (corOrAcor === "COR" && this._docData.cor !== null) {
      this._docData.cor.dodaac = val;
    } else if (this._docData.acor !== null) {
      this._docData.acor.dodaac = val;
    }
  }
}

</script>
