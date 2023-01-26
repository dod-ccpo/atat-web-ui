<template>
  <div>
    <h1>
      Ready to submit your acquisition package?
    </h1>
    <div class="copy-max-width d-flex mt-10">
      <div>
        <p class="font-size-20 font-weight-500 mb-0">
          Great news! We have everything ready to send your package to DITCO for processing.
        </p>
        <p class="mt-2 mb-4">
          Upon submission, a Contracting Specialist will review your documents and
          contact you if any changes are required. You’ll continue to have access
          to your completed documents within DAPPS.
        </p>
      </div>
      <v-card
        class="
          border1
          border-base-lighter
          pa-6"
        :elevation="2"
      >

      </v-card>

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

