<template>
  <svg viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M14.1666 10.5H15.8333V12.1667H14.1666V10.5ZM14.1666 7.16667H15.8333V8.83333H14.1666V7.16667ZM14.1666 3.83333H15.8333V5.5H14.1666V3.83333ZM11.4499 3.83333L12.4999 4.53333V3.83333H11.4499Z"
          :fill="'#' + color"/>
    <path d="M8.33325 0.5V1.75833L9.99992 2.86667V2.16667H17.4999V13.8333H14.1666V15.5H19.1666V0.5H8.33325Z"
          :fill="'#' + color"/>
    <path d="M6.80825 2.75L12.4999 6.54167V15.5H0.833252V6.73333L6.80825 2.75ZM8.33325 13.8333H10.8333V7.3L6.80825 4.74167L2.49992 7.48333V13.8333H4.99992V8.83333H8.33325V13.8333Z"
          :fill="'#' + color"/>
    <!-- eslint-enable -->

  </svg>
</template>

<script lang='ts'>
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
@Component({})
class HomeWork extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
export default HomeWork;
</script>
