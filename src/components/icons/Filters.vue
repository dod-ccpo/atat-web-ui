<template>
  <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M0.541571 1.67467C2.2249 3.83301 5.33324 7.83301 5.33324 7.83301V12.833C5.33324 13.2913 5.70824 13.6663 6.16657 13.6663H7.83324C8.29157 13.6663 8.66657 13.2913 8.66657 12.833V7.83301C8.66657 7.83301 11.7666 3.83301 13.4499 1.67467C13.8749 1.12467 13.4832 0.333008 12.7916 0.333008H1.1999C0.508238 0.333008 0.116571 1.12467 0.541571 1.67467Z"
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Filters extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>

