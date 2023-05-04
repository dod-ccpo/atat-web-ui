<template>
  <svg
    viewBox='0 0 40 50'
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
      <path d="M27.5 0H5C2.25 0 0 2.25 0 5V45C0 47.75 2.25 50 5 50H35C37.75 50 40 47.75 40 45V12.5L27.5 0ZM5 45V5H25V15H35V45H5ZM30 20V32.5C30 38.025 25.525 42.5 20 42.5C14.475 42.5 10 38.025 10 32.5V16.25C10 12.575 13.15 9.65 16.9 10.025C20.15 10.35 22.5 13.325 22.5 16.6V32.5H17.5V16.25C17.5 15.55 16.95 15 16.25 15C15.55 15 15 15.55 15 16.25V32.5C15 35.25 17.25 37.5 20 37.5C22.75 37.5 25 35.25 25 32.5V20H30Z" 
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class FilePresent extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
