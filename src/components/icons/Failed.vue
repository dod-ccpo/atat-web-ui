<template>
  <svg viewBox="0 0 18 17" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M8.16699 11H9.83366V12.6667H8.16699V11ZM8.16699 4.33335H9.83366V9.33335H8.16699V4.33335ZM8.99199 0.166687C4.39199 0.166687 0.666992 3.90002 0.666992 8.50002C0.666992 13.1 4.39199 16.8334 8.99199 16.8334C13.6003 16.8334 17.3337 13.1 17.3337 8.50002C17.3337 3.90002 13.6003 0.166687 8.99199 0.166687ZM9.00033 15.1667C5.31699 15.1667 2.33366 12.1834 2.33366 8.50002C2.33366 4.81669 5.31699 1.83335 9.00033 1.83335C12.6837 1.83335 15.667 4.81669 15.667 8.50002C15.667 12.1834 12.6837 15.1667 9.00033 15.1667Z"
          :fill="'#' + color"
    />
  </svg>
  <!-- eslint-enable -->
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Failed extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
</script>
