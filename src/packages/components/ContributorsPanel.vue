<template>
  <div id="ContributorPanel" class="_contributor-panel">
    <div class="_panel-padding mb-2">
      <div class="d-flex justify-space-between align-center pb-4">
        <span>Status</span>
        <span>Draft</span>
      </div>
      <div class="d-flex justify-space-between align-center pb-4">
        <span>Service/Agency</span>
        <span>DISA</span>
      </div>
      <div class="d-flex justify-space-between align-center pb-4">
        <span id="CreatedByLabel">Created by</span>


        <v-menu
          :close-on-content-click="false"
          left
          open-on-hover
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              plain
              text
              v-bind="attrs"
              v-on="on"
              class="font-size-14 _member-button"
            >
              {{ creatorName }}
            </v-btn>
          </template>

          <ATATProfileCard :person="packageCreator" />

        </v-menu>



      </div>
    </div>

    <hr class="my-0">

    <div class="_panel-padding">
      <h3>Contributors ()</h3>
    </div>
  </div>
</template>

<script lang="ts">
import AcquisitionPackage from "@/store/acquisitionPackage";

import Vue from "vue";
import { Component } from "vue-property-decorator";
// import MemberCard from "@/portfolios/portfolio/components/shared/MemberCard.vue";
import ATATProfileCard from "@/components/ATATProfileCard.vue";

@Component({
  components: {
    ATATProfileCard
  }
})

export default class ContributorsPanel extends Vue {
  public packageCreator = AcquisitionPackage.getPackageCreator;

  public get creatorName(): string {
    return this.packageCreator.firstName && this.packageCreator.lastName
      ? this.packageCreator.firstName + " " + this.packageCreator.lastName
      : this.packageCreator.email as string;
  }

}


</script>
