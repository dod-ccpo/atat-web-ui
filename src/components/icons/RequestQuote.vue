<template>
  <svg viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M10 0H2C0.9 0 0 0.9 0 2V18C0 19.1 0.9 20 2 20H14C15.1 20 16 19.1 16 18V6L10 0ZM2 18V2H9V6H14V18H2ZM7 17H9V16H10C10.55 16 11 15.55 11 15V12C11 11.45 10.55 11 10 11H7V10H11V8H9V7H7V8H6C5.45 8 5 8.45 5 9V12C5 12.55 5.45 13 6 13H9V14H5V16H7V17Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
@Component({})
class RequestQuote extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
export default toNative(RequestQuote)
</script>
