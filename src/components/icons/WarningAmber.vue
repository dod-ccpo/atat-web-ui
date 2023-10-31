<template>
  <svg viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M11 3.99L18.53 17H3.47L11 3.99ZM11 0L0 19H22L11 0ZM12 14H10V16H12V14ZM12 8H10V12H12V8Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-facing-decorator";
@Component({})
class WarningAmber extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
export default WarningAmber;
</script>
