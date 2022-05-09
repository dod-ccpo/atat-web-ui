<template>
  <svg
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path
      d="M11.8333 1.33906L10.6583 0.164062L5.99996 4.8224L1.34163 0.164062L0.166626 1.33906L4.82496 5.9974L0.166626 10.6557L1.34163 11.8307L5.99996 7.1724L10.6583 11.8307L11.8333 10.6557L7.17496 5.9974L11.8333 1.33906Z"
      :fill="'#' + color"
    />

    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Close extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
