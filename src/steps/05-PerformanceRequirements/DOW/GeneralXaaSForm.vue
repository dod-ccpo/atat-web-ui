<template>
  <div>
    <h1 class="page-header mb-3" tabindex="-1">
      <span v-if="firstTimeHere">
        Let’s gather your requirements for general IaaS, PaaS and SaaS
      </span>
      <span v-else>
        Let’s gather some details for Requirement #{{ _generalXaaSData.instanceNumber }}
      </span>
    </h1>

    <p 
      class="copy-max-width"
      :class="isClassificationDataMissing || isPeriodsDataMissing ? 'mb-4' : 'mb-10'"
    >
      <span v-if="firstTimeHere">
        In this section, we will collect details about any third-party marketplace 
        solutions or cloud resources not covered in the other XaaS categories. 
      </span>

      If you have more than one requirement, we will walk through them one at a time. 

      <span v-if="avlClassificationLevelObjects.length === 1">
        This requirement will be within the 
        <strong id="SingleClass">{{ singleClassificationLevelName }}</strong> classification level.
        If you need a different level, 
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

    <ATATTextField 
      id="RequirementTitle"
      ref="RequirementTitle"
      label="Requirement title"
      class="_input-max-width mb-10"
      tooltipText="Enter a title that briefly describes this IaaS, 
        PaaS or SaaS requirement."
      :value.sync="_generalXaaSData.requirementTitle"
      :rules="[$validators.required('Please provide a title for this requirement.')]"
    />

    <div v-if="avlClassificationLevelObjects.length > 1" class="mb-8">
      <ATATRadioGroup
        id="ClassificationLevel"
        ref="ClassificationLevel"
        name="ClassificationLevel"
        legend="What classification level is this requirement deployed in?"
        :value.sync="_generalXaaSData.classificationLevel"
        :items="classificationRadioOptions"
        class="mt-3 mb-2"
        :tooltipText="classificationTooltipText"
        tooltipLabel="Classification level for this requirement"
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

    <DescriptionOfNeed
      :anticipatedNeedUsage.sync="_generalXaaSData.anticipatedNeedUsage"
      :index="1"
      :textAreaWithCounter="true"
    />

    <EntireDuration
      :entireDuration.sync="_generalXaaSData.entireDuration"
      :periodsNeeded.sync="_generalXaaSData.periodsNeeded"
      :isPeriodsDataMissing="isPeriodsDataMissing"
      :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
      :index="1"
    />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import DescriptionOfNeed from "./DescriptionOfNeed.vue";
import DOWSubtleAlert from "./DOWSubtleAlert.vue";
import EntireDuration from "./EntireDuration.vue";

import { ClassificationLevelDTO } from "@/api/models";

import { Checkbox, OtherServiceOfferingData, RadioButton } from "../../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextArea,
    ATATTextField,
    DescriptionOfNeed,
    DOWSubtleAlert,
    EntireDuration,
  }
})

export default class GeneralXaaSForm extends Vue {
  @PropSync("generalXaaSData") public _generalXaaSData!: OtherServiceOfferingData;
  @Prop() public firstTimeHere!: boolean;
  @Prop() public isClassificationDataMissing!: boolean;
  @Prop() public isPeriodsDataMissing!: boolean;
  @Prop() public avlClassificationLevelObjects!: ClassificationLevelDTO[];
  @Prop() public singleClassificationLevelName!: string | undefined;
  @Prop() public classificationRadioOptions!: RadioButton[];
  @Prop() public classificationTooltipText!: string;
  @Prop() public availablePeriodCheckboxItems!: Checkbox[];
  
  public openModal(): void {
    this.$emit("openModal");
  }

}

</script>
