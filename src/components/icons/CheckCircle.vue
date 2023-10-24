<!-- eslint-disable max-len -->
<template>
  <svg
    width="20"
    height="22"
    viewBox="0 0 20 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.99984 3.05859C5.39984 3.05859 1.6665 6.79193 1.6665 11.3919C1.6665 15.9919 5.39984 19.7253 9.99984 19.7253C14.5998 19.7253 18.3332 15.9919 18.3332 11.3919C18.3332 6.79193 14.5998 3.05859 9.99984 3.05859Z"
      fill="white"
    />
    <path
      d="M9.99984 3.05859C5.39984 3.05859 1.6665 6.79193 1.6665 11.3919C1.6665 15.9919 5.39984 19.7253 9.99984 19.7253C14.5998 19.7253 18.3332 15.9919 18.3332 11.3919C18.3332 6.79193 14.5998 3.05859 9.99984 3.05859ZM8.33317 15.5586L4.1665 11.3919L5.3415 10.2169L8.33317 13.2003L14.6582 6.87526L15.8332 8.05859L8.33317 15.5586Z"
      :fill="'#' + color"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
@Component({})
class CheckCircle extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?: string;
}
export default toNative(CheckCircle);
</script>
