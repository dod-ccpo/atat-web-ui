<template>
  <svg
    viewBox="0 0 31 30"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path
      d="M13.833 24H16.833V21H13.833V24ZM15.333 0C7.05301 0 0.333008 6.72 0.333008 15C0.333008 23.28 7.05301 30 15.333 30C23.613 30 30.333 23.28 30.333 15C30.333 6.72 23.613 0 15.333 0ZM15.333 27C8.71801 27 3.33301 21.615 3.33301 15C3.33301 8.385 8.71801 3 15.333 3C21.948 3 27.333 8.385 27.333 15C27.333 21.615 21.948 27 15.333 27ZM15.333 6C12.018 6 9.33301 8.685 9.33301 12H12.333C12.333 10.35 13.683 9 15.333 9C16.983 9 18.333 10.35 18.333 12C18.333 15 13.833 14.625 13.833 19.5H16.833C16.833 16.125 21.333 15.75 21.333 12C21.333 8.685 18.648 6 15.333 6Z"
      :fill="'#' + color"
    />

    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class People extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
