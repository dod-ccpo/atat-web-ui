<template>
  <InvitePortfolioManagersTable>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import CreatePortfolioForm from "../components/CreatePorfolioForm.vue";

@Component({
  components: {
    CreatePortfolioForm,
  },
})
export default class Step_1 extends Vue {
  $refs!: {
    createPortfolioForm: CreatePortfolioForm;
  };
}
</script>
