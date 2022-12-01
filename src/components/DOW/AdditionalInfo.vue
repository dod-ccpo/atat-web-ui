<template>
  <ATATTextArea 
    id="AdditionalInfo"
    class="max-width-740"
    :value.sync="_additionalInfo"
    label="What additional information would help a CSP understand your current environment?"
    helpText="NOTE: This will be included in your Description of Work. Please use
      vendor-neutral language. Avoid including any company names or vendor-unique 
      brand, product, or titles."
    :no-resize="false"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATTextArea,
  }
})

export default class AdditionalInfo extends Vue {
  @PropSync("additionalInfo") public _additionalInfo!: string;
}

</script>
