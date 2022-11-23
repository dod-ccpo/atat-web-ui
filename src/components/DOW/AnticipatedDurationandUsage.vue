<template>
<div>
  <ATATTextArea
    :value.sync="_dataObject.anticipatedNeedUsage"
    :id="'AnticipatedNeedUsage_' + (index + 1)"
    ref="DescriptionOfNeed"
    :label="label"
    :helpText="description"
    class="width-100 mb-10 max-width-740"
    :rows="5"
    :maxChars="maxCharCount"
    :rules="[
      $validators.required('Provide your statement of objective.'),
      $validators.maxLength(maxCharCount,
       'Description is to be' + maxCharCount+ ' characters or less.')
    ]"
  />
  <div>
    <ATATRadioGroup
      class="copy-max-width mb-10 mt-0"
      ref="NeededForEntireDuration"
      :id="'EntireDuration_' + (index + 1)"
      :legend="'Is this ' + requirementOrInstance +
        ' needed for the entire duration of your task order?'"
      :items="entureDurationOptions"
      :value.sync="_entireDuration"
      :rules="[
        $validators.required(
          'Please select an option to specify your ' + requirementOrInstance + '’s duration.'
        )
      ]"
    />
    <div v-if="_entireDuration === 'NO'">
      <p :id="'PeriodsLabel_' + (index + 1)" class="_checkbox-group-label">
        In which base and/or option periods do you need this {{ requirementOrInstance }}?
      </p>
      <ATATCheckboxGroup
        :id="'PeriodsCheckboxes_' + (index + 1)"
        :aria-describedby="'PeriodsLabel_' + (index + 1)"
        ref="periodsCheckboxes"
        :value.sync="_periodsNeeded"
        :items="availablePeriodCheckboxItems"
        :card="false"
        :disabled="isPeriodsDataMissing"
        :rules="[
          $validators.required('Please select at least one base or option period' +
            ' to specify your ' + requirementOrInstance + '’s duration level.')
        ]"
        class="copy-max-width"
      />
      <ATATAlert
        :ref="'PeriodRequirementsAlert_' + (index + 1)"
        :id="'PeriodRequirementsAlert_' + (index + 1)"
        v-if="isPeriodsDataMissing === true"
        type="warning"
        class="copy-max-width mb-10"
      >
        <template v-slot:content>
          <p class="mb-0" :id="'PeriodIntro_' + (index + 1)">
            Your period of performance details are missing. To select specific base or
            option periods for this {{ type }},
            <router-link
              :id="'ContractDetailsLink_' + (index + 1)"
              :to="{ name: routeNames.PeriodOfPerformance }"
            >revisit the Contract Details section
            </router-link>
          </p>
        </template>
      </ATATAlert>
    </div>
  </div>
</div>
</template>

<EntireDuration
  :entireDuration.sync="_computeData.entireDuration"
  :periodsNeeded.sync="_computeData.periodsNeeded"
  :isPeriodsDataMissing="isPeriodsDataMissing"
  :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
  :index="0"
  requirementOrInstance="instance"
/>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";
import DescriptionOfNeed from "@/components/DOW/DescriptionOfNeed.vue";
import EntireDuration from "@/steps/05-PerformanceRequirements/DOW/EntireDuration.vue";
import { OtherServiceOfferingData } from "../../../types/Global";

@Component({
  components: {
    DescriptionOfNeed,
    EntireDuration
  }
})

export default class AnticipatedDurationandUsage extends Vue {
  @PropSync("dataObject")public _dataObject!: OtherServiceOfferingData;
  @Prop() private index!: string;
  @Prop({required: true}) private type!: string;
  @Prop({default: "Statement of objectives for the anticipated need or usage"})
  private label?: string;
  @Prop({default: "Use vendor-neutral language. This will be added to your" +
      " Description of Work, so avoid including any company names or vendor-unique" +
      " brand, product, or titles that could impact full and open competition."})
  private description?: string;
  @Prop({default: "800"}) private maxCharCount?: string;



}

</script>
