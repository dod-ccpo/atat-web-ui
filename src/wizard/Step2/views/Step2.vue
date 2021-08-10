<template>
  <CreateTaskOrderForm />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import CreateTaskOrderForm from "@/wizard/Step2/components/CreateTaskOrderForm.vue";

@Component({
  components: {
    CreateTaskOrderForm,
  },
})
export default class Step_2 extends Vue {}
</script>

<style scoped></style>
