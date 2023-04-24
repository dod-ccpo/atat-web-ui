<template>
  <svg viewBox="0 0 40 51" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M25 0.5H5C2.25 0.5 0.0250006 2.75 0.0250006 5.5L0 45.5C0 48.25 2.225 50.5 4.975 50.5H35C37.75 50.5 40 48.25 40 45.5V15.5L25 0.5ZM35 45.5H5V5.5H22.5V18H35V45.5ZM10 33.025L13.525 36.55L17.5 32.6V43H22.5V32.6L26.475 36.575L30 33.025L20.025 23L10 33.025Z" 
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class UploadFile extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
</script>
