<template>
  <router-view/>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import { routeNames } from "@/router/stepper";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
})
export default class AcquisitionPackageDetails extends Vue {

  public async mounted(): Promise<void> {
    const packageId = this.$route.query['packageId'] || "";

    if(packageId){
      console.log(packageId);
      // do reset/reload of package
      await AcquisitionPackage.reset();
      AcquisitionPackage.setPackageId(packageId as string);
      AcquisitionPackage.loadPackageFromId(packageId as string);
    }

    this.$router.push({
      name: routeNames.ProjectOverview,
      replace: true,
      params: {
        direction: "next"
      },
    }).catch(() => console.log("avoiding redundant navigation"));;
  }

}
</script>
