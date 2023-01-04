<template>
  <svg
    viewBox="0 0 25 35"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path
      d="M12.0007 0.333984C5.55065 0.333984 0.333984 5.55065 0.333984 12.0007C0.333984 20.7507 12.0007 33.6673 12.0007 33.6673C12.0007 33.6673 23.6673 20.7507 23.6673 12.0007C23.6673 5.55065 18.4507 0.333984 12.0007 0.333984ZM12.0007 16.1673C9.70065 16.1673 7.83398 14.3007 7.83398 12.0007C7.83398 9.70065 9.70065 7.83398 12.0007 7.83398C14.3007 7.83398 16.1673 9.70065 16.1673 12.0007C16.1673 14.3007 14.3007 16.1673 12.0007 16.1673Z"
      :fill="'#' + color"
    />

    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Place extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
