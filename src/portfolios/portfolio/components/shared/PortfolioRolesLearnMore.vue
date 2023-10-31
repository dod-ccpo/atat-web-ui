<template>
  <div class="_panel-padding">
    <h2 class="mb-5">Learn more about portfolio roles</h2>
    <PortfolioRolesLearnMoreText />
  </div>
</template>

<script lang="ts">
import { Component,  Vue, toNative } from "vue-facing-decorator";
import PortfolioRolesLearnMoreText from "./PortfolioRolesLearnMoreText.vue"
@Component({
  components: {
    PortfolioRolesLearnMoreText,
  }
})

class PortfolioRolesLearnMore extends Vue {}
export default PortfolioRolesLearnMore
</script>
