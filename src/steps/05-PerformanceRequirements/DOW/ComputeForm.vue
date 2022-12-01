<template>
  <div>
    <h1 class="page-header mb-3" tabindex="-1">
      <span v-if="firstTimeHere">Let’s start by gathering your Compute requirements</span>
      <span v-else>
        Let’s gather some details for Compute Instance #{{ _computeData.instanceNumber }}
      </span>
    </h1>
    <p 
      class="copy-max-width"
      :class="isClassificationDataMissing || isPeriodsDataMissing ? 'mb-4' : 'mb-10'"
    >
      <span v-if="firstTimeHere">
        In this section, we’ll collect details about each compute instance that you need. 
      </span>

      If you need multiple, we’ll walk through them one at a time. 
      <span v-if="avlClassificationLevelObjects.length === 1">
        You previously specified <strong>{{ singleClassificationLevelName }}</strong> 
        as the classification level for all requirements. If you need any instances
        within a different level, 
        <a 
          role="button" 
          id="UpdateClassificationFromIntro"
          tabindex="0"
          @click="openModal"
          @keydown.enter="openModal"
          @keydown.space="openModal"
        >update your Classification Requirements</a>.
      </span>
    </p>
    
    <DOWSubtleAlert
      v-show="isClassificationDataMissing || isPeriodsDataMissing"
      :isClassificationDataMissing="isClassificationDataMissing"
      :isPeriodsDataMissing="isPeriodsDataMissing"
      class="copy-max-width"
    />

    <v-expand-transition>
      <ATATAlert
        id="ErrorsOnLoadAlert"
        v-show="formHasErrors === true && formHasBeenTouched === true"
        type="error"
        class="mb-10"
      >
        <template v-slot:content>
          <p class="mb-0" id="ErrorsOnLoadAlertText">
            Some of your info is missing. You can add it now or come back at any 
            time before finalizing your acquisition package.
          </p>
        </template>
      </ATATAlert>
    </v-expand-transition>

    <h2 class="mb-5" id="FormSection1Heading">
      1. 
      <span v-if="firstTimeHere">
        Tell us about Instance #{{ _computeData.instanceNumber }}
      </span>
      <span v-else>
        Instance details
      </span>
    </h2>
    <ATATRadioGroup
      id="EnvironmnetType"
      legend="What type of environment is this instance?"
      :value.sync="_computeData.environmentType"
      :items="EnvironmentTypeOptions"
      name="EnvironmnetType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of environment.')]"
    />

    <div v-if="avlClassificationLevelObjects.length > 1" class="mb-8">
      <ATATRadioGroup
        id="ClassificationLevel"
        legend="What classification level is this instance deployed in?"
        :value.sync="_computeData.classificationLevel"
        :items="classificationRadioOptions"
        name="ClassificationLevel"
        class="mt-3 mb-2"
        :tooltipText="classificationTooltipText"
        tooltipLabel="Classification level for this instance"
        :rules="[$validators.required('Please select a classification level.')]"
      />
      <a 
        role="button" 
        id="UpdateClassificationFromRadios"
        tabindex="0"
        @click="openModal"
        @keydown.enter="openModal"
        @keydown.space="openModal"
      >Update your Classification Requirements</a>
    </div>

    <p class="d-flex mb-4">
      <span class="font-weight-500">What region(s) do you need this instance deployed in?</span>
      <span class="optional">Optional</span>
      <ATATTooltip 
        class="d-block ml-2"
        id="Region"
        :tooltipText="regionTooltipText"
        label="Region selection"
      />
    </p>
    <ATATCheckboxGroup 
      id="Regions"
      ref="regionsCheckbox"
      aria-describedby="CheckboxGroupLabel"
      :value.sync="_computeData.deployedRegions"
      :items="regionCheckboxOption"
      :card="false"
      class="copy-max-width mb-10"
      :hasOtherValue="true"
      :otherValue="otherRegionValue"
      :otherValueEntered.sync="_computeData.deployedRegionsOther"
      :otherValueRequiredMessage="otherRegionValueRequiredMessage"
      otherEntryType="textfield"
    />

    <DescriptionOfNeed
      :anticipatedNeedUsage.sync="_computeData.anticipatedNeedUsage"
      :index="0"
      :textAreaWithCounter="true"
      requirementOrInstance="instance"
    />

    <EntireDuration
      :entireDuration.sync="_computeData.entireDuration"
      :periodsNeeded.sync="_computeData.periodsNeeded"
      :isPeriodsDataMissing="isPeriodsDataMissing"
      :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
      :index="0"
      requirementOrInstance="instance"
    />

    <hr />

    <h2 id="FormSection2Heading" class="mb-5">2. Instance configurations</h2>

    <v-row class="mt-7">
      <v-col class="col-md-12 col-lg-9">
        <ATATTextField
          ref="operatingSystemAndLicensing"
          id="OperatingSystemAndLicensing"
          label="Operating system and licensing"
          :tooltipText="operatingSystemTooltipText"
          :value.sync="_computeData.operatingSystemAndLicensing"
          :rules="[
            $validators.required('Please describe your OS and licensing requirements.')
          ]"
        />
      </v-col>
    </v-row>
    <v-row class="mt-7">
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="NumberOfVCPUs"
          label="Number of vCPUs"
          :tooltipText="VCPUTooltipText"
          :value.sync="_computeData.numberOfVCPUs"
          type="number"
          :allowDecimals="false"
          :rules="[
            $validators.required('Please enter a number greater than or equal to 0.')
          ]"
        />
      </v-col>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="Memory"
          label="Memory"
          :tooltipText="memoryTooltipText"
          :value.sync="_computeData.memory"
          appendText="GB"
          type="number"
          :rules="[
            $validators.required('Please enter a number greater than or equal to 0.')
          ]"
        />
      </v-col>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATSelect
          id="StorageType"
          label="Storage type"
          :items="storageTypes"
          :selectedValue.sync="_computeData.storageType"
          :rules="[
            $validators.required('Select a storage type.')
          ]"
        />
      </v-col>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="StorageAmount"
          ref="storageAmount"
          label="Storage amount"
          :tooltipText="storageAmountTooltipText"
          :value.sync="_computeData.storageAmount"
          appendText="GB"
          type="number"
          :rules="[
            $validators.required('Please enter a number greater than or equal to 0.')
          ]"
        />
      </v-col>
    </v-row>

    <ATATRadioGroup
      class="my-10"
      id="PerformanceTier"
      legend="Performance tier"
      :items="performanceTiers"
      :value.sync="_computeData.performanceTier"
      :rules="[
        $validators.required('Please select your performance tier.')
      ]"
      :tooltipText="performanceTierTooltipText"
      :hasOtherValue="true"
      :otherValue="otherPerformanceTierValue"
      :otherValueEntered.sync="_computeData.performanceTierOther"
      :otherValueRequiredMessage="otherPerformanceTierValueRequiredMessage"
      :validateOtherNow="validateOtherTierNow"
      :validateOtherOnBlur="validateOtherTierOnBlur"
      :clearOtherValidation="clearOtherTierValidation"
    />

    <v-row>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="NumberOfInstancesNeeded"
          ref="numberOfInstancesNeeded"
          label="Number of instances needed"
          :tooltipText="numberOfInstancesTooltipText"
          :value.sync="_computeData.numberOfInstancesNeeded"
          type="number"
          :rules="[
            $validators.required('Enter a number greater than or equal to 1.'),
            $validators.greaterThan(0, 'Enter a number greater than or equal to 1.'),            
          ]"
        />
      </v-col>
    </v-row>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATTooltip from "@/components/ATATTooltip.vue"

import DescriptionOfNeed from "../../../components/DOW/DescriptionOfNeed.vue"
import DOWSubtleAlert from "./DOWSubtleAlert.vue";
import EntireDuration from "./EntireDuration.vue"

import { ClassificationLevelDTO } from "@/api/models";

import { 
  Checkbox, 
  OtherServiceOfferingData,
  RadioButton,
  SelectData,
} from "../../../../types/Global";

@Component({
  components: {
    ATATAlert,
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATSelect,
    ATATTextArea,
    ATATTextField,
    ATATTooltip,
    DescriptionOfNeed,
    DOWSubtleAlert,
    EntireDuration,
  }
})

export default class ComputeForm extends Vue {
  @PropSync("computeData") public _computeData!: OtherServiceOfferingData;
  @Prop() public firstTimeHere!: boolean;
  @Prop() public isClassificationDataMissing!: boolean;
  @Prop() public isPeriodsDataMissing!: boolean;
  @Prop() public avlClassificationLevelObjects!: ClassificationLevelDTO[];
  @Prop() public singleClassificationLevelName!: string | undefined;
  @Prop() public otherRegionValue!: string;
  @Prop() public otherPerformanceTierValue!: string;
  @Prop() public formHasErrors!: boolean;
  @Prop() public formHasBeenTouched!: boolean;
  @Prop() public classificationRadioOptions!: RadioButton[];
  @Prop() public classificationTooltipText!: string;
  @Prop() public availablePeriodCheckboxItems!: Checkbox[];
  @Prop() public validateOtherTierNow!: boolean;
  @Prop() public validateOtherTierOnBlur!: boolean;
  @Prop() public clearOtherTierValidation!: boolean;

  public openModal(): void {
    this.$emit("openModal");
  }

  public updated(): void {
    this.$emit("formUpdate");
  }

  public EnvironmentTypeOptions: RadioButton[] = [
    {
      id: "DevTesting",
      label: "Dev/Testing",
      value: "Dev/Testing",
    },
    {
      id: "PreProdStaging",
      label: "Pre-production/Staging",
      value: "Pre-production/Staging",
    },
    {
      id: "Production",
      label: "Production",
      value: "Production",
    },
  ];

  public regionCheckboxOption: Checkbox[] = [
    {
      id: "CONUSEast",
      label: "CONUS East",
      value: "CONUS East",
    },
    {
      id: "CONUSCentral",
      label: "CONUS Central",
      value: "CONUS Central",
    },
    {
      id: "CONUSWest",
      label: "CONUS West",
      value: "CONUS West",
    },
    {
      id: "OCONUS",
      label: "OCONUS",
      value: "OCONUS",
    },
    {
      id: "Other",
      label: "Other",
      value: "OtherRegion",
    },
  ];

  public otherRegionValueRequiredMessage = "Please enter your other region(s).";

  public storageTypes: SelectData[] = [
    { text: "General Purpose SSD", value: "General Purpose SSD" },
    { text: "Provisioned IOPS SSD", value: "Provisioned IOPS SSD" },
    { text: "Nearline", value: "Nearline" },
    { text: "Offline", value: "Offline" },
    { text: "Other", value: "Other" },
  ];

  public performanceTiers: RadioButton[] = [
    {
      id: "PerformancePremium",
      label: "High performance (Premium)",
      value: "Premium",
    },
    {
      id: "PerformanceStandard",
      label: "Medium performance (Standard)",
      value: "Standard",
    },
    {
      id: "PerformanceBasic",
      label: "Low performance (Basic)",
      value: "Basic",
    },
    {
      id: "PerformanceOther",
      label: "Other",
      value: "OtherPerformance",
    },
  ];
  public otherPerformanceTierValueRequiredMessage 
    = "Please enter your other performance tier.";

  public regionTooltipText = `This is the geographic location where your public cloud 
    resources are located, e.g., within the continental U.S. (CONUS) or outside of the 
    continental U.S. (OCONUS). If you need a certain location, select Other and enter 
    your specifications.`;

  public operatingSystemTooltipText = `Specify the type of OS you want to run your 
    instance on. Provide details about your licensing scenario, to include the number 
    of licenses.`;

  public VCPUTooltipText = `A vCPU, or virtual centrallized processing unit, represents 
    a portion or share of the underlying, physical CPU that is assigned to a particular 
    virtual machine.`;

  public memoryTooltipText = `Enter the amount of Random Access Memory (RAM) you need 
    to store data short-term for performing computing operations.`;

  public storageAmountTooltipText = `Enter the amount of storage you need to access 
    and store data on a long-term basis.`;

  public performanceTierTooltipText = `This refers to your network speed and service 
    availability. If you have size and performance details, select Other and enter 
    your specifications.`;

  public numberOfInstancesTooltipText = `Specify the number of instances you need 
    with these configurations.`;

}

</script>
