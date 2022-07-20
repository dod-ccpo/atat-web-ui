<template>
  <div>
    <h1 class="page-header mb-3">Let’s start by gathering your Compute requirements</h1>
    <p>
      In this section, we’ll collect details about each compute instance that you need. 
      If you need multiple, we’ll walk through them one at a time. 
      <span v-if="avlClassificationLevelObjects.length === 1">
        You previously specified <strong>XXXXXXXX</strong> as the classification level 
        for all requirements. If you need any instances within a different level, 
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

    <ATATTextArea 
      id="DescriptionOfNeed"
      class="mt-8"
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
    <h2 id="FormSection2Heading">2. Instance configurations</h2>

    

    <ClassificationsModal 
      :showDialog="showDialog"
      @cancelClicked="modalCancelClicked"
      @okClicked="modalOkClicked"
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
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextArea.vue";
import ATATTooltip from "@/components/ATATTooltip.vue"

import ClassificationsModal from "./ClassificationsModal.vue";

import { routeNames } from "../../../router/stepper"
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";

import { 
  Checkbox, 
  DOWClassificationInstance, 
  RadioButton 
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
  public selectedClassificationLevel = "";

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
  // EJY - Need error message if no entry for other
  public otherRegionValueRequiredMessage = "EJY - Need error message if no entry for other";

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





  public openModal(): void {
    debugger;
    this.modalSelectionsOnOpen = this.modalSelectedOptions;
    this.showDialog = true;
  }

  public modalCancelClicked(): void {
    this.showDialog = false;
    debugger;
  }

  public async modalOkClicked(): Promise<void> {
    this.showDialog = false;
    debugger;
    // update lead paragraph
    // determine what to show in radio group if > 1 selected
    // else hide radio group and set classification level for this instance 


    // remove any previously selected classifications no longer selected in modal
    // const keepSelected = this.modalSelectedOptions;
    // this.selectedHeaderLevelSysIds = this.selectedHeaderLevelSysIds.filter((sysId) => {
    //   return keepSelected.indexOf(sysId) > -1;
    // });
    // const arr = this.currentPackageClassificationLevels;
    // await ClassificationRequirements.setSelectedClassificationLevels(arr);
    // await this.setAvailableClassificationLevels();
    // await this.buildNewClassificationInstances();
    // this.checkSingleClassification();
    
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
    debugger;   
  }

  public async loadOnEnter(): Promise<void> {
    // get classification levels selected in step 4 Contract Details
    this.avlClassificationLevelObjects 
      = await ClassificationRequirements.getSelectedClassificationLevels();
    debugger;

    // set checked items in modal to classification levels selected in step 4 Contract Details
    if(this.avlClassificationLevelObjects) {
      this.avlClassificationLevelObjects.forEach((val) => {
        this.modalSelectedOptions.push(val.sys_id || "")
      });
    }
    debugger;
    // set up header checkbox items and list of sysIds for available classification levels
    await this.setAvailableClassificationLevels();
    // get list of all possible classification levels to generate checkbox list and labels
    this.allClassificationLevels
      = await ClassificationRequirements.getAllClassificationLevels();
    this.modalCheckboxItems 
      = this.createCheckboxOrRadioItems(this.allClassificationLevels, "Modal");
    debugger;
    const IL6Checkbox 
      = this.modalCheckboxItems.find(e => e.label.indexOf("IL6") > -1);
    this.IL6SysId = IL6Checkbox?.value || "";
    this.classificationRadioOptions 
      = this.createCheckboxOrRadioItems(this.avlClassificationLevelObjects, "Radio");
    debugger;

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

  public classificationTooltipText = `The levels listed below are based on classification 
    requirements you previously specified in the Contract Details section.`;

}

</script>