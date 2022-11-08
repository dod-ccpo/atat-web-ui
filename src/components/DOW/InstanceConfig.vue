<template>
  <section id="InstanceConfig">
    <v-row>
      <v-col class="col-sm-12 col-md-6">
        <ATATTextField
          id="Licensing"
          label="Licensing"
          :value.sync="_instanceConfig.licensing"
          tooltipText="Provide details about your licensing agreement, to include 
            the type and number of licenses."
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-12 col-md-3">
        <ATATTextField
          id="NumberOfVCPUs"
          label="Number of vCPUs"
          :value.sync="_instanceConfig.numberOfVCPUs"
          tooltipText="This refers to the size of compute. You can provide an approximate 
            number of virtual centralized processing units (vCPUs)."
        />
      </v-col>
      <v-col class="col-sm-12 col-md-3">
        <ATATTextField
          id="ProcessorSpeed"
          label="Processor speed"
          :value.sync="_instanceConfig.processorSpeed"
          tooltipText="Enter the clock speed for each vCPU. This is typically measured
            in gigahertz (GHz)."
        />
      </v-col>
      <v-col class="col-sm-12 col-md-6">
        <ATATTextField
          id="OperatingSystem"
          label="Operating system"
          :value.sync="_instanceConfig.operatingSystem"
          tooltipText="Specify the type of OS that your instance is running on 
            (e.g., Windows, Linux)."
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-12 col-md-3">
        <ATATTextField
          id="Memory"
          label="Memory"
          :value.sync="_instanceConfig.memory"
          tooltipText="Enter the amount of Random Access Memory (RAM) available for 
            storing data short-term in order to perform computing operations."
          appendText="GB"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-12 col-md-3">
        <ATATSelect
          id="StorageType"
          label="Storage type"
          :items="storageTypes"
          :selectedValue.sync="_instanceConfig.storageType"
          :rules="[
            $validators.required('Select a storage type.')
          ]"
        />

      </v-col>
      <v-col class="col-sm-12 col-md-3">
        <ATATTextField
          id="StorageAmount"
          label="Storage size"
          :value.sync="_instanceConfig.storageAmount"
          tooltipText="Enter the amount of storage available to access and store 
            data on a long-term basis."
          :appendDropdown="true"
          :dropdownOptions="storageUnits"
          :selectedDropdownValue.sync="_instanceConfig.storageUnit"
        />       
      </v-col>
    </v-row>

  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";

import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { 
  SelectData,
  CurrentEnvInstanceConfig 
} from "types/Global";

@Component({
  components: {
    ATATSelect,
    ATATTextField,
  }
})

export default class InstanceConfig extends Vue {
  @PropSync("instanceConfig") public _instanceConfig!: CurrentEnvInstanceConfig


  public storageTypes: SelectData[] = [
    { 
      text: "Block storage", 
      description: "Fixed-sized raw storage capacity", 
      value: "Block storage VAL" 
    },
    { 
      text: "Object storage", 
      description: "Store and serve unstructured user-generated content",
      value: "Object storage" 
    },
    { 
      text: "File storage", 
      description: "Store and serve shared file systems",
      value: "File storage" 
    },
    { 
      text: "Archive storage", 
      description: "Store and serve for long-term data retention",
      value: "Archive storage" 
    },
  ];

  public storageUnits: SelectData[] = [
    { text: "Gigabyte (GB)", value: "GB" },
    { text: "Terabyte (TB)", value: "TB" },
    { text: "Petabyte (PB)", value: "PB" },
  ];


}

</script>
