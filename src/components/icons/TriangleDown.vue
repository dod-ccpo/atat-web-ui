<template>
  <svg viewBox="0 0 7 4" xmlns="http://www.w3.org/2000/svg">

    <!-- eslint-disable -->
    <path d="M0.666687 0.666748L4.00002 4.00008L7.33335 0.666748H0.666687Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->


  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class TriangleUp extends Vue {
  @Prop({ default: "498e43", required: false }) private color!:string;
}
</script>




