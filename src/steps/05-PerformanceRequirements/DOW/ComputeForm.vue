<template>
  <div>
    <h1 class="page-header mb-3">Let’s start by gathering your Compute requirements</h1>
    <p class="copy-max-width mb-10">
      In this section, we’ll collect details about each compute instance that you need. 
      If you need multiple, we’ll walk through them one at a time. 
      <span v-if="avlClassificationLevelObjects.length === 1">
        You previously specified <strong>{{ singleClassificationLevelName }} </strong> 
        as the classification level for all requirements. If you need any instances
        within a different level, 
        <a 
          role="button" 
          id="UpdateClassification"
          tabindex="0"
          @click="openModal"
          @keydown.enter="openModal"
          @keydown.space="openModal"
        >update your Classification Requirements</a>.
      </span>
    </p>

    <h2 class="mb-5" id="FormSection1Heading">
      1. Tell us about Instance #1
    </h2>
    <ATATRadioGroup
      id="EnvironmnetType"
      legend="What type of environment is this instance?"
      :value.sync="selectedEnvironmentType"
      :items="EnvironmentTypeOptions"
      name="EnvironmnetType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select an option')]"
    />

    <div v-if="avlClassificationLevelObjects.length > 1" class="mb-8">
      <ATATRadioGroup
        id="ClassificationLevel"
        legend="What classification level is this instance deployed in?"
        :value.sync="selectedClassificationLevel"
        :items="classificationRadioOptions"
        name="ClassificationLevel"
        class="mt-3 mb-2"
        :tooltipText="classificationTooltipText"
        tooltipLabel="Classification level for this instance"
        :rules="[$validators.required('Please select an option')]"
      />
      <a 
        role="button" 
        id="UpdateClassification"
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
      aria-describedby="CheckboxGroupLabel"
      :value.sync="selectedRegions"
      :items="regionCheckboxOption"
      :card="false"
      class="copy-max-width"
      :hasOtherValue="true"
      :otherValue="otherRegionValue"
      :otherValueEntered.sync="otherRegionValueEntered"
      :otherValueRequiredMessage="otherRegionValueRequiredMessage"
      otherEntryType="textfield"
    />

    <v-row class="mt-8">
      <v-col class="col-md-12 col-lg-9">
        <ATATTextArea 
          id="DescriptionOfNeed"
          label="Description of your anticipated need or usage"
          :value.sync="descriptionOfNeed"
          :rules="[
            $validators.required(
              'Please describe your anticipated need or usage'
            ),
            $validators.maxLength(
              300,
              'Please limit your description to 300 characters or less'
            ),
          ]"
          maxChars="300"
        />
      </v-col>
    </v-row>

    <ATATRadioGroup
      class="copy-max-width mb-10"
      id="NeededForEntireDuration"
      legend="Is this instance needed for the entire duration of your task order?"
      :items="requirementOptions"
      :value.sync="neededForEntireDuration"
      :rules="[
        $validators.required('Please select an option to specify your requirements.')
      ]"
    />
    <div v-if="neededForEntireDuration === 'NO'">
      <p id="PeriodsLabel" class="_checkbox-group-label">
        In which base and/or option periods do you need this requirement?
      </p>
      <ATATCheckboxGroup
        id="PeriodsCheckboxes"
        aria-describedby="PeriodsLabel"
        :value.sync="selectedPeriods"
        :items="availablePeriodCheckboxItems"
        :card="false"
        :disabled="periodsDisabled"
        :rules="[
          $validators.required('Please select at least one base or option period' +
            ' to specify your requirement’s duration level.')
        ]"
        class="copy-max-width"
      />
      <ATATAlert
        id="PeriodRequirementsAlert"
        v-show="periodsDisabled === true"
        type="warning"
        class="copy-max-width mb-10"
      >
        <template v-slot:content>
          <p class="mb-0" id="PeriodIntro">
            Your period of performance details are missing. To select specific base or
            option periods for this requirement,
            <router-link
              id="ContractDetailsLink"
              :to="{name: routeNames.PeriodOfPerformance}"
            >revisit the Contract Details section
            </router-link>
          </p>
        </template>
      </ATATAlert>
    </div>

    <hr />
    <h2 id="FormSection2Heading" class="mb-5">2. Instance configurations</h2>

    <v-row class="mt-7">
      <v-col class="col-md-12 col-lg-9">
        <ATATTextField
          id="OperatingSystemAndLicensing"
          label="Operating system and licensing"
          :tooltipText="operatingSystemTooltipText"
          :value.sync="operatingSystemAndLicensing"
        />
      </v-col>
    </v-row>
    <v-row class="mt-7">
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="NumberOfVCPUs"
          label="Number of vCPUs"
          :tooltipText="VCPUTooltipText"
          :value.sync="numberOfVCPUs"
        />
      </v-col>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="Memory"
          label="Memory"
          :tooltipText="memoryTooltipText"
          :value.sync="memory"
          appendText="GB"
        />
      </v-col>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATSelect
          id="StorageType"
          label="Storage type"
          :items="storageTypes"
          :selectedValue.sync="selectedStorageType"
        />

      </v-col>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="StorageAmount"
          label="Storage amount"
          :tooltipText="storageAmountTooltipText"
          :value.sync="storageAmount"
          appendText="GB"
        />
      </v-col>
    </v-row>

    <ATATRadioGroup
      class="my-10"
      id="PerformanceTier"
      legend="Performance tier"
      :items="performanceTiers"
      :value.sync="selectedPerformanceTier"
      :rules="[
        $validators.required('Please select an option to specify your requirements.')
      ]"
      :tooltipText="performanceTierTooltipText"
      :hasOtherValue="true"
      :otherValue="otherPerformanceTierValue"
      :otherValueEntered.sync="otherPerformanceTierValueEntered"
      :otherValueRequiredMessage="otherPerformanceTierValueRequiredMessage"

    />

    <v-row>
      <v-col class="col-sm-12 col-md-6 col-lg-3">
        <ATATTextField
          id="NumberOfInstancesNeeded"
          label="Number of instances needed"
          :tooltipText="numberOfInstancesTooltipText"
          :value.sync="numberOfInstancesNeeded"
        />
      </v-col>
    </v-row>


    <ClassificationsModal 
      :showDialog="showDialog"
      @cancelClicked="modalCancelClicked"
      @okClicked="classificationLevelsChanged"
      :modalSelectedOptions.sync="modalSelectedOptions"
      :modalSelectionsOnOpen="modalSelectionsOnOpen"
      :modalCheckboxItems="modalCheckboxItems"
      :IL6SysId="IL6SysId"
      :isIL6Selected.sync="isIL6Selected"
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

import ClassificationsModal from "./ClassificationsModal.vue";

import { routeNames } from "../../../router/stepper"
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import Toast from "@/store/toast";

import { 
  Checkbox, 
  RadioButton,
  SelectData,
  ToastObj,
} from "../../../../types/Global";

import ClassificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";

import { 
  buildClassificationCheckboxList, 
  buildClassificationLabel,
  hasChanges,
} from "@/helpers";

@Component({
  components: {
    ATATAlert,
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATSelect,
    ATATTextArea,
    ATATTextField,
    ATATTooltip,
    ClassificationsModal,
  }
})

export default class ComputeForm extends Vue {
  private routeNames = routeNames;
  public modalSelectionsOnOpen: string[] = [];
  private showDialog = false;
  public modalSelectedOptions: string[] = [];
  private modalCheckboxItems: Checkbox[] = [];
  public isIL6Selected = false;
  public IL6SysId = "";
  public allClassificationLevels:ClassificationLevelDTO[] = [];
  public avlClassificationLevelObjects: ClassificationLevelDTO[] = [];
  public classificationRadioOptions: RadioButton[] = [];
  public selectedClassificationLevel: string | undefined = "";
  public singleClassificationLevelName: string | undefined = "";

  public classificationLevelToast: ToastObj = {
    type: "success",
    message: "Classification requirements updated",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  }

  public selectedEnvironmentType = "";
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

  public selectedRegions: string[] = [];
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
      value: "Other",
    },

  ];
  public otherRegionValue = "Other";
  public otherRegionValueEntered = "";
  public otherRegionValueRequiredMessage = "Please enter your other region(s).";

  public descriptionOfNeed = "";

  public neededForEntireDuration = "";
  public requirementOptions: RadioButton[] = [
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

  public availablePeriodCheckboxItems: Checkbox[] = [];
  public periodsDisabled = true;
  public selectedPeriods: string[] = [];
  public operatingSystemAndLicensing = "";
  public numberOfVCPUs = "";
  public memory = "";
  public storageAmount = "";
  public selectedStorageType = "";
  public storageTypes: SelectData[] = [
    { text: "General Purpose SSD", value: "General Purpose SSD" },
    { text: "Provisioned IOPS SSD", value: "Provisioned IOPS SSD" },
    { text: "Nearline", value: "Nearline" },
    { text: "Offline", value: "Offline" },
    { text: "Other", value: "Other" },
  ];

  public selectedPerformanceTier = "";
  public otherPerformanceTierValue = "OtherPerformance";
  public otherPerformanceTierValueEntered = "";
  public otherPerformanceTierValueRequiredMessage 
    = "Please enter your other performance tier.";

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

  public numberOfInstancesNeeded = "1";

  public openModal(): void {
    this.modalSelectionsOnOpen = this.modalSelectedOptions;
    this.showDialog = true;
  }

  public modalCancelClicked(): void {
    this.showDialog = false;
  }

  public setAvlClassificationLevels(): void {
    this.classificationRadioOptions 
      = this.createCheckboxOrRadioItems(this.avlClassificationLevelObjects, "Radio");
  }

  public async classificationLevelsChanged(): Promise<void> {
    this.showDialog = false;
    this.avlClassificationLevelObjects = [];
    this.modalSelectedOptions.forEach((sysId) => {
      const classififcationObj = this.allClassificationLevels.find(obj => obj.sys_id === sysId);
      if (classififcationObj) {
        this.avlClassificationLevelObjects.push(classififcationObj);
      }
    });
    this.setAvlClassificationLevels();

    if (this.avlClassificationLevelObjects.length === 1) {
      this.selectedClassificationLevel = this.avlClassificationLevelObjects[0].sys_id;
      const sysId = this.selectedClassificationLevel;
      const singleSelection 
        = this.modalCheckboxItems.find((obj) => obj.value === sysId);
      this.singleClassificationLevelName = singleSelection?.label;
    } else if (this.selectedClassificationLevel) {
      // if the classification level that was selected was removed via the modal,
      // clear out this.selectedClassificationLevel
      const selectedSysId = this.selectedClassificationLevel;
      if (this.modalSelectedOptions.indexOf(selectedSysId) === -1) {
        this.selectedClassificationLevel = "";
      }
    }

    await ClassificationRequirements.setSelectedClassificationLevels(
      this.avlClassificationLevelObjects
    );

    Toast.setToast(this.classificationLevelToast);
    
  }

  private createPeriodCheckboxItems(periods: PeriodDTO[]) {
    // ensure sort order is correct
    periods.sort((a, b) => a.option_order > b.option_order ? 1 : -1);
    
    const arr: Checkbox[] = [];
    periods.forEach((period, idx) => {
      const label = idx === 0 ? "Base period" : `Option period ${idx}`;
      const option: Checkbox = {
        id: period.period_type,
        label,
        value: period.sys_id || "",
      }
      arr.push(option)
    })
    return arr
  };

  private createCheckboxOrRadioItems(data: ClassificationLevelDTO[], idSuffix: string) {
    idSuffix = idSuffix || "";
    return data.length > 1 ? buildClassificationCheckboxList(data, idSuffix) : [];
  }

  public async setAvailableClassificationLevels(): Promise<void> {
    this.avlClassificationLevelObjects 
      = await ClassificationRequirements.getSelectedClassificationLevels();
  }

  public async loadOnEnter(): Promise<void> {
    // get classification levels selected in step 4 Contract Details
    this.avlClassificationLevelObjects 
      = await ClassificationRequirements.getSelectedClassificationLevels();

    // set checked items in modal to classification levels selected in step 4 Contract Details
    if(this.avlClassificationLevelObjects) {
      this.avlClassificationLevelObjects.forEach((val) => {
        this.modalSelectedOptions.push(val.sys_id || "")
      });
    }

    // set available classification levels for radio buttons if > 1 level selected
    await this.setAvailableClassificationLevels();
    // get list of all possible classification levels to generate checkbox list and labels
    this.allClassificationLevels
      = await ClassificationRequirements.getAllClassificationLevels();
    this.modalCheckboxItems 
      = this.createCheckboxOrRadioItems(this.allClassificationLevels, "Modal");
    const IL6Checkbox 
      = this.modalCheckboxItems.find(e => e.label.indexOf("IL6") > -1);
    this.IL6SysId = IL6Checkbox?.value || "";
    this.setAvlClassificationLevels();

    const periods = await Periods.loadPeriods();
    if (periods && periods.length > 0) {
      this.periodsDisabled = false;
      this.availablePeriodCheckboxItems = this.createPeriodCheckboxItems(periods);
      this.selectedPeriods.push(this.availablePeriodCheckboxItems[0].value);
    } else {
      this.availablePeriodCheckboxItems = [
        {
          id: "BaseDisabled",
          label: "Base period",
          value: "",
        }
      ]
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  };

  public regionTooltipText = `This is the geographic location where your public cloud 
    resources are located, e.g., within the continental U.S. (CONUS) or outside of the 
    continental U.S. (OCONUS). If you need a certain location, select Other and enter 
    your specifications.`;

  public classificationTooltipText = `The levels listed below are based on the overall 
    classification requirements you previously specified.`;

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