
<template>
  <div>
    <!-- Foo -->
    <PortfolioDashboard />

  </div>

</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";

import PortfolioDashboard from "@/dashboards/Portfolio.vue";

@Component({
  components: {
    PortfolioDashboard,
  },
})
export default class FundingTracker extends Vue {}
</script>

