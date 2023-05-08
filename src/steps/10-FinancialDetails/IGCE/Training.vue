<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width mb-7">
      <v-row>
        <v-col class="col-12">

          <h1 class="page-header">
            Now we’ll estimate your training requirements
          </h1>
          <p class="page-intro">
            Considering the training details you previously outlined in Performance 
            Requirements, answer the following questions to estimate costs for each 
            training. We’ll take care of calculating your total estimates within 
            the IGCE.
          </p>
          <div class="d-flex justify-space-between">
            <div class="mr-10">
              <ATATRadioGroup
                id="trainingEstimateType"
                class="mb-8"
                legend="How do you want to estimate your cost for this training?"
                :items="trainingEstimateTypeOptions"
                :value.sync="instanceData.costEstimateType"
                :rules="[$validators.required('Please select an option.')]"
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
                  <div class="d-flex justify-space-between mb-4 width-100" >
                    <div>
                      <div class="d-flex">
                        <ATATSVGIcon 
                          width="37"
                          height="28"
                          name="menuBook"
                          class="mr-2"
                        />
                        <h2>Training #{{trainingIndex + 1}}</h2>
                      </div>
                    </div>
                    <div class="h3 text-base">
                      {{trainingIndex + 1}} of {{trainingCount}}
                    </div>
                  </div>

                  <div class="h3">{{trainingTitle}}</div>
                  <p class="text-base-darkest mb-0">
                    {{trainingLocation}}
                  </p>

                </template>
              </ATATAlert> 
            </div>
          </div>

          <div v-if="instanceData.costEstimateType !== ''">
            <ATATTextField
              id="CostEstimatePrice"
              name="CostEstimatePrice"
              class="mb-10"
              :label="costEstimateLabel"
              :suffix="costEstimateSuffix"
              :isCurrency="true"
              :value.sync="instanceData.estimatedTrainingPrice"
              :tooltipText="costEstimateTooltipText"
              width="234"
              :rules="costEstimateRules"
              :alignRight="true"
            />
              
            <div v-if="instanceData.costEstimateType !== 'ANNUAL_SUBSCRIPTION'">
              <ATATRadioGroup
                class="mb-8"
                id="TrainingType"
                :legend="periodTypeLabel"
                :items="periodTypeOptions"
                :value.sync="instanceData.trainingOption"
                @radioButtonClicked="radioButtonClicked"
                :rules="[
                  $validators.required('Please select an option.')
                ]"
              />

              <div v-if="instanceData.trainingOption !== ''">
                <ATATSingleAndMultiplePeriods
                  :periods="periods"
                  :textboxSuffix="periodsSuffix"
                  :singlePeriodLabel="periodsLabel"
                  :multiplePeriodLabel="periodsLabel"
                  :isMultiple="instanceData.trainingOption === 'MULTIPLE'"
                  :showSinglePeriodTooltip="false"
                  :singlePeriodErrorMessage="singlePeriodErrorMessage"
                  :multiplePeriodErrorMessage="multiplePeriodErrorMessage"
                  :values.sync="valueArray"
                  :sysIdValueArray.sync="sysIdValueArray"
                />
                
              </div>
            </div>

          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
/* eslint camelcase: 0, prefer-const: 1 */
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
import { hasChanges, convertEstimateData } from "@/helpers";

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
      id: "PerClass",
      label: "Individual training course (Pay per class/session)",
      value: "PER_CLASS"
    },
    {
      id: "AnnualSubscription",
      label: "Annual subscription",
      value: "ANNUAL_SUBSCRIPTION"
    },
    {
      id: "MonthlySubscription",
      label: "Monthly subscription",
      value: "MONTHLY_SUBSCRIPTION"
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

  public instanceData: TrainingEstimate = defaultTrainingEstimate();

  public get currentData(): TrainingEstimate {
    return this.instanceData;
  }
  public sysIdValueArray: Record<string, string>[] = [];
  public valueArray: string[] = [];

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
  public cloudSupportEnvironmentInstance = "";

  public trainingTitle = "[User's training title]";
  public trainingLocation = `On-site instructor led CONUS 
    (government facility, Washington, DC, 10 people)`;

  /**
   * keeps instanceData.estimate.option in sync with 
   * instanceData.trainingOption
   */
  @Watch("instanceData.trainingOption")
  protected trainingOptions(val: SingleMultiple): void {
    this.instanceData.estimate.option = val;
  }

  @Watch("instanceData.costEstimateType")
  private updateSelections(): void {
    switch(this.instanceData.costEstimateType){
    case "PER_PERSON":
      this.periodsSuffix = "people";
      this.periodsLabel = "Number of people trained per period";
      this.periodTypeLabel = `Do you anticipate needing the same number of 
        people trained within each performance period?`;
      this.singlePeriodErrorMessage = `Enter the number of people 
        expected to be trained each period.`
      this.multiplePeriodErrorMessage = `Enter the number of people 
        expected to be trained in this period.`
      this.costEstimateLabel = `Estimated price per person`;
      this.costEstimateSuffix = `/person`;
      this.costEstimateTooltipText = `This estimate will be applied to all performance 
        periods that you specified in the Performance Requirements section.`;
      this.costEstimateRules = 
        [this.$validators.required('Enter your estimated price per person.')];
      break;
    case "PER_CLASS":
      this.periodsSuffix = "sessions";
      this.periodsLabel = "Number of training sessions per period";
      this.periodTypeLabel = `Do you anticipate needing the same number of 
        training sessions each performance period?`;
      this.singlePeriodErrorMessage = `Enter the number of training 
        sessions each period.`
      this.multiplePeriodErrorMessage = `Enter the number of training 
        sessions in this period.`
      this.costEstimateLabel = `Estimated price per session`;
      this.costEstimateSuffix = `/session`;
      this.costEstimateTooltipText = `This estimate will be applied to all performance 
        periods that you specified in the Performance Requirements section.`;
      this.costEstimateRules = 
        [this.$validators.required('Enter your estimated price per session.')];
      break;
    case "MONTHLY_SUBSCRIPTION":
      this.periodsSuffix = "months";
      this.periodsLabel = "Number of months per period";
      this.periodTypeLabel = `Do you anticipate needing subscriptions for 
        the same number of months within each performance period?`;
      this.singlePeriodErrorMessage = `Enter the number of subscriptions 
        each period.`
      this.multiplePeriodErrorMessage = `Enter the number of subscriptions 
        in this period.`
      this.costEstimateLabel = `Estimated price for all subscriptions`;
      this.costEstimateSuffix = "/month";
      this.costEstimateTooltipText = "";
      this.costEstimateRules = 
        [this.$validators.required('Enter your estimated price per month.')];
      break;
    case "ANNUAL_SUBSCRIPTION":
      this.periodsSuffix = "";
      this.periodsLabel = "";
      this.periodTypeLabel = "";
      this.costEstimateSuffix = "/year";
      this.costEstimateLabel = `Estimated price for all subscriptions`;
      this.costEstimateTooltipText = "";
      this.costEstimateRules = 
        [this.$validators.required('Enter your estimated price per year.')];
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
    this.instanceData.estimate.estimated_values = "";
    this.instanceData.trainingOption = "";
  }

  private radioButtonClicked(): void {
    this.sysIdValueArray = [];
    this.valueArray = [];
  }

  protected loadOnEnter(): boolean {
    this.periods = Periods.periods;

    this.trainingIndex = IGCE.igceTrainingIndex;

    const dowTrainingItems = DescriptionOfWork.DOWObject.find(
      item => item.serviceOfferingGroupId === "TRAINING"
    );
    if(dowTrainingItems && dowTrainingItems.otherOfferingData){

      this.trainingCount = dowTrainingItems.otherOfferingData.length;
      const trainingItem = dowTrainingItems.otherOfferingData[this.trainingIndex];
      this.cloudSupportEnvironmentInstance = trainingItem.sysId || "";

      if(trainingItem){
        this.trainingTitle = trainingItem.trainingRequirementTitle as string;

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
      IGCE.trainingItems[this.trainingIndex].cloudSupportEnvironmentInstance = 
        this.cloudSupportEnvironmentInstance;
      this.instanceData = _.cloneDeep(IGCE.trainingItems[this.trainingIndex]);
      this.savedData = _.cloneDeep(IGCE.trainingItems[this.trainingIndex]);

      this.$nextTick(() => {
        if(this.savedData.estimate){
          const scrubbedEstimates =
            (this.savedData.estimate.estimated_values?.replaceAll("\\", "") || "")
          const estValues = JSON.parse(scrubbedEstimates);
          this.instanceData.estimate.estimated_values = scrubbedEstimates;

          /** ON first component load instanceData.estimate.option is an []
           *  OTHERWISE instanceData.estimate.option is an {}
           * 
           *  code below accommodates for both [] && {}
          */
          let hasEstimates = false;
          if (Array.isArray(estValues) && estValues.length>0){
            this.instanceData.estimate.option = 
              Object.keys(estValues[0])[0].toUpperCase() === "PER_PERIOD" 
                ? "SINGLE" : "MULTIPLE";
            hasEstimates = true;
          } else if (estValues && Object.keys(estValues).length > 0){
            this.instanceData.estimate.option = 
              Object.keys(estValues)[0].toUpperCase() === "PER_PERIOD" 
                ? "SINGLE" : "MULTIPLE";
            hasEstimates = true;
          }
          
          if (hasEstimates){
            this.instanceData.trainingOption = this.instanceData.estimate.option || "";
            this.setValueArray(estValues);
          }
        }
        if(this.savedData.costEstimateType){
          this.instanceData.costEstimateType = this.savedData.costEstimateType;
        }
        
        this.$nextTick(() => {
          if(this.savedData.estimatedTrainingPrice)
            this.instanceData.estimatedTrainingPrice = _.cloneDeep(
              this.savedData.estimatedTrainingPrice);
        });
        
      });
    }
    return true;
  }

  /**
   * iterate through periods to ensure they are in chronogical order 
   * based on period.sys_ids
   * 
   * sets this.Value Array with correctly ordered period/valus 
   */
  public setValueArray(estValues: Record<string, string>): void{
    const isSingle = this.instanceData.estimate.option === "SINGLE";

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
  

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try{
      if (this.instanceData.trainingOption.toLowerCase()==="single"){
        this.sysIdValueArray = [];
        //eslint-disable-next-line prefer-const
        let obj:Record<string, string>= {};
        obj["PER_PERIOD"] = this.valueArray[0];
        this.sysIdValueArray.push(obj);
      }
      this.currentData.estimate.estimated_values = 
        convertEstimateData(this.sysIdValueArray);
      this.currentData.cloudSupportEnvironmentInstance = 
        this.cloudSupportEnvironmentInstance;
      
      if(this.hasChanged()){  
        await IGCE.setTrainingEstimate(this.currentData);
      }
    } catch (error){
      console.log(error);
    }
    return true;
  }
  
  

}

</script>