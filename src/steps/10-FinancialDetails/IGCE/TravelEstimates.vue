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
            @mousedown="selectTravelEstimate"
            :value.sync="setCeilingPrice"
            :rules="[$validators.required('Please select an option')]"
          />
        </div>
        <hr class="mt-8" v-if="setCeilingPrice !== ''" />

        <fieldset class="no-border" v-if="setCeilingPrice !== ''">
          <legend
            :class="[
              { 'font-weight-500': setCeilingPrice === 'multiple' },
              ' mb-4',
            ]"
          >
            Estimated travel costs per period
          </legend>
          <template v-if="setCeilingPrice === 'single'">
            <ATATTextField
              id="SingleAmount"
              :value.sync="estimatedTravelCosts[0]"
              :alignRight="true"
              :isCurrency="true"
              :showErrorMessages="true"
              @blur="sanitizeValue(0, estimatedTravelCosts[0])"
              width="190"
              class="mr-2"
              :rules="[
                $validators.required(
                  'Enter your estimated travel price.',
                  true
                ),
              ]"
            />
          </template>
          <template v-if="currentData.setCeilingPrice === 'multiple'">
            <div
              v-for="(period, idx) in periods"
              :key="idx"
              :class="[
                idx < periods.length - 1 ? 'pb-5' : '',
                ' pl-2 d-flex align-start',
              ]"
              style="border-left: #544496 4px solid"
            >
              <div class="text-right mt-2" style="width: 75px">
                {{ getOption(idx) }}
              </div>
              <div>
                <ATATTextField
                  :id="period.period_type"
                  :value.sync="estimatedTravelCosts[idx]"
                  :alignRight="true"
                  :isCurrency="true"
                  :showErrorMessages="true"
                  @blur="
                    sanitizeValue(idx, estimatedTravelCosts[idx])
                  "
                  width="190"
                  class="ml-5"
                  :rules="[
                    $validators.required(
                      'Enter your estimated travel price.',
                      true
                    ),
                  ]"
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
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import { Component, Mixins, Watch } from "vue-property-decorator";
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import IGCEStore, { TravelEstimateNeeds } from "@/store/IGCE";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField,
    ATATErrorValidation,
  },
})
export default class TravelEstimates extends Mixins(SaveOnLeave) {
  private periods: PeriodDTO[] | null = [];
  private setCeilingPrice = "";
  private estimatedTravelCosts = [""];
  public savedData: TravelEstimateNeeds = {
    setCeilingPrice: "",
    estimatedTravelCosts: [],
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

  get currentData(): TravelEstimateNeeds {
    return{
      setCeilingPrice: this.setCeilingPrice,
      estimatedTravelCosts: this.estimatedTravelCosts,
    }
  };

  @Watch("setCeilingPrice")
  protected changeSelection(newVal: string): void{
    if (newVal !== this.savedData.setCeilingPrice){
      this.estimatedTravelCosts = [];
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public sanitizeValue(idx: number, val: string): void {
    if (parseInt(val) === 0) {
      this.currentData.estimatedTravelCosts[idx] = "";
    }
  }

  public getOption(idx: number): string {
    return idx === 0 ? "Base" : "Option " + idx;
  }

  private async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.periods = Periods.periods;
  }

  private async loadOnEnter(): Promise<void> {
    const store = await IGCEStore.getTravelEstimateNeeds();
    this.savedData = store;
    this.setCeilingPrice = store.setCeilingPrice;
    this.estimatedTravelCosts = store.estimatedTravelCosts;
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (this.hasChanged()) {
      await IGCEStore.setTravelEstimateNeeds(this.currentData);
    }
    return true;
  }
}
</script>

