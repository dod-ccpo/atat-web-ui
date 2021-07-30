<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="h1 step-1-title my-5font-weight-bold">Step 1</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <CreatePortfolioForm />
      </v-col>
      <!-- <v-col cols="12">
        <InvitePortfolioManagersTable />
      </v-col> -->
    </v-row>
  </v-container>
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
export default class Step_1 extends Vue {}
</script>
