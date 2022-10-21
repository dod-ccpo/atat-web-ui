<template>
  <div class="pt-8 pb-10">
    <div class="container-max-width">

      <v-row>    
        <v-col class="col-sm-12 col-md-7 pr-5">

          <ATATAlert 
            v-if="showAlert"
            type="warning"
            :closeButton="true"
            class="mb-10"
          >
            <template slot="content">
              You have {{ draftPackageCount }} 
              draft<span v-if="draftPackageCount !== 1">s</span>
              in progress.
            </template>

          </ATATAlert>

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
              View all open packages
            </a>
          </div>


          <v-expansion-panels id="PortfoliosAccordion" flat v-model="portfolioPanel">
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

        </v-col>

        <v-col class="col-sm-12 col-md-5 pl-5">
          <v-card flat class="pa-6 mb-10 _simple-border">
            <h3 class="text-primary mb-2">Do you already have an awarded task order?</h3>
            <p>
              Provide a few details about your awarded task order and we’ll import 
              your info to provision your cloud resources.
            </p>
            <ATATSearch 
              buttonText="Search"
              placeHolder="Search Task Order Number"
              class="d-inline-block"
              width="auto"
              wrapperWidth="100%"
            />
          </v-card>

          <v-card flat class="pa-6 mb-10 _simple-border">
            <h3 class="text-primary mb-4">What else could we help you with?</h3>
            <v-btn
              id="StartNewAcquisitionButton"
              class="primary mb-4 mt-4 width-100"
              @click="startNewAcquisition"
              @keydown.enter="startNewAcquisition"
              @keydown.space="startNewAcquisition"
            >
              Start your new acquisition package
            </v-btn>
            <v-btn
              id="StartNewAcquisitionButton"
              class="secondary mt-4 width-100"
            >
              Create a new portfolio
            </v-btn>

          </v-card>

        </v-col>
      </v-row>
      
    </div>
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

@Component({
  components: {
    ATATAlert,
    ATATSearch,
    "PackageCards": Card,
    PortfoliosSummary,
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

  private async loadOnEnter(){
    const packageData = await AcquisitionPackageSummary
      .searchAcquisitionPackageSummaryList(this.searchDTO);
    this.packageData = packageData.acquisitionPackageSummaryList;

    this.packageCount = this.packageData.length;
    const draftPackages = this.packageData.filter(obj => obj.package_status?.value === "DRAFT");
    this.draftPackageCount = draftPackages?.length || 0;
  }

  public mounted():void{
    this.loadOnEnter();
  }

}

</script>