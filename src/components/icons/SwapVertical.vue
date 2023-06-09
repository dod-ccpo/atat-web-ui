<template>
  <svg  viewBox="0 0 14 18" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M11 14.01V7H9V14.01H6L10 18L14 14.01H11V14.01ZM4 0L0 3.99H3V11H5V3.99H8L4 0Z"
          :fill="'#' + color"
    />
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class SwapVertical extends Vue {
  @Prop({ default: "959A9D", required: false }) private color?: string;
}
</script>
