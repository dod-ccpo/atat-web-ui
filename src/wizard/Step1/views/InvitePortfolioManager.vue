<template>
  <div class="">
    <InvitePortfolioManagersTable />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import InvitePortfolioManagersTable from "@/wizard/Step1/components/InvitePortfolioManagersTable.vue";

@Component({
  components: {
    InvitePortfolioManagersTable,
  },
})
export default class invitePortfolioManager extends Vue {}
</script>
