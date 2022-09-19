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
          <ol>
            <li>
              <CurrentContractOptions 
                :isForm="false"
                :isCard="false"
                :isWizard="false"
                legend="Do you have a current contract for this effort?"
                :selectedOption="currentContractExists"
              />
            </li>
            <li>
              <FairOppExceptions 
                :isForm="false"
                legend="Does your market research indicate an exception to the fair 
                  opportunity process (Federal Acquisition Regulation (FAR) 16.505(b)(2))?"
                :selectedException.sync="fairOpportunityException"
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
