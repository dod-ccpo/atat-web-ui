<template>
  <svg viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M0.666687 5.99996L4.00002 16H14L17.3334 5.99996L9.00002 0.166626L0.666687 5.99996Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
@Component({})
class Service extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
export default Service;
</script>
