<template>
  <div>
    <h1>
      Ready to submit your acquisition package?
    </h1>
    <div class="copy-max-width">
      <p class="mt-2 mb-4">
        Future ready to submit
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
    console.log('ready')
  }
  async mounted(): Promise<void>{
    await this.loadOnEnter()
  }
}
</script>

