<template>
  <div>
    <div>Step 4 View</div>

    <strong>Testing table:</strong>

    <PermissionsTable
      :name="getApplicationUserData.name"
      :data="getApplicationUserData.members"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PermissionsTable from "@/wizard/Step5/components/PermissionsTable.vue";
import { Portfolios } from "@/../types/Portfolios";

@Component({
  components: { PermissionsTable },
})
export default class Step_4 extends Vue {
  get getApplicationUserData(): Portfolios {
    const portfolioID = "11";
    return this.$store.getters.getPortfolioById(portfolioID).applications[0];
  }
}
</script>

<style scoped></style>
