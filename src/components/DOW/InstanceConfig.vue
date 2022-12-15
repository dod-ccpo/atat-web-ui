<template>
  <section id="InstanceConfig">
    <v-row>
      <v-col class="col-sm-12 col-md-6">
        <ATATTextField
          v-if="!isDOW"
          id="Licensing"
          label="Licensing"
          :value.sync="offeringData.licensing"
          tooltipText="Provide details about your licensing agreement, to include 
            the type and number of licenses."
          :rules="[
            $validators.required('Enter a description of your current licensing.')
          ]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-12 col-md-3">
        <ATATTextField
          id="NumberOfVCPUs"
          label="Number of vCPUs"
          :value.sync="offeringData.numberOfVCPUs"
          tooltipText="This refers to the size of compute. You can provide an approximate 
            number of virtual centralized processing units (vCPUs)."
          type="number"
          :rules="[
            $validators.required('Enter a number greater than or equal to 1.'),
            $validators.greaterThan(0, 'Enter a number greater than or equal to 1.'),
          ]"
          :allowDecimals="false"
        />
      </v-col>
      <v-col class="col-sm-12 col-md-3">
        <ATATTextField
          id="ProcessorSpeed"
          label="Processor speed"
          :value.sync="offeringData.processorSpeed"
          tooltipText="Enter the clock speed for each vCPU. This is typically measured
            in gigahertz (GHz)."
          type="number"
          :rules="[
            $validators.required('Enter a number greater than or equal to 1.'),
            $validators.greaterThan(0, 'Enter a number greater than or equal to 1.'),
          ]"
          :allowDecimals="false"
        />
      </v-col>
      <v-col class="col-sm-12 col-md-6">
        <ATATTextField
          id="OperatingSystem"
          label="Operating system"
          :value.sync="offeringData.operatingSystem"
          tooltipText="Specify the type of Operating System (OS) that your instance is running on 
            (e.g., Windows, Linux)."
          :rules="[
            $validators.required('Enter the name of an operating system.'),
          ]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-12 col-md-3">
        <ATATTextField
          id="Memory"
          label="Memory"
          :value.sync="offeringData.memoryAmount"
          tooltipText="Enter the amount of Random Access Memory (RAM) available for 
            storing data short-term in order to perform computing operations."
          appendText="GB"
          :rules="[
            $validators.required('Enter a number greater than or equal to 1.'),
            $validators.greaterThan(0, 'Enter a number greater than or equal to 1.'),
          ]"
          :isMaskRegex="true"
          :mask="['^[0-9]*\.?[0-9]{1}$']"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-12 col-md-3">
        <ATATSelect
          id="StorageType"
          label="Storage type"
          :items="storageTypes"
          :selectedValue.sync="offeringData.storageType"
          :validateOnBlur="true"
          :rules="[
            $validators.required('Select a storage type.')
          ]"
        />

      </v-col>
      <v-col class="col-sm-12 col-md-3">
        <ATATTextField
          id="StorageAmount"
          label="Storage size"
          :value.sync="offeringData.storageAmount"
          tooltipText="Enter the amount of storage available to access and store 
            data on a long-term basis."
          :appendDropdown="true"
          :dropdownOptions="storageUnits"
          :selectedDropdownValue.sync="offeringData.storageUnit"
          type="number"
          :rules="[
            $validators.required('Enter a number greater than or equal to 0.'),
          ]"
          :allowDecimals="false"
        />       
      </v-col>
    </v-row>

  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";


import { 
  SelectData,
  CurrEnvInstanceConfig, 
  OtherServiceOfferingData
} from "types/Global";

@Component({
  components: {
    ATATSelect,
    ATATTextField,
  }
})

export default class InstanceConfig extends Vue {
  @PropSync("data") public offeringData!: CurrEnvInstanceConfig | OtherServiceOfferingData;
  @Prop() public storageUnits!: SelectData[];
  @Prop({default: false}) public isDOW?: boolean;

  public storageTypes: SelectData[] = [
    { 
      text: "Block storage", 
      description: "Fixed-sized raw storage capacity", 
      value: "BLOCK" 
    },
    { 
      text: "Object storage", 
      description: "Store and serve unstructured user-generated content",
      value: "OBJECT" 
    },
    { 
      text: "File storage", 
      description: "Store and serve shared file systems",
      value: "FILE" 
    },
    { 
      text: "Archive storage", 
      description: "Store and serve for long-term data retention",
      value: "ARCHIVE" 
    },
  ];



}

</script>
