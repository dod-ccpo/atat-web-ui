<template>
  <div>
    <h1>
      Ready to submit your acquisition package?
    </h1>
    <div class="copy-max-width">
      <p class="mt-2 mb-4">
        We’ve generated your required documents based on the information that you have provided in
        steps 1-8. Download your entire package below and review each document. If needed, you can
        revisit the previous steps to make changes and click the “Update” button to re-generate your
        documents.
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
@Component({
})
export default class ReadyToSubmit extends Vue {

  public async loadOnEnter(): Promise<void> {
    console.log(AcquisitionPackage.attachmentNames)
  }
  async mounted(): Promise<void>{
    await this.loadOnEnter()
  }
}
</script>

