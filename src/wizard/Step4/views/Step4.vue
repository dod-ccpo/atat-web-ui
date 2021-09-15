<template>
  <div>Step 4 View</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class Step_4 extends Vue {
  public mounted(): void {
    this.$store.dispatch("saveStepModel", [{}, 4, true]);
  }
}

</script>

<style scoped></style>
