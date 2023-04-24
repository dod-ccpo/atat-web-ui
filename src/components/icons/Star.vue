<template>
  <svg
    viewBox="-2 -2 15 15 "
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path
      d="M8.84502 5.66634L7.22502 0.333008L5.60502 5.66634H0.55835L4.67835 8.60634L3.11168 13.6663L7.22502 10.5397L11.345 13.6663L9.77835 8.60634L13.8917 5.66634H8.84502Z"
      :fill="'#' + color"
    />

    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Star extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
