<template>
<svg viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg">

<!-- eslint-disable -->
  <path d="M2.00009 0.82666L0.590088 2.23666L5.17009 6.82666L0.590088 11.4167L2.00009 12.8267L8.00009 6.82666L2.00009 0.82666Z"
      :fill="'#' + color"
/>
<!-- eslint-enable -->


</svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class ChevronRight extends Vue {
  @Prop({ default: "498e43", required: false }) private color!:string;
}
</script>
