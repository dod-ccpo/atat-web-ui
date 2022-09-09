<template>
  <svg viewBox="0 0 18 15" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M13.167 3.33333L11.992 4.50833L14.142 6.66667H5.66699V8.33333H14.142L11.992 10.4833L13.167 11.6667L17.3337 7.5L13.167 3.33333ZM2.33366 1.66667H9.00033V0H2.33366C1.41699 0 0.666992 0.75 0.666992 1.66667V13.3333C0.666992 14.25 1.41699 15 2.33366 15H9.00033V13.3333H2.33366V1.66667Z" 
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class SignOut extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
</script>
