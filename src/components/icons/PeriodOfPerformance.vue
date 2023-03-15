<template>
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <rect width="80" height="80" rx="40" :fill="'#' + color" fill-opacity="0.05"/>
    <path d="M53.333 25H51.6663V21.6667H48.333V25H31.6663V21.6667H28.333V25H26.6663C24.833 25 23.333 26.5 23.333 28.3334V55C23.333 56.8334 24.833 58.3334 26.6663 58.3334H53.333C55.1663 58.3334 56.6663 56.8334 56.6663 55V28.3334C56.6663 26.5 55.1663 25 53.333 25ZM53.333 55H26.6663V33.3334H53.333V55Z"
    :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class PeriodOfPerformance extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
</script>

