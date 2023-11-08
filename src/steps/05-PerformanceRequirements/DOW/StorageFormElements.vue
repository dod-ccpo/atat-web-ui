<template>
  <div>
    <v-row>
      <v-col class="col-sm-12 col-md-3">
        <ATATSelect
          id="StorageType"
          label="Storage type"
          :items="storageTypes"
          :selectedValue="offeringData.storageType"
          @update:selectedValue="offeringData.storageType = $event"
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
          :value="offeringData.storageAmount"
          @update:value="offeringData.storageAmount = $event"
          tooltipText="Enter the amount of storage available to access and store 
            data on a long-term basis."
          :appendDropdown="true"
          :dropdownOptions="storageUnits"
          :selectedDropdownValue="offeringData.storageUnit"
          @update:selectedDropdownValue="offeringData.storageUnit = $event"
          type="number"
          :rules="[
            $validators.required('Enter a number greater than or equal to 0.'),
          ]"
          :allowDecimals="false"
        />       
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ATATTextField
          id="NumberOfInstances"
          class="mt-8 _input-max-width-240"
          :value="offeringData.numberOfInstances"
          @update:value="offeringData.numberOfInstances = $event"
          label="Number of instances needed"
          type="number"
          :rules="[
            $validators.required('Enter a number greater than or equal to 1.'),
            $validators.greaterThan(0, 'Enter a number greater than or equal to 1.'),
          ]"    
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
 
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { 
  OtherServiceOfferingData,
  SelectData
} from "../../../../types/Global";

@Component({
  components: {
    ATATSelect,
    ATATTextField
  }
})
class StorageFormElements extends Vue {
  @PropSync("data") public offeringData!: OtherServiceOfferingData;
  @Prop() public storageUnits!: SelectData[];

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
export default toNative(StorageFormElements)
</script>
