<template>
  <svg
    viewBox='0 0 18 18'
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path d="M4.83464 8.16602V9.83268H13.168V8.16602H4.83464ZM9.0013 0.666016C4.4013 0.666016 0.667969 4.39935 0.667969 8.99935C0.667969 13.5993 4.4013 17.3327 9.0013 17.3327C13.6013 17.3327 17.3346 13.5993 17.3346 8.99935C17.3346 4.39935 13.6013 0.666016 9.0013 0.666016ZM9.0013 15.666C5.3263 15.666 2.33464 12.6743 2.33464 8.99935C2.33464 5.32435 5.3263 2.33268 9.0013 2.33268C12.6763 2.33268 15.668 5.32435 15.668 8.99935C15.668 12.6743 12.6763 15.666 9.0013 15.666Z"
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>

</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class RemoveCircle extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
