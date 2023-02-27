<template>
  <svg viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M12.3337 5.5H9.00033V0.5H4.00033V5.5H0.666992L6.50033 11.3333L12.3337 5.5ZM0.666992 13V14.6667H12.3337V13H0.666992Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class Download extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
</script>

