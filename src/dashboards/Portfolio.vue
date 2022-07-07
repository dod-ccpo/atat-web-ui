<template>
  <v-main class="_dashboard">
    <ATATPageHead :headline="projectTitle"  />
    <v-container class="container-max-width">
      <v-row>
        <v-col>

          <div id="app-content" class="d-flex flex-column">
            <div class="mb-auto" style="padding-bottom: 200px;">
              
              <div class="d-flex justify-space-between width-100">
                <h2>Overview</h2>
                <span class="text-base-dark">Last Sync: Nov. 15, 0100</span> 
              </div>

            </div>
            <ATATFooter/>
          </div>

        </v-col>
      </v-row>
    </v-container>
  </v-main>

</template>

<script lang="ts">

import Vue from "vue";
import { Component } from "vue-property-decorator";
import {PortfolioDashBoardService} from "@/services/portfolioDashBoard";

import ATATFooter from "../components/ATATFooter.vue";
import ATATPageHead from "../components/ATATPageHead.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATFooter,
    ATATPageHead
  }
})

export default class PortfolioDashboard extends Vue {

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }

  portFolioDashBoardService: PortfolioDashBoardService = new PortfolioDashBoardService();

  public async mounted(): Promise<void>{
    const data = await this.portFolioDashBoardService.getdata('1000000001234');
    // for testing, console log returned data
    console.log({data});
  }

}

</script>
