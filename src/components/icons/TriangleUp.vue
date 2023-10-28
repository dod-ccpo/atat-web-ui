<template>
  <svg viewBox="0 0 7 4" xmlns="http://www.w3.org/2000/svg">

    <!-- eslint-disable -->
    <path d="M0.666748 4.15999L4.00008 0.82666L7.33341 4.15999H0.666748Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->


  </svg>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-facing-decorator";
@Component({})
class TriangleUp extends Vue {
  @Prop({ default: "498e43", required: false }) private color!:string;
}
export default TriangleUp;
</script>




