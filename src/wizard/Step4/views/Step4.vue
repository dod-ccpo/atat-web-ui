<template>
  <div>
    <div>Step 4 View</div>

    <strong>Testing table:</strong>

    <ReviewTable
      :name="getApplicationUserData.name"
      :data="getApplicationUserData.members"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ReviewTable from "@/wizard/Step5/components/ReviewTable.vue";
import { Portfolios } from "@/../types/Portfolios";

@Component({
  components: { ReviewTable },
})
export default class Step_4 extends Vue {
  get getApplicationUserData(): Portfolios {
    const portfolioID = "11";
    return this.$store.getters.getPortfolioById(portfolioID).applications[0];
  }
}
</script>

<style scoped></style>
