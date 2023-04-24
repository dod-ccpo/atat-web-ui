<template>
  <svg viewBox="0 0 34 38" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M30.334 3.9974H28.6673V0.664062H25.334V3.9974H8.66732V0.664062H5.33398V3.9974H3.66732C1.83398 3.9974 0.333984 5.4974 0.333984 7.33073V33.9974C0.333984 35.8307 1.83398 37.3307 3.66732 37.3307H30.334C32.1673 37.3307 33.6673 35.8307 33.6673 33.9974V7.33073C33.6673 5.4974 32.1673 3.9974 30.334 3.9974ZM30.334 33.9974H3.66732V12.3307H30.334V33.9974Z" 
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Calendar extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
</script>
