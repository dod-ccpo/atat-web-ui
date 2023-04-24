<template>
  <svg
    viewBox='0 0 12 15'
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path
      d="M0.999959 13.3333C0.999959 14.25 1.74996 15 2.66663 15H9.33329C10.25 15 11 14.25 11 13.3333V3.33333H0.999959V13.3333ZM11.8333 0.833333H8.91663L8.08329 0H3.91663L3.08329 0.833333H0.166626V2.5H11.8333V0.833333Z"
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Remove extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
