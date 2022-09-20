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
              :emergencyDeclaration.sync="_docData.acqPackage.emergency_declaration"
            />
        </div>

        <div class="_comment-wrap">
          <CommentButton id="ProjectTitle" />
          <ProjectTitle
            label="Project/Requirements Title"
            :currentTitle.sync="_docData.acqPackage.title"
          />
        </div>
        <div class="_comment-wrap">
          <CommentButton id="ProjectScope" />
          <ProjectScope
            label="What is the scope of your requirement?"
            :projectScope.sync="_docData.acqPackage.scope"
          />
        </div>

        <h2 class="mb-5 ml-4">Part II. Requirement Information</h2>

        <div class="_comment-wrap">
          <CommentButton id="CurrentContract" />
          <CurrentContractOptions 
            legend="Do you have a current contract for this effort?"
            :selectedOption.sync="currentContractExists"
          /><!-- EJY FIX SYNC -->
        </div>

        <div class="_comment-wrap">
          <CommentButton id="FairOpportunity" />
          <FairOppExceptions 
            legend="Based on your market research, do any of the following exceptions to fair 
              opportunity apply to your acquisition?"
            classes=""
            :selectedException.sync="fairOpportunityException"
          /><!-- EJY FIX SYNC -->
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

// EJY may not need AcqPkg and API Models
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { 
  CurrentContractDTO, 
  FairOpportunityDTO,
  ProjectOverviewDTO,
} from "@/api/models";

@Component({
  components: {
    ATATSVGIcon,
    CommentButton,
    CurrentContractOptions,
    EmergencyDeclarationSupport,
    FairOppExceptions,
    PageHead,
    ProjectScope,
    ProjectTitle,
  },
})
export default class DocumentReviewForm extends Vue {
  @Prop({ default: "" }) private docTitle!: string;

  // EJY MOVE ALL DATA TO INDEX
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
