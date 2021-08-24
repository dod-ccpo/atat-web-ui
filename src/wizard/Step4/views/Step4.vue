<template>
  <div>
    <div>Step 4 View</div>

    <b>Testing table:</b>

    <PermissionsTable />
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
