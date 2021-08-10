<template>
  <div>
    <CreatePortfolioForm ref="createPortfolioForm" />
    <CloudServiceProvider class="pb-10" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import CreatePortfolioForm from "../components/CreatePorfolioForm.vue";
import CloudServiceProvider from "../components/CloudServiceProvider.vue";

@Component({
  components: {
    CreatePortfolioForm,
    CloudServiceProvider,
  },
})
export default class Step_1 extends Vue {
  $refs!: {
    createPortfolioForm: CreatePortfolioForm;
  };
}
</script>
