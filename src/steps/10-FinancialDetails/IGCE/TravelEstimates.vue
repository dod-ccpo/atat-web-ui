<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s gather price estimates for your travel requirements
          </h1>
          <p class="page-intro">
            Considering the travel requirements that you previously outlined,
            estimate costs for each period. If you have multiple trips within
            the same performance period, aggregate the prices into a single
            estimate per period.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-7">
          <div class="copy-max-width">
            <ATATRadioGroup
              class="copy-max-width max-width-740"
              id="TravelEstimates"
              legend="How do you want to estimate your travel needs?"
              :items="travelEstimateOptions"
              :value.sync="ceilingPrice"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
          <br />
          <div v-if="ceilingPrice !== ''">
            <ATATSingleAndMultiplePeriods
              :periods.sync="periods"
              :isMultiple="ceilingPrice === 'multiple'"
              :singlePeriodLabel="singlePeriodLabel"
              :multiplePeriodLabel="multiplePeriodLabel"
              :singlePeriodTooltipText="singlePeriodTooltipText"
              :multiplePeriodTooltipText="multiplePeriodTooltipText"
              :showMultiplePeriodTooltip="true"
              :values.sync="estimatedTravelCosts"
            ></ATATSingleAndMultiplePeriods>
          </div>
        </v-col>
        <v-col class="col-5">
          <ATATAlert
            type="callout"
            :showIcon="false"
            calloutBackground="primary-lighter"
            class="copy-max-width my-10"
          >
            <template slot="content">
              <div>
                <h2 class="d-flex align-center mb-2">
                  <ATATSVGIcon
                    name="currentLocation"
                    width="23"
                    height="33"
                    class="mr-4"
                  ></ATATSVGIcon>
                  Travel Summary
                </h2>
                <v-expansion-panels accordion flat>
                  <v-expansion-panel class="bg-transparent pb-2">
                    <v-expansion-panel-header id="baseYearButton" class="no-hover">
                      Base Period
                      <span class="font-weight-400"
                        >({{ basePeriodTripsCount }} trips)</span
                      >
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <div
                        v-for="(item, index) in basePeriodItems"
                        :key="index"
                        :id="item.id + '_Content'"
                      >
                        {{ item.count }} x {{ item.location }},
                        {{ item.duration }}, {{ item.travelers }} travelers
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
               
                  <v-expansion-panel class="bg-transparent pb-2"
                        v-for="(optionYear, index) in optionPeriodItems"
                        :key="index"
                        :id="optionYear.id + '_Content'">
                    <v-expansion-panel-header id="optionYearButton" class="no-hover">
                      Option {{ index+1 }} Period
                      <span class="font-weight-400"
                        >({{ optionPeriodTripsCount }} trips)</span
                      >
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <div v-for="(item, index) in optionYear"
                        :key="index"
                        :id="item.id + '_Content'">
                         {{ item.count }} x {{ item.location }},
                        {{ item.duration }}, {{ item.travelers }} travelers
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </template>
          </ATATAlert>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
import { RadioButton } from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import { Component, Mixins, Watch } from "vue-property-decorator";
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import IGCEStore, { TravelEstimateNeeds } from "@/store/IGCE";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods,
    ATATAlert,
    ATATSVGIcon,
    ATATExpandableLink,
  },
})
export default class TravelEstimates extends Mixins(SaveOnLeave) {
  private periods: PeriodDTO[] | null = [];
  private ceilingPrice = "";
  private estimatedTravelCosts = [""];
  public savedData: TravelEstimateNeeds = {
    ceilingPrice: "",
    estimatedTravelCosts: [],
  };

  private singlePeriodLabel = "Estimated travel costs per period";
  private multiplePeriodLabel = "Estimated travel costs per period";
  private singlePeriodTooltipText = `This estimate will be applied to all performance 
    periods specified in the travel summary.`;
  private multiplePeriodTooltipText = `Customize a price estimate for each performance 
    period specified in the travel summary.`;

  private travelEstimateOptions: RadioButton[] = [
    {
      id: "SinglePrice",
      label:
        "I want to apply the same price estimate to all performance periods.",
      value: "single",
    },
    {
      id: "MultiplePrices",
      label:
        "I want to estimate a different price for the base and each option period.",
      value: "multiple",
    },
  ];

  private basePeriodItems: any[] = [];

  private optionPeriodItems: any[] = [];

  private baseExpanded = false;
  private optionsExpanded: boolean[] = [];

  get basePeriodTripsCount(): number {
    let total = 0;

    this.basePeriodItems.forEach((currentItem) => {
      total += Number(currentItem.count);
    });

    return total;
  }

  get optionPeriodTripsCount(): number {
    let total = 0;

    this.optionPeriodItems.forEach((currentItem) => {
      currentItem.forEach((item: any) => {
        total += Number(item.count);
      })
    });

    return total;
  }

  get totalTrips(): number {
    return this.basePeriodTripsCount + this.optionPeriodTripsCount;
  }

  get currentData(): TravelEstimateNeeds {
    return {
      ceilingPrice: this.ceilingPrice,
      estimatedTravelCosts: this.estimatedTravelCosts,
    };
  }

  @Watch("ceilingPrice")
  protected changeSelection(newVal: string): void {
    if (newVal !== this.savedData.ceilingPrice) {
      this.estimatedTravelCosts = [];
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  private async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  private async loadOnEnter(): Promise<void> {
    const store = await IGCEStore.getTravelEstimateNeeds();
    this.savedData = store;
    this.ceilingPrice = store.ceilingPrice;
    this.estimatedTravelCosts = store.estimatedTravelCosts;

    this.periods = Periods.periods;

    // TEST DATA; REMOVE ONCE REAL DATA IS AVAILABLE
    this.basePeriodItems = [
      {
        count: "2",
        location: "Washington, DC",
        duration: "2 days",
        travelers: "4",
      },
      {
        count: "2",
        location: "San Diego, CA",
        duration: "2 days",
        travelers: "4",
      },
    ];

    // TEST DATA; REMOVE ONCE REAL DATA IS AVAILABLE
    this.optionPeriodItems = [
      [
        {
          count: "2",
          location: "Washington, DC",
          duration: "2 days",
          travelers: "4"
        },
        {
          count: "2",
          location: "San Diego, CA",
          duration: "2 days",
          travelers: "4"
        },
      ],
      [
        {
          count: "3",
          location: "Washington, DC",
          duration: "2 days",
          travelers: "4"
        },
        {
          count: "5",
          location: "San Diego, CA",
          duration: "2 days",
          travelers: "4"
        },
      ]
    ];

   
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    if (this.hasChanged()) {
      IGCEStore.setTravelEstimateNeeds(this.currentData);
    }
    return true;
  }
}
</script>

