<template>
<svg viewBox="0 0 10 7" xmlns="http://www.w3.org/2000/svg">

<!-- eslint-disable -->
  <path d="M8.825 0.658203L5 4.47487L1.175 0.658203L0 1.8332L5 6.8332L10 1.8332L8.825 0.658203Z" 
    :fill="'#' + color"
/>
<!-- eslint-enable -->


</svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class ChevronDown extends Vue {
  @Prop({ default: "161B1E", required: false }) private color!:string;
}
</script>
