<template>
  <v-container fluid class="step_1-portfolio-managers">
    <v-row>
      <v-col cols="12">
        <h3 class="h3">Invite Portfolio Managers</h3>
        <p>
          Invite others to join ATAT and give them access to areas of <br />
          your Portfolio relevant to their work.
        </p>
        <v-btn
          ripple="false"
          id="'step_1-portfolio-managers-action"
          color="primary"
          @click="clickedAction()"
          class="portfolio-managers-action mr-5"
          >Invite Portfolio Managers</v-btn
        >
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
export default class InvitePortfolioManagersTable extends Vue {
  private clickedAction() {
    return 0;
  }
}
</script>
