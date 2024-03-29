<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header mb-3">Do you want to request a PoP start date?</h1>
            <div class="copy-max-width">
              <p class="mb-8">
                Due to project requirements and/or contractual obligations, your
                PoP may need to start on a specific date. If no date is specified,
                then your PoP will begin based upon the execution date of your
                task order.
              </p>
              <ATATRadioGroup
                ref="PoPStartRadio"
                class="copy-max-width max-width-740"
                id="PoPStartDate"
                :card="true"
                :items="startPoPDateOptions"
                :value="selectedPoPStartDateOption"
                @update:value="selectedPoPStartDateOption = $event"
                :rules="[$validators.required('Please select an option')]"
                width="200"
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
                  :selectedValue="selectedTimeFrameOption"
                  @update:selectedValue="selectedTimeFrameOption = $event"
                  style="max-width: 196px"
                  :rules="[$validators.required('Please select an option')]"
                />
                <ATATDatePicker 
                  id="RequestDatePicker" 
                  ref="RequestDatePickerRef" 
                  :value="requestedPopStartDate" 
                  @update:value="requestedPopStartDate = $event" 
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
                <template v-slot:content>
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
  </v-form>
</template>

<script lang="ts">
/* eslint camelcase: 0, prefer-const: 1 */
import { Component, Watch, Vue, toNative, Hook } from "vue-facing-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import { RadioButton, SaveOnLeaveRefs, SelectData } from "../../../types/Global";
import { PeriodOfPerformanceDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import Periods from "@/store/periods";

@Component({
  components: {
    ATATAlert,
    ATATDatePicker,
    ATATRadioGroup,
    ATATSelect,
  },
})
class POPStart extends Vue {
  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs,
      nextTick: this.$nextTick,
    }).catch(() => false)
  }

  private requestedPopStartDate = "";
  private selectedPoPStartDateOption = "";
  private loaded: PeriodOfPerformanceDTO | null  = null;

  
  private startPoPDateOptions: RadioButton[] = [
    {
      id: "YesStartDate",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "NoStartDate",
      label: "No.",
      value: "NO",
    },
  ];

  private selectedTimeFrameOption = "";
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
      pop_start_request: this.selectedPoPStartDateOption,
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
    const storeData = await Periods.getPeriodOfPerformance();

    if (storeData) {
      this.loaded = storeData;

      this.selectedPoPStartDateOption = storeData.pop_start_request || "";
      this.requestedPopStartDate = storeData.requested_pop_start_date || "";
      this.savedData = {
        time_frame: storeData.time_frame || "",
        pop_start_request: storeData.pop_start_request || "",
        requested_pop_start_date: storeData.requested_pop_start_date  || "",
      }
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        const pops: PeriodOfPerformanceDTO  = {  
          ...this.loaded,
          time_frame: this.currentData.time_frame || "",
          pop_start_request: this.currentData.pop_start_request || "",
          requested_pop_start_date: this.currentData.requested_pop_start_date  || "",
        }

        await Periods.setPeriodOfPerformance(pops);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
  public async created(): Promise<void> {
    await this.loadOnEnter();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}

export default toNative(POPStart)
</script>
