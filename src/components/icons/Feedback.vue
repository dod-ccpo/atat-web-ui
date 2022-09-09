<template>
  <svg viewBox="0 0 18 17" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M15.667 0.166016H2.33366C1.41699 0.166016 0.675326 0.916016 0.675326 1.83268L0.666992 16.8327L4.00033 13.4993H15.667C16.5837 13.4993 17.3337 12.7493 17.3337 11.8327V1.83268C17.3337 0.916016 16.5837 0.166016 15.667 0.166016ZM15.667 11.8327H3.30866L2.81699 12.3243L2.33366 12.8077V1.83268H15.667V11.8327ZM8.16699 8.49935H9.83366V10.166H8.16699V8.49935ZM8.16699 3.49935H9.83366V6.83268H8.16699V3.49935Z" 
       :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Feedback extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
