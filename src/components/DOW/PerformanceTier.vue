<template>
  <div id="PerformanceTier" class="mt-10">
    <ATATRadioGroup 
      id="PerformanceTierOptions"
      :items="performanceTiers"
      legend="Performance tier"
      tooltipText="This refers to your network speed and service availability."
      :rules="[
        $validators.required('Select a performance tier.'),
      ]"
      :value.sync="_performanceTier.performanceTier"

    />

    <ATATTextField
      id="NumberOfSimilarInstances"
      class="mt-8 _input-max-width-240"
      :value.sync="_performanceTier.numberOfSimilarInstances"
      label="Number of instances with these configurations"
      type="number"
      :rules="[
        $validators.required('Enter a number greater than or equal to 1.'),
        $validators.greaterThan('0', 'Enter a number greater than or equal to 1.'),
      ]"    
    />

    <ATATTextField
      id="MonthlyDataEgress"
      class="mt-8 _input-max-width-240 _has-appended-dropdown"
      label="Approximate data/internet egress per month"
      :value.sync="_performanceTier.dataEgressMonthlyAmount"
      tooltipText="This refers to the amount of data that gets transferred from 
        your organization’s host network to external networks."
      :appendDropdown="true"
      :dropdownOptions="storageUnits"
      :selectedDropdownValue.sync="_performanceTier.dataEgressMonthlyUnit"
      type="number"
      :rules="[
        $validators.required('Enter a number greater than or equal to 1.'),
        $validators.greaterThan('0', 'Enter a number greater than or equal to 1.'),
      ]"
      :allowDecimals="false"
    />       

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATTextField from "@/components/ATATTextField.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import { CurrentEnvPerformanceTier, RadioButton, SelectData } from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField,
  }
})

export default class PerformanceTier extends Vue {
  @PropSync("performanceTier") public _performanceTier!: CurrentEnvPerformanceTier;
  @Prop() public storageUnits!: SelectData[];

  public performanceTiers: RadioButton[] = [
    {
      id: "GeneralPurpose",
      label: "General Purpose",
      description: "Provides a balance of compute, memory & network",
      value: "GeneralPurpose",
    },
    {
      id: "ComputeOptimized",
      label: "Compute Optimized",
      description: `Supports compute-bound applications that benefit from high 
        performance processors`,
      value: "ComputeOptimized",
    },
    {
      id: "MemoryOptimized",
      label: "Memory Optimized",
      description: `Designed to deliver fast performance for workloads that 
        process large data sets in memory`,
      value: "MemoryOptimized",
    },
    {
      id: "StorageOptimized",
      label: "Storage Optimized",
      description: `Designed for high, sequential read and write workloads to 
        very large data sets on local storage`,
      value: "StorageOptimized",
    },
  ];


}

</script>