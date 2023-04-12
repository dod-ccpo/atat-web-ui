<template>
  <v-dialog
    v-model="isLoading"
    :max-width="'640px'"
    persistent
    id="LoadingDialog"
  >
    <v-card style="padding: 80px 100px">
      <div class="text-center">
        <div class="h1 mb-4" id="LoadingModalTitle">
          Loading your package details<span class="ellipsis"></span>
        </div>
        <p>Please wait while we finish getting your package ready.</p>
        <div class="px-4">
          <v-progress-linear
            :value="packagePercentLoaded"
            color="#544496"
            class="mb-6 _progress-bar"
            height="16"
            rounded  
          />
        </div>
        <v-btn 
          id="CancelLoadingButton" 
          @click="cancelLoad" 
          class="_quaternary mx-auto"
        >
          Go back
        </v-btn>
      </div>
    </v-card>
  </v-dialog>

</template>

<script lang="ts">
import Vue from "vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import AppSections from "@/store/appSections";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class ATATLoadingPackageModal extends Vue {
  @Prop({ default: false }) isLoading!: boolean;
  
  public get packagePercentLoaded(): number {
    return AcquisitionPackage.getPackagePercentLoaded;
  }

  public cancelLoad(): void {
    AcquisitionPackage.setInitialized(false);
    const dest = AcquisitionPackage.getCancelLoadDest;
    AppSections.changeActiveSection(dest);
  }

}

</script>
