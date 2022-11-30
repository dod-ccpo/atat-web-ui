<template>
  <div class="pt-8 pb-10">
    <section class="_learn-more-section bg-white _py-80">
      <div class="container-max-width">

        <v-row>    
          <v-col class="col-sm-12 col-md-7 pr-5">

            <v-expansion-panels id="PackagesAccordion" flat v-model="packagesPanel">
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
                    :key="index"
                    :cardData="cardData"
                    :index="index"
                    :isLastCard="index === packageData.length - 1"
                  />

                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <div class="_view-all mb-10">
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

          </v-col>

          <v-col class="col-sm-12 col-md-5 pl-5">
            <ATATAlert
              type="info"
            >
              <template slot="content">
                Provisioning of cloud resources is not available at this time. In the coming 
                weeks, you will be able to add an awarded JWCC task order, and ATAT will 
                create accounts and environments within your CSP portal.
              </template>
            </ATATAlert>
            <br/>

            <v-card flat class="pa-6 mb-10 _simple-border">
              <h3 class="text-primary mb-4">What else could we help you with?</h3>
              <v-btn
                id="JWCCHelpCenterButton"
                class="secondary mb-4 mt-4 width-100"
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
                class="secondary mt-4 width-100"
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
                id="ReportIssueButton"
                class="secondary mt-4 width-100" 
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
import { Component } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATSearch from "@/components/ATATSearch.vue";
import AppSections from "@/store/appSections";

import Packages from "@/packages/Index.vue";
import Card from "@/packages/components/Card.vue";

import Portfolios from "../portfolios/Index.vue";
import PortfoliosSummary from "../portfolios/components/PortfoliosSummary.vue"
import { 
  AcquisitionPackageSummaryDTO,
  AcquisitionPackageSummarySearchDTO, 
} from "@/api/models";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATAlert,
    ATATSearch,
    "PackageCards": Card,
    PortfoliosSummary,
    ATATSVGIcon
  }
})

export default class ExistingUser extends Vue {

  public packageData:AcquisitionPackageSummaryDTO[] = []
  public draftPackageCount = 0;

  public packagesPanel = 0; // open by default
  public packageCount = 0;

  public portfolioPanel = 0; // open by default
  public portfolioCount = 0;

  public get showAlert(): boolean {
    return this.draftPackageCount > 0
  }

  public startNewAcquisition(): void {
    this.$emit("startNewAcquisition");
  }

  public updateTotalPortfolios(totalCount: number): void {
    this.portfolioCount = totalCount;
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

  public async loadOnEnter(): Promise<void>{
    try {
      const packageData = await AcquisitionPackageSummary
        .searchAcquisitionPackageSummaryList(this.searchDTO);
      
      this.packageData = packageData.acquisitionPackageSummaryList;
      this.packageCount = this.packageData.length;
      const draftPackages = this.packageData.filter(obj => obj.package_status?.value === "DRAFT");
      this.draftPackageCount = draftPackages?.length || 0;
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