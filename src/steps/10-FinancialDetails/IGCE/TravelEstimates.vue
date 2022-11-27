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
          <CardRequirement
            title="Travel summary"
            iconType="currentLocation"
            :units="totalTrips + ' trips'"
            :background="cardRequirementBackground"
          >
            <template slot="content">
              <div>
                <v-btn
                  id="baseYearButton"
                  @click="toggleBaseExpanded()"
                >
                  <v-icon v-if="!baseExpanded">navigate_next</v-icon>
                  <v-icon v-if="baseExpanded">expand_more</v-icon>
                  <strong>Base Period</strong> ({{basePeriodTripsCount}} trips) 
                </v-btn>
                <div v-if="baseExpanded">
                  <div
                    v-for="(item, idx) in basePeriodItems"
                    :key="idx"
                    class="d-flex flex-row align-center pl-12"
                  >
                    <div class="d-flex">
                      <span>{{item.count}} x</span>
                    </div>
                    <div class="d-flex">
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </div>
                    <div class="d-flex">
                      <span>
                        {{item.location}}, {{item.duration}}, {{item.travelers}} travelers
                      </span>
                    </div>
                  </div>
                  <div class="hr"></div>
                </div>
              </div>
              <div v-if="periods?.length > 1">
                <div v-for="(item, idx) in periods?.slice(1)" :key="idx">
                  <v-btn
                    :id="getButtonId(idx)"
                    @click="toggleOptionsExpanded(idx)"
                  >
                    <v-icon v-if="!optionsExpanded[idx]">navigate_next</v-icon>
                    <v-icon v-if="optionsExpanded[idx]">expand_more</v-icon>
                    <strong>Option Period {{idx + 1}}</strong> ({{optionPeriodTripsCount}} trips) 
                  </v-btn>
                  <div v-if="optionsExpanded[idx]">
                    <div
                      v-for="(item, idx2) in optionPeriodItems[idx]"
                      :key="idx2"
                      class="d-flex flex-row align-center pl-12"
                    >
                      <div class="d-flex">
                        <span>{{item.count}} x</span>
                      </div>
                      <div class="d-flex">
                        <span>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                      </div>
                      <div class="d-flex">
                        <span>
                          {{item.location}}, {{item.duration}}, {{item.travelers}} travelers
                        </span>
                      </div>
                    </div>
                    <div class="hr"></div>
                  </div>
                </div>
              </div>
            </template>
          </CardRequirement>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
import { RadioButton } from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { Component, Mixins, Watch } from "vue-property-decorator";
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import IGCEStore, { TravelEstimateNeeds } from "@/store/IGCE";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import CardRequirement from "./components/Card_Requirement.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods,
    CardRequirement
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

  private cardRequirementBackground = `bg-base-lightest _no-shadow
    border-rounded-more pa-4`;
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

  private basePeriodItems = [
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
    }
  ];

  private optionPeriodItems = [
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
    ]
  ]

  private baseExpanded = false;
  private optionsExpanded: boolean[] = [];

  private getButtonId(index: number){
    return "Option" + (index + 1) as string + "Button";
  }

  private toggleBaseExpanded(): void {
    this.baseExpanded = !this.baseExpanded;
  }

  private toggleOptionsExpanded(index: number): void {
    this.optionsExpanded[index] = !this.optionsExpanded[index];
    console.log(this.optionsExpanded)
  }

  get basePeriodTripsCount(): number {
    let total = 0;

    this.basePeriodItems.forEach((currentItem) => {
      total += Number(currentItem.count);
    });

    return total;
  }

  get optionPeriodTripsCount(): number {
    let total = 0;

    this.optionPeriodItems.every((currentItem) => {
      currentItem.forEach((item) => {
        total += Number(item.count);
      })
    });

    return total;
  }

  get totalTrips(): number {
    return this.basePeriodTripsCount + this.optionPeriodTripsCount;
  }

  get currentData(): TravelEstimateNeeds {
    return{
      ceilingPrice: this.ceilingPrice,
      estimatedTravelCosts: this.estimatedTravelCosts,
    }
  };

  @Watch("ceilingPrice")
  protected changeSelection(newVal: string): void{
    if (newVal !== this.savedData.ceilingPrice){
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
    this.periods?.slice(1).forEach(() => {
      this.optionsExpanded.push(false);
    });
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

