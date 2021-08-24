<template>
  <div>
    <div>Step 4 View</div>

    <b>Testing table:</b>

    <v-card class="mt-4"
      elevation="2"
      max-width="100%">
      <v-card-title class="d-flex justify-space-between">
        <span class="h4">Tracker Application</span>
        <v-btn text 
          x-small 
          class="v-btn text-decoration-none mt-1 mx-1 h6 primary--text"
          :ripple="false">
          <v-icon x-small class="text-decoration-none mr-1" >edit</v-icon>
          <span class="text-decoration-underline">Edit</span>
        </v-btn>

      </v-card-title>
      <v-card-text class="pa-0">
        <PermissionsTable />
      </v-card-text>

    </v-card>

   
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { ATATTableData } from "@/components/ATATTable.vue";
import ATATTable from "@/components/ATATTable.vue";
import PermissionsTable from "@/wizard/Step1/components/PermissionsTable.vue";

import { component } from "vue/types/umd";

let applicationUserData: ATATTableData = {
  headers: [
    {
      text: "Name",
      value: "application_name",
      align: "start",
      sortable: true,
      class: "application_name",
      cellClass: "application_name_cell",
    },
    {
      text: "App Permissions",
      value: "application_permissions",
      align: "start",
      sortable: true,
      class: "application_permissions",
      cellClass: "application_permissions_cell",
    },
    {
      text: "Environment Access",
      value: "application_env_access",
      align: "start",
      sortable: true,
      class: "application_env_access",
      cellClass: "application_env_access_cell",
    },
  ],
  items: [
    {
      application_name: "John Smith john.smith@mail.mil",
      application_permissions: "Edit Team Manage Environments",
      application_env_access:
        "Development:  Administrator Testing:  Administrator Staging:  Administrator Production:  Administrator",
    },
    {
      application_name: "Jane Doe jane.doe@mail.mil",
      application_permissions: "Edit Team Manage Environments",
      application_env_access:
        "Development:  Administrator Testing:  Administrator Staging:  Administrator Production:  Administrator",
    },
  ],
};

@Component({
  components: { ATATTable, PermissionsTable },
})
export default class Step_4 extends Vue {
  get getApplicationUserData(): ATATTableData {
    return applicationUserData;
  }
}
</script>

<style scoped></style>
