<template>
  <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M17.3244 2.33268C17.3244 1.41602 16.5827 0.666016 15.666 0.666016H2.33268C1.41602 0.666016 0.666016 1.41602 0.666016 2.33268V12.3327C0.666016 13.2493 1.41602 13.9993 2.33268 13.9993H13.9993L17.3327 17.3327L17.3244 2.33268ZM13.9993 10.666H3.99935V8.99935H13.9993V10.666ZM13.9993 8.16602H3.99935V6.49935H13.9993V8.16602ZM13.9993 5.66602H3.99935V3.99935H13.9993V5.66602Z" 
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class CommentBubble extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
  