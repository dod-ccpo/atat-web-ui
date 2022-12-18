<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Now we'll estimate your training requirements
          </h1>
          <p class="page-intro">
            Considering the training details you previously outlined in Performance 
            Requirements, answer the following questions to estimate costs for each 
            training. We’ll take care of calculating your total estimates within 
            the IGCE.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <ATATRadioGroup
            id="trainingEstimateType"
            legend="How do you want to estimate your cost for this training?"
            :items="trainingEstimateTypeOptions"
            :value.sync="trainingEstimateType"
            :rules="[$validators.required('Please select an option.')]"
          />
        </v-col>
      </v-row>
      <div v-if="trainingEstimateType !== ''">
        <v-row>
          <v-col>
            <ATATRadioGroup
              :legend="durationLabel"
              :items="entireDurationOptions"
              :value.sync="entireDuration"
              :rules="[
                $validators.required('Please select an option.')
              ]"
            />
            <br />
            <div v-if="entireDuration !== ''">
              <ATATSingleAndMultiplePeriods
                :periods="periods"
                :textboxSuffix="periodsSuffix"
                :singlePeriodLabel="periodsLabel"
                :multiplePeriodLabel="periodsLabel"
                :isMultiple="entireDuration === 'NO'"
                :values.sync="periodEstimates"
                :showSinglePeriodTooltip="false"
              />
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { RadioButton } from "types/Global";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { PeriodDTO } from "@/api/models";
import Periods from "@/store/periods";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods
  }
})
export default class IGCETraining extends Mixins(SaveOnLeave) {

  public trainingEstimateTypeOptions: RadioButton[] = [
    {
      id: "PerPerson",
      label: "Individual training course (Pay per person)",
      value: "PER_PERSON"
    },
    {
      id: "PerSession",
      label: "Individual training course (Pay per class/session)",
      value: "PER_SESSION"
    },
    {
      id: "Subscription",
      label: "Subscription based",
      value: "SUBSCRIPTION"
    },
  ];

  public entireDurationOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes",
      value: "YES",
    },
    {
      id: "No",
      label: "No",
      value: "NO",
    },
  ];

  public periods: PeriodDTO[] | null = [];

  public trainingEstimateType = "";
  public entireDuration = "";
  public periodEstimates: string[] = [];

  public durationLabel = "";
  public periodsSuffix = "";
  public periodsLabel = "";

  @Watch("trainingEstimateType")
  private updateSelections(): void {
    switch(this.trainingEstimateType){
    case "PER_PERSON":
      this.periodsSuffix = "people";
      this.periodsLabel = "Number of people trained per period";
      this.durationLabel = `Do you anticipate needing the same number of 
        people trained within each performance period?`;
      break;
    case "PER_SESSION":
      this.periodsSuffix = "sessions";
      this.periodsLabel = "Number of training sessions per period";
      this.durationLabel = `Do you anticipate needing the same number of 
        training sessions each performance period?`;
      break;
    case "SUBSCRIPTION":
      this.periodsSuffix = "months";
      this.periodsLabel = "Number of months per period";
      this.durationLabel = `Do you anticipate needing subscriptions for 
        the same number of months within each performance period?`;
      break;
    default:
      this.periodsSuffix = "";
      this.periodsLabel = "";
      this.durationLabel = "";
      break;
    }

    this.entireDuration = "";
    this.periodEstimates = [];
  }

  protected async loadOnEnter(): Promise<boolean> {
    this.periods = Periods.periods;
    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }

}
</script>