<template>
  <svg viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M3.51667 6.49167C4.71667 8.85 6.65 10.775 9.00833 11.9833L10.8417 10.15C11.0667 9.925 11.4 9.85 11.6917 9.95C12.625 10.2583 13.6333 10.425 14.6667 10.425C15.125 10.425 15.5 10.8 15.5 11.2583V14.1667C15.5 14.625 15.125 15 14.6667 15C6.84167 15 0.5 8.65833 0.5 0.833333C0.5 0.375 0.875 0 1.33333 0H4.25C4.70833 0 5.08333 0.375 5.08333 0.833333C5.08333 1.875 5.25 2.875 5.55833 3.80833C5.65 4.1 5.58333 4.425 5.35 4.65833L3.51667 6.49167Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Phone extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
</script>
