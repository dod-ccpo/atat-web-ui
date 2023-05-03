<template>
  <svg
    viewBox="0 0 36 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path
      d="M29.025 9.06C28.005 3.885 23.46 0 18 0C13.665 0 9.9 2.46 8.025 6.06C3.51 6.54 0 10.365 0 15C0 19.965 4.035 24 9 24H28.5C32.64 24 36 20.64 36 16.5C36 12.54 32.925 9.33 29.025 9.06ZM21 13.5V19.5H15V13.5H10.5L18 6L25.5 13.5H21Z"
      :fill="'#' + color"
    />

    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class CloudUpload extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
