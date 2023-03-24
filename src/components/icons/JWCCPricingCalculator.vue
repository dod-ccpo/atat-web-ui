<template>
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <rect width="80" height="80" rx="40" :fill="'#' + color" fill-opacity="0.05"/>
    <path d="M51.6667 25H28.3333C26.5 25 25 26.5 25 28.3333V51.6667C25 53.5 26.5 55 28.3333 55H51.6667C53.5 55 55 53.5 55 51.6667V28.3333C55 26.5 53.5 25 51.6667 25ZM41.7167 31.7667L43.4833 30L45.8333 32.35L48.1833 30L49.95 31.7667L47.6 34.1167L49.95 36.4667L48.1833 38.2333L45.8333 35.9L43.4833 38.25L41.7167 36.4833L44.0667 34.1333L41.7167 31.7667ZM30.4167 32.8667H38.75V35.3667H30.4167V32.8667ZM39.1667 46.6667H35.8333V50H33.3333V46.6667H30V44.1667H33.3333V40.8333H35.8333V44.1667H39.1667V46.6667ZM50 48.75H41.6667V46.25H50V48.75ZM50 44.5833H41.6667V42.0833H50V44.5833Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class JWCCPricingCalculator extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
</script>
