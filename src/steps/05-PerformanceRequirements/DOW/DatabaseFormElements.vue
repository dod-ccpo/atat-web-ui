<template>
  <div>
    <ATATRadioGroup
      id="DatabaseType"
      legend="What type of database do you need?"
      :value="offeringData.databaseType"
      @update:value="offeringData.databaseType = $event"
      :items="databaseTypeOptions"
      name="DatabaseType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of database.')]"
      :hasOtherValue="true"
      otherValueRequiredMessage="Enter your other database type."
      :validateOtherOnBlur="true"
      otherValue="OTHER"
      :otherValueEntered="offeringData.databaseTypeOther"
      @update:otherValueEntered="offeringData.databaseTypeOther = $event"
    />

    <ATATRadioGroup
      id="OSLicensingType"
      legend="Operating system licensing"
      :value="offeringData.licensing"
      @update:value="offeringData.licensing = $event"
      :items="OSLicensingOptions"
      name="OSLicensingType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of operating system licensing.')]"
    />

    <ATATRadioGroup
      id="DatabaseLicensing"
      legend="Database licensing"
      :value="offeringData.databaseLicensing"
      @update:value="offeringData.databaseLicensing = $event"
      :items="DBLicensingOptions"
      name="DatabaseLicensing"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of database licensing.')]"
    /> 

  </div>
</template>

<script lang="ts">
 
import { Component, Vue, toNative } from "vue-facing-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue"
import { PropSync } from "@/decorators/custom"
import { 
  OtherServiceOfferingData,
  RadioButton,
} from "../../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField,
  }
})

class DatabaseFormElements extends Vue{
  @PropSync("data") public offeringData!: OtherServiceOfferingData;

  public databaseTypeOptions: RadioButton[] = [
    {
      id: "Analytical",
      label: "Analytical",
      value: "ANALYTICAL", 
    },
    {
      id: "Transactional",
      label: "Transactional",
      value: "TRANSACTIONAL",
    },
    {
      id: "Graph",
      label: "Graph",
      value: "GRAPH",
    },
    {
      id: "Relational",
      label: "Relational",
      value: "RELATIONAL"
    },
    {
      id: "Other",
      label: "Other",
      value: "OTHER"
    }
  ];

  public OSLicensingOptions: RadioButton[] = [
    {
      id: "OSTransferLicense",
      label: "Transfer existing license",
      value: "TRANSFER_EXISTING",
    },
    {
      id: "OSNewLicense1",
      label: "New license",
      value: "NEW",
    },
  ];

  public DBLicensingOptions: RadioButton[] = [
    {
      id: "DBTransferLicense",
      label: "Transfer existing license",
      value: "TRANSFER_EXISTING",
    },
    {
      id: "DBNewLicense",
      label: "New license",
      value: "NEW",
    },
  ];


}
export default toNative(DatabaseFormElements )
 
</script>
