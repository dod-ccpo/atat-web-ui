<template>
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <rect width="80" height="80" rx="40" :fill="'#' + color" fill-opacity="0.05"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M53.333 25H26.6663C24.833 25 23.333 26.5 23.333 28.3333V51.6667C23.333 53.5 24.833 55 26.6663 55H53.333C55.1663 55 56.6663 53.5 56.6663 51.6667V28.3333C56.6663 26.5 55.1663 25 53.333 25ZM36.6663 48.3333H28.333V45H36.6663V48.3333ZM36.6663 41.6667H28.333V38.3333H36.6663V41.6667ZM36.6663 35H28.333V31.6667H36.6663V35ZM44.6997 45L39.9997 40.2667L42.3497 37.9167L44.6997 40.2833L49.983 35L52.3497 37.3667L44.6997 45Z"
    :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class OtherCommonDocumentation extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
</script>

