<template>
  <ClinsCard />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ClinsCard from "@/wizard/Step2/components/ClinsCard.vue";

@Component({
  components: { ClinsCard },
})
export default class Step_2 extends Vue {}
</script>

<style scoped></style>
