<template>
    <CreatePortfolioForm ref="createPortfolioForm" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import CreatePortfolioForm from "../components/CreatePorfolioForm.vue";
// import InvitePortfolioManagersTable from "../components/InvitePortfolioManagersTable.vue";

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
