<template>
  <!-- eslint-disable -->
  <svg viewBox="0 0 22 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4ZM14 6V8H17V11H19V8H22V6H19V3H17V6H14ZM0 14V16H16V14C16 11.34 10.67 10 8 10C5.33 10 0 11.34 0 14Z"
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class PersonAddAlt extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
