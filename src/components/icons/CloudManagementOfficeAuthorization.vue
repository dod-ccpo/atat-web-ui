<template>
  <svg viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M0.333008 12L6.99967 32H26.9997L33.6663 12L16.9997 0.333344L0.333008 12Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class CloudManagementOfficeAuthorization extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
</script>

