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
            :value.sync="instanceData.costEstimateType"
            :rules="[$validators.required('Please select an option.')]"
          />
          <br/>
          <div class="col-sm-12 col-md-6" 
            v-if="instanceData.costEstimateType !== '' && 
            instanceData.costEstimateType !== 'SUBSCRIPTION'">
            <ATATTextField
              id="CostEstimatePrice"
              name="CostEstimatePrice"
              :label="costEstimateLabel"
              :suffix="costEstimateSuffix"
              :isCurrency="true"
              :value.sync="instanceData.estimatedTrainingPrice"
              :tooltipText="costEstimateTooltipText"
              :rules="costEstimateRules"
            />
          </div>
          <div v-if="instanceData.costEstimateType === 'SUBSCRIPTION'">
            <ATATRadioGroup
              id="CostEstimateSubscriptionType"
              name="CostEstimateSubscriptionType"
              :items="subscriptionTypeOptions"
              :legend="costEstimateLabel"
              :value.sync="instanceData.subscriptionType"
              :rules="[$validators.required('Please select an option.')]"
            />
            <div class="col-sm-12 col-md-7" v-if="instanceData.subscriptionType !== ''">
              <ATATTextField
                id="CostEstimateSubscriptionPrice"
                name="CostEstimateSubscriptionPrice"
                label="Estimated price for all subscriptions"
                :suffix="costEstimateSuffix"
                :isCurrency="true"
                width="234"
                :tooltipText="costEstimateTooltipText"
                :value.sync="instanceData.estimatedTrainingPrice"
                :rules="costEstimateRules"
              />
            </div>
          </div>
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
      <div v-if="instanceData.costEstimateType !== ''">
        <v-row>
          <v-col>
            <ATATRadioGroup
              :legend="periodTypeLabel"
              :items="periodTypeOptions"
              :value.sync="instanceData.trainingOption"
              :rules="[
                $validators.required('Please select an option.')
              ]"
            />
            <br />
            <div v-if="instanceData.trainingOption !== ''">
              <ATATSingleAndMultiplePeriods
                :periods="periods"
                :textboxSuffix="periodsSuffix"
                :singlePeriodLabel="periodsLabel"
                :multiplePeriodLabel="periodsLabel"
                :isMultiple="instanceData.trainingOption === 'MULTIPLE'"
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
  TrainingEstimate,
  TRAINING_TYPE,
  TRAINING_FACILITY_TYPE
} from "../../../../types/Global";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { PeriodDTO, TrainingEstimateDTO } from "@/api/models";
import Periods from "@/store/periods";
import IGCE from "@/store/IGCE";
import DescriptionOfWork from "@/store/descriptionOfWork";
import _ from "lodash";
import { defaultTrainingEstimate } from "@/store/IGCE";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods,
    ATATAlert,
    ATATSVGIcon,
    ATATTextField
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

  public subscriptionTypeOptions: RadioButton[] = [
    {
      id: "Annual",
      label: "Annual Subscription",
      value: "ANNUAL"
    },
    {
      id: "Monthly",
      label: "Monthly Subscription",
      value: "MONTHLY"
    }
  ]

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

  public instanceData: TrainingEstimate = defaultTrainingEstimate();

  public get currentData(): TrainingEstimate {
    return this.instanceData;
  }

  public savedData: TrainingEstimate = defaultTrainingEstimate();

  public periodTypeLabel = "";
  public periodsSuffix = "";
  public periodsLabel = "";
  public singlePeriodErrorMessage = "";
  public multiplePeriodErrorMessage = "";
  public costEstimateLabel = "";
  public costEstimateSuffix = "";
  public costEstimateTooltipText = "";
  public costEstimateRules: Array<unknown> = [];

  public trainingIndex = 0;
  public trainingCount = 0;

  public trainingTitle = "[User's training title]";
  public trainingLocation = `On-site instructor led CONUS 
    (government facility, Washington, DC, 10 people)`;

  @Watch("instanceData.costEstimateType")
  private updateSelections(): void {
    switch(this.instanceData.costEstimateType){
    case "PER_PERSON":
      this.periodsSuffix = "people";
      this.periodsLabel = "Number of people trained per period";
      this.periodTypeLabel = `Do you anticipate needing the same number of 
        people trained within each performance period?`;
      this.singlePeriodErrorMessage = `Enther the number of people 
        expected to be trained each period.`
      this.multiplePeriodErrorMessage = `Enther the number of people 
        expected to be trained in this period.`
      this.costEstimateLabel = `Estimated price per person`;
      this.costEstimateSuffix = `/person`;
      this.costEstimateTooltipText = `This estimate will be applied to all performance 
        periods that you specified in the Performance Requirements section.`;
      this.costEstimateRules = [this.$validators.required('Please select an option.')];
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
      this.costEstimateLabel = `Estimated price per session`;
      this.costEstimateSuffix = `/session`;
      this.costEstimateTooltipText = `This estimate will be applied to all performance 
        periods that you specified in the Performance Requirements section.`;
      this.costEstimateRules = [this.$validators.required('Please select an option.')];
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
      this.costEstimateLabel = `What type of subscription do you plan on 
        using for your price estimate?`;
      this.costEstimateSuffix = "";
      this.costEstimateTooltipText = "";
      this.costEstimateRules = [];
      break;
    default:
      this.periodsSuffix = "";
      this.periodsLabel = "";
      this.periodTypeLabel = "";
      this.singlePeriodErrorMessage = "";
      this.multiplePeriodErrorMessage = "";
      this.costEstimateLabel = "";
      this.costEstimateSuffix = "";
      this.costEstimateTooltipText = "";
      this.costEstimateRules = [];
      break;
    }

    this.instanceData.estimate.estimated_values = [];
    this.instanceData.trainingOption = "";
    this.instanceData.subscriptionType = "";
  }

  @Watch("instanceData.subscriptionType")
  public updateSubscriptionSelections(): void {
    this.instanceData.estimatedTrainingPrice = "";
    switch(this.instanceData.subscriptionType){
    case "ANNUAL":
      this.costEstimateSuffix = `/year`;
      this.costEstimateRules = [this.$validators.required('Please select an option.')];
      this.costEstimateTooltipText = `This estimate will be applied to all performance 
        periods that you specified in the Performance Requirements section.`;
      break;
    case "MONTHLY":
      this.costEstimateSuffix = `/month`;
      this.costEstimateRules = [this.$validators.required('Please select an option.')];
      this.costEstimateTooltipText = `This estimate will be applied to all performance 
        periods that you specified in the Performance Requirements section.`;
      break;
    default:
      this.costEstimateSuffix = "";
    }
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
      this.trainingIndex < IGCE.trainingItems.length
    ){
      this.instanceData = _.cloneDeep(IGCE.trainingItems[this.trainingIndex]);
      this.savedData = _.cloneDeep(IGCE.trainingItems[this.trainingIndex]);

      this.$nextTick(() => {
        if(this.savedData.estimate)
          this.instanceData.estimate = _.cloneDeep(this.savedData.estimate);
        if(this.savedData.costEstimateType)
          this.instanceData.costEstimateType = _.cloneDeep(this.savedData.costEstimateType);
        if(this.savedData.subscriptionType)
          this.instanceData.subscriptionType = _.cloneDeep(this.savedData.subscriptionType);
        if(this.savedData.trainingOption)
          this.instanceData.trainingOption = _.cloneDeep(this.savedData.trainingOption);
        
        this.$nextTick(() => {
          if(this.savedData.estimatedTrainingPrice)
            this.instanceData.estimatedTrainingPrice = _.cloneDeep(
              this.savedData.estimatedTrainingPrice);
        });
        
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
        await IGCE.setTrainingEstimate(this.currentData);
    } catch (error){
      console.log(error);
    }
    return true;
  }

}
</script>