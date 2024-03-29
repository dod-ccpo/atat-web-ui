<template>
  <div class="pt-5 pb-10">
    <section class="_learn-more-section">
      <div class="container-max-width">
        <v-row>    
          <v-col class="pr-5" cols="12" md="7">

            <div v-if="userHasPackages">
              <v-expansion-panels 
                id="PackagesAccordion" 
                v-model="packagesPanel"
                style="z-index:10"
              >
                <v-expansion-panel expand>
                  <v-expansion-panel-title expand-icon="$expand">
                    <div class="d-flex justify-space-between width-100">
                      <div class="h3">
                        Open Acquisition Packages
                      </div>
                      <div class="h3 _item-count pr-4">
                        {{ packageCount }} package<span v-if="packageCount !== 1">s</span>
                      </div>
                    </div>

                  </v-expansion-panel-title>
                  <v-expansion-panel-text>

                    <ATATLoader 
                      v-show="isLoadingPackages" 
                      loadingText="Loading your packages" 
                    />
                  
                    <PackageCards
                      v-show="!isLoadingPackages"                     
                      v-for="(cardData, index) in packageData"
                      :key="cardData.sys_id"
                      :cardData="cardData"
                      :index="index"
                      :isLastCard="index === packageData.length - 1"
                      @updateStatus="loadPackageData"
                      @openTOSearchModal="openTOSearchModal"
                    />

                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <div class="_view-all mb-10 bg-white">
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
            </div>


            <div v-if="userHasPortfolios">
              <v-expansion-panels 
                id="PortfoliosAccordion" 
                v-model="portfolioPanel" 
              >
                <v-expansion-panel expand>
                  <v-expansion-panel-title>
                    <div class="d-flex justify-space-between width-100">
                      <div class="h3">
                        Portfolios
                      </div>
                      <div class="h3 text-base-light _item-count pr-4">
                        {{ portfolioCount }} portfolio<span v-if="portfolioCount !== 1">s</span>
                      </div>
                    </div>

                  </v-expansion-panel-title>
                  <v-expansion-panel-text>

                    <PortfoliosSummary 
                      active-tab="ALL" 
                      default-sort="DESCsys_updated_on"
                      :isHomeView="true"
                      @openTOModal="openTOSearchModal"
                    />

                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <div class="_view-all _portfolios bg-white">
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
            </div>

          </v-col>

          <v-col class="pl-5" cols="12" md="5">
            <v-card flat class="pa-6 mb-10 _simple-border">
              <h3 class="text-primary mb-4">Do you already have an awarded task order?</h3>
              <p class="body">
                We’ll gather details about your task order to start provisioning new 
                cloud resources or to continue funding an existing portfolio.
              </p>
              <TaskOrderSearch
                :TONumber="TONumber"
                @update:TONumber="TONumber = $event"
                @startProvisionWorkflow="startProvisionWorkflow"
              />
            </v-card>            

            <v-card flat class="pa-6 mb-10 _simple-border">
              <h3 class="text-primary mb-4">What else could we help you with?</h3>
                <v-btn
                  id="JWCCHelpCenterButton"
                  href="https://community.hacc.mil/s/jwcc/resources"
                  target="_blank" 
                  class="_secondary mb-4 mt-4 width-100 _text-decoration-none"
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
                  class="_secondary mt-4 width-100 _text-decoration-none"
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
                  class="_secondary mt-4 width-100 _text-decoration-none" 
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
import { Component, Vue, toNative } from "vue-facing-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATLoader from "@/components/ATATLoader.vue";
import ATATSearch from "@/components/ATATSearch.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import Packages from "@/packages/Index.vue";
import Card from "@/packages/components/Card.vue";

import TaskOrderSearch from "@/portfolios/components/TaskOrderSearch.vue";

import Portfolios from "../portfolios/Index.vue";
import PortfoliosSummary from "../portfolios/components/PortfoliosSummary.vue"
import { 
  AcquisitionPackageSummaryDTO,
  AcquisitionPackageSummarySearchDTO, 
} from "@/api/models";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import CurrentUserStore from "@/store/user";
import AppSections from "@/store/appSections";

@Component({
  components: {
    ATATAlert,
    ATATLoader,
    ATATSearch,
    "PackageCards": Card,
    PortfoliosSummary,
    ATATSVGIcon,
    //TODO identify error undefined reading `allowedLengths`
    TaskOrderSearch,
  }
})

class ExistingUser extends Vue {
  public packageData:AcquisitionPackageSummaryDTO[] = []
  public isLoadingPackages = true;

  public reportIssueLink = "https://services.disa.mil/sp?id=sc_cat_item&sys_id=20e86845dbaf1914" +
    "8c045e8cd39619d9&sysparm_category=a30a5ca3db12a0508c045e8cd396197c";

  public supportUrl = "https://community.hacc.mil/s/contact?RequestTopic=Account%20Tracking%20" +
    "and%20Automation%20Tool%20%28ATAT%29&RoleType=Customer"
    
  public packagesPanel = 0; // open by default

  public get packageCount(): number {
    return CurrentUserStore.getCurrentUserPackageCount;
  };

  public portfolioPanel = 0; // open by default
  public get portfolioCount(): number {
    return CurrentUserStore.currentUserPortfolioCount;
  }

  public get userHasPackages(): boolean {
    return CurrentUserStore.getUserHasPackages;
  }
  
  public get userHasPortfolios(): boolean {
    return CurrentUserStore.getUserHasPortfolios;
  }

  public TONumber = "";
  public async startProvisionWorkflow(): Promise<void> {
    this.$emit("startProvisionWorkflow");
  }

  public openTOSearchModal(acqPackageSysId: string): void {
    this.$emit("openTOSearchModal", acqPackageSysId);
  }
  
  public startNewAcquisition(): void {
    this.$emit("startNewAcquisition");
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
  
  public async loadPackageData(): Promise<void> {
    this.isLoadingPackages = true;
    const packageData = await AcquisitionPackageSummary
      .searchAcquisitionPackageSummaryList(this.searchDTO);   
    this.packageData = packageData.acquisitionPackageSummaryList;
    this.isLoadingPackages = false;
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
export default toNative(ExistingUser)
</script>
