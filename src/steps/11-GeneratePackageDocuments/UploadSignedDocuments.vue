<template>
  <div>
    Future Upload Docs page
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
@Component({
})
export default class UploadSignedDocuments extends Vue {

  public async loadOnEnter(): Promise<void> {
    console.log(AcquisitionPackage.attachmentNames)
  }
  async mounted(): Promise<void>{
    await this.loadOnEnter()
  }
}
</script>

