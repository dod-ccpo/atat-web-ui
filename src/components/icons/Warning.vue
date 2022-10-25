<template>
  <svg viewBox="0 0 22 19" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M0 19H22L11 0L0 19ZM12 16H10V14H12V16ZM12 12H10V8H12V12Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class Warning extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
</script>
