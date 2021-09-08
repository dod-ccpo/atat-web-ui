<template>
  <portfolio-summary />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PortfolioSummary from "../components/PortfolioSummary.vue";

@Component({
  components: {
    PortfolioSummary,
  },
})
export default class Step_5 extends Vue {}
</script>

<style scoped></style>
