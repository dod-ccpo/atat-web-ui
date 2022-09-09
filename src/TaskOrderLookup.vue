<template>
  <div class="pa-5">
    <v-main>
      <ATATPageHead :headline="projectTitle"/>
        <v-container class="container-max-width">
          <v-row>
            <v-col>      
              <div class="v-main__wrap">
                <div id="app-content" class="d-flex flex-column">
                  <div class="mb-auto" style="padding-bottom: 200px;">
                    <v-row class="">
                      <v-col class="col-12">
                        <h1 class="page-header mb-3">
                          Import funding details for your awarded Task Order
                        </h1>
                        <div class="copy-max-width">
                          <p class="mb-10">
                            Please verify a few details about your awarded task order and we will 
                            import the CLIN funding info from Electronic Data Access (EDA).
                          </p>
                          <ATATSearch
                            id="TaskOrderNumber"
                            helpText="Format: Must be either 13 or 17 digits"
                            label="Task Order Number"
                            placeHolder="Find your task order in EDA"
                            :tooltipText="toolTipText"
                            searchType="EDA"
                            :hideHelpTextOnError="true"
                            :validate-on-blur="true"
                            :value.sync="taskOrder"
                            :rules="[
                              $validators.required('Please enter your awarded task order number.'),
                              $validators.isMaskValid(
                                ['^([0-9A-Z]{13})([0-9A-Z]{4})?$'],
                                `Your task order number must be either 13 or 17 characters.`,
                                true
                              )
                            ]"
                          />
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              <ATATFooter/>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">

import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATFooter from "./components/ATATFooter.vue";
import ATATPageHead from "./components/ATATPageHead.vue";
import ATATSearch from "@/components/ATATSearch.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATSearch,
    ATATFooter,
    ATATPageHead
  }
})

export default class TaskOrderLookup extends Vue {
  private toolTipText = `<p class="mb-1">This is a 13-character value for new task orders, or
    a 17-character value for task order modifications.</p>
    <p class="mb-1">If your Contracting Office used:</p>
    <ul>
      <li class="pb-1">Form 1149: Enter the “Order Number”</li>
        <li>Form 1155: Enter the “Delivery Order/Call No."</li>
    </ul>`;
  private taskOrder = '';

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }
}
</script>
