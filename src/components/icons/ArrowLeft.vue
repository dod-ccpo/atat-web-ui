<template>
  <svg viewBox="0 0 16 16">
    <!-- eslint-disable -->
    <path d="M16 7.5H3.83L9.42 1.91L8 0.5L0 8.5L8 16.5L9.41 15.09L3.83 9.5H16V7.5Z"
	:fill="'#' + color"
    />
    <!-- eslint-enable -->

  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ArrowLeft extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
</script>
