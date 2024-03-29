<template>
  <div class="copy-max-width">
    <div 
      v-if="needs === 'data'">
      <ATATTextField
        width="234"
        type="number"
        :id="'DataTransfer_'+ index"
        :ref="'DataTransfer_'+ index + '_Ref'"
        :label="dataLabel"
        :tooltipText="dataTooltipText"
        :appendDropdown="true"
        :dropdownOptions="dataUnits"
        :value="_dataTextFieldValue"
        @update:value="_dataTextFieldValue = $event"
        :selectedDropdownValue="_dataDropdownValue"
        @update:selectedDropdownValue="_dataDropdownValue = $event"
        :rules="[
          $validators.required(
            'Enter the amount of data egress anticipated in this task order.'
          )
        ]"
        :dropDownRules="[
          $validators.required('Please select an option')
        ]"
      ></ATATTextField>
      <br/>
    </div>
    <div>
      <ATATRadioGroup
        :id="'DataIncrease_'+ index"
        :ref="'DataIncrease_'+ index + '_Ref'"
        :legend="increaseLabel"
        :items="increaseOptions"
        :value="_increaseSelection"
        @update:value="_increaseSelection = $event"
        :rules="[
          $validators.required('Please select an option.')
        ]"
      ></ATATRadioGroup>
      <br/>
    </div>
    <div v-if="_increaseSelection === 'YES'">
      <ATATRadioGroup
        :id="'EstimateGrowth_'+ index"
        :ref="'EstimateGrowth_'+ index + '_Ref'"
        :legend="growthLabel"
        :items="growthOptions"
        :value="_growthSelection"
        @update:value="_growthSelection = $event"

        :rules="[
          $validators.required('Please select an option.')
        ]"
      ></ATATRadioGroup>
      <br />
      <div v-if="_growthSelection !== ''" class="mb-6">
        <ATATSingleAndMultiplePeriods
          :id="'Periods'+ index "
          :ref="'Periods'+ index + '_Ref'"
          :needs="needs"
          :index="index"
          :periods="periods"
          :textboxSuffix="'%'"
          :singlePeriodLabel="percentageLabel"
          :multiplePeriodLabel="percentageLabel"
          :isMultiple="_growthSelection === 'MULTIPLE'"
          :values="_percentages"
          @update:value="_percentages = $event"
        ></ATATSingleAndMultiplePeriods>
      </div>
    </div>
    
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSingleAndMultiplePeriods from "@/components/ATATSingleAndMultiplePeriods.vue";
import { RadioButton, SelectData } from "types/Global";
import { PeriodDTO } from "@/api/models";

@Component({
  components: {
    ATATTextField,
    ATATRadioGroup,
    ATATSingleAndMultiplePeriods
  }
})
class AnticipatedDataNeeds extends Vue {
  @Prop({default: "data"}) private needs?: string;
  @Prop({default: 0}) private index?: number;
  @Prop({
    default: `Approximate data/internet egress across 
      the entire duration of your task order`
  }) private dataLabel?: string;
  @Prop({
    default: `This refers to the amount of data that gets transferred 
      from your organization's host network to the external networks.`
  }) private dataTooltipText?: string;
  @Prop() private periods!: PeriodDTO[];

  @PropSync("dataTextFieldValue") private _dataTextFieldValue?: number;
  @PropSync("dataDropdownValue", {default: "GB"}) private _dataDropdownValue?: string;
  @PropSync("percentages") private _percentages?: string[];
  @PropSync("increaseSelection") private _increaseSelection?: string;
  @PropSync("growthSelection") private _growthSelection?: string;

  private dataUnits: SelectData[] = [];

  private defaultDataUnits: SelectData[] = [
    { text: "GB", value: "GB" },
    { text: "TB", value: "TB" },
    { text: "PB", value: "PB" },
  ];

  private increaseLabel = "";
  private increaseOptions: RadioButton[] = [
    {
      id: `Accordion_${this.index}Question_${this.needs}_YES`,
      value: "YES",
      label: "Yes"
    }
  ];

  private growthLabel = "";
  private growthOptions: RadioButton[] = [
    {
      id: `Accordion_${this.index}Question_${this.needs}_Single`,
      value: "SINGLE",
      label: `I want to estimate a single growth percentage 
        for the entire duration of the task order.`
    },
    {
      id: `Accordion_${this.index}Question_${this.needs}_Multiple`,
      value: "MULTIPLE",
      label: `I want to customize growth percentage estimates 
        for the base and each option period.`
    }
  ];

  private percentageLabel = "";

  private setDataOptions(): void {
    if(!this.dataUnits || this.dataUnits.length == 0){
      this.dataUnits = this.defaultDataUnits;
    }

    this.increaseLabel = `Do you anticipate an increase in 
      data over the duration of the task order?`;

    this.increaseOptions.push({
      id: `Accordion_${this.index}Question_${this.needs}_NO`,
      value: "NO",
      label: "No, I expect the amount of data to remain static."
    });

    this.growthLabel = `How would you like to estimate 
      the growth in your data?`;

    this.percentageLabel = `Estimated percentage of growth in data`;
  }

  private setUserOptions(): void {
    this.increaseLabel = `Do you anticipate an increase in 
      users over the duration of your task order?`;

    this.increaseOptions.push({
      id: `Accordion_${this.index}Question_${this.needs}_NO`,
      value: "NO",
      label: "No, I expect the number of users to remain static."
    });

    this.growthLabel = `How would you like to estimate 
      the growth in your users?`;

    this.percentageLabel = `Estimated percentage of growth in users`;
  }

  public async mounted(): Promise<void> {
    if(this.needs === "data") {
      this.setDataOptions();
    } else if (this.needs === "user") {
      this.setUserOptions();
    }
  }

}
export default toNative(AnticipatedDataNeeds)
</script>
