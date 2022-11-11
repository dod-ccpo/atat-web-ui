<template>
  <section id="CurrentUsage">
    <ATATRadioGroup 
      id="CurrentUsageDescription"
      :items="usageOptions"
      :value.sync="_currentUsage.currentUsageDescription"
      legend="How would you describe the current usage?"
      :rules="[
        $validators.required('Select a description for your current usage.'),
      ]"
    />

    <ATATCheckboxGroup
      class="mt-8"
      id="SpikeCauses"
      v-if="_currentUsage.currentUsageDescription === 'IRREGULAR_USAGE'"
      groupLabel="Are spikes in usage typically caused by a specific event and/or 
        during certain period(s) of the year?"
      groupLabelId="SpikeCauseGroupLabel"
      :items="spikeCauses"
      :value.sync="_currentUsage.trafficSpikeCauses"
    />

    <ATATTextField
      id="HighUsageEventDescription"
      class="mt-10"
      v-if="_currentUsage.trafficSpikeCauses.includes('EVENT')"
      :value.sync="_currentUsage.surgeUsageEvent"
      label="Tell us about the event that causes a surge in usage"
      tooltipText="Include any details that would help a CSP better understand 
        your surge requirements (i.e., event name and/or time of year)."
      :rules="[
        $validators.required('Enter your high usage event.'),
      ]"
    />

    <ATATTextField
      id="HighUsagePeriodDescription"
      class="mt-8"
      v-if="_currentUsage.trafficSpikeCauses.includes('PERIOD')"
      :value.sync="_currentUsage.surgeUsagePeriods"
      label="In which period of the year do you typically have a surge in usage?"
      tooltipText="Include any details that would help a CSP better understand 
        your surge requirements (i.e., date ranges or particular days, months, 
        or quarters that are higher)."
      :rules="[
        $validators.required('Describe your high usage period(s).'),
      ]"
    />

  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { Checkbox, RadioButton, CurrentEnvUsageData } from "types/Global";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATTextField,
  }
})

export default class CurrentUsage extends Vue {
  
  @PropSync("currentUsage") public _currentUsage!: CurrentEnvUsageData;

  public usageOptions: RadioButton[] = [
    {
      id: "RegularUsage",
      label: "Evenly distributed or constant usage",
      value: "EVEN_USAGE"
    },
    {
      id: "IrregularUsage",
      label: `Irregular usage or spike traffic (i.e., typically surges for a 
        specific event or during a certain period each year)`,
      value: "IRREGULAR_USAGE"
    },
  ];

  public spikeCauses: Checkbox[] = [
    {
      id: "EventBased",
      label: "Event-based spike in traffic",
      value: "EVENT"
    },
    {
      id: "CertainPeriods",
      label: "High usage during certain period(s) of the year",
      value: "PERIOD"
    },
  ];

  @Watch("_currentUsage", {deep: true})
  public currentUsageDescriptionChange(newVal: CurrentEnvUsageData): void {
    if (newVal.currentUsageDescription === "EVEN_USAGE") {
      this._currentUsage.isTrafficSpikeEventBased = "";
      this._currentUsage.isTrafficSpikePeriodBased = "";
      this._currentUsage.trafficSpikeEventDescription = "";
      this._currentUsage.trafficSpikePeriodDescription = "";
    }
    if (!newVal.trafficSpikeCauses?.includes("EVENT")) {
      this._currentUsage.trafficSpikeEventDescription = "";
    } else if (newVal.trafficSpikeCauses?.includes("EVENT")) {
      this._currentUsage.isTrafficSpikeEventBased = "YES";
    }
    if (!newVal.trafficSpikeCauses?.includes("PERIOD")) {
      this._currentUsage.trafficSpikePeriodDescription = "";
    } else if (newVal.trafficSpikeCauses?.includes("PERIOD")) {
      this._currentUsage.isTrafficSpikePeriodBased = "YES";
    }
  }

}

</script>
