<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          How do you want to estimate your travel needs?
        </h1>
        <p>
          Consider the travel requirements that you previously outlined (e.g.,
          location, duration, quantity, attendance, etc.). You may choose to set
          a ceiling price and apply it to all periods. Or, if you know that your
          travel requirements will change over time, then you may opt to set a
          different price for each period.
        </p>
        <div class="copy-max-width">
          <ATATRadioGroup
            class="copy-max-width mb-10 max-width-740"
            id="TravelEstimates"
            :card="true"
            :items="travelEstimateOptions"
            @click="travelFormFields"
            :value.sync="selectedTravelEstimate"
            :rules="[$validators.required('Please select an option')]"
          />
        </div>

      
         <fieldset class="no-border" v-if="travelFormFields !==''">
            <legend class="mb-4"><strong>Estimated travel costs per period</strong></legend>
            <template v-if="travelFormFields === 'single'">
              <ATATTextField
                id="SingleAmount"
                :value.sync="Amounts[0]"
                :alignRight="true"
                :isCurrency="true"
                :showErrorMessages="true"
                @blur="sanitizeValue(0, Amounts[0])"
                width="190"
                class="mr-2"
                :rules="[$validators.required('Enter your estimated travel price.', true)]"
              />
            </template>
            <template v-if="travelFormFields === 'multiple'">
              <div
                v-for="(period, idx) in periods"
                :key="idx"
                :class="[(idx < periods.length-1 ? 'pb-5': ''), ' d-flex align-center']"
                style="border-left: #544496 4px solid;"
              >
                <div class="text-right" style="width: 75px">
                  {{ getOption(idx) }}
                </div>
                <div>
                  <ATATTextField
                    :id="period.period_type"
                    :value.sync="Amounts[idx]"
                    :alignRight="true"
                    :isCurrency="true"
                    :showErrorMessages="true"
                    @blur="sanitizeValue(idx, Amounts[idx])"
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
import { Component } from "vue-property-decorator";
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField,
    ATATErrorValidation
  },
})
export default class TravelEstimates extends Vue {
  private selectedTravelEstimate = "";
  private Amounts: (string | null)[] = [];
  private periods: PeriodDTO[] | null = [];
  private travelEstimateOptions: RadioButton[] = [
    {
      id: "SingleEstimates",
      label:
        "I want to set a ceiling price and apply the same estimate to all base and option periods.",
      value: "single",
    },
    {
      id: "MultipleEstimates",
      label:
        "I want to customize my travel estimates for the base and each option period.",
      value: "multiple",
    },
  ];

  get travelFormFields(): string {
    return this.selectedTravelEstimate;
  }

  public sanitizeValue(idx: number, val: string): void{
    if (parseInt(val)===0){
      this.Amounts[idx]="";
    }
  }

  public getOption(idx: number): string {
    return idx === 0 ? "Base" : ("Option " + idx)
  }

  private mounted(): void {
    this.periods = Periods.periods;
  }
}
</script>

