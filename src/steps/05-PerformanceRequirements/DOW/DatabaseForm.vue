<template>
  <div>
    <h1 class="page-header mb-3" tabindex="-1">
      <span v-if="firstTimeHere">
        Next, let's start by gathering your requirements for Database
      </span>
      <span v-else>
        Let's gather some details for Database Instance #{{ _databaseData.instanceNumber }}
      </span>
    </h1>
    <p 
      class="copy-max-width"
      :class="isClassificationDataMissing || isPeriodsDataMissing ? 'mb-4' : 'mb-10'"
    >
      <span v-if="firstTimeHere">
        In this section, we'll collect details about each database instance that you need. 
      </span>

      If you need multiple, we'll walk through them one at a time. 
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
        Tell us about Instance #{{ _databaseData.instanceNumber }}
      </span>
      <span v-else>
        Instance details
      </span>
    </h2>

    <div v-if="avlClassificationLevelObjects.length > 1" class="mb-8">
      <ATATRadioGroup
        id="ClassificationLevel"
        legend="What classification and impact level do you need this instance deployed in?"
        :value.sync="_databaseData.classificationLevel"
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

    <ATATRadioGroup
      id="DatabaseType"
      legend="What type of database do you need?"
      :value.sync="_databaseData.environmentType"
      :items="DatabaseTypeOptions"
      name="DatabaseType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of environment.')]"
    />

    <ATATRadioGroup 
      id="OSLicensing"
      legend="Operating system licensing"
      :items="osLicensingRadioOptions"
      :value.sync="_databaseData.operatingSystemLicensing"
      name="OSLicensing"
      class="mt-3 mb-2"
      :rules="[$validators.required('Select a licensing option.')]"
    />

    <ATATRadioGroup 
      id="DatabaseLicensing"
      legend="Database licensing"
      :items="dbLicensingRadioOptions"
      :value.sync="_databaseData.databaseLicensing"
      name="DatabaseLicensing"
      class="mt-3 mb-2"
      :rules="[$validators.required('Select a licensing option.')]"
    />

    <hr />

    <h2 id="FormSection2Heading" class="mb-5">2. Database configurations</h2>

    <v-row class="mt-7">
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="NumberOfVCPUs"
          label="Number of vCPUs"
          :tooltipText="VCPUTooltipText"
          :value.sync="_databaseData.numberOfVCPUs"
          type="number"
          :allowDecimals="false"
          :rules="[
            $validators.required('Please enter a number greater than or equal to 1.')
          ]"
        />
      </v-col>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="ProcessorSpeed"
          label="Processor Speed"
          :tooltipText="processorSpeedTooltipText"
          :value.sync="_databaseData.processorSpeed"
          type="number"
          :allowDecimals="false"
          :rules="[
            $validators.required('Please enter a number greater than or equal to 1.')
          ]"
        />
      </v-col>
      <v-col class="col-md-12 col-lg-6">
        <ATATTextField
          ref="operatingSystem"
          id="OperatingSystem"
          label="Operating system"
          :tooltipText="operatingSystemTooltipText"
          :value.sync="_databaseData.operatingSystemAndLicensing"
          :rules="[
            $validators.required('Enter the name of an operating system')
          ]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="Memory"
          label="Memory"
          :tooltipText="memoryTooltipText"
          :value.sync="_databaseData.memory"
          appendText="GB"
          type="number"
          :rules="[
            $validators.required('Please enter a number greater than or equal to 0.')
          ]"
        />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATSelect
          id="StorageType"
          label="Storage type"
          :items="storageTypes"
          placeholder="- Select -"
          :selectedValue.sync="_databaseData.storageType"
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
          :value.sync="_databaseData.storageAmount"
          :appendDropdown="true"
          :dropdownOptions="dataUnits"
          :selectedDropdownValue.sync="_databaseData.storageUnit"
          type="number"
          :rules="[
            $validators.required('Please enter a number greater than or equal to 0.')
          ]"
        />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <v-row>
      <v-col class="col-sm-12 col-md-6 col-lg-6">
        <ATATTextField
          id="NetworkPerformance"
          ref="networkPerformance"
          label="Network performance"
          :tooltipText="networkPerformanceTooltipText"
          :value.sync="_databaseData.networkPerformance"
          type="number"
          :rules="[
            $validators.required('Enter a number greater than or equal to 1.'),         
          ]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="NumberOfInstancesNeeded"
          ref="numberOfInstancesNeeded"
          label="Number of instances needed"
          :tooltipText="numberOfInstancesTooltipText"
          :value.sync="_databaseData.numberOfInstancesNeeded"
          type="number"
          :rules="[
            $validators.required('Enter a number greater than or equal to 1.'),
            $validators.greaterThan(0, 'Enter a number greater than or equal to 1.'),            
          ]"
        />
      </v-col>
    </v-row>

    <hr />

    <h2 class="mb-5" id="FormSection3Heading">
      3. Anticipated need and duration
    </h2>

    <DescriptionOfNeed
      :anticipatedNeedUsage.sync="_databaseData.anticipatedNeedUsage"
      :index="0"
      :textAreaWithCounter="true"
      requirementOrInstance="instance"
    />

    <EntireDuration
      :entireDuration.sync="_databaseData.entireDuration"
      :periodsNeeded.sync="_databaseData.periodsNeeded"
      :isPeriodsDataMissing="isPeriodsDataMissing"
      :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
      :index="0"
      requirementOrInstance="instance"
    />

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

import DescriptionOfNeed from "./DescriptionOfNeed.vue"
import DOWSubtleAlert from "./DOWSubtleAlert.vue";
import EntireDuration from "./EntireDuration.vue"

import { ClassificationLevelDTO } from "@/api/models";

import { 
  Checkbox, 
  DatabaseOfferingData,
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

export default class DatabaseForm extends Vue {
  @PropSync("databaseData") public _databaseData!: DatabaseOfferingData;
  @Prop() public firstTimeHere!: boolean;
  @Prop() public isClassificationDataMissing!: boolean;
  @Prop() public isPeriodsDataMissing!: boolean;
  @Prop() public avlClassificationLevelObjects!: ClassificationLevelDTO[];
  @Prop() public singleClassificationLevelName!: string | undefined;
  @Prop() public formHasErrors!: boolean;
  @Prop() public formHasBeenTouched!: boolean;
  @Prop() public classificationRadioOptions!: RadioButton[];
  @Prop() public availablePeriodCheckboxItems!: Checkbox[];

  public openModal(): void {
    this.$emit("openModal");
  }

  public updated(): void {
    this.$emit("formUpdate");
  }

  public DatabaseTypeOptions: RadioButton[] = [
    {
      id: "Anaytical",
      label: "Anaytical",
      value: "Anaytical",
    },
    {
      id: "Transactional",
      label: "Transactional",
      value: "Transactional",
    },
    {
      id: "Graph",
      label: "Graph",
      value: "Graph",
    },
    {
      id: "Relational",
      label: "Relational",
      value: "Relational",
    },
    {
      id: "Other",
      label: "Other",
      value: "Other",
    },
  ];

  public osLicensingRadioOptions: RadioButton[] = [
    {
      id: "Transfer",
      label: "Transfer existing license",
      value: "TRANSFER_EXISTING"
    },
    {
      id: "New",
      label: "New license",
      value: "NEW"
    }
  ];

  public dbLicensingRadioOptions: RadioButton[] = [
    {
      id: "Transfer",
      label: "Transfer existing license",
      value: "TRANSFER_EXISTING"
    },
    {
      id: "New",
      label: "New license",
      value: "NEW"
    }
  ];

  public storageTypes: SelectData[] = [
    { 
      text: "Block storage", 
      value: "BLOCK",
      description: "Fixed-sized raw storage capacity"
    },
    { 
      text: "Object storage", 
      value: "OBJECT",
      description: "Store and serve unstructured user-generated content"
    },
    { 
      text: "File storage", 
      value: "FILE",
      description: "Store and serve shared file systems"
    },
    { 
      text: "Archive storage", 
      value: "ARCHIVE",
      description: "Store and serve for long-term data retention"
    },
  ];

  public dataUnits: SelectData[] = [
    { text: "Gigabyte (GB)", value: "GB" },
    { text: "Terabyte (TB)", value: "TB" },
    { text: "Petabyte (PB)", value: "PB" },
  ];

  public operatingSystemTooltipText = `Specify which operating system you want to 
    run your instance on (e.g., Windows, Linux).`;

  public VCPUTooltipText = `This refers to the size of compute. You can provide an 
    approximate number of virtual centralized processing units (vCPUs).`;

  public processorSpeedTooltipText = `Enter the clock speed for each vCPU. 
    This is typically measured in gigahertz (GHz).`;

  public memoryTooltipText = `Enter the amount of Random Access Memory (RAM) available 
    for storing data short-term in order to perform computing operations.`;

  public storageAmountTooltipText = `Enter the amount of storage you need to access 
    and store data on a long-term basis.`;

  public numberOfInstancesTooltipText = `Specify the number of instances you need 
    with these configurations.`;

  public classificationTooltipText = `The levels listed below are based on the 
    overall classification requirements you previously specified.`;

  public networkPerformanceTooltipText = `This refers to your network speed 
    and service availability.`;


  public async mounted(): Promise<void> {
    if(!this._databaseData.storageUnit){
      this._databaseData.storageUnit = "GB";
    }
  }

}

</script>
