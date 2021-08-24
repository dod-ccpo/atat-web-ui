<template>
  <div class="permission-table">
    <v-simple-table>
      <template v-slot:default>
        <thead class="bg-base-lightest">
          <tr>
            <th class="text-left text--base-dark label font-weight-black py-3 px-4">
                Name
            </th>
            <th class="text-left text--base-dark label font-weight-black py-3 px-4">
                App Permissions
            </th>
            <th class="text-left text--base-dark label font-weight-black py-3 px-4">
                Environment Access
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in getData" :key="item.id">
            <td class="pa-4">
              <span class="table-item font-weight-bold"> {{ item.name }} </span> <br />
              <span class="table-item"> {{ item.email }} </span>
            </td>
            <td class="pa-4">
              <span
                class="table-item d-flex flex-column"
                v-for="permission in grantedPermissions(item.permissions)"
                :key="permission"
              >
                {{ permission }}
              </span>
            </td>
            <td class="pa-4">
              <span
                class="table-item d-flex flex-column"
                v-for="setting in item.environments_settings"
                :key="setting.id"
              >
                {{ setting.label }} : {{ setting.accessLevel }}
              </span>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

export interface ApplicationMember {
  id: string;
  email: string;
  name: string;
  permissions?: ApplicationMemberPermissions[];
  environments_settings?: ApplicationMemberEnvironment[];
}
export interface ApplicationMemberPermissions {
  id: string;
  label: string;
  is_granted: boolean;
}
export interface ApplicationMemberEnvironment {
  id: string;
  label: string;
  accessLevel: "Administrator" | "Contributor" | "No Access";
}

let demoData: ApplicationMember[] = [
  {
    id: "john.smith@mail.mil",
    email: "john.smith@mail.mil",
    name: "John Smith",
    permissions: [
      {
        id: "edit_team",
        label: "Edit Team",
        is_granted: true,
      },
      {
        id: "manage_environments",
        label: "Manage Environments",
        is_granted: true,
      },
    ],
    environments_settings: [
      {
        id: "development",
        label: "Development",
        accessLevel: "Administrator",
      },
      {
        id: "testing",
        label: "Testing",
        accessLevel: "Administrator",
      },
      {
        id: "staging",
        label: "Staging",
        accessLevel: "Administrator",
      },
      {
        id: "production",
        label: "Production",
        accessLevel: "Administrator",
      },
    ],
  },
  {
    id: "jane.doe@mail.mil",
    email: "jane.doe@mail.mil",
    name: "Jane Doe",
    permissions: [
      {
        id: "edit_team",
        label: "Edit Team",
        is_granted: false,
      },
      {
        id: "manage_environments",
        label: "Manage Environments",
        is_granted: false,
      },
    ],
    environments_settings: [
      {
        id: "development",
        label: "Development",
        accessLevel: "Contributor",
      },
      {
        id: "testing",
        label: "Testing",
        accessLevel: "Contributor",
      },
      {
        id: "staging",
        label: "Staging",
        accessLevel: "Contributor",
      },
      {
        id: "production",
        label: "Production",
        accessLevel: "No Access",
      },
    ],
  },
];

@Component({})
export default class PermissionsTable extends Vue {
  @Prop({ default: true }) private sorting!: boolean;
  @Prop({ default: [] }) private data!: ApplicationMember[];

  get getData(): ApplicationMember[] {
    if (!this.data || this.data.length < 1) return demoData;
    else return this.data;
  }

  private grantedPermissions(
    permissions: ApplicationMemberPermissions[]
  ): string[] {
    // filter out not granted permisssions and is not permission have been grante return 'no access'
    const grantedPermissionsArr = permissions.filter((item) => item.is_granted);
    console.log("grantedPermissionsArr", grantedPermissionsArr);
    if (grantedPermissionsArr.length > 0) {
      return grantedPermissionsArr.map((item) => item.label);
    } else return ["No Access"];
  }
}
</script>
