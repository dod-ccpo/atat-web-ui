<template>
  <v-form ref="form" lazy-validation>
    <div>
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header mb-3">
              Will this be a recurring requirement?
            </h1>
            <div class="copy-max-width">
              <p class="mb-7">
                DISA has developed a tracking system for expiring contracts. Responding “YES” 
                below will enable DITCO to notify you of expiring contracts in sufficient time 
                to prepare your follow-on acquisition package.
              </p>
              <ATATRadioGroup
                class="copy-max-width mb-n6 max-width-740"
                id="RecurringOptions"
                :card="true"
                :items="recurringOptions"
                @radioButtonClicked="recurringOptionsClicked"
                :value.sync="selectedRecurringOption"
                :rules="[$validators.required('Please select an option')]"
              />
            </div>
            <div v-if="showFollowOnProcurementBeSoleSourcedSection">
              <hr />
              <ATATAlert
                id="FairOpportunityAlert"
                type="info"
                class="copy-max-width mb-3"
              >
                <template v-slot:content>
                  <p class="mb-0">
                    Based on what you previously told us, you requested an exception to 
                    fair opportunity for this acquisition, resulting in a task order to 
                    {{proposedCSP}} on a sole source basis.
                  </p>
                </template>
              </ATATAlert>
              <ATATRadioGroup
                  class="copy-max-width max-width-740"
                  id="followOnProcurementBeSoleSourcedOptions"
                  :legend="followOnProcurementBeSoleSourcedLegend"
                  :card="false"
                  :items="followOnProcurementBeSoleSourcedOptions"
                  :value.sync="selectedfollowOnProcurementBeSoleSourcedOption"
                  :rules="[$validators.required('Please select an option')]"
                />
              </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>

<script lang="ts">
/* eslint camelcase: 0, prefer-const: 1 */
import { Component, Mixins } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue"
import ATATAlert from "@/components/ATATAlert.vue";
import AcquisitionPackage, { isMRRToBeGenerated } from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { PeriodOfPerformanceDTO } from "@/api/models"
import { hasChanges } from "@/helpers";

import { RadioButton } from "../../../types/Global";
import Periods, { defaultPeriodOfPerformance } from "@/store/periods";

@Component({
  components: {
    ATATRadioGroup,
    ATATAlert
  },
})

export default class RecurringRequirement extends Mixins(SaveOnLeave) {

  public popDTO = defaultPeriodOfPerformance;

  public selectedRecurringOption = "";

  private recurringOptions: RadioButton[] = [
    {
      id: "YesRecurring",
      label: "Yes. This requirement should be tracked for similar efforts in the future.",
      value: "YES",
    },
    {
      id: "NoRecurring",
      label: "No. This is a temporary requirement.",
      value: "NO",
    },
  ];

  private selectedfollowOnProcurementBeSoleSourcedOption = "";

  private followOnProcurementBeSoleSourcedOptions: RadioButton[] = [
    {
      id: "YESSoleSourced",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "NoSoleSourced",
      label: "No.",
      value: "NO",
    },
  ];

  private get currentData(): PeriodOfPerformanceDTO {
    return {
      recurring_requirement: this.selectedRecurringOption,
      is_requirement_follow_on_procurement_sole_sourced: 
        this.selectedfollowOnProcurementBeSoleSourcedOption
    };
  }

  private get showFollowOnProcurementBeSoleSourcedSection(): boolean{
    return isMRRToBeGenerated() && this.selectedRecurringOption === "YES"
  }

  private get followOnProcurementBeSoleSourcedLegend(): string{
    return "It is encouraged to compete follow-on requirements. With this in mind, does your " +
      "requirement necessitate the follow-on procurement be sole-sourced to " + 
      this.proposedCSP + "?"
  }

  private get proposedCSP(): string {
    return AcquisitionPackage.fairOpportunity?.proposed_csp !== ""
      ?  AcquisitionPackage.csps[AcquisitionPackage.fairOpportunity?.proposed_csp as string]
      : "this CSP"
  }

  private savedData: PeriodOfPerformanceDTO = { 
    recurring_requirement: "",
    is_requirement_follow_on_procurement_sole_sourced: ""
  };

  private recurringOptionsClicked(): void{
    if (this.selectedRecurringOption === "NO"){
      this.currentData.is_requirement_follow_on_procurement_sole_sourced = "";
      this.selectedfollowOnProcurementBeSoleSourcedOption = "";
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await Periods.getPeriodOfPerformance();
    if (storeData) {
      this.popDTO = storeData;
      if (Object.prototype.hasOwnProperty.call(storeData, 'recurring_requirement')) {
        this.savedData = {
          recurring_requirement: storeData.recurring_requirement,
          is_requirement_follow_on_procurement_sole_sourced:
            storeData.is_requirement_follow_on_procurement_sole_sourced
        }
        this.selectedRecurringOption = storeData.recurring_requirement as string;
        this.selectedfollowOnProcurementBeSoleSourcedOption = 
          storeData.is_requirement_follow_on_procurement_sole_sourced as string;
      }
    } 
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        //eslint-disable-next-line prefer-const
        let pops: PeriodOfPerformanceDTO  = {  
          ...this.popDTO,
          is_requirement_follow_on_procurement_sole_sourced: 
            this.currentData.is_requirement_follow_on_procurement_sole_sourced || "",
          recurring_requirement: this.currentData.recurring_requirement || "",
        }
        await Periods.setPeriodOfPerformance(pops);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}
</script>
