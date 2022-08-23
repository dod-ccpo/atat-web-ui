<template>
  <svg
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable -->
    <path d="M11.8332 6.83464H6.83317V11.8346H5.1665V6.83464H0.166504V5.16797H5.1665V0.167969H6.83317V5.16797H11.8332V6.83464Z" 
      :fill="'#' + color"
    />

    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class PlusSign extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
