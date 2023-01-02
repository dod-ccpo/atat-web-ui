<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          Let’s gather price estimates for your travel requirements
        </h1>
        <p class="page-intro">
          Considering the travel requirements that you previously outlined,
          estimate costs for each period. If you have multiple trips within the
          same performance period, aggregate the prices into a single estimate
          per period.
        </p>
        <div class="d-flex justify-space-between">
          <div class="mr-10">
            <ATATRadioGroup
              class="copy-max-width max-width-740"
              id="TravelEstimates"
              :card="true"
              :items="travelEstimateOptions"
              :value.sync="ceilingPrice"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
          <div>
            <ATATAlert
              type="callout"
              calloutBackground="primary-lighter"
              maxWidth="400"
              minWidth="400"
            >
              <template slot="content">
                <div class="mb-4 width-100">
                  <div class="d-flex align-center height-60">
                    <div>
                      <ATATSVGIcon
                        width="23"
                        height="33"
                        name="place"
                        class="mt-n1 mr-2"
                        color="primary"
                      />
                    </div>
                    <h2 class="">Travel summary</h2>
                    <h3 class="text-base-light ml-auto">
                      {{ numberOfTrips }} trip(s)
                    </h3>
                  </div>
                </div>

                <v-expansion-panels accordion flat class="bg-transparent">
                  <v-expansion-panel
                    v-for="(item, index) in calloutData"
                    :key="index"
                  >
                    <v-expansion-panel-header :id="item.id + '_Button'">
                      {{ item.period }} ({{ getNumberOfTripsForEachPeriod(item.trips.length)}})
                    </v-expansion-panel-header>
                    <v-expansion-panel-content :id="item.id + '_Content'">
                      <div v-for="(trip, tripIdx) in item.trips" :key="tripIdx"
                      >
                        <div v-html="trip" class="d-flex align-top"></div>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </template>
            </ATATAlert>
          </div>
        </div>
        <hr class="mt-8" v-if="ceilingPrice !== ''" />

        <div v-if="ceilingPrice !== ''">
          <ATATSingleAndMultiplePeriods
            :periods.sync="periods"
            :isMultiple="ceilingPrice === 'MULTIPLE'"
            :values.sync="estimatedTravelCosts"
          ></ATATSingleAndMultiplePeriods>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import {
  Checkbox,
  RadioButton,
  SingleMultiple,
  TravelCalloutDataItem,
  TravelSummaryTableData,
} from "types/Global";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { Component, Mixins, Watch } from "vue-property-decorator";
import Periods from "@/store/periods";
import { EstimateOptionValueDTO, PeriodDTO } from "@/api/models";
import IGCEStore from "@/store/IGCE";
import {
  createPeriodCheckboxItems,
  hasChanges,
  setItemToPlural,
} from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import AnticipatedDataNeeds from "@/components/DOW/AnticipatedDataNeeds.vue";
import DescriptionOfWork from "@/store/descriptionOfWork";

@Component({
  components: {
    ATATAlert,
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods,
    AnticipatedDataNeeds,
    ATATSVGIcon,
  },
})
export default class TravelEstimates extends Mixins(SaveOnLeave) {
  private periods: PeriodDTO[] | null = [];
  private ceilingPrice: SingleMultiple = "";
  private estimatedTravelCosts = [""];
  private percentages = [""];
  private numberOfTrips = 0;
  private selectedPeriods: Checkbox[] = [];
  private travelDOWData: TravelSummaryTableData[] = [];
  private calloutData: TravelCalloutDataItem[] = [];
  public savedData: EstimateOptionValueDTO = {
    option: "",
    estimated_values: [],
  };
  
  private travelEstimateOptions: RadioButton[] = [
    {
      id: "SinglePrice",
      label:
        "I want to apply the same price estimate to all performance periods.",
      value: "SINGLE",
    },
    {
      id: "MultiplePrices",
      label:
        "I want to estimate a different price for the base and each option period.",
      value: "MULTIPLE",
    },
  ];
  
  get currentData(): EstimateOptionValueDTO {
    return {
      option: this.ceilingPrice,
      estimated_values: this.estimatedTravelCosts,
    };
  }

  @Watch("ceilingPrice")
  protected changeSelection(newVal: string): void {
    if (newVal !== this.savedData.option) {
      this.estimatedTravelCosts = [];
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  private async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.periods = Periods.periods;
    await this.loadDOWTravelData();
  }

  private async loadOnEnter(): Promise<void> {
    const store = await IGCEStore.getRequirementsCostEstimate();
    this.savedData = store.travel;
    this.ceilingPrice = store.travel.option;
    this.estimatedTravelCosts = store.travel.estimated_values;
  }

  protected async loadDOWTravelData(): Promise<void> {
    this.selectedPeriods = await createPeriodCheckboxItems();
    this.travelDOWData = await DescriptionOfWork.getTravel();

    this.selectedPeriods.forEach((period) => {
      const calloutDataItem: TravelCalloutDataItem = {
        period: period.label,
        period_sys_id: period.value,
        trips: [],
      };
      this.travelDOWData.forEach((travelItem) => {
        if (travelItem.selected_periods.join("").indexOf(period.value) > -1) {
          const duration =
            travelItem.duration_in_days +
            " " +
            setItemToPlural(parseInt(travelItem.duration_in_days), "day");
          const travelers =
            travelItem.number_of_travelers +
            " " +
            setItemToPlural(
              parseInt(travelItem.number_of_travelers),
              "traveler"
            );
          calloutDataItem.trips.push(
            "<div class='mr-2'>" +
              travelItem.number_of_trips + " x " + 
            "</div>" + 
            "<div>" +
              travelItem.trip_location +
              ", " +
              duration +
              ", " +
              travelers + 
            "</div>"
          );
        }
      });
      if (calloutDataItem.trips.length > 0) {
        this.calloutData.push(calloutDataItem);
      }
    });
  }

  protected getNumberOfTripsForEachPeriod(trips: number): string {
    return trips + " " + setItemToPlural(trips, "trip")
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      const store = await IGCEStore.getRequirementsCostEstimate();
      store.travel = this.currentData;
      await IGCEStore.setRequirementsCostEstimate(store);
      await IGCEStore.saveRequirementsCostEstimate();
    }
    return true;
  }
}
</script>

