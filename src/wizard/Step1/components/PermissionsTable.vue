<template>
  <div class="permission-table">
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">App Permissions</th>
            <th class="text-left">Environment Access</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in getData" :key="item.id">
            <td>
              <span class="font-weight-bold"> {{ item.name }} </span> <br />
              <span class=""> {{ item.email }} </span>
            </td>
            <td class="d-flex flex-column">
              <span
                class=""
                v-for="permission in grantedPermissions(item.permissions)"
                :key="permission"
              >
                {{ permission }}
              </span>
            </td>
            <td>
              <span
                class="d-flex flex-column"
                v-for="setting in item.enviroments_settings"
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
  enviroments_settings?: ApplicationMemberEnviroment[];
}
export interface ApplicationMemberPermissions {
  id: string;
  label: string;
  is_granted: boolean;
}
export interface ApplicationMemberEnviroment {
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
    enviroments_settings: [
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
    enviroments_settings: [
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
