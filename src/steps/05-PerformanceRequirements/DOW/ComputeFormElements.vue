<template>
  <div>
    <ATATRadioGroup
      id="EnvironmentType"
      legend="What type of environment is this instance?"
      :value.sync="offeringData.environmentType"
      :items="environmentTypeOptions"
      name="EnvironmnetType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of environment.')]"
    />

    <ATATRadioGroup
      id="OperatingEnvType"
      legend="What type of operating environment do you need?"
      :value.sync="offeringData.operatingEnvironment"
      :items="operatingEnvOptions"
      name="OperatingEnvType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of operating environment.')]"
    />

    <ATATRadioGroup
      id="OSLicensingType"
      legend="Operating system licensing"
      :value.sync="offeringData.operatingSystemAndLicensing"
      :items="OSLicensingOptions"
      name="OSLicensingType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of operating system licensing.')]"
    />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import { 
  OtherServiceOfferingData,
  RadioButton,
} from "../../../../types/Global";
import { instanceEnvTypeOptions }  from "@/store/descriptionOfWork";

@Component({
  components: {
    ATATRadioGroup,
  }
})

export default class ComputeFormElements extends Vue {
  @PropSync("data") public offeringData!: OtherServiceOfferingData;

  public environmentTypeOptions = instanceEnvTypeOptions;

  public operatingEnvOptions: RadioButton[] = [
    {
      id: "VirtualMachine",
      label: "Virtual Machine",
      value: "VIRTUAL"
    },
    {
      id: "Containers",
      label: "Containers",
      value: "CONTAINERS"
    },
    {
      id: "ServerlessComputing",
      label: "Serverless Computing",
      value: "SERVERLESS"
    },
    {
      id: "VirtualDesktop",
      label: "End User Computing Virtual Desktop",
      value: "END_USER_COMPUTING_VIRTUAL_DESKTOP"
    },
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


}

</script>
