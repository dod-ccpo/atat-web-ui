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
                :emergencyDeclaration="docData.acqPackage.emergency_declaration"
                legend="Emergency: This requirement is in support of an Emergency Declaration."
              />
            </li>
            <li>
              <strong id="ReqInfo" class="mb-4 d-block">Requirements Information</strong>
              <div aria-describedby="ReqInfo">
                <ProjectTitle
                  class="mb-2"
                  :isForm="false"
                  :currentTitle="docData.acqPackage.title"
                />
                <ProjectScope
                  :isForm="false" 
                  :projectScope="docData.acqPackage.scope"
                />
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
            </li>
            <li>
              <FairOppExceptions 
                :isForm="isForm"
                legend="Does your market research indicate an exception to the fair 
                  opportunity process (Federal Acquisition Regulation (FAR) 16.505(b)(2))?"
                :selectedException="docData.fairOpp.exception_to_fair_opportunity"
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

// Step 2 Components
import FairOppExceptions from "@/steps/02-FairOpportunityProcess/components/FairOppExceptions.vue";

// Step 3 Components
import CurrentContractOptions 
  from "@/steps/03-Background/CurrentContract/components/CurrentContractOptions.vue";


import { Component, Prop } from "vue-property-decorator";
import AcquisitionPackage, {
  StoreProperties,
} from "@/store/acquisitionPackage";

import { 
  CurrentContractDTO, 
  FairOpportunityDTO,
  ProjectOverviewDTO,
} from "@/api/models";

@Component({
  components: {
    ATATSVGIcon,
    CurrentContractOptions,
    EmergencyDeclarationSupport,
    FairOppExceptions,
    ProjectScope,
    ProjectTitle,
  },
})

export default class DocumentReviewPreview extends Vue {
  @Prop({ default: "" }) private docTitle!: string;
  @Prop() private docData!:  Record<string, Record<string, unknown>>;
  @Prop() private isForm!: boolean;
}

</script>
