
<template>
  <div>
    <PortfolioDashboard />
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-facing-decorator;

import PortfolioDashboard from "@/portfolios/portfolio/Portfolio.vue";

@Component({
  components: {
    PortfolioDashboard,
  },
})
export default class FundingTracker extends Vue {}
</script>

