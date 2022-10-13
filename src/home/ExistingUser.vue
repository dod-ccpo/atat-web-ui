<template>
  <div class="bg-white pt-8 pb-10">
    <div class="container-max-width">

      <v-row>    
        <v-col class="col-sm-12 col-md-7 pr-5">

          <v-expansion-panels flat v-model="portfolioPanel">
            <v-expansion-panel expand>
              <v-expansion-panel-header>
                <div class="d-flex justify-space-between">
                  <div class="h3">
                    Porfolios
                  </div>
                  <div class="h3 text-base-light _item-count pr-4">
                    {{ portfolioCount }} portfolios
                  </div>
                </div>

              </v-expansion-panel-header>
              <v-expansion-panel-content>

                <PortfoliosSummary 
                  active-tab="ALL" 
                  :isHomeView="true" 
                  @totalCount="updateTotalPortfolios"
                />

              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <div class="_view-all">
            <a
              id="ViewAllPortfoliosButton"
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
          <v-card flat class="py-7 mb-10 px-5 _simple-border">
            <h3 class="text-primary mb-4">Do you already have an awarded task order?</h3>
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

          <v-card flat class="py-7 mb-10 px-5 _simple-border">
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

import ATATSearch from "@/components/ATATSearch.vue";
import AppSections from "@/store/appSections";
import Portfolios from "../portfolios/Index.vue";
import PortfoliosSummary from "../portfolios/components/PortfoliosSummary.vue"

@Component({
  components: {
    ATATSearch,
    PortfoliosSummary,
  }
})

export default class ExistingUser extends Vue {
  public startNewAcquisition(): void {
    this.$emit("startNewAcquisition");
  }

  public portfolioPanel = 0; // open by default
  public portfolioCount = 0;

  public updateTotalPortfolios(totalCount: number): void {
    this.portfolioCount = totalCount;
  } 

  public viewAllPortfolios(): void {
    AppSections.setAppContentComponent(Portfolios);
  }

}

</script>