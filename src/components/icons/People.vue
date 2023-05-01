<template>
  <svg
    viewBox="0 0 34 22"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path
      d="M22.667 9.5C25.157 9.5 27.152 7.49 27.152 5C27.152 2.51 25.157 0.5 22.667 0.5C20.177 0.5 18.167 2.51 18.167 5C18.167 7.49 20.177 9.5 22.667 9.5ZM10.667 9.5C13.157 9.5 15.152 7.49 15.152 5C15.152 2.51 13.157 0.5 10.667 0.5C8.17699 0.5 6.16699 2.51 6.16699 5C6.16699 7.49 8.17699 9.5 10.667 9.5ZM10.667 12.5C7.17199 12.5 0.166992 14.255 0.166992 17.75V21.5H21.167V17.75C21.167 14.255 14.162 12.5 10.667 12.5ZM22.667 12.5C22.232 12.5 21.737 12.53 21.212 12.575C22.952 13.835 24.167 15.53 24.167 17.75V21.5H33.167V17.75C33.167 14.255 26.162 12.5 22.667 12.5Z"
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
