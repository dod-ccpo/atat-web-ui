<template>
  <div class="pt-8 pb-10">
    <section class="_learn-more-section">
      <div class="container-max-width">
        <v-row>    
          <v-col class="col-sm-12 col-md-7 pr-5">

            <v-expansion-panels 
              id="PackagesAccordion" 
              flat 
              v-model="packagesPanel"
              v-if="showPackagesPanel"
              style="z-index:10"
            >
              <v-expansion-panel expand>
                <v-expansion-panel-header>
                  <div class="d-flex justify-space-between">
                    <div class="h3">
                      Open Acquisition Packages
                    </div>
                    <div class="h3 _item-count pr-4">
                      {{ packageCount }} package<span v-if="packageCount !== 1">s</span>
                    </div>
                  </div>

                </v-expansion-panel-header>
                <v-expansion-panel-content>

                  <PackageCards
                    v-for="(cardData, index) in packageData"
                    :key="cardData.sys_id"
                    :cardData="cardData"
                    :index="index"
                    :isLastCard="index === packageData.length - 1"
                    @updateStatus="loadPackageData"
                    @openTOSearchModal="openTOSearchModal"
                  />

                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <div 
              class="_view-all mb-10 bg-white"
              v-if="showPackagesPanel"
            >
              <a
                id="viewAllPackagesLink"
                role="button"
                @click="viewAllPackages"
                @keydown.enter="viewAllPackages"
                @keydown.space="viewAllPackages"
              >
                View all packages
              </a>
            </div>

          <v-expansion-panels 
            id="PortfoliosAccordion" 
            flat
            v-model="portfolioPanel" 
            v-show="userHasPortfolios"
          >
            <v-expansion-panel expand>
              <v-expansion-panel-header>
                <div class="d-flex justify-space-between">
                  <div class="h3">
                    Porfolios
                  </div>
                  <div class="h3 text-base-light _item-count pr-4">
                    {{ portfolioCount }} portfolio<span v-if="portfolioCount !== 1">s</span>
                  </div>
                </div>

              </v-expansion-panel-header>
              <v-expansion-panel-content>

                <PortfoliosSummary 
                  active-tab="ALL" 
                  default-sort="DESCsys_updated_on"
                  :isHomeView="true" 
                  @totalCount="updateTotalPortfolios"
                />

              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- 
            ---------------------------------------------------
            -- ATAT TODO -  UNHIDE LINK when Portfolio Mgmt added -- 
            ---------------------------------------------------
            <div class="_view-all">
            <a
              id="ViewAllPortfoliosLink"
              role="button"
              @click="viewAllPortfolios"
              @keydown.enter="viewAllPortfolios"
              @keydown.space="viewAllPortfolios"
            >
              View all portfolios
            </a>
          </div> 
          -->

          </v-col>

          <v-col class="col-sm-12 col-md-5 pl-5">
            <v-card flat class="pa-6 mb-10 _simple-border">
              <h3 class="text-primary mb-4">Do you already have an awarded task order?</h3>
              <p class="body">
                We’ll gather details about your task order to start provisioning new 
                cloud resources or to continue funding an existing portfolio.
              </p>
              <TaskOrderSearch
                :TONumber.sync="TONumber"
                @startProvisionWorkflow="startProvisionWorkflow"
              />
            </v-card>            

            <v-card flat class="pa-6 mb-10 _simple-border">
              <h3 class="text-primary mb-4">What else could we help you with?</h3>
                <v-btn
                  id="JWCCHelpCenterButton"
                  href="https://community.hacc.mil/s/jwcc/resources"
                  target="_blank" 
                  class="secondary mb-4 mt-4 width-100 _text-decoration-none"
                >
                  JWCC Help Center
                  
                    <ATATSVGIcon
                      id="JWCCHelpCenterButtonIcon"
                      width="15"
                      height="15"
                      name="launch"
                      class="ml-2"
                      color="primary"
                    />
                
                </v-btn>
                <v-btn
                  id="CustomerSupportButton"
                  class="secondary mt-4 width-100 _text-decoration-none"
                  :href="supportUrl"
                  target="_blank"
                >      
                  Contact customer support
                    <ATATSVGIcon
                      id="CustomerSupportButtonIcon"
                      width="15"
                      height="15"
                      name="launch"
                      class="ml-2"
                      color="primary"
                    />
                    
                </v-btn>
                <v-btn
                  :href="reportIssueLink"
                  id="ReportIssueButton"
                   target="_blank"
                  class="secondary mt-4 width-100 _text-decoration-none" 
                >
                  Report a bug or technical issue
                  <ATATSVGIcon
                      id="ReportIssueButtonIcon"
                      width="15"
                      height="15"
                      name="launch"
                      class="ml-2"
                      color="primary"
                    />
                </v-btn>
            </v-card>

          </v-col>
        </v-row>
        
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATSearch from "@/components/ATATSearch.vue";
import AppSections from "@/store/appSections";

import Packages from "@/packages/Index.vue";
import Card from "@/packages/components/Card.vue";

import TaskOrderSearch from "@/portfolios/components/TaskOrderSearch.vue";

import Portfolios from "../portfolios/Index.vue";
import PortfoliosSummary from "../portfolios/components/PortfoliosSummary.vue"
import { 
  AcquisitionPackageSummaryDTO,
  AcquisitionPackageSummarySearchDTO,
  UserDTO, 
} from "@/api/models";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import CurrentUserStore from "@/store/user";

@Component({
  components: {
    ATATAlert,
    ATATSearch,
    "PackageCards": Card,
    PortfoliosSummary,
    ATATSVGIcon,
    TaskOrderSearch,
  }
})

export default class ExistingUser extends Vue {
  public packageData:AcquisitionPackageSummaryDTO[] = []
  public draftPackageCount = 0;

  public reportIssueLink = "https://services.disa.mil/sp?id=sc_cat_item&sys_id=20e86845dbaf1914" +
    "8c045e8cd39619d9&sysparm_category=a30a5ca3db12a0508c045e8cd396197c";

  public supportUrl = "https://community.hacc.mil/s/contact?RequestTopic=Account%20Tracking%20" +
    "and%20Automation%20Tool%20%28ATAT%29&RoleType=Customer"
    
  public packagesPanel = 0; // open by default
  public packageCount = 0;
  public get showPackagesPanel(): boolean {
    return this.packageCount > 0;
  }

  public portfolioPanel = 0; // open by default
  public portfolioCount = 0;

  public get userHasPortfolios(): boolean {
    return this.portfolioCount > 0;
  }

  public TONumber = "";
  public async startProvisionWorkflow(): Promise<void> {
    this.$emit("startProvisionWorkflow");
  }
  public get showAlert(): boolean {
    return this.draftPackageCount > 0
  }

  public openTOSearchModal(acqPackageSysId: string): void {
    this.$emit("openTOSearchModal", acqPackageSysId);
  }
  
  public startNewAcquisition(): void {
    this.$emit("startNewAcquisition");
  }

  public updateTotalPortfolios(totalCount: number): void {
    this.portfolioCount = totalCount;
    this.$emit("portfolioCountUpdated", totalCount);
  } 


  public viewAllPortfolios(): void {
    AppSections.setAppContentComponent(Portfolios);
  }

  public viewAllPackages(): void {
    AppSections.setAppContentComponent(Packages);
  }

  public searchDTO:AcquisitionPackageSummarySearchDTO = {
    acquisitionPackageStatus: "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER",
    searchString: "",
    sort: "DESCsys_updated_on",
    limit: 5,
    offset: 0
  };
  
  public get getCurrentUser(): UserDTO {
    return CurrentUserStore.currentUser;
  }

  @Watch("getCurrentUser")
  public async currentUserChange(): Promise<void> {
    await this.loadPackageData();
  }  

  public async loadPackageData(): Promise<void> {
    const packageData = await AcquisitionPackageSummary
      .searchAcquisitionPackageSummaryList(this.searchDTO);
    
    this.packageData = packageData.acquisitionPackageSummaryList;
    this.packageCount = packageData.total_count;
    const draftPackages = this.packageData.filter(obj => obj.package_status?.value === "DRAFT");
    this.draftPackageCount = draftPackages?.length || 0;
    if (this.packageCount === 0) {
      this.$emit("allPackagesCleared");
    }
  }

  public async loadOnEnter(): Promise<void>{
    try {
      await this.loadPackageData();
    }
    catch {
      console.log("Error loading acquisition package data");
    }
  }

  public mounted():void{
    this.loadOnEnter();
  }

}

</script>