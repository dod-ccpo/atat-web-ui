<template>
  <svg viewBox="0 0 20 13" xmlns="http://www.w3.org/2000/svg">

    <!-- eslint-disable -->
    <path d="M14 0.82666L16.29 3.11666L11.41 7.99666L7.41 3.99666L0 11.4167L1.41 12.8267L7.41 6.82666L11.41 10.8267L17.71 4.53666L20 6.82666V0.82666H14Z" 
      :fill="'#' + color"
    />
    <!-- eslint-enable -->

  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class TrendingUp extends Vue {
  @Prop({ default: "c60634", required: false }) private color!:string;
}
</script>
