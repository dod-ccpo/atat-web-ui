<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Will this be a future recurring requirement?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              DISA has developed a tracking system for expiring contracts. Responding YES to this 
              question will enable contract specialists to populate the tracking system.
            </p>
            <ATATRadioGroup
              class="copy-max-width mb-10 max-width-740"
              id="RecurringOptions"
              :card="true"
              :items="recurringOptions"
              :value.sync="selectedRecurringOption"
            />
          </div>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue"

import AcquisitionPackage from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { PeriodOfPerformanceDTO } from "@/api/models"
import { hasChanges } from "@/helpers";

import { RadioButton } from "../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})

export default class RecurringRequirement extends Mixins(SaveOnLeave) {

  public selectedRecurringOption 
    = AcquisitionPackage.periodOfPerformance?.recurring_requirement || "";

  private recurringOptions: RadioButton[] = [
    {
      id: "YesRecurring",
      label: "Yes. This requirement should be tracked for similar efforts in the future.",
      value: "true",
    },
    {
      id: "NoRecurring",
      label: "No. This is a temporary requirement.",
      value: "false",
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
    const storeData = await AcquisitionPackage.loadPeriodOfPerformance();
    if (storeData) {
      if (Object.prototype.hasOwnProperty.call(storeData, 'recurring_requirement')) {
        this.savedData = {
          recurring_requirement: storeData.recurring_requirement,
        }
      }
    } else {
      AcquisitionPackage.setPeriodOfPerformance(this.currentData);
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.savePeriodOfPerformance(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}
</script>
