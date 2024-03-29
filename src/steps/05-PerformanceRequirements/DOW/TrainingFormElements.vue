<template>
  <div>
    <ATATTextField
      id="TrainingTitle"
      class="_input-wrapper-max-width mb-10"
      :value="offeringData.trainingRequirementTitle"
      @update:value="offeringData.trainingRequirementTitle = $event"
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
      :value="offeringData.trainingType"
      @update:value="offeringData.trainingType = $event"
      :items="trainingTypes"
      name="TrainingFormat"
      @radioButtonSelected="clearData()"
      class="mb-10"
      :rules="[$validators.required('Select a training format.')]"
    />

    <ATATRadioGroup
      id="TrainingFacility"
      v-if="offeringData.trainingType === 'ONSITE_INSTRUCTOR_CONUS'"
      legend="What type of facility will your training be held at??"
      :value="offeringData.trainingFacilityType"
      @update:value="offeringData.trainingFacilityType = $event"
      :items="trainingFaciltyTypes"
      name="TrainingFacility"
      class="mb-10"
      :rules="[$validators.required('Select a type of facility.')]"
    />


    <ATATTextField
      id="TrainingLocation"
      class="mb-10"
      v-if="showTrainingLocation"
      :value="offeringData.trainingLocation"
      @update:value="offeringData.trainingLocation = $event"
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
      :value="offeringData.trainingTimeZone"
      @update:value="offeringData.trainingTimeZone = $event"
      label="Timezone of training"
      width="234"
      :rules="[
        $validators.required('Enter the timezone of your training.'),
      ]"
    />

    <ATATTextField
      id="TrainingPersonnel"
      class="mb-10"
      :value="offeringData.trainingPersonnel"
      @update:value="offeringData.trainingPersonnel = $event"
      label="How many personnel require this training?"
      tooltipText="Enter the total number of people that require this training. 
        This may be split across multiple training sessions."
      width="234"
      type="number"
      :rules="[
        $validators.required('Enter the number of personnel that require this training.'),
      ]"
    />
   
  </div>
</template>

<script lang="ts">
 
import { Component, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue"
import { trainingTypeOptions }  from "@/store/descriptionOfWork";

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

class TrainingFormElements extends Vue{
  @PropSync("data") public offeringData!: OtherServiceOfferingData;

  public get trainingLocationLabel(): string {
    const loc = this.offeringData.trainingType 
      && this.offeringData.trainingType?.indexOf("OCONUS") > -1 ? "OCONUS" : "CONUS"
    return "Location of " + loc + " training"
  }

  /**
   * clears unwanted data from all form fields when new 
   * offeringData.trainingType
   * is selected
   */
  public clearData(): void{
    this.offeringData.trainingFacilityType = "";
    this.offeringData.trainingPersonnel = "";
    this.offeringData.trainingTimeZone="";
    this.offeringData.trainingLocation="";
  }

  public get showTrainingLocation(): boolean {
    return this.offeringData.trainingType !== undefined
      && this.offeringData.trainingType.indexOf('CONUS') > -1;
  }

  public get showTrainingTimezone(): boolean {
    return this.offeringData.trainingType !== undefined
      && this.offeringData.trainingType === "VIRTUAL_INSTRUCTOR"
  }

  public trainingTypes = trainingTypeOptions;

  public trainingFaciltyTypes: RadioButton[] = [
    {
      id: "GovtFacility",
      label: "Government facility",
      value: "GOVERNMENT_FACILITY", 
    },
    {
      id: "NonGovtFacility",
      label: "Non-government facility (e.g., CSP or 3rd party facility)",
      value: "NON_GOVERNMENT_FACILITY", 
    },
  ];

}
export default toNative(TrainingFormElements )

 
</script>
