<template>
  <svg viewBox="0 0 9 9"  xmlns="http://www.w3.org/2000/svg">
    <circle cx="4.3" cy="4.3" r="4.3" fill="transparent"/>
    <circle cx="4.15" cy="4.15" r="2.15" :fill="'#' + color"/>
  </svg>
</template>

<script lang='ts'>
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";

@Component({})
class Bullet extends Vue {
  @Prop({ default: "959A9D", required: false }) private color?: string;
}
export default toNative(Bullet)
</script>
