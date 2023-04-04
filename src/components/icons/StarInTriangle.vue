<template>
  <svg viewBox="0 0 49 48" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->

    <path fill-rule="evenodd" clip-rule="evenodd"
      d="M48.2251 1.71655e-06L41.398 6.82713L41.3967 6.82843L7.05352 41.1716L7.05239 41.1727L0.225098 48L0.225098 38.3457C0.225097 38.3449 0.225097 38.344 0.225097 38.3431L0.225099 9.6L0.225099 4C0.225099 1.79086 2.01596 -7.82795e-08 4.2251 -1.74844e-07L9.8253 -4.19636e-07L38.5682 2.13867e-06L48.2251 1.71655e-06Z"
      :fill="'#' + color" />
    <path
      d="M16.6551 12L14.2251 4L11.7951 12H4.2251L10.4051 16.41L8.0551 24L14.2251 19.31L20.4051 24L18.0551 16.41L24.2251 12H16.6551Z"
      :fill="'#' + starColor" />

    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class StarInTriangle extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
  @Prop({ default: "ffffff", required: false }) private starColor!: string;
}
</script>
