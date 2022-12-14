<template>
  <div>
    <ATATTextField
      id="TrainingTitle"
      class="_input-wrapper-max-width mb-10"
      :value.sync="offeringData.requirementTitle"
      label="Training title"
      tooltipText="Enter a title that briefly describes this specific training requirement."
      :rules="[
        $validators.required('Enter your training title.'),
        $validators.maxLength(60, 'Title cannot exceed 60 chars'),
      ]"
    />

    <ATATRadioGroup
      id="TrainingFormat"
      legend="What training format do you require?"
      :value.sync="offeringData.trainingType"
      :items="trainingTypes"
      name="TrainingFormat"
      class="mb-10"
      :rules="[$validators.required('Select a training format.')]"
    />

    <ATATRadioGroup
      id="TrainingFacility"
      v-if="offeringData.trainingType === 'ON_SITE_CONUS'"
      legend="What type of facility will your training be held at??"
      :value.sync="offeringData.trainingFacilityType"
      :items="trainingFaciltyTypes"
      name="TrainingFacility"
      class="mb-10"
      :rules="[$validators.required('Select a type of facility.')]"
    />


    <ATATTextField
      id="TrainingLocation"
      class="mb-10"
      v-if="showTrainingLocation"
      :value.sync="offeringData.trainingLocation"
      :label="trainingLocationLabel"
      width="234"
      :rules="[
        $validators.required('Enter the location of your training.'),
      ]"
    />

    <ATATTextField
      id="TrainingTimezone"
      class="mb-10"
      v-if="showTrainingTimezone"
      :value.sync="offeringData.trainingTimezone"
      label="Timezone of training"
      width="234"
      :rules="[
        $validators.required('Enter the timezone of your training.'),
      ]"
    />

    <ATATTextField
      id="TrainingPersonnel"
      class="mb-10"
      :value.sync="offeringData.trainingPersonnel"
      label="How many personnel require this training?"
      tooltipText="Enter the total number of people that require this training. 
        This may be split across multiple training sessions."
      width="234"
      :rules="[
        $validators.required('Enter the number of personnel that require this training.'),
      ]"
    />
   
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue"

import { 
  OtherServiceOfferingData,
  RadioButton,
} from "../../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField,
  }
})

export default class TrainingFormElements extends Vue {
  @PropSync("data") public offeringData!: OtherServiceOfferingData;

  public get trainingLocationLabel(): string {
    const loc = this.offeringData.trainingType 
      && this.offeringData.trainingType?.indexOf("OCONUS") > -1 ? "OCONUS" : "CONUS"
    return "Location of " + loc + " training"
  }

  public get showTrainingLocation(): boolean {
    return this.offeringData.trainingType !== undefined
      && this.offeringData.trainingType.indexOf('CONUS') > -1;
  }


  public get showTrainingTimezone(): boolean {
    return this.offeringData.trainingType !== undefined
      && this.offeringData.trainingType.indexOf('INSTRUCTOR') > -1
  }

  public trainingTypes: RadioButton[] = [
    {
      id: "OnSiteCONUS",
      label: "On-site instructor-led within the Continental United States (CONUS)",
      value: "ON_SITE_CONUS", 
    },
    {
      id: "OnSiteOCONUS",
      label: "On-site instructor-led outside of the Continental United States (OCONUS)",
      value: "ON_SITE_OCONUS", 
    },
    {
      id: "VirturalInstructorLed",
      label: "Virtual instructor-led",
      value: "VIRTUAL_INSTRUCTOR_LED", 
    },
    {
      id: "VirtualSelfLed",
      label: "Virtual self-led",
      value: "VIRTUAL_SELF_LED", 
    },
    {
      id: "NoPreference",
      label: "No preference",
      value: "NO_PREFERENCE", 
    },
  ];

  public trainingFaciltyTypes: RadioButton[] = [
    {
      id: "GovtFacility",
      label: "Government facility",
      value: "GOVT", 
    },
    {
      id: "NonGovtFacility",
      label: "Non-government facility (e.g., CSP or 3rd party facility)",
      value: "NON_GOVT", 
    },
  ];

}

</script>
