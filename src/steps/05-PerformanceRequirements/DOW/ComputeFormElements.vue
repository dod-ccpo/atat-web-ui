<template>
  <div>
    <ATATRadioGroup
      id="EnvironmentType"
      ref="EnvironmentTypeRef"
      legend="What type of environment is this instance?"
      :value="offeringData.environmentType"
      @update:value="offeringData.environmentType = $event"
      :items="environmentTypeOptions"
      name="EnvironmnetType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of environment.')]"
    />

    <ATATRadioGroup
      id="OperatingEnvType"
      ref="OperatingEnvTypeRef"
      legend="What type of operating environment do you need?"
      :value="offeringData.operatingEnvironment"
      @update:value="offeringData.operatingEnvironment = $event"
      :items="operatingEnvOptions"
      name="OperatingEnvType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of operating environment.')]"
    />

    <ATATRadioGroup
      id="OSLicensingType"
      ref="OSLicensingTypeRef"
      legend="Operating system licensing"
      :value="offeringData.operatingSystemAndLicensing"
      @update:value="offeringData.operatingSystemAndLicensing = $event"
      :items="OSLicensingOptions"
      name="OSLicensingType"
      class="mt-3 mb-8"
      :rules="[$validators.required('Please select a type of operating system licensing.')]"
    />

  </div>
</template>

<script lang="ts">
 
import { Component, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom" // add PropSync import
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

class ComputeFormElements extends Vue {
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
export default toNative(ComputeFormElements)
 
</script>
