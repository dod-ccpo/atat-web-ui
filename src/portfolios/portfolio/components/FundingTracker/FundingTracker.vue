
<template>
  <div>
    <PortfolioDashboard />
  </div>
</template>
<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";

import PortfolioDashboard from "@/portfolios/portfolio/Portfolio.vue";

@Component({
  components: {
    PortfolioDashboard,
  },
})
class FundingTracker extends Vue {}
export default toNative(FundingTracker)
</script>

