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
      :legend="durationLabel ||
      `Do you need this ${type} for the entire duration of your task order?`"
      :items="entireDurationOptions"
      :value.sync="_dataObject.entireDuration"
      :tooltipText="toolTip"
      :rules="[
        $validators.required(
          'Please select an option.'
        )
      ]"
    />
    <div v-if="_dataObject.entireDuration === 'NO'">
      <p :id="'PeriodsLabel_' + (index + 1)" class="_checkbox-group-label">
        In which base and/or option periods do you need this {{ type }}?
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
          $validators.required('Please select at least one base or option period.')
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

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";
import {
  Checkbox,
  CrossDomainSolution,
  OtherServiceOfferingData,
  RadioButton
} from "../../../types/Global";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import {routeNames} from "@/router/stepper";


@Component({
  components: {
    ATATTextArea,
    ATATRadioGroup,
    ATATCheckboxGroup,
    ATATAlert,
  }
})

export default class AnticipatedDurationandUsage extends Vue {
  @PropSync("dataObject")public _dataObject!: OtherServiceOfferingData | CrossDomainSolution;
  @PropSync("periodsNeeded") public _periodsNeeded?: string[];
  @Prop() private index!: string;
  @Prop({required: true}) private type!: string;
  @Prop({default: "Statement of objectives for the anticipated need or usage"})
  private label?: string;
  @Prop({default: ""})
  private durationLabel?: string;
  @Prop({default: "Use vendor-neutral language. This will be added to your" +
      " Description of Work, so avoid including any company names or vendor-unique" +
      " brand, product, or titles that could impact full and open competition."})
  private description?: string;
  @Prop({default: "Performance period details will be used to generate a cost estimate for" +
      " this service later."})
  private toolTip?: string;
  @Prop({default: "800"}) private maxCharCount?: string;
  @Prop() public isPeriodsDataMissing!: boolean;
  @Prop() public availablePeriodCheckboxItems!: Checkbox[];

  public routeNames = routeNames;

  public entireDurationOptions: RadioButton[] = [
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

  // when user selects "YES", remove periods from needed array.
  // when user selects "NO", pre-select base period
  @Watch("_entireDuration")
  public entireDurationChanged(newVal: string): void {
    this._periodsNeeded = newVal === "NO" && this.availablePeriodCheckboxItems[0].value !== ""
      ? [this.availablePeriodCheckboxItems[0].value]
      : [];
  }

}

</script>
