<template>
  <div>
    <ATATRadioGroup
      id="DatabaseType"
      legend="What type of database do you need?"
      :value.sync="offeringData.databaseType"
      :items="databaseTypeOptions"
      name="DatabaseType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of database.')]"
      :hasOtherValue="true"
      otherValueRequiredMessage="Enter your other database type."
      :validateOtherOnBlur="true"
      otherValue="OTHER"
      :otherValueEntered.sync="offeringData.databaseTypeOther"
    />

    <ATATRadioGroup
      id="OSLicensingType"
      legend="Operating system licensing"
      :value.sync="offeringData.licensing"
      :items="OSLicensingOptions"
      name="OSLicensingType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of operating system licensing.')]"
    />

    <ATATRadioGroup
      id="DatabaseLicensing"
      legend="Database licensing"
      :value.sync="offeringData.databaseLicensing"
      :items="DBLicensingOptions"
      name="DatabaseLicensing"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of database licensing.')]"
    /> 

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue"

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

export default class DatabaseFormElements extends Vue {
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
      id: "TransferLicense",
      label: "Transfer existing license",
      value: "TRANSFER_EXISTING",
    },
    {
      id: "NewLicense",
      label: "New license",
      value: "NEW",
    },
  ];

  public DBLicensingOptions: RadioButton[] = [
    {
      id: "TransferLicense",
      label: "Transfer existing license",
      value: "TRANSFER_EXISTING",
    },
    {
      id: "NewLicense",
      label: "New license",
      value: "NEW",
    },
  ];


}

</script>
