<template>
  <v-container class="container-max-width" fluid>
    <v-row v-if="PoPUnder9Months">
      <v-col class="col-12">
        <h1 class="page-header">
          Based on your period of performance, this effort does not qualify for an incremental
          funding plan.
        </h1>

        <ATATAlert
          id="PoPUnder9Months"
          :showIcon="false"
          class="copy-max-width my-10"
          type="callout"
        >
          <template v-slot:content>
            <h2>Why can’t I request to incrementally fund my task order?</h2>
            <p class="mt-2">
              An incremental funding plan provides the contracting office with assurance that
              funds have been budgeted and will be available to fully fund all non-optional
              services on a projected schedule.
            </p>
            <p>
              To incrementally fund a task order, the period of performance must be at least 9
              months. Based on what you previously told us, this contracting effort requires a
              base period of {{ basePeriod }}s.
            </p>
            <p class="mb-0">
              If you would like to request incremental funding, please revisit the Contract
              Details section to
              <router-link
                id="LinkToPoP"
                :to="{name: routeNames.PeriodOfPerformance}"
              >
                update your period of performance.
              </router-link>
            </p>
          </template>
        </ATATAlert>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Are you requesting to incrementally fund this requirement?
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            To request incremental funding, your requirement must be severable in nature. This means
            that it can be divided and apportioned into two or more parts that are not necessarily
            dependent upon each other. If you select "Yes" below, we will help you generate a
            projected schedule for your incremental funding.
          </p>
          <ATATRadioGroup
            id="IncrementallyFundOptions"
            :card="true"
            :items="incrementallyFundOptions"
            :rules="[$validators.required('Please select an option')]"
            :value.sync="selectedFundOption"
            class="copy-max-width mb-5 max-width-640"
          />
          <ATATExpandableLink aria-id="IFPFAQ1">
            <template v-slot:header>
              How do I know if my requirement is severable?
            </template>
            <template v-slot:content>
              <p class="mb-4">
                Severable services are continuing and recurring in nature (e.g., systems development
                support provided on a level-of-effort basis, help-desk support, maintenance). 
                "Severable" means tasks can be separated into components that independently meet a 
                separate and on-going need of the government.
              </p>
              <p>
                U.S. Government Accountability Office (GAO) considers services to be non-severable
                when they constitute an entire job or single undertaking with a defined end-product
                that cannot feasibly be subdivided for separate performance in each fiscal year.
                GAO's Principles of Federal Appropriations Law presents a contract to conduct a
                study and prepare a final report as an example of non-severable services and
                concludes that non-severable services must be funded entirely out of the
                appropriation current at the time of award, notwithstanding that performance may
                extend into future fiscal years. Following that logic, GAO has further determined
                that contracts for non-severable services cannot be incrementally funded.
              </p>
            </template>
          </ATATExpandableLink>
          <ATATExpandableLink aria-id="IFPFAQ2">
            <template v-slot:header>
              How does this affect my acquisition package?
            </template>
            <template v-slot:content>
              <p class="pb-2">
                If you want to incrementally fund this requirement, your final acquisition package
                must include a <strong>Certification of Severability and Incremental Funding
                Plan</strong>.
              </p>
              <p class="pb-2">
                The purpose of this document is to provide the Contracting Office 
                with the following:
              </p>
              <ol>
                <li class="pb-2">
                  Written certification that the requirement is severable in nature
                </li>
                <li class="pb-2">
                  A projected schedule for fully funding any contract line items that are not
                  optional in nature, regardless of contract type
                </li>
                <li class="pb-2">
                  A projected schedule for fully funding firm-fixed-price contract line items in
                  order to populate 
                  
                  <a
      href="https://www.acquisition.gov/dfars/252.232-7007-limitation-ofgovernments-obligation."
                  target="_blank"
                  class="_text-link"
                  id="limitationOfGovernmentsObligationLink"
                >
                  <span class="_external-link">DFARS clause 252.232-7007, Limitation of Government’s
                  Obligation</span>
                </a>
                  
                </li>
                <li class="pb-2">
                  Assurance that funds have been budgeted and will be available to
                  fully fund contract line items that are not optional in nature.
                </li>
              </ol>
            </template>
          </ATATExpandableLink>
        </div>

        <!-- TODO - ADD ALERT BACK IN WHEN IGCE IMPLEMENTED FULLY -->
        
        <!-- <div v-if="showAlert()">
          <ATATAlert
            id="IFPRequestPageAlert"
            class="container-max-width my-10"
            type="warning"
          >
            <template v-slot:content>
              <div v-if="isPeriodsDataMissing || isCostEstimateMissing">
                <h3 class="h3">Your
                  <span v-if="isOnlyPoPyMissing">
                    period of performance is
                  </span>
                  <span v-else-if="isOnlyCostEstimateMissing">
                    requirements cost estimate is
                  </span>
                  <span v-else-if="isPoPAndCostEstimateMissing">
                    period of performance and requirements cost estimate are
                  </span>
                  missing.
                </h3>
                <p id="AlertInfo" class="mt-2 mb-0">
                  We will not be able to create your incremental funding plan until we have this
                  missing info. We recommend
                  <span v-if="isPeriodsDataMissing">updating your </span>
                  <span v-else>completing the </span>
                  <span v-if="isPoPAndCostEstimateMissing">
                    <router-link
                      id="PoPLink"
                      :to="{name: routeNames.PeriodOfPerformance}"
                    >Period of Performance section</router-link>
                    and the
                    <router-link
                      id="CostEstimateLink"
                      :to="{name: routeNames.RequirementsCostForm}"
                    >Requirements Cost Estimate section</router-link>
                  </span>
                  <span v-else-if="isOnlyCostEstimateMissing || isOnlyPoPyMissing ">
                    <router-link
                      id="AlertLink"
                      :to="{name: route}"
                    >{{ linkText }}</router-link>
                  </span>
                  before proceeding.
                </p>
              </div>
            </template>
          </ATATAlert> 
        </div>-->
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">

import { Component, Mixins, Watch } from "vue-property-decorator";
import { RadioButton } from "../../../types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import Periods from "@/store/periods";
import FinancialDetails from "@/store/financialDetails";
import { routeNames } from "@/router/stepper";
import SaveOnLeave from "@/mixins/saveOnLeave";
import TaskOrder from "@/store/taskOrder";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { PeriodDTO } from "@/api/models";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ATATRadioGroup,
    ATATExpandableLink,
    ATATAlert,
  }
})

export default class SeverabilityAndIncrementalFunding extends Mixins(SaveOnLeave) {
  private selectedFundOption = "";
  private savedFundOption = "";
  private isPeriodsDataMissing = false;
  private isCostEstimateMissing = false;
  private routeNames = routeNames;
  private base: PeriodDTO = {
    /* eslint-disable camelcase */
    period_unit: "",
    period_unit_count: "",
    period_type: "",
    option_order: "",
  };
  private incrementallyFundOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes. I need to provide an incremental funding plan.",
      value: "YES",
    },
    {
      id: "No",
      label: "No. This requirement will be funded entirely up-front.",
      value: "NO",
    },
  ];

  public get isPoPAndCostEstimateMissing(): boolean {
    return this.isCostEstimateMissing && this.isPeriodsDataMissing;
  }

  public get isOnlyPoPyMissing(): boolean {
    return !this.isCostEstimateMissing && this.isPeriodsDataMissing;
  }

  public get isOnlyCostEstimateMissing(): boolean {
    return this.isCostEstimateMissing && !this.isPeriodsDataMissing;
  }

  public get route(): string {
    return this.isOnlyCostEstimateMissing
      ? this.routeNames.RequirementsCostForm
      : this.routeNames.PeriodOfPerformance;
  }

  public get linkText(): string {
    return this.isOnlyCostEstimateMissing
      ? "Requirements Cost Estimate section"
      : "Contract Details section";
  }

  public get PoPUnder9Months(): boolean {
    return AcquisitionPackage.totalBasePoPDuration < 270 
      && AcquisitionPackage.totalBasePoPDuration > 0;
  }

  public get basePeriod(): string {
    const hasBasePeriod = this.base && this.base.period_unit_count && this.base.period_unit;
    return hasBasePeriod
      ? `${this.base.period_unit_count} ${this.base.period_unit.toLowerCase()}`
      : ""
  }

  public async loadOnEnter(): Promise<void> {
    const periods = await Periods.loadPeriods();
    this.isPeriodsDataMissing = (periods && periods.length === 0);
    const estimatedTOValue = await FinancialDetails.getEstimatedTaskOrderValue();
    this.isCostEstimateMissing = !estimatedTOValue;
    await FinancialDetails.loadFundingRequirement();
    const fundingReq = await FinancialDetails.getFundingRequirement();
    this.savedFundOption = fundingReq?.incrementally_funded as string;
    this.selectedFundOption = this.savedFundOption;
    this.base = periods[0];
  }

  public async mounted(): Promise<void> {  
    await this.loadOnEnter();
  }

  private hasChanged(): boolean {
    const current = this.selectedFundOption.length > 0 ? this.selectedFundOption : "";
    return hasChanges(current, this.savedFundOption);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await FinancialDetails.setIsIncrementallyFunded(this.selectedFundOption);
        await FinancialDetails.saveFundingRequirement();
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }



  @Watch("selectedFundOption")
  protected showAlert(): boolean {
    return this.selectedFundOption === "YES"
      && (this.isPeriodsDataMissing || this.isCostEstimateMissing)
  }
}
</script>

