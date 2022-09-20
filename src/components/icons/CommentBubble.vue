<template>
  <svg
    viewBox="0 -1 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path
      d="M18.3253 3.33268C18.3253 2.41602 17.5837 1.66602 16.667 1.66602H3.33366C2.41699 1.66602 1.66699 2.41602 1.66699 3.33268V13.3327C1.66699 14.2493 2.41699 14.9993 3.33366 14.9993H15.0003L18.3337 18.3327L18.3253 3.33268ZM15.0003 11.666H5.00033V9.99935H15.0003V11.666ZM15.0003 9.16602H5.00033V7.49935H15.0003V9.16602ZM15.0003 6.66602H5.00033V4.99935H15.0003V6.66602Z"
      :fill="'#' + color"
    />

    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class CommentBubble extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
  