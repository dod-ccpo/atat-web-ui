<template>
  <svg viewBox="0 0 18 15"  xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M15.6667 0.833374H2.33335C1.41669 0.833374 0.67502 1.58337 0.67502 2.50004L0.666687 12.5C0.666687 13.4167 1.41669 14.1667 2.33335 14.1667H15.6667C16.5834 14.1667 17.3334 13.4167 17.3334 12.5V2.50004C17.3334 1.58337 16.5834 0.833374 15.6667 0.833374ZM15.6667 4.16671L9.00002 8.33337L2.33335 4.16671V2.50004L9.00002 6.66671L15.6667 2.50004V4.16671Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->

  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Email extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
</script>
