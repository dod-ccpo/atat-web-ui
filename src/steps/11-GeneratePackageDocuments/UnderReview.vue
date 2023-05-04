<template>
  <div class="container-max-width ml-10">
    <h1>
      Your package is currently under review
    </h1>
    <div class="d-flex mt-3">
      <div class="copy-max-width">
        <p>
          Your acquisition was submitted to DITCO for processing. A Contracting Specialist is
          reviewing your documents and will contact you if any changes are required. Nothing
          further is needed from you at this time.
        </p>
        <div class="d-flex">
          <ATATSVGIcon
            width="680" height="466" name="underReview" color="primary"
          />
         <CompletePackageCard />
        </div>
      </div>
    </div>

    <ATATLoadingPackageModal :isLoading="isLoading" />

  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import acquisitionPackage from "@/store/acquisitionPackage";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATLoadingPackageModal from "@/components/ATATLoadingPackageModal.vue";
import CompletePackageCard 
  from "@/steps/11-GeneratePackageDocuments/components/CompletePackageCard.vue"
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATSVGIcon,
    ATATLoadingPackageModal,
    CompletePackageCard
  }
})
export default class ReadyToSubmit extends Vue {
  public packageNotInitialized = false;

  public get isLoading(): boolean {
    return this.packageNotInitialized || this.isPackageLoading;
  }
  public get isPackageLoading(): boolean {
    return AcquisitionPackage.getIsLoading;
  }

  async mounted(): Promise<void>{
    await acquisitionPackage.setHideNavigation(true);
    this.packageNotInitialized = !AcquisitionPackage.initialized;
    if (this.packageNotInitialized) {
      await AcquisitionPackage.loadPackageFromId(AcquisitionPackage.packageId);
      this.packageNotInitialized = false;
    }
  }

} 
</script>

