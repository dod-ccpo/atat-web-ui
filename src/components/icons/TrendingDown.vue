<template>
  <svg viewBox="0 0 20 13" xmlns="http://www.w3.org/2000/svg">

    <!-- eslint-disable -->
    <path d="M14 12.8267L16.29 10.5367L11.41 5.65666L7.41 9.65666L0 2.23666L1.41 0.82666L7.41 6.82666L11.41 2.82666L17.71 9.11666L20 6.82666V12.8267H14Z"
      :fill="'#' + color"
    />
    <!-- eslint-enable -->

  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class TrendingDown extends Vue {
  @Prop({ default: "498e43", required: false }) private color!:string;
}
</script>
