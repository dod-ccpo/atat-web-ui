<template>
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M19.5 27C21.9853 27 24 24.9853 24 22.5C24 20.0147 21.9853 18 19.5 18C17.0147 18 15 20.0147 15 22.5C15 24.9853 17.0147 27 19.5 27Z"
          :fill="'#' + color"
    />
    <path d="M40.5 27C42.9853 27 45 24.9853 45 22.5C45 20.0147 42.9853 18 40.5 18C38.0147 18 36 20.0147 36 22.5C36 24.9853 38.0147 27 40.5 27Z"
          :fill="'#' + color"
    />
    <path d="M30 36C23.01 36 17.04 40.35 14.64 46.5H19.65C21.72 42.93 25.56 40.5 30 40.5C34.44 40.5 38.25 42.93 40.35 46.5H45.36C42.96 40.35 36.99 36 30 36ZM29.97 0C13.41 0 0 13.44 0 30C0 46.56 13.41 60 29.97 60C46.56 60 60 46.56 60 30C60 13.44 46.56 0 29.97 0ZM30 54C16.74 54 6 43.26 6 30C6 16.74 16.74 6 30 6C43.26 6 54 16.74 54 30C54 43.26 43.26 54 30 54Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->

  </svg>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-facing-decorator";
@Component({})
class Dissatisfied extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
export default Dissatisfied;
</script>
