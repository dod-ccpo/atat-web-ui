<template>
  <svg viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M26.6667 3.9974H19.7C19 2.06406 17.1667 0.664062 15 0.664062C12.8333 0.664062 11 2.06406 10.3 3.9974H3.33333C1.5 3.9974 0 5.4974 0 7.33073V30.6641C0 32.4974 1.5 33.9974 3.33333 33.9974H26.6667C28.5 33.9974 30 32.4974 30 30.6641V7.33073C30 5.4974 28.5 3.9974 26.6667 3.9974ZM15 3.9974C15.9167 3.9974 16.6667 4.7474 16.6667 5.66406C16.6667 6.58073 15.9167 7.33073 15 7.33073C14.0833 7.33073 13.3333 6.58073 13.3333 5.66406C13.3333 4.7474 14.0833 3.9974 15 3.9974ZM11.6667 27.3307L5 20.6641L7.35 18.3141L11.6667 22.6141L22.65 11.6307L25 13.9974L11.6667 27.3307Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>

</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class CheckedBag extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
</script>
