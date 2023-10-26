<template>
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M30 34.5C23.01 34.5 17.07 38.88 14.67 45H45.33C42.93 38.88 36.99 34.5 30 34.5ZM17.46 30L20.64 26.82L23.82 30L27 26.82L23.82 23.64L27 20.46L23.82 17.28L20.64 20.46L17.46 17.28L14.28 20.46L17.46 23.64L14.28 26.82L17.46 30ZM29.97 0C13.41 0 0 13.41 0 30C0 46.59 13.41 60 29.97 60C46.53 60 60 46.59 60 30C60 13.41 46.56 0 29.97 0ZM30 54C16.74 54 6 43.26 6 30C6 16.74 16.74 6 30 6C43.26 6 54 16.74 54 30C54 43.26 43.26 54 30 54ZM42.54 17.28L39.36 20.46L36.18 17.28L33 20.46L36.18 23.64L33 26.82L36.18 30L39.36 26.82L42.54 30L45.72 26.82L42.54 23.64L45.72 20.46L42.54 17.28Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->

  </svg>
</template>

<script lang='ts'>
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
@Component({})
class VeryDissatisfied extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
export default VeryDissatisfied;
</script>
