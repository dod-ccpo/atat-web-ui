<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">Do you want to request a PoP start date?</h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Due to project requirements and/or contractual obligations, your
              PoP may need to start on a specific date. If no date is specified,
              then your PoP will begin based upon the execution date of your
              task order.
            </p>
            <ATATRadioGroup
              class="copy-max-width max-width-740"
              id="PoPStartDate"
              :card="true"
              :items="startPoPDateOptions"
              :value.sync="selectedPoPStartDateOption"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>

          <div v-if="selectedPoPStartDateOption ==='YES'">
            <hr class="my-9"/>
            <p class="mb-2">
              Requested start date
            </p>

            <div class="copy-max-width d-flex mb-9">
              <ATATSelect
                id="RequestDateOption"
                class="mr-7"
                label=""
                :items="timeFrameOptions"
                :selectedValue.sync="selectedTimeFrameOption"
                style="max-width: 196px"
                :rules="[$validators.required('Please select an option')]"
              />
              <ATATDatePicker 
                id="RequestDatePicker" 
                :value.sync="requestedPopStartDate" 
                :rules="[
                  $validators.required('Please enter a valid date'),
                  $validators.isDateValid('Please enter a valid date')
                ]"
              />

            </div>
            <ATATAlert
              id="RequestDateAlert"
              class="copy-max-width"
              v-if="selectedTimeFrameOption === 'NO_LATER_THAN'"
              type="warning"
            >
              <template slot="content">
                <p class="mb-0">
                  All efforts will be made to accommodate your requested period
                  of performance start date. However, there is no guarantee that
                  the award will be made by said date. Normal contracting lead
                  times and/or complexity of requirements may prevent meeting
                  the requested date.
                </p>
              </template>
            </ATATAlert>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import { RadioButton, SelectData } from "../../../types/Global";
import { PeriodOfPerformanceDTO } from "@/api/models";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATAlert,
    ATATDatePicker,
    ATATRadioGroup,
    ATATSelect,
  },
})
export default class POPStart extends Mixins(SaveOnLeave) {
  private requestedPopStartDate 
    = AcquisitionPackage.periodOfPerformance?.requested_pop_start_date || "";;
  private selectedPoPStartDateOption 
    = AcquisitionPackage.periodOfPerformance?.pop_start_request || "";
  private startPoPDateOptions: RadioButton[] = [
    {
      id: "YesStartDate",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "NoStartDate",
      label: "No. The PoP should start upon execution of the task order.",
      value: "NO",
    },
  ];

  private selectedTimeFrameOption 
    = AcquisitionPackage.periodOfPerformance?.time_frame || "";
  private timeFrameOptions: SelectData[] = [
    {
      text: "No sooner than",
      value: "NO_SOONER_THAN",
    },
    {
      text: "Not later than",
      value: "NO_LATER_THAN"
    }
  ];

  @Watch("selectedPoPStartDateOption")
  protected popStartDateOptionChange(newVal: string): void {
    if (newVal === "YES") {
      this.selectedTimeFrameOption = "NO_SOONER_THAN";
    } else {
      this.selectedTimeFrameOption = "";
      this.requestedPopStartDate = "";
    }
  }

  private get currentData(): PeriodOfPerformanceDTO {
    return {
      time_frame: this.selectedTimeFrameOption,
      pop_start_request: this.selectedPoPStartDateOption || "UNSELECTED",
      requested_pop_start_date: this.requestedPopStartDate,
    };
  }

  private savedData: PeriodOfPerformanceDTO = {
    time_frame: "",
    pop_start_request: "",
    requested_pop_start_date: "",
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage
      .loadData<PeriodOfPerformanceDTO>({storeProperty: StoreProperties.PeriodOfPerformance});

    if (storeData) {
      this.savedData = {
        time_frame: storeData.time_frame || "",
        pop_start_request: storeData.pop_start_request || "UNSELECTED",
        requested_pop_start_date: storeData.requested_pop_start_date  || "",
      }
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveData<PeriodOfPerformanceDTO>(
          {data: this.currentData, 
            storeProperty: StoreProperties.PeriodOfPerformance});
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
