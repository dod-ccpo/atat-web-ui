<template>
  <section id="CurrentUsage">
    <ATATRadioGroup 
      id="CurrentUsageDescription"
      :items="usageOptions"
      :value="_currentUsageDescription"
      @update:value="_currentUsageDescription = $event"
      legend="How would you describe the current usage?"
      :rules="[
        $validators.required('Select a description for your current usage.'),
      ]"
    />

    <ATATCheckboxGroup
      class="mt-8"
      id="SpikeCauses"
      v-if="_currentUsageDescription === 'IRREGULAR_USAGE'"
      groupLabel="Are spikes in usage typically caused by a specific event and/or 
        during certain period(s) of the year?"
      groupLabelId="SpikeCauseGroupLabel"
      :items="spikeCauses"
      :value="_usageTrafficSpikeCauses"
      @update:value="_usageTrafficSpikeCauses = $event"
      :rules="[
        $validators.required('Select at least one type of spike in usage.'),
      ]"
    />

    <ATATTextField
      id="HighUsageEventDescription"
      class="mt-10"
      v-if="_usageTrafficSpikeCauses.includes('EVENT')"
      :value="_eventSpikeDescription"
      @update:value="_eventSpikeDescription = $event"
      label="Tell us about the event that causes a surge in usage"
      tooltipText="Include any details that would help a CSP better understand 
        your surge requirements (e.g., event name and/or time of year)."
      :rules="[
        $validators.required('Enter your high usage event.'),
      ]"
    />

    <ATATTextField
      id="HighUsagePeriodDescription"
      class="mt-8"
      v-if="_usageTrafficSpikeCauses.includes('PERIOD')"
      :value="_periodSpikeDescription"
      @update:value="_periodSpikeDescription = $event"
      label="In which period of the year do you typically have a surge in usage?"
      tooltipText="Include any details that would help a CSP better understand 
        your surge requirements (e.g., date ranges or particular days, months, 
        or quarters that are higher)."
      :rules="[
        $validators.required('Describe your high usage period(s).'),
      ]"
    />

  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { 
  Checkbox, 
  RadioButton, 
  EnvironmentInstanceUsage 
} from "types/Global";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATTextField,
  }
})

class CurrentUsage extends Vue {
  
  @PropSync("usageTrafficSpikeCauses") public _usageTrafficSpikeCauses!: string[];
  @PropSync("currentUsageDescription") public _currentUsageDescription!: EnvironmentInstanceUsage;
  @PropSync("eventSpikeDescription") public _eventSpikeDescription!: string;
  @PropSync("periodSpikeDescription") public _periodSpikeDescription!: string;
  
  public usageOptions: RadioButton[] = [
    {
      id: "RegularUsage",
      label: "Evenly distributed or constant usage",
      value: "EVEN_USAGE"
    },
    {
      id: "IrregularUsage",
      label: `Irregular usage or spike traffic (e.g., typically surges for a 
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

  @Watch("_currentUsageDescription", {deep: true})
  public currentUsageDescriptionChange(newVal: EnvironmentInstanceUsage): void {
    if (newVal === "EVEN_USAGE") {
      this._usageTrafficSpikeCauses = [];
    }
  }
}
export default toNative(CurrentUsage)
</script>
