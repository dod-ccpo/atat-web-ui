<template>
  <ATATTextArea 
    id="AdditionalInfo"
    class="max-width-740"
    :value="_additionalInfo"
    @update:value="_additionalInfo = $event"
    label="What additional information would help a CSP understand your current environment?"
    helpText="NOTE: This will be included in your Description of Work. Please use
      vendor-neutral language. Avoid including any company names or vendor-unique 
      brand, product, or titles."
    :no-resize="false"
  />
</template>

<script lang="ts">
import {Vue, Component, toNative } from "vue-facing-decorator";
import {PropSync} from "@/decorators/custom";
import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATTextArea,
  }
})

class AdditionalInfo extends Vue {
  @PropSync("additionalInfo") public _additionalInfo!: string;
}
export default toNative(AdditionalInfo)
</script>
