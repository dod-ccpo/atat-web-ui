<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
           Review your cost estimate summary
        </h1>
         <div class="copy-max-width d-flex mb-4">
            <p id="IntroP" class="mb-10">
              Based on your estimates for each requirement, we’ve calculated the total 
              projected price for each period of your task order. Your completed IGCE 
              spreadsheet will have a more detailed breakdown of requirement estimates 
              within each period. When you’re done reviewing the summary, click Continue 
              and we’ll gather details about how your price estimates were developed.
            </p>
           <v-btn
             class="secondary align-self-end"
             role="link"
             @click="toRequirementsCostEstimates"
             @keydown.enter="toRequirementsCostEstimates"
             @keydown.space="toRequirementsCostEstimates">
             View/Edit estimates
           </v-btn>
          </div>
<!--          <ATATAlert-->
<!--            id="ClassificationRequirementsAlert"-->
<!--            type="warning"-->
<!--            class="copy-max-width my-10"-->
<!--          >-->
<!--            <template v-slot:content>-->
<!--              <span class="h2 font-size-20">Missing price estimate details</span>-->
<!--              <p class="mb-0">-->
<!--                Your summary reflects the projected prices that you’ve told us about so far,
                     but-->
<!--                totals may change after you add this missing info. We recommend going back to-->
<!--                complete your price estimates before proceeding.-->
<!--              </p>-->
<!--            </template>-->
<!--          </ATATAlert>-->
            <v-data-table
              id="CostEstimateDataTable"
              :headers="tableHeaders"
              :items="tableData"
              :disable-sort="true"
              :items-per-page="-1"
              hide-default-footer
              hide-default-header
              class="_data-table _has-total-col"
            >

              <template v-slot:header="{ props }">
                <tr>
                  <th 
                    v-for="(header,hdrIdx) in props.headers" 
                    :key="hdrIdx"
                    :id="getIdText(header.text)"
                  >
                    <div 
                      :class="[
                        'py-4 d-flex font-size-14',
                        {'align-left': hdrIdx === 0},
                        {'justify-end': hdrIdx > 0},
                        
                      ] ">
                    {{ header.text }}
                    </div>
                  </th>
                </tr>
              </template>


              <template v-slot:body="props">
                <tr v-for="(item,rowIdx) in props.items" :key="rowIdx"
                  class="row-item font-size-14 text-right"
                  :class="[{ 
                    '_subtotal' : item.CLINTypeClassAggregate === 'Subtotal',
                    '_total' : item.CLINTypeClassAggregate === 'Total Price' ||
                    item.CLINTypeClassAggregate === 'Grand Total with Fee',
                    '_border-bottom' : item.isCLINAmount === 'true',
                  }]"
                >
                  <td>
                    <div :class="[
                      'text-left py-4',
                      {'font-weight-bold text-right': 
                        isItemAggregate(item.CLINTypeClassAggregate)},
                        { 'text-right': isFee(item.CLINTypeClassAggregate)}
                      ]"
                    >
                      {{ item.CLINTypeClassAggregate }}
                    </div>
                  </td>
                   <td>
                    <div>{{ item.BasePeriod }}</div>
                  </td>
                  <td v-if="periodsLength > 1">
                    <div>{{ item.OptionOne }}</div>
                  </td>
                  <td v-if="periodsLength > 2">
                    <div>{{ item.OptionTwo }}</div>
                  </td>
                  <td v-if="periodsLength > 3">
                    <div>{{ item.OptionThree }}</div>
                  </td>
                  <td v-if="periodsLength > 4">
                    <div>{{ item.OptionFour }}</div>
                  </td>
                  <td>
                    <div>{{ item.Total }}</div>
                  </td>
                </tr>
                <tr>

                </tr>
              </template>
            </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";
import ATATAlert from "@/components/ATATAlert.vue";
import { Component } from "vue-property-decorator";

import { getCurrencyString, getIdText, toCurrencyString } from "@/helpers"
import acquisitionPackage from "@/store/acquisitionPackage";
import { api } from "@/api";
import { CostEstimateDTO } from "@/api/models";
import { routeNames } from "@/router/stepper";
import IGCEStore from "@/store/IGCE";
import Periods from "@/store/periods";


export interface IGCECostSummaryItem {
    CLINTypeClassAggregate:string,
    BasePeriod?: string,
    OptionOne?: string,
    OptionTwo?: string,
    OptionThree?: string,
    OptionFour?: string,
    Total?: string,
    isCLINAmount?: string,
}

@Component({
  components: {
    ATATAlert,
  },
})

export default class CostSummary extends Vue {
  public tableData: IGCECostSummaryItem[] = []
  public costData: CostEstimateDTO = {packageId:"",payload:{}}
  public surgePercentage = "";
  public contractingOfficeFee = "";
  public periodsLength = Periods.periods.length

  public tableHeaders = [
    { text: "CLIN Type & Classification", value: "CLINTypeClassAggregate"},

  ];

  public getIdText(str: string): string {
    return getIdText(str);
  }

  public async toRequirementsCostEstimates(): Promise<void> {
    this.$nextTick(()=>{
      this.$router.push({
        name: routeNames.GatherPriceEstimates,
        params: {
          direction: "next"
        }
      });
    })
  }

  public createTableData(source:Record<string, any>, clinAmount:string,rowName:string):void{
    let basePeriod,option1,option2,option3,option4
    if(source["Base Period"]){
      basePeriod = getCurrencyString(source["Base Period"],true)
    }
    if(source["Option 1"]){
      option1 = getCurrencyString(source["Option 1"],true)
    }if(source["Option 2"]){
      option2 = getCurrencyString(source["Option 2"],true)
    }if(source["Option 3"]){
      option3 = getCurrencyString(source["Option 3"],true)
    }if(source["Option 4"]){
      option4 = getCurrencyString(source["Option 4"],true)
    }
    const tableItem = {
      CLINTypeClassAggregate: rowName,
      BasePeriod: basePeriod,
      OptionOne:option1,
      OptionTwo:option2,
      OptionThree:option3,
      OptionFour:option4,
      Total:getCurrencyString(source["Total"],true),
      isCLINAmount: clinAmount
    }
    this.tableData.push(tableItem)
  }
  public createFeeData(name:string, amount:number, isClinAmount:string):void{
    const tableObject = {
      CLINTypeClassAggregate: "",
      BasePeriod:"",
      OptionOne: "",
      OptionTwo:"",
      OptionThree:"",
      OptionFour:"",
      Total:amount,
      isCLINAmount: isClinAmount
    }

    if(name === "ditcoFee"){
      tableObject.CLINTypeClassAggregate = "DITCO Fee (2.25%)"
    }
    if(name === "contractingOffice"){
      tableObject.CLINTypeClassAggregate = this.contractingOfficeFee
    }
    if(name === "grandTotal"){
      tableObject.CLINTypeClassAggregate = "Grand Total with Fee"
    }
    this.createTableData(tableObject, isClinAmount,tableObject.CLINTypeClassAggregate)
  }

  public async loadOnEnter(): Promise<void> {
    const headers = [
      { text: "Base Period", value: "BasePeriod"},
      { text: "Option 1", value: "OptionOne"},
      { text: "Option 2", value: "OptionTwo"},
      { text: "Option 3", value: "OptionThree"},
      { text: "Option 4", value: "OptionFour"},
    ]
    for(let i = 0; i < this.periodsLength ; i++){
      this.tableHeaders.push(headers[i])
    }

    this.tableHeaders.push({ text: "Total", value: "Total"})
    this.costData.payload.data.forEach((CLIN:Record<string, any>) => {
      this.createTableData(CLIN,"true",CLIN["CLIN Type & Classification"])
    })
    const subTotalData = this.costData.payload.subtotal
    const totalData = this.costData.payload.total_price
    const surgeData = this.costData.payload.surge
    const ditcoFee = this.costData.payload.ditco_fee
    const contratingFee = this.costData.payload.contracting_office_fee
    const grandTotal = this.costData.payload.grand_total_with_fee
    if(surgeData){
      this.createTableData(subTotalData,"false","Subtotal")
    }
    if(surgeData){
      this.createTableData(surgeData,"false",this.surgePercentage)
    }
    this.createTableData(totalData,"false", "Total Price")
    if(ditcoFee){
      this.createFeeData("ditcoFee",ditcoFee,"false")
    }else if(contratingFee){
      this.createFeeData("contractingOffice",contratingFee,"false")
    }
    if(ditcoFee || contratingFee){
      this.createFeeData("grandTotal", grandTotal, "false")
    }
    // this.createTableData(ditcoFee,"false","Ditco FEE")
  }

  public async mounted(): Promise<void> {
    this.costData = await api.costEstimateTable.search(acquisitionPackage.packageId)
    this.surgePercentage =
      `${IGCEStore.requirementsCostEstimate?.surge_requirements.capacity}% Surge`
    this.contractingOfficeFee =
      `Contracting Office Fee (${IGCEStore.requirementsCostEstimate?.fee_specs.percentage}%)`
    await this.loadOnEnter()
  }

  public isItemAggregate(label: string): boolean {
    return ['total'].some((itm)=> label.toLowerCase().indexOf(itm)>-1)
  }
  public isFee(label: string): boolean {
    return ['%'].some((itm)=> label.toLowerCase().indexOf(itm)>-1)
  }


}
</script>

