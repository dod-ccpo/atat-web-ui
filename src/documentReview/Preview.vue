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
          <h1>{{ docTitle }}</h1>
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
                :selectedOption="currentContractExists"
              /><!-- EJY FIX SYNC -->
            </li>
            <li>
              <FairOppExceptions 
                :isForm="isForm"
                legend="Does your market research indicate an exception to the fair 
                  opportunity process (Federal Acquisition Regulation (FAR) 16.505(b)(2))?"
                :selectedException="fairOpportunityException"
              /><!-- EJY FIX SYNC -->
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

  // EJY probably don't need this - data load should be in index.vue
  private isForm = false;
  private currentTitle = "";
  private projectScope = "";
  private emergencyDeclaration = "";
  private fairOpportunityException = "";
  private currentContractExists = "";

  private docData = {
    acqPackage: {},
    fairOpp: {},
    background: {},
  }

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

    const bkgStoreData = await AcquisitionPackage.
      loadData<CurrentContractDTO>({storeProperty: StoreProperties.CurrentContract})
    if (bkgStoreData) {
      if (Object.prototype.hasOwnProperty.call(bkgStoreData, 'current_contract_exists')) {
        this.docData.background = {
          // eslint-disable-next-line camelcase
          current_contract_exists: bkgStoreData.current_contract_exists,
        }
        this.currentContractExists = bkgStoreData.current_contract_exists || "";
      }
    }

  }
}
</script>
