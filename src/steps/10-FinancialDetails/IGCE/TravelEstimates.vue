<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          How do you want to estimate your travel needs?
        </h1>
        <p class="page-intro">
          Consider the travel requirements that you previously outlined (e.g.,
          location, duration, quantity, attendance, etc.). You may choose to set
          a ceiling price and apply it to all periods. Or, if you know that your
          travel requirements will change over time, then you may opt to set a
          different price for each period.
        </p>
        <div class="copy-max-width">
          <ATATRadioGroup
            class="copy-max-width max-width-740"
            id="TravelEstimates"
            :card="true"
            :items="travelEstimateOptions"
            @radioButtonSelected="selectTravelEstimate"
            :value.sync="currentData.setCeilingPrice"
            :rules="[$validators.required('Please select an option')]"
          />
        </div>
        <hr class="mt-8" v-if="travelFormFields !==''" />
      
         <fieldset class="no-border" v-if="travelFormFields !==''">
            <legend :class="[{'font-weight-500': travelFormFields==='multiple'}, ' mb-4']">
              Estimated travel costs per period</legend>
            <template v-if="travelFormFields === 'single'">
              <ATATTextField
                id="SingleAmount"
                :value.sync="currentData.estimatedTravelCosts[0]"
                :alignRight="true"
                :isCurrency="true"
                :showErrorMessages="true"
                @blur="sanitizeValue(0, currentData.estimatedTravelCosts[0])"
                width="190"
                class="mr-2"
                :rules="[$validators.required('Enter your estimated travel price.', true)]"
              />
            </template>
            <template v-if="travelFormFields === 'multiple'">
              <div
                v-for="(period, idx) in periods"
                :key="idx"
                :class="[(idx < periods.length-1 ? 'pb-5': ''), ' pl-2 d-flex align-start']"
                style="border-left: #544496 4px solid;"
              >
                <div class="text-right mt-2" style="width: 75px">
                  {{ getOption(idx) }}
                </div>
                <div>
                  <ATATTextField
                    :id="period.period_type"
                    :value.sync="currentData.estimatedTravelCosts[idx]"
                    :alignRight="true"
                    :isCurrency="true"
                    :showErrorMessages="true"
                    @blur="sanitizeValue(idx, currentData.estimatedTravelCosts[idx])"
                    width="190"
                    class="ml-5"
                    :rules="[$validators.required('Enter your estimated travel price.', true)]"
                  />
                </div>
              </div>
            </template>
          </fieldset>
      
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { RadioButton } from "types/Global";
import Vue from "vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import { Component, Mixins } from "vue-property-decorator";
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import IGCEStore, { TravelEstimateNeeds } from "@/store/IGCE";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";


@Component({
  components: {
    ATATRadioGroup,
    ATATTextField,
    ATATErrorValidation
  },
})
export default class TravelEstimates extends Mixins(SaveOnLeave) {
  private periods: PeriodDTO[] | null = [];
  private savedData: TravelEstimateNeeds = {
    setCeilingPrice: "",
    estimatedTravelCosts: []
  };


  private travelEstimateOptions: RadioButton[] = [
    {
      id: "SinglePrice",
      label:
        "I want to set a ceiling price and apply the same estimate to all base and option periods.",
      value: "single",
    },
    {
      id: "MultiplePrices",
      label:
        "I want to customize my travel estimates for the base and each option period.",
      value: "multiple",
    },
  ];

  private currentData: TravelEstimateNeeds = {
    setCeilingPrice: "",
    estimatedTravelCosts: [""],
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  get travelFormFields(): string {
    return this.currentData.setCeilingPrice;
  }

  public selectTravelEstimate(): void {
    const clickedElement = window.event?.currentTarget as HTMLDivElement;
    if (clickedElement.classList?.contains("v-radio")){
      this.currentData.estimatedTravelCosts=[""];
    }
  }

  public sanitizeValue(idx: number, val: string): void{
    if (parseInt(val)===0){
      this.currentData.estimatedTravelCosts[idx]="";
    }
  }

  public getOption(idx: number): string {
    return idx === 0 ? "Base" : ("Option " + idx)
  }

  private async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.periods = Periods.periods;
  }

  private async loadOnEnter(): Promise<void>{
    const store = await IGCEStore.getTravelEstimateNeeds();
    this.savedData = store;
    this.currentData = store;
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      await IGCEStore.setTravelEstimateNeeds(this.currentData);
    }
    return true;
  }
}
</script>

