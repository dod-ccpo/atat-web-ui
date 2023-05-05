<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Will this be a recurring requirement?
            </h1>
            <div class="copy-max-width">
              <p class="mb-10">
                DISA has developed a tracking system for expiring contracts. Responding "YES" 
                below will enable DITCO to notify you of expiring contracts in sufficient time 
                to prepare your follow-on acquisition package.
              </p>
              <ATATRadioGroup
                class="copy-max-width mb-10 max-width-740"
                id="RecurringOptions"
                :card="true"
                :items="recurringOptions"
                :value.sync="selectedRecurringOption"
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

import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { PeriodOfPerformanceDTO } from "@/api/models"
import { hasChanges } from "@/helpers";

import { RadioButton } from "../../../types/Global";
import Periods, { defaultPeriodOfPerformance } from "@/store/periods";

@Component({
  components: {
    ATATRadioGroup,
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
  private get currentData(): PeriodOfPerformanceDTO {
    return {
      recurring_requirement: this.selectedRecurringOption,
    };
  }

  private savedData: PeriodOfPerformanceDTO = { 
    recurring_requirement: "" 
  };

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
        }
        this.selectedRecurringOption = storeData.recurring_requirement as string;
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
