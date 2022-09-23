<template>
  <div class="_panel-padding">
    <h2 class="mb-5">Learn more about portfolio roles</h2>
    <PortfolioRolesLearnMoreText />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PortfolioRolesLearnMoreText from "./PortfolioRolesLearnMoreText.vue"
@Component({
  components: {
    PortfolioRolesLearnMoreText,
  }
})

export default class PortfolioRolesLearnMore extends Vue {}
</script>
