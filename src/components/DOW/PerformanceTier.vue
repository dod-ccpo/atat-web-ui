<template>
  <div id="PerformanceTier" class="mt-10">
    <ATATRadioGroup 
      id="PerformanceTierOptions"
      v-if="!isDatabase"
      :items="performanceTiers"
      legend="Performance tier"
      tooltipText="This refers to your network speed and service availability."
      :rules="[
        $validators.required('Select a performance tier.'),
      ]"
      :value.sync="offeringData.performanceTier"
    />

    <ATATTextField
      id="NetworkPerformance"
      v-if="isDatabase"
      class="mt-8 _input-max-width-240"
      :value.sync="offeringData.networkPerformance"
      label="Network performance"
      tooltipText="This refers to your network speed and service availability."
      :rules="[
        $validators.required('Enter a description of your network performance.'),
      ]"    
    />

    <ATATTextField
      id="NumberOfInstances"
      class="mt-8 _input-max-width-240"
      :value.sync="offeringData.numberOfInstances"
      label="Number of instances with these configurations"
      type="number"
      :rules="[
        $validators.required('Enter a number greater than or equal to 1.'),
        $validators.greaterThan(0, 'Enter a number greater than or equal to 1.'),
      ]"    
    />

    <ATATTextField
      id="MonthlyDataEgress"
      v-if="!isDOW"
      class="mt-8 _input-max-width-240 _has-appended-dropdown"
      label="Approximate data/internet egress per month"
      :value.sync="offeringData.dataEgressMonthlyAmount"
      tooltipText="This refers to the amount of data that gets transferred from 
        your organization’s host network to external networks."
      :appendDropdown="true"
      :dropdownOptions="storageUnits"
      :selectedDropdownValue.sync="offeringData.dataEgressMonthlyUnit"
      type="number"
      :rules="[
        $validators.required('Enter a number greater than or equal to 1.'),
        $validators.greaterThan(0, 'Enter a number greater than or equal to 1.'),
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

import { 
  CurrEnvInstancePerformance, 
  OtherServiceOfferingData, 
  RadioButton,
  SelectData 
} from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField,
  }
})

export default class PerformanceTier extends Vue {
  @PropSync("data") 
  public offeringData!: CurrEnvInstancePerformance | OtherServiceOfferingData;
  @Prop() public storageUnits!: SelectData[];
  @Prop({ default: false }) public isDOW?: boolean;
  @Prop({ default: false }) public isCompute?: boolean;
  @Prop({ default: false }) public isDatabase?: boolean;

  public performanceTiers: RadioButton[] = [
    {
      id: "GeneralPurpose",
      label: "General Purpose",
      description: "Provides a balance of compute, memory & network",
      value: "GENERAL",
    },
    {
      id: "ComputeOptimized",
      label: "Compute Optimized",
      description: `Supports compute-bound applications that benefit from high 
        performance processors`,
      value: "COMPUTE",
    },
    {
      id: "MemoryOptimized",
      label: "Memory Optimized",
      description: `Designed to deliver fast performance for workloads that 
        process large data sets in memory`,
      value: "MEMORY",
    },
    {
      id: "StorageOptimized",
      label: "Storage Optimized",
      description: `Designed for high, sequential read and write workloads to 
        very large data sets on local storage`,
      value: "STORAGE",
    },
  ];


}

</script>