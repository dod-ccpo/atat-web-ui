<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Now we’ll estimate your training requirements
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
        <v-col cols="7">
          <ATATRadioGroup
            id="trainingEstimateType"
            legend="How do you want to estimate your cost for this training?"
            :items="trainingEstimateTypeOptions"
            :value.sync="instanceData.cost_estimate"
            :rules="[$validators.required('Please select an option.')]"
          />
        </v-col>
        <v-col cols="5">
          <div>
            <ATATAlert 
              type="callout"
              calloutBackground="base-lightest"
            >
              <template slot="content">
                <v-row>
                  <v-col class="d-flex justify-start">
                    <span>
                      <ATATSVGIcon 
                        width="37"
                        height="28"
                        name="menuBook"
                      />
                     
                    </span>
                    &nbsp; &nbsp;
                    <h2>Training #{{trainingIndex + 1}}</h2>
                  </v-col>
                  <v-col class="d-flex justify-end">
                    <h3 class="text-base-light">
                      {{trainingIndex + 1}} of {{trainingCount}}
                    </h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <h3>{{trainingTitle}}</h3>
                    <p class="text-base-light">
                      {{trainingLocation}}
                    </p>
                  </v-col>
                </v-row>
              </template>
            </ATATAlert>
          </div>
        </v-col>
      </v-row>
      <div v-if="instanceData.cost_estimate !== ''">
        <v-row>
          <v-col>
            <ATATRadioGroup
              :legend="periodTypeLabel"
              :items="periodTypeOptions"
              :value.sync="instanceData.estimate.option"
              :rules="[
                $validators.required('Please select an option.')
              ]"
            />
            <br />
            <div v-if="instanceData.estimate.option !== ''">
              <ATATSingleAndMultiplePeriods
                :periods="periods"
                :textboxSuffix="periodsSuffix"
                :singlePeriodLabel="periodsLabel"
                :multiplePeriodLabel="periodsLabel"
                :isMultiple="instanceData.estimate.option === 'MULTIPLE'"
                :values.sync="instanceData.estimate.estimated_values"
                :showSinglePeriodTooltip="false"
                :singlePeriodErrorMessage="singlePeriodErrorMessage"
                :multiplePeriodErrorMessage="multiplePeriodErrorMessage"
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
import { 
  RadioButton, 
  SingleMultiple, 
  TRAINING_TYPE,
  TRAINING_FACILITY_TYPE
} from "../../../../types/Global";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { PeriodDTO, TrainingEstimateDTO } from "@/api/models";
import Periods from "@/store/periods";
import IGCE from "@/store/IGCE";
import DescriptionOfWork from "@/store/descriptionOfWork";
import _ from "lodash";
import { defaultTrainingEstimateDTO } from "@/store/IGCE";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods,
    ATATAlert,
    ATATSVGIcon
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

  public periodTypeOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes",
      value: "SINGLE",
    },
    {
      id: "No",
      label: "No",
      value: "MULTIPLE",
    },
  ];

  public periods: PeriodDTO[] | null = [];

  public instanceData: TrainingEstimateDTO = defaultTrainingEstimateDTO();

  public get currentData(): TrainingEstimateDTO {
    return this.instanceData;
  }

  public savedData: TrainingEstimateDTO = defaultTrainingEstimateDTO();

  public periodTypeLabel = "";
  public periodsSuffix = "";
  public periodsLabel = "";
  public singlePeriodErrorMessage = "";
  public multiplePeriodErrorMessage = "";

  public trainingIndex = 0;
  public trainingCount = 0;

  public trainingTitle = "[User's training title]";
  public trainingLocation = `On-site instructor led CONUS 
    (government facility, Washington, DC, 10 people)`;

  @Watch("instanceData.cost_estimate")
  private updateSelections(): void {
    switch(this.instanceData.cost_estimate){
    case "PER_PERSON":
      this.periodsSuffix = "people";
      this.periodsLabel = "Number of people trained per period";
      this.periodTypeLabel = `Do you anticipate needing the same number of 
        people trained within each performance period?`;
      this.singlePeriodErrorMessage = `Enther the number of people 
        expected to be trained each period.`
      this.multiplePeriodErrorMessage = `Enther the number of people 
        expected to be trained in this period.`
      break;
    case "PER_SESSION":
      this.periodsSuffix = "sessions";
      this.periodsLabel = "Number of training sessions per period";
      this.periodTypeLabel = `Do you anticipate needing the same number of 
        training sessions each performance period?`;
      this.singlePeriodErrorMessage = `Enther the number of training 
        sessions each period.`
      this.multiplePeriodErrorMessage = `Enther the number of training 
        sessions in this period.`
      break;
    case "SUBSCRIPTION":
      this.periodsSuffix = "months";
      this.periodsLabel = "Number of months per period";
      this.periodTypeLabel = `Do you anticipate needing subscriptions for 
        the same number of months within each performance period?`;
      this.singlePeriodErrorMessage = `Enther the number of subscriptions 
        each period.`
      this.multiplePeriodErrorMessage = `Enther the number of subscriptions 
        in this period.`
      break;
    default:
      this.periodsSuffix = "";
      this.periodsLabel = "";
      this.periodTypeLabel = "";
      this.singlePeriodErrorMessage = "";
      this.multiplePeriodErrorMessage = "";
      break;
    }

    this.instanceData.estimate.option = "";
    this.instanceData.estimate.estimated_values = [];
  }

  protected async loadOnEnter(): Promise<boolean> {
    this.periods = Periods.periods;

    this.trainingIndex = IGCE.igceTrainingIndex;

    const dowTrainingItems = DescriptionOfWork.DOWObject.find(
      item => item.serviceOfferingGroupId === "TRAINING"
    );

    if(dowTrainingItems && dowTrainingItems.otherOfferingData){
      this.trainingCount = dowTrainingItems.otherOfferingData.length;
      const trainingItem = dowTrainingItems.otherOfferingData[this.trainingIndex];

      if(trainingItem){
        this.trainingTitle = trainingItem.requirementTitle as string;

        const trainingType = TRAINING_TYPE[trainingItem.trainingType as keyof typeof TRAINING_TYPE];

        const trainingFacilityType = TRAINING_FACILITY_TYPE[
          trainingItem.trainingFacilityType as keyof typeof TRAINING_FACILITY_TYPE
        ];

        this.trainingLocation = `${trainingType} 
          (${trainingFacilityType ? trainingFacilityType + ', ' : ''}
          ${trainingItem.trainingLocation ? trainingItem.trainingLocation + ', ' : ''} 
          ${trainingItem.trainingPersonnel} people)`;
      }
    }

    if(this.trainingIndex > -1 && 
      IGCE.requirementsCostEstimate &&
      this.trainingIndex < IGCE.requirementsCostEstimate.training.length
    ){
      this.instanceData = _.cloneDeep(IGCE.requirementsCostEstimate.training[this.trainingIndex]);
      this.savedData = _.cloneDeep(IGCE.requirementsCostEstimate.training[this.trainingIndex]);

      this.$nextTick(() => {
        this.instanceData.estimate = _.cloneDeep(this.savedData.estimate);
      });
    }
      

    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try{
      if(this.hasChanged())
        await IGCE.saveTrainingEstimate(this.currentData);
    } catch (error){
      console.log(error);
    }
    return true;
  }

}
</script>