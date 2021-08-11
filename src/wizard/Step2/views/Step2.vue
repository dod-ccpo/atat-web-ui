<template>
  <CreateTaskOrderForm ref="createTaskOrderForm" />
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
export default class Step_2 extends Vue {
  $refs!: {
    createTaskOrderForm: CreateTaskOrderForm;
  };
}
</script>
