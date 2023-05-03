<template>
  <svg viewBox="0 0 19 15" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M10.833 0C6.69134 0 3.33301 3.35833 3.33301 7.5H0.833008L4.07467 10.7417L4.13301 10.8583L7.49967 7.5H4.99967C4.99967 4.275 7.60801 1.66667 10.833 1.66667C14.058 1.66667 16.6663 4.275 16.6663 7.5C16.6663 10.725 14.058 13.3333 10.833 13.3333C9.22467 13.3333 7.76634 12.675 6.71634 11.6167L5.53301 12.8C6.89134 14.1583 8.75801 15 10.833 15C14.9747 15 18.333 11.6417 18.333 7.5C18.333 3.35833 14.9747 0 10.833 0ZM9.99967 4.16667V8.33333L13.5663 10.45L14.1663 9.44167L11.2497 7.70833V4.16667H9.99967Z"
          :fill="'#' + color"
    />
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import {Component, Prop} from "vue-property-decorator";

@Component({})
export default class Restore extends Vue {
  @Prop({default: "544496", required: true}) private color!:string;
}
</script>
