<template>
  <div class="_preview-wrap">
    <v-app-bar app flat v-if="!isForm" class="_preview-header d-flex align-center bg-white">
      <v-btn 
        class="plain bg-transparent mx-7 my-4 pa-0" 
        @click="$emit('showView', 'form')" >
          <ATATSVGIcon class="mr-2" name="arrowBack" width="16" height="16" />
      
      <h3>Document Preview: {{ docTitle }}</h3>
      </v-btn>
    </v-app-bar>    

    <div class="_document-wrap">
      <div class="_sheet">
        <div id="PreviewForm">
          <h1 class="mb-10">{{ docTitle }}</h1>

          <h2 class="mb-5">Part I. Requirement Owner Information</h2>

          <ol>
            <li>
              <EmergencyDeclarationSupport
                :isForm="false"
                :emergencyDeclaration="docData.projectOverview.emergency_declaration"
                legend="Emergency: This requirement is in support of an Emergency Declaration."
              />
            </li>
            <li>
              <strong id="ReqInfo" class="mb-4 d-block">Requirements Information</strong>
              <div aria-describedby="ReqInfo">
                <ProjectTitle
                  class="mb-2"
                  :isForm="false"
                  :currentTitle="docData.projectOverview.title"
                />
                <ProjectScope
                  :isForm="false" 
                  :projectScope="docData.projectOverview.scope"
                />
              </div>
            </li>

            <li>
              <strong>Mission Owner Agency/Organization Information</strong>
            </li>

            <li>
              <strong id="CORInfo" class="mb-4 d-block">
                Task Order Contracting Officer Representative (TO COR) nominee
              </strong>
              <div aria-describedby="CORInfo">
                <CommonCorAcor
                  :isACOR="false"
                  :isWizard="false"
                  :isForm="false"
                  :currentContactData="docData.cor"
                />
              </div>

              <div v-if="hasACOR">
                <strong id="ACORInfo" class="mb-4 mt-10 d-block">
                  Alternate TO COR nominee
                </strong>
                <div aria-describedby="ACORInfo">
                  <CommonCorAcor
                    :isACOR="true"
                    :isWizard="false"
                    :isForm="false"
                    :currentContactData="docData.acor"
                  />
                </div>
              </div>

            </li>
          </ol>

          <hr />
          <h2 class="mb-5">Part II. Requirement Information</h2>

          <ol>
            <li>
              <CurrentContractOptions 
                :isForm="isForm"
                legend="Do you have a current contract for this effort?"
                :selectedOption="docData.currentContract.current_contract_exists"
              />
              <IncumbentContractorName
                  v-if="docData.currentContract.current_contract_exists === 'YES'"
                  :isForm="isForm"
                  :value.sync="docData.currentContract.incumbent_contractor_name"
              />
              <ContractNumber v-if="docData.currentContract.current_contract_exists === 'YES'"
                  :isForm="isForm"
                  :value.sync="docData.currentContract.contract_number"
              />
              <TaskOrderNumber v-if="docData.currentContract.current_contract_exists === 'YES'"
                  :isForm="isForm"
                  :value.sync="docData.currentContract.task_delivery_order_number"
              />
            </li>
            <li>
              <FairOppExceptions 
                :isForm="isForm"
                legend="Does your market research indicate an exception to the fair 
                  opportunity process (Federal Acquisition Regulation (FAR) 16.505(b)(2))?"
                :selectedException="docData.fairOpportunity.exception_to_fair_opportunity"
              />
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

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
import IncumbentContractorName from "@/steps/03-Background/components/IncumbentContractorName.vue";

// Step 3 Components
import ContractNumber from "@/steps/03-Background/components/ContractNumber.vue";
import CurrentContractOptions 
  from "@/steps/03-Background/CurrentContract/components/CurrentContractOptions.vue";

import { Component, Prop } from "vue-property-decorator";

import { DocReviewData } from "types/Global";
import TaskOrderNumber from "@/steps/03-Background/components/TaskOrderNumber.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    TaskOrderNumber,
    ATATSVGIcon,
    ContractNumber,
    CommonCorAcor,
    CurrentContractOptions,
    DoDAAC,
    EmergencyDeclarationSupport,
    FairOppExceptions,
    IncumbentContractorName,
    ProjectScope,
    ProjectTitle,
  },
})

export default class DocumentReviewPreview extends Vue {
  @Prop({ default: "" }) private docTitle!: string;
  @Prop() private docData!: DocReviewData;
  @Prop() private isForm!: boolean;

  private hasACOR = AcquisitionPackage.hasAlternativeContactRep;
}

</script>
