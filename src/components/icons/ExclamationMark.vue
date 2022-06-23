<template>
  <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M9.83366 13.6641H10.3337V13.1641V11.4974V10.9974H9.83366H8.16699H7.66699V11.4974V13.1641V13.6641H8.16699H9.83366ZM9.83366 10.3307H10.3337V9.83073V4.83073V4.33073H9.83366H8.16699H7.66699V4.83073V9.83073V10.3307H8.16699H9.83366ZM1.16699 8.9974C1.16699 4.67354 4.67647 1.16406 9.00033 1.16406C13.3242 1.16406 16.8337 4.67354 16.8337 8.9974C16.8337 13.3213 13.3242 16.8307 9.00033 16.8307C4.67647 16.8307 1.16699 13.3213 1.16699 8.9974Z" 
      :fill="'#' + color"
      :stroke="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>


</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ExclamationMark extends Vue {
  @Prop({default: "c60634", required: true}) private color!:string;
}
</script>
