<template>
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <rect width="80" height="80" rx="40" :fill="'#' + color" fill-opacity="0.05"/>
    <path d="M46.667 38.3333C49.4337 38.3333 51.6503 36.1 51.6503 33.3333C51.6503 30.5667 49.4337 28.3333 46.667 28.3333C43.9003 28.3333 41.667 30.5667 41.667 33.3333C41.667 36.1 43.9003 38.3333 46.667 38.3333ZM33.3337 38.3333C36.1003 38.3333 38.317 36.1 38.317 33.3333C38.317 30.5667 36.1003 28.3333 33.3337 28.3333C30.567 28.3333 28.3337 30.5667 28.3337 33.3333C28.3337 36.1 30.567 38.3333 33.3337 38.3333ZM33.3337 41.6667C29.4503 41.6667 21.667 43.6167 21.667 47.5V51.6667H45.0003V47.5C45.0003 43.6167 37.217 41.6667 33.3337 41.6667ZM46.667 41.6667C46.1837 41.6667 45.6337 41.7 45.0503 41.75C46.9837 43.15 48.3337 45.0333 48.3337 47.5V51.6667H58.3337V47.5C58.3337 43.6167 50.5503 41.6667 46.667 41.6667Z" :fill="'#' + color"
    />
 <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class ContactInformation extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
</script>

