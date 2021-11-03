<template>
  <v-divider :style="{ width: width, margin: margin + ' 0' }" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATDivider extends Vue {
  @Prop({ default: "40px" }) private margin!: string;
  @Prop({ default: "200px" }) private width!: string;
}
</script>
