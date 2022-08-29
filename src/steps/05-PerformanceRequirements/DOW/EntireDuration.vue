<template>
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
            option periods for this {{ requirementOrInstance }},
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
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import { routeNames } from "../../../router/stepper"

import { 
  Checkbox, 
  RadioButton,
} from "../../../../types/Global";

@Component({
  components: {
    ATATAlert,
    ATATCheckboxGroup,
    ATATRadioGroup,
  }
})

export default class EntireDuration extends Vue {
  @PropSync("periodsNeeded") public _periodsNeeded?: string[];
  @PropSync("entireDuration") public _entireDuration?: string;
  @Prop() public isPeriodsDataMissing!: boolean;
  @Prop() public availablePeriodCheckboxItems!: Checkbox[];
  @Prop() public index!: number;
  @Prop({ default: "requirement" }) public requirementOrInstance?: string;

  public routeNames = routeNames;

  public entureDurationOptions: RadioButton[] = [
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
