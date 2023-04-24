<template>
  <svg
    viewBox='0 0 18 17'
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path d="M9.83317 4.33366H8.1665V7.66699H4.83317V9.33366H8.1665V12.667H9.83317V9.33366H13.1665V7.66699H9.83317V4.33366ZM8.99984 0.166992C4.39984 0.166992 0.666504 3.90033 0.666504 8.50033C0.666504 13.1003 4.39984 16.8337 8.99984 16.8337C13.5998 16.8337 17.3332 13.1003 17.3332 8.50033C17.3332 3.90033 13.5998 0.166992 8.99984 0.166992ZM8.99984 15.167C5.32484 15.167 2.33317 12.1753 2.33317 8.50033C2.33317 4.82533 5.32484 1.83366 8.99984 1.83366C12.6748 1.83366 15.6665 4.82533 15.6665 8.50033C15.6665 12.1753 12.6748 15.167 8.99984 15.167Z"
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ControlPoint extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
