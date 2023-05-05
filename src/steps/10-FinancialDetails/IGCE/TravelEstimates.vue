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
              legend="How do you want to estimate your travel needs?"
              :items="travelEstimateOptions"
              @radioButtonClicked="clearSelectedValues"
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
                        class="ml-2 mt-n1 mr-3"
                        color="primary"
                      />
                    </div>
                    <h2 class="">Travel summary</h2>
                    <h3 class="text-base-light ml-auto">
                      {{ pluralizeTrip(numberOfAllTrips) }}
                    </h3>
                  </div>
                </div>

                <v-expansion-panels accordion flat>
                  <v-expansion-panel
                    class="bg-transparent"
                    v-for="(item, index) in calloutData"
                    :key="index"
                  >
                    <v-expansion-panel-header
                      :id="item.id + '_Button'"
                      class="no-hover"
                    >
                      <strong>{{ item.period }}</strong>
                      <span class="font-weight-400">
                        ({{ pluralizeTrip(item.totalNumberOfTripsPerPeriod) }})
                      </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content :id="item.id + '_Content'">
                      <div v-for="(trip, tripIdx) in item.trips" :key="tripIdx">
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
            :periods="periods"
            :isMultiple="ceilingPrice === 'MULTIPLE'"
            singlePeriodTooltipText="Customize a price estimate for each performance 
              period specified in the travel summary."
            singlePeriodErrorMessage="Enter your estimated travel costs per period"
            multiplePeriodErrorMessage="Enter your estimated travel costs for this period"
            :values.sync="valueArray"
            :sysIdValueArray.sync="sysIdValueArray"
          ></ATATSingleAndMultiplePeriods>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint camelcase: 0, prefer-const: 1 */
import {
  Checkbox,
  EstimateOptionValue,
  EstimateOptionValueObjectArray,
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
  convertEstimateData
} from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import AnticipatedDataNeeds from "@/components/DOW/AnticipatedDataNeeds.vue";
import DescriptionOfWork from "@/store/descriptionOfWork";
import _ from "lodash";

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
  private ceilingPrice: SingleMultiple | undefined = "";
  private estimatedTravelCosts = "";
  private percentages = [""];
  private numberOfAllTrips = 0;
  private selectedPeriods: Checkbox[] = [];
  private travelDOWData: TravelSummaryTableData[] = [];
  private calloutData: TravelCalloutDataItem[] = [];
  public savedData: EstimateOptionValueObjectArray = {
    option: "",
    estimated_values: "",
  };
  public sysIdValueArray: Record<string, string>[] = [];
  public valueArray: string[] = [];
  
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
  
  get currentData(): EstimateOptionValueObjectArray{
    return {
      option: this.ceilingPrice || "",
      estimated_values: this.estimatedTravelCosts,
    };
  }



  @Watch("ceilingPrice")
  protected changeSelection(newVal: string): void {
    if (newVal !== this.savedData.option) {
      this.clearSelectedValues();
    }
  }

  private clearSelectedValues():void {
    this.sysIdValueArray = [];
    this.valueArray = [];
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  private async mounted(): Promise<void> {
    this.periods = Periods.periods;
    await this.loadOnEnter();
    await this.loadDOWTravelData();
  }

  private async loadOnEnter(): Promise<void> {
    const savedRCE = await IGCEStore.getRequirementsCostEstimate();
    this.savedData = _.cloneDeep(savedRCE.travel);
    this.$nextTick(() => {
      if(this.savedData.estimated_values){
        this.ceilingPrice = this.savedData.option
        const scrubbedEstimates =
            (this.savedData.estimated_values?.replaceAll("\\", "") || "");
        const estValues = JSON.parse(scrubbedEstimates);     
        this.estimatedTravelCosts = scrubbedEstimates;

        /** ON first component load instanceData.estimate.option is an []
           *  OTHERWISE instanceData.estimate.option is an {}
           * 
           *  code below accommodates for both [] && {}
          */
        let hasEstimates = false;
        if (Array.isArray(estValues) && estValues.length>0){
          this.currentData.option = 
              Object.keys(estValues[0])[0].toUpperCase() === "PER_PERIOD" 
                ? "SINGLE" : "MULTIPLE";
          hasEstimates = true;
        } else if (estValues && Object.keys(estValues).length > 0){
          this.currentData.option = 
              Object.keys(estValues)[0].toUpperCase() === "PER_PERIOD" 
                ? "SINGLE" : "MULTIPLE";
          hasEstimates = true;
        }

        if (hasEstimates){
          this.setValueArray(estValues);
        }
      }
    })
  }

  protected async loadDOWTravelData(): Promise<void> {
    this.selectedPeriods = await createPeriodCheckboxItems();
    this.travelDOWData = await DescriptionOfWork.getTravel();
    
    this.selectedPeriods.forEach((period) => {
      const calloutDataItem: TravelCalloutDataItem = {
        period: period.label,
        periodSysId: period.value,
        trips: [],
        totalNumberOfTripsPerPeriod: 0
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
            "<div class='mr-3'>" +
                  travelItem.number_of_trips +"&nbsp;&nbsp;x" +
            "</div>" +
            "<div>" +
            travelItem.trip_location +
            ", " +
            duration +
            ", " +
            travelers +
            "</div>"
          );
          calloutDataItem.totalNumberOfTripsPerPeriod =
            calloutDataItem.totalNumberOfTripsPerPeriod + parseInt(travelItem.number_of_trips);
        }
        
      });
      if (calloutDataItem.trips.length > 0) {
        this.numberOfAllTrips = this.numberOfAllTrips + calloutDataItem.totalNumberOfTripsPerPeriod;
        this.calloutData.push(calloutDataItem);
      }
    });
  }

  protected pluralizeTrip(numberOfTrips: number): string {
    return numberOfTrips + " " + setItemToPlural(numberOfTrips, "trip");
  }

  /**
   * iterate through periods to ensure they are in chronogical order 
   * based on period.sys_ids
   * 
   * sets this.Value Array with correctly ordered period/valus 
   */
  public setValueArray(estValues: Record<string, string>): void{
    const isSingle = this.currentData.option === "SINGLE";

    if (Array.isArray(estValues)){ //isArray
      this.sysIdValueArray = estValues;
      if (isSingle){
        this.valueArray.push(Object.values(estValues[0])[0] as string)
      }else{
        this.periods?.sort().forEach(
          (p) => {
            const obj = estValues.find(ev => Object.keys(ev)[0] === p.sys_id);
            this.valueArray.push(obj[p.sys_id || 0]);
          })
      }
    } else { //Is Object
      if (isSingle){ // retrieving single value
        this.sysIdValueArray.push(estValues);
        this.valueArray.push(Object.values(estValues)[0])
      } else {
        this.periods?.sort().forEach(
          (p) => {
            for(const estVal in estValues){ // retreiving multiple values
              if (estVal === p.sys_id){
                this.sysIdValueArray.push({[estVal] : estValues[estVal]});
                this.valueArray.push(estValues[estVal])
              }
            }
          })
      }
    }
  }
  

  protected async saveOnLeave(): Promise<boolean> {
    if (this.currentData.option?.toLowerCase()==="single"){
      this.sysIdValueArray = [];
      //eslint-disable-next-line prefer-const
      let obj:Record<string, string>= {};
      obj["PER_PERIOD"] = this.valueArray[0];
      this.sysIdValueArray.push(obj);
    }
    this.currentData.estimated_values = convertEstimateData(this.sysIdValueArray);
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

