<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h3>
          Portfolio Permissions Menu Component that is to appear in each row
        </h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <PermissionsModal />
      </v-col>
      <v-col cols="12">
        <RevokeInvitationModal />
      </v-col>
      <v-col cols="12">
        <ResendInvitationToast />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PermissionsModal from "./PermissionsModal.vue";
import ResendInvitationToast from "./ResendInvitationToast.vue";
import RevokeInvitationModal from "./RevokeInvitationModal.vue";

@Component({
  components: {
    PermissionsModal,
    RevokeInvitationModal,
    ResendInvitationToast,
  },
})
export default class PortfolioPermissionsMenu extends Vue {}
</script>
