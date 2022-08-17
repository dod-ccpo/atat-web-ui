<template>
  <v-form ref="generalXaaSForm">
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
      :class="showSubtleAlert ? 'mb-4' : 'mb-10'"
    >
      <span v-if="firstTimeHere">
        In this section, we will collect details about any third-party marketplace 
        solutions or cloud resources not covered in the other XaaS categories. 
      </span>

      If you have more than one requirement, we will walk through them one at a time. 

      <span v-if="avlClassificationLevelObjects.length === 1">
        This requirement will be within the 
        <strong>{{ singleClassificationLevelName }}</strong> classification level.
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
      v-show="showSubtleAlert"
      :isClassificationDataMissing="isClassificationDataMissing"
      :isPeriodsDataMissing="isPeriodsDataMissing"
      class="copy-max-width"
    />

    <ATATTextField 
      :id="'RequirementTitle_' + (index + 1)"
      label="Requirement title"
      class="_input-max-width mb-10"
      tooltipText="Enter a title that briefly describes this IaaS, 
        PaaS or SaaS requirement."
      :value="requirementTitle"
    />

    <div v-if="avlClassificationLevelObjects.length > 1" class="mb-8">
      <ATATRadioGroup
        id="ClassificationLevel"
        legend="What classification level is this requirement deployed in?"
        :value="_generalXaaSData.classificationLevel"
        :items="classificationRadioOptions"
        name="ClassificationLevel"
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


  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

import { ClassificationLevelDTO } from "@/api/models";

import { 
  Checkbox, 
  OtherServiceOfferingData,
  RadioButton,
} from "../../../../types/Global";

import { 
  buildClassificationCheckboxList, 
  buildClassificationLabel 
} from "@/helpers";
import DescriptionOfWork from "@/store/descriptionOfWork";

@Component({})


export default class GeneralXaaS extends Vue {
  @PropSync("generalXaaSData") public _generalXaaSData!: OtherServiceOfferingData;






}

</script>
