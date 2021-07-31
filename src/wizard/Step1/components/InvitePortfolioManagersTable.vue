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
          :ripple="false"
          id="'step_1-portfolio-managers-action"
          color="primary"
          @click="modalAction({ action: 'open-add-manager-dialog' })"
          class="portfolio-managers-action mr-5"
          >Invite Portfolio Manager</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <PermissionsModal
          :isDialogOpen="isPermissionDialogOpen"
          @modalAction="modalAction"
        />
      </v-col>
    </v-row>
    <pre>
      state: 
      isPermissionDialogOpen: {{ isPermissionDialogOpen }}

    </pre>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PortfolioPermissionsMenu from "./PortfolioPermissionsMenu.vue";
import PermissionsModal from "./PermissionsModal.vue";
import { ActionObject } from "./PermissionsModal.vue";

@Component({
  components: {
    PortfolioPermissionsMenu,
    PermissionsModal,
  },
})
export default class InvitePortfolioManagersTable extends Vue {
  private isPermissionDialogOpen = false;
  private clickedAction(): void {
    console.log("action on invite portfolio");
    this.isPermissionDialogOpen = false;
  }
  private modalAction(actionObj: ActionObject): void {
    console.log("modalAction on invite portfolio", actionObj);
    if (actionObj.action === "open-add-manager-dialog") {
      this.isPermissionDialogOpen = true;
    } else if (actionObj.action === "portfolio-managers-modal-cancel") {
      this.isPermissionDialogOpen = false;
    } else if (actionObj.action === "portfolio-managers-modal-save") {
      // get data to the store and/or API.
      console.log("save this", actionObj.data);
      this.isPermissionDialogOpen = false;
    }
  }
}
</script>
