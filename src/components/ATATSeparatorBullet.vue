<template>
  <span
    class="separator-bullet"
    aria-hidden="true"
    :style="{ margin: '0px ' + margin, color: color }"
  >
    &bull;
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATSeparatorBullet extends Vue {
  @Prop({ default: "#a9aeb1" }) private color?: string;
  @Prop({ default: "8px" }) private margin?: string;
}
</script>
