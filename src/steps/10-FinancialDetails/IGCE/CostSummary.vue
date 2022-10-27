<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
           Review your cost estimate summary
        </h1>
         <div class="copy-max-width">
            <p id="IntroP" class="mb-10">
              Based on your estimates for each requirement, we’ve calculated the total 
              projected price for each period of your task order. Your completed IGCE 
              spreadsheet will have a more detailed breakdown of requirement estimates 
              within each period. When you’re done reviewing the summary, click Continue 
              and we’ll gather details about how your price estimates were developed.
            </p>
          </div>
          <ATATAlert
            id="ClassificationRequirementsAlert"
            type="warning"
            class="copy-max-width my-10"
          >
            <template v-slot:content>
              <span class="h2 font-size-20">Missing price estimate details</span>
              <p class="mb-0">
                Your summary reflects the projected prices that you’ve told us about so far, but 
                totals may change after you add this missing info. We recommend going back to 
                complete your price estimates before proceeding.
              </p>
            </template>
          </ATATAlert>
            <v-data-table
              id="CostEstimateDataTable"
              :headers="tableHeaders"
              :items="tableData"
              :disable-sort="true"
              :items-per-page="-1"
              hide-default-footer
              class="_clin-table"
            >
                <template v-slot:header="headers">
                <tr>
                  <th v-for="(header,hdrIdx) in headers.items" :key="hdrIdx">
                    <div 
                      :class="[
                        'py-4 d-flex font-size-14',
                        {'align-left pl-6': hdrIdx===0},
                        {'justify-end': hdrIdx > 0},
                        
                      ], ">
                    {{ header }}
                    </div>
                  </th>
                </tr>
              </template>
              <template v-slot:body="props">
                <tr v-for="(item,rowIdx) in props.items" :key="rowIdx"
                    class="row-item border-base-lighter"
                    style="border-bottom: 1px solid">
                  <td v-for="(item,cellIdx) in props.items[rowIdx]" :key="cellIdx">
                    <div 
                      :class="[
                        'py-4 d-flex font-size-14',
                        {'align-left pl-6': cellIdx===0},
                        {'justify-end': cellIdx > 0},
                        
                      ], ">
                    {{ item }}
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import ATATAlert from "@/components/ATATAlert.vue";
import { Component } from "vue-property-decorator";
@Component({
  components: {
    ATATAlert,
  },
})
export default class CostSummary extends Vue {
public tableHeaders = [

  { text: "CLIN Type & Classification"},
  { text: "Base Period"},
  { text: "Option 1"},
  { text: "Option 2"},
  { text: "Option 3"},
  { text: "Option 4"},
  { text: "Total"},
]

public tableData = [
  [
    "Cloud UNCLASSIFIED",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$5,000.00",
  ],
  [
    "Cloud Support UNCLASSIFIED",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$5,000.00",
  ],
  [
    "Cloud SECRET",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$5,000.00",
  ],
  [
    "Cloud Support SECRET",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$5,000.00",
  ],
  [
    "Cloud Support Travel",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$1,000.00",
    "$5,000.00",
  ], 
  [
    "External ordering agency fee (1%)",
    "$50.00",
    "$50.00",
    "$50.00",
    "$50.00",
    "$50.00",
    "$250.00",
  ],
  [
    "Subtotal",
    "$5,050.00",
    "$5,050.00",
    "$5,050.00",
    "$5,050.00",
    "$5,050.00",
    "$25,250.00",
  ],
  [
    "5% Surge",
    "$252.50",
    "$252.50",
    "$252.50",
    "$252.50",
    "$252.50",
    "$1,262.50",
  ],
  [
    "Total Price",
    "$5,302.50",
    "$5,302.50",
    "$5,302.50",
    "$5,302.50",
    "$5,302.50",
    "$26,512.50",
  ]

]

}
</script>

