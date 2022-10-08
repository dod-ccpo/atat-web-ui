<template>
  <div>
    Future page for Gather Price Estimates
  </div>
</template>
<script lang="ts">
import SaveOnLeave from "@/mixins/saveOnLeave";
import IGCE from "@/store/IGCE";

import { Component, Mixins } from "vue-property-decorator";
@Component({
})
export default class GatherPriceEstimates  extends Mixins(SaveOnLeave) {
  private data = [];
  public async loadOnEnter(): Promise<void> {
    //const storeData = await AcquisitionPackage.
    //loadData<RequirementsCostEstimateDTO>({storeProperty: 
    //StoreProperties.RequirementsCostEstimate});
    const storeData = await IGCE.loadIGCEData();
    if (storeData) {
      console.log(storeData)
    }
  }

  private async mounted(): Promise<void>{
    this.loadOnEnter()
  } 
}
</script>

