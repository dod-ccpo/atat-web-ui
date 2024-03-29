<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Review your cost estimate summary
        </h1>
        <div class="d-flex mb-4 justify-space-between">
          <span id="IntroP" class="pr-10">
            Based on your estimates for each requirement, we’ve calculated the total
            projected price for each period of your task order. Your completed IGCE
            spreadsheet will have a more detailed breakdown of requirement estimates
            within each period. When you’re done reviewing the summary, click Continue
            and we’ll gather details about how your price estimates were developed.
          </span>
          <v-btn 
            class="_secondary align-self-end" 
            role="link" 
            @click="editRoute" 
            @keydown.enter="editRoute"
            @keydown.space="editRoute">
            View/Edit estimates
          </v-btn>
        </div>  
        <ATATAlert 
          v-if="showAlert" 
          id="ClassificationRequirementsAlert" 
          type="warning" 
          class="copy-max-width my-10">
          <template v-slot:content>
            <span class="h2 font-size-20">Missing price estimate details</span>
            <p class="mb-0">
              Your summary reflects the projected prices that you’ve told us about so far, but
              totals may change after you add this missing info. We recommend going back to
              complete the following price estimates before proceeding:
            </p>
            <ul class="mt-4">
              <li v-if="needsReplicateAndOptimize" class="text-primary">
                <router-link :to="{ name: routes.OptimizeOrReplicate }">
                  Replicate/Optimize your current environment
                </router-link>
              </li>
              <li v-if="needArchitecturalDesign" class="text-primary mt-2">
                <router-link :to="{ name: routes.ArchitecturalDesignSolutions }">
                  Architectural Design Solution pricing
                </router-link>
              </li>
              <li v-if="needPerformanceRequirement" class="text-primary mt-2">
                <router-link :to="{ name: routes.GatherPriceEstimates }">
                  Performance requirement pricing
                </router-link>
              </li>
              <li v-if="needTrainingPricing" class="text-primary mt-2">
                <router-link :to="{ name: routes.IGCETraining }">
                  Training pricing
                </router-link>
              </li>
              <li v-if="needTravelPricing" class="text-primary mt-2">
                <router-link :to="{ name: routes.TravelEstimates }">
                  Travel pricing
                </router-link>
              </li>
              <li v-if="needSurgeCapabilities" class="text-primary mt-2">
                <router-link :to="{ name: routes.SurgeCapabilities }">
                  Surge capabilities
                </router-link>
              </li>
              <li v-if="needContractingOfficeFee" class="text-primary mt-2">
                <router-link :to="{ name: routes.FeeCharged }">
                  Contracting Office Fee
                </router-link>
              </li>
            </ul>
          </template>
        </ATATAlert>
        <div v-if="isLoading" class="d-flex justify-space-around py-15 border1 
              _border-rounded border-base-lighter my-10 bg-offwhite width-100 
              text-center">
          <div class="d-flex align-center" style="margin: 0 auto">
            <v-progress-circular 
              indeterminate 
              color="#544496" 
              size="24" 
              width="3" 
              class="mr-2" />
            <span class="h3">Calculating your total projected costs</span>
          </div>
        </div>
        <v-table 
          v-else 
          id="CostEstimateDataTable" 
          :headers="tableHeaders" 
          :items="tableData" 
          :disable-sort="true"
          :items-per-page="-1" 
          hide-default-footer 
          hide-default-header 
          class="_data-table _has-total-col width-100 my-10"
        >
          <thead>
            <tr>
              <th 
                v-for="(header, idx) in tableHeaders" 
                :key="idx"
                :id="getIdText(header.title)">
                <div :class="[
                  'py-4 d-flex font-size-14',
                  { 'align-left': idx === 0 },
                  { 'justify-end': idx > 0 },
                ]">
                  {{ header.title }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, idx) in tableData"
              :key="idx" 
              class="row-item font-size-14 text-right" :class="[{
                '_subtotal': item.CLINTypeClassAggregate === 'Subtotal'
                  || item.CLINTypeClassAggregate === 'Total with Surge & Ordering Fee'
                  || item.CLINTypeClassAggregate === 'Total with Surge'
                  || item.CLINTypeClassAggregate === 'Total with Ordering Fee',
                '_total': item.CLINTypeClassAggregate === 'Total Price'
                  || item.CLINTypeClassAggregate === 'Grand Total with Fees',
                '_border-bottom': item.isCLINAmount === 'true' ||
                  item.CLINTypeClassAggregate === 'Fees' ||
                  item.CLINTypeClassAggregate === 'Surge and Fees',
              },
              { '_fees-row': isAccordionItem(Boolean(item?.isAccordionItem)) },
              { '_hide': showSurgeAndFees(Boolean(item?.isAccordionItem)) }
              ]"
            >
            <td>
              <div :class="['text-left py-4',
                  {
                    'font-weight-bold text-right':
                      isItemAggregate(item.CLINTypeClassAggregate)
                  },
                  { 'text-right': isFee(item.CLINTypeClassAggregate) },
                  { '_accordion-container': itemNeedsIcon(item.CLINTypeClassAggregate) },
                ]">
                  <v-btn 
                    v-if="itemNeedsIcon(item.CLINTypeClassAggregate)" 
                    icon 
                    @click="toggle()"
                    @keydown.enter="toggle()" @keydown.space="toggle()">
                    <ATATSVGIcon 
                      name="ChevronRight" 
                      class="toggle pb-2" 
                      :class="{ '_rotate-down': showSurgeAndFeeRows }"
                      color="base" :width="7.41" :height="12" />
                  </v-btn>
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
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//TODO: REFACTOR AFTER VUE 3 UPGRADE
// NOTE: more like check that the table works properly, not refactor
// -DP <3

/*eslint prefer-const: 1 */
import ATATAlert from "@/components/ATATAlert.vue";
import { Component, Vue, toNative } from "vue-facing-decorator";

import { getCurrencyString, getIdText } from "@/helpers"
import acquisitionPackage from "@/store/acquisitionPackage";
import { api } from "@/api";
import { CostEstimateDTO } from "@/api/models";
import { routeNames } from "@/router/stepper";
import IGCEStore from "@/store/IGCE";
import Periods from "@/store/periods";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import DescriptionOfWork from "@/store/descriptionOfWork";
import IGCE from "@/store/IGCE";
import { DataTableHeader } from 'types/Global';


export interface IGCECostSummaryItem {
  CLINTypeClassAggregate: string,
  BasePeriod?: string,
  OptionOne?: string,
  OptionTwo?: string,
  OptionThree?: string,
  OptionFour?: string,
  Total?: string,
  isCLINAmount?: string,
  isAccordionItem?: boolean,
}

@Component({
  components: {
    ATATSVGIcon,
    ATATAlert,
  },
})

class CostSummary extends Vue {
  public tableData: IGCECostSummaryItem[] = []
  public costData: CostEstimateDTO = { packageId: "", payload: {} }
  public surgePercentage = "";
  public contractingOfficeFee = "";
  public periodsLength = Periods.periods.length
  public routes = routeNames
  public needsReplicateAndOptimize = false
  public needArchitecturalDesign = false
  public needPerformanceRequirement = false
  public needTrainingPricing = false
  public needTravelPricing = false
  public needSurgeCapabilities = false
  public needContractingOfficeFee = false
  public hasCurrentEnv = false
  public hasArchDesign = false
  public showSurgeAndFeeRows = false
  public orderingAgencyFee = "";
  public isLoading = true;

  public toggle(): void {
    this.showSurgeAndFeeRows = !this.showSurgeAndFeeRows
  }
  public tableHeaders: DataTableHeader[] = [
    { title: "CLIN Type & Classification", value: "CLINTypeClassAggregate" },
  ];

  public getIdText(str: string): string {
    return getIdText(str);
  }

  public get showAlert(): boolean {
    return this.needContractingOfficeFee
      || this.needSurgeCapabilities
      || this.needPerformanceRequirement
      || this.needTravelPricing
      || this.needArchitecturalDesign
      || this.needTrainingPricing
      || this.needsReplicateAndOptimize
  }

  // eslint-disable-next-line max-len
  public createTableData(
    source: Record<string, any>, 
    clinAmount: string,
    rowName: string,
    isAccordionItem = false,
  ) : void {
    let basePeriod, option1, option2, option3, option4
    if (source["Base Period"]) {
      basePeriod = getCurrencyString(source["Base Period"], true)
    }
    if (source["Option 1"] >= 0) {
      option1 = getCurrencyString(source["Option 1"], true)
    } if (source["Option 2"] >= 0) {
      option2 = getCurrencyString(source["Option 2"], true)
    } if (source["Option 3"] >= 0) {
      option3 = getCurrencyString(source["Option 3"], true)
    } if (source["Option 4"] >= 0) {
      option4 = getCurrencyString(source["Option 4"], true)
    }
    //TODO temporary fix for null title
    if (rowName === null || rowName === undefined) {
      rowName = 'Undefined'
    }
    const tableItem = {
      CLINTypeClassAggregate: rowName,
      BasePeriod: basePeriod,
      OptionOne: option1,
      OptionTwo: option2,
      OptionThree: option3,
      OptionFour: option4,
      Total: getCurrencyString(source["Total"], true),
      isCLINAmount: clinAmount,
      isAccordionItem: isAccordionItem
    }
    this.tableData.push(tableItem)
  }
  // eslint-disable-next-line max-len
  public createFeeData(name: string, amount: number, isClinAmount: string, isAccordionItem = false): void {
    const tableObject = {
      CLINTypeClassAggregate: "",
      BasePeriod: "",
      OptionOne: "",
      OptionTwo: "",
      OptionThree: "",
      OptionFour: "",
      Total: amount,
      isCLINAmount: isClinAmount,
    }

    if (name === "ditcoFee") {
      tableObject.CLINTypeClassAggregate = "DITCO Fee (2.25%)"
    }
    if (name === "contractingOffice") {
      tableObject.CLINTypeClassAggregate = this.contractingOfficeFee
    }
    if (name === "grandTotal") {
      tableObject.CLINTypeClassAggregate = "Grand Total with Fees"
    }
    // eslint-disable-next-line max-len
    this.createTableData(tableObject, isClinAmount, tableObject.CLINTypeClassAggregate, isAccordionItem)
  }

  public async findMissingEstimates(): Promise<void> {
    let missingCostEstimates = false
    let hasTraining = false
    IGCEStore.igceEstimateList.forEach(estimate => {
      //eslint-disable-next-line
      const legitVal = !!parseInt(String(estimate.unit_price))
      if (!legitVal) {
        missingCostEstimates = true
      }
    })
    const currentEnvReplicateOrOptimize = CurrentEnvironment.currentEnvironment
      .current_environment_replicated_optimized;
    const archDesign = DescriptionOfWork.DOWArchitectureNeeds.needs_architectural_design_services;
    const dowObject = DescriptionOfWork.DOWObject;
    const travel = DescriptionOfWork.travelSummaryInstances;
    dowObject.forEach(service => {
      if (service.serviceOfferingGroupId === "TRAINING") {
        hasTraining = true
      }
    })
    if (currentEnvReplicateOrOptimize !== "NO"
      && currentEnvReplicateOrOptimize !== "") {
      if (IGCEStore.requirementsCostEstimate?.optimize_replicate.estimated_values.length === 0) {
        this.needsReplicateAndOptimize = true
      } else {
        IGCEStore.requirementsCostEstimate?.optimize_replicate.estimated_values.forEach(value => {
          //eslint-disable-next-line
          const legitVal = !!parseInt(String(value))
          if (!legitVal) {
            this.needsReplicateAndOptimize = true
          }
        })
      }
    }
    if (archDesign === "YES") {
      if (IGCEStore.requirementsCostEstimate?.architectural_design_performance_requirements
        .estimated_values.length === 0) {
        this.needArchitecturalDesign = true

      } else {
        IGCEStore.requirementsCostEstimate?.architectural_design_performance_requirements
          .estimated_values.forEach(value => {
            //eslint-disable-next-line
            const legitVal = !!parseInt(value)
            if (!legitVal) {
              this.needArchitecturalDesign = true
            }
          })
      }
    }
    if (dowObject.length > 0 && missingCostEstimates) {
      this.needPerformanceRequirement = true
    }
    if (hasTraining && IGCEStore.trainingItems) {
      IGCEStore.trainingItems.forEach(item => {
        //eslint-disable-next-line
        const legitVal = !!parseInt(item.estimatedTrainingPrice)
        if (!legitVal) {
          this.needTrainingPricing = true
        }
      })
    }
    if (travel && IGCEStore.requirementsCostEstimate?.travel.estimated_values) {
      const values: string[] =
        Object.values(JSON.parse(IGCEStore.requirementsCostEstimate?.travel.estimated_values))
      if (values.length === 0) {
        this.needTravelPricing = true
      } else {
        values.forEach(value => {
          //eslint-disable-next-line
          const legitVal = !!parseInt(value)
          if (!legitVal) {
            this.needTravelPricing = true
          }
        })
      }
    }
    if (IGCEStore.requirementsCostEstimate?.surge_requirements.capabilities === "YES") {
      const capacity = IGCEStore.requirementsCostEstimate?.surge_requirements.capacity
      //eslint-disable-next-line
      const legitVal = !!parseInt(String(capacity))
      if (!legitVal) {
        this.needSurgeCapabilities = true
      }
    }
    if (IGCEStore.requirementsCostEstimate?.fee_specs.is_charged === "YES") {
      const percentage = IGCEStore.requirementsCostEstimate?.fee_specs.percentage
      //eslint-disable-next-line
      const legitVal = !!parseInt(String(percentage))
      if (!legitVal) {
        this.needContractingOfficeFee = true
      }
    }
  }

  public async loadOnEnter(): Promise<void> {
    const headers = [
      { title: "Base Period", value: "BasePeriod" },
      { title: "Option 1", value: "OptionOne" },
      { title: "Option 2", value: "OptionTwo" },
      { title: "Option 3", value: "OptionThree" },
      { title: "Option 4", value: "OptionFour" },
    ]
    this.isLoading = false;
    for (let i = 0; i < this.periodsLength; i++) {
      this.tableHeaders.push(headers[i])
    }
    this.hasCurrentEnv = CurrentEnvironment.currentEnvironment.current_environment_exists === "YES"
    this.hasArchDesign = DescriptionOfWork.DOWArchitectureNeeds
      .needs_architectural_design_services === "YES"

    this.tableHeaders.push({ title: "Total", value: "Total" })
    this.costData.payload.data.forEach((CLIN: Record<string, any>) => {
      this.createTableData(CLIN, "true", CLIN["CLIN Type & Classification"])
    })
    const subTotalData = this.costData.payload.subtotal
    const surgeData = this.costData.payload.surge
    const externalOrderingFee = this.costData.payload.external_ordering_agency_fee
    const totalWithSurge = this.costData.payload.total_price
    const totalWithSurgeAndOrdering = this.costData.payload.total_with_surge_and_ordering_fee
    const ditcoFee = this.costData.payload.ditco_fee
    const contractingFee = this.costData.payload.other_contracting_office_fee
    const grandTotal = this.costData.payload.grand_total_with_fee

    if (surgeData) {
      this.createTableData(subTotalData, "false", "Subtotal")
    }
    if (surgeData) {
      this.createTableData(subTotalData, "false", "Surge and Fees")
    } else {
      this.createTableData(subTotalData, "false", "Fees")
    }
    if (surgeData) {
      this.createTableData(surgeData, "false", this.surgePercentage, true)
    }
    if (surgeData && totalWithSurge) {
      this.createTableData(totalWithSurge, "false", "Total with Surge", true)
    }
    if (externalOrderingFee) {
      this.createTableData(externalOrderingFee, "false", this.orderingAgencyFee, true)
    }
    if (totalWithSurgeAndOrdering && surgeData) {
      // eslint-disable-next-line max-len
      this.createTableData(totalWithSurgeAndOrdering, "false", "Total with Surge & Ordering Fee", true)
    } else if (totalWithSurgeAndOrdering && !surgeData) {
      this.createTableData(totalWithSurgeAndOrdering, "false", "Total with Ordering Fee", true)
    }
    if (ditcoFee) {
      this.createFeeData("ditcoFee", ditcoFee.Total, "false", true)
    } else if (contractingFee) {
      this.createFeeData("contractingOffice", contractingFee.Total, "false", true)
    }

    if (ditcoFee || contractingFee) {
      this.createFeeData("grandTotal", grandTotal.Total, "false")
    }
    await this.findMissingEstimates()
  }
  public editRoute(): void {
    let name = routeNames.GatherPriceEstimates
    if (this.hasCurrentEnv) {
      name = routeNames.OptimizeOrReplicate
    }
    else if (this.hasArchDesign) {
      name = routeNames.ArchitecturalDesignSolutions
    }
    this.$router.push({
      name: name,
      query: {
        direction: "next"
      }
    });
  }

  public async mounted(): Promise<void> {
    this.isLoading = true;
    this.costData = await api.costEstimateTable.search(acquisitionPackage.packageId)
    IGCE.doSetCostEstimateTotals({
      base: this.costData.payload.subtotal["Base Period"],
      grand: this.costData.payload.grand_total_with_fee["Total"]
    })
    this.surgePercentage =
      `Surge (${IGCEStore.requirementsCostEstimate?.surge_requirements.capacity}%)`
    this.contractingOfficeFee =
      IGCEStore.requirementsCostEstimate?.fee_specs.percentage === null
        ? `Contracting Office Fee (0%)`
        : `Contracting Office Fee (
          ${IGCEStore.requirementsCostEstimate?.fee_specs.percentage}%
        )`
    this.orderingAgencyFee = `External Ordering Agency Fee (1%)`
    await this.loadOnEnter()
  }

  public isItemAggregate(label: string): boolean {
    return ['total', 'fees'].some((itm) => label.toLowerCase().indexOf(itm) > -1)
  }
  public itemNeedsIcon(label: string): boolean {
    if (label === 'Grand Total with Fees') return false
    return ['Surge and Fees', 'fees'].some((itm) => label.toLowerCase().indexOf(itm) > -1)
  }
  public isFee(label: string): boolean {
    return ['%'].some((itm) => label.toLowerCase().indexOf(itm) > -1)
  }
  public isAccordionItem(accordionItem: boolean): boolean {
    return accordionItem
  }
  public showSurgeAndFees(isFee: boolean): boolean {
    return !this.showSurgeAndFeeRows && isFee
  }


}

export default toNative(CostSummary)
</script>

