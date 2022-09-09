<template>
  <svg
    viewBox="0 0 14 15"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path d="M6.99967 7.50065C8.84134 7.50065 10.333 6.00898 10.333 4.16732C10.333 2.32565 8.84134 0.833984 6.99967 0.833984C5.15801 0.833984 3.66634 2.32565 3.66634 4.16732C3.66634 6.00898 5.15801 7.50065 6.99967 7.50065ZM6.99967 9.16732C4.77467 9.16732 0.333008 10.284 0.333008 12.5007V14.1673H13.6663V12.5007C13.6663 10.284 9.22467 9.16732 6.99967 9.16732Z" 
      :fill="'#' + color"
    />

    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Person extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
