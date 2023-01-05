<template>
  <svg viewBox="0 0 19 14" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M14.4167 5.16406C14.5584 5.16406 14.7 5.1724 14.8334 5.18906V1.7224C14.8334 0.864062 14.1334 0.164062 13.275 0.164062H2.22502C1.36669 0.164062 0.666687 0.864062 0.666687 1.7224V10.2724C0.666687 11.1307 1.36669 11.8307 2.22502 11.8307H10.3334C10.0167 11.2057 9.83335 10.4974 9.83335 9.7474C9.83335 7.21406 11.8834 5.16406 14.4167 5.16406ZM7.66669 6.83073L2.33335 3.65573V1.83073H2.52502L7.67502 4.8974L12.95 1.83073H13.1667V3.63073L7.66669 6.83073Z" :fill="'#' + color"/>
    <path d="M14.8334 6.83073L13.6584 8.00573L14.975 9.33073H11.5V10.9974H14.975L13.6584 12.3224L14.8334 13.4974L18.1667 10.1641L14.8334 6.83073Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class SendEmail extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
</script>
