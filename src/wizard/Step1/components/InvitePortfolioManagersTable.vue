<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 tabindex="-1">Invite Portfolio Managers Table Component</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <PortfolioPermissionsMenu />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PortfolioPermissionsMenu from "./PortfolioPermissionsMenu.vue";
import PermissionsModal from "./PermissionsModal.vue";

@Component({
  components: {
    PortfolioPermissionsMenu,
    PermissionsModal,
  },
})
export default class InvitePortfolioManagersTable extends Vue {}
</script>
